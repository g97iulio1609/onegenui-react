"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { loggers } from "@onegenui/utils";
import type { UITree } from "@onegenui/core";
import { createTreeStoreBridge } from "./ui-stream/tree-store-bridge";
import type { UseUIStreamOptions, UseUIStreamReturn, ConversationTurn, Attachment } from "./types";
import { useStore } from "../store";
import { removeElementFromTree, removeSubItemsFromTree, updateElementInTree, updateElementLayoutInTree, type LayoutUpdates } from "./ui-stream/tree-mutations";
import { useHistory } from "./ui-stream/use-history";
import { streamLog } from "./ui-stream/logger";
import { buildRequest, isFileAttachment } from "./ui-stream/request-builder";
import { processPlanEvent } from "./ui-stream/plan-handler";
import { processDocumentIndex } from "./ui-stream/document-index-handler";
import { useStoreRefs } from "./ui-stream/use-store-refs";
import { createPendingTurn, finalizeTurn, markTurnFailed, removeTurn, rollbackToTurn } from "./ui-stream/turn-manager";
import { collectPreviousAnswers, buildQuestionResponsePrompt, buildQuestionResponseContext, addQuestionAnswer } from "./ui-stream/question-handler";
import { useStreamSession } from "./ui-stream/use-stream-session";
import { useStreamConnection } from "./ui-stream/use-stream-connection";
import { useStreamEventLoop } from "./ui-stream/use-stream-event-loop";
import { usePatchPipelineHook } from "./ui-stream/use-patch-pipeline-hook";
import { useDeepResearchTracker, normalizeDeepResearchProgress } from "./ui-stream/use-deep-research-tracker";

const log = loggers.react;

export function useUIStream({
  api, onComplete, onError, getHeaders, getChatId, onBackgroundComplete,
}: UseUIStreamOptions): UseUIStreamReturn {
  const { storeTree, treeVersion } = useStore(
    useShallow((s) => ({ storeTree: s.uiTree, treeVersion: s.treeVersion })),
  );
  const { planStoreRef, addProgressRef, resetPlanExecution } = useStoreRefs();
  const bridge = useMemo(() => createTreeStoreBridge(), []);

  const tree = useMemo(() => {
    if (!storeTree) return null;
    return { ...storeTree, elements: { ...storeTree.elements } };
  }, [storeTree, treeVersion]);

  const setTree = useCallback(
    (newTree: UITree | null | ((prev: UITree | null) => UITree | null)) => {
      const finalTree = typeof newTree === "function" ? newTree(bridge.getTree()) : newTree;
      log.debug("[useUIStream] setTree", {
        hasTree: !!finalTree,
        elementsCount: finalTree?.elements ? Object.keys(finalTree.elements).length : 0,
      });
      bridge.setTree(finalTree);
    },
    [bridge],
  );

  const session = useStreamSession(bridge, resetPlanExecution);
  const connection = useStreamConnection();
  const { processStream } = useStreamEventLoop();
  const pipelineHook = usePatchPipelineHook(bridge);
  const deepResearch = useDeepResearchTracker();
  const { pushHistory, undo, redo, canUndo, canRedo, setHistory, setHistoryIndex } =
    useHistory(tree, session.conversation, setTree, session.setConversation);

  const removeElement = useCallback(
    (key: string) => { pushHistory(); setTree((prev) => (prev ? removeElementFromTree(prev, key) : null)); },
    [pushHistory, setTree],
  );
  const removeSubItems = useCallback(
    (elementKey: string, identifiers: (number | string)[]) => {
      if (identifiers.length === 0) return;
      pushHistory();
      setTree((prev) => (prev ? removeSubItemsFromTree(prev, elementKey, identifiers) : null));
    },
    [pushHistory, setTree],
  );
  const updateElement = useCallback(
    (elementKey: string, updates: Record<string, unknown>) => {
      setTree((prev) => (prev ? updateElementInTree(prev, elementKey, updates) : null));
    },
    [setTree],
  );
  const updateElementLayout = useCallback(
    (elementKey: string, layoutUpdates: LayoutUpdates) => {
      pushHistory();
      setTree((prev) => (prev ? updateElementLayoutInTree(prev, elementKey, layoutUpdates) : null));
    },
    [pushHistory, setTree],
  );

  // ── send() — main streaming entry point ─────────────────────────────────
  const send = useCallback(
    async (prompt: string, context?: Record<string, unknown>, attachments?: Attachment[]) => {
      const chatId = (context?.chatId as string | undefined) ?? getChatId?.();
      if (session.sendingRef.current) {
        streamLog.warn("Ignoring concurrent send", { prompt: prompt.slice(0, 100) });
        return;
      }
      session.sendingRef.current = true;
      streamLog.info("Starting send", { promptLength: prompt.length, hasContext: !!context, attachmentCount: attachments?.length ?? 0, chatId });

      const { signal } = connection.setupAbort(chatId);
      session.setIsStreaming(true);
      session.setError(null);
      bridge.setStreaming(true);

      if (!bridge.getTree()) {
        streamLog.debug("Initializing empty tree");
        bridge.setTree({ root: "", elements: {} });
      }

      const isProactive = context?.hideUserMessage === true;
      const pendingTurn = createPendingTurn(prompt, { isProactive, attachments });
      const turnId = pendingTurn.id;
      streamLog.debug("Creating turn", { turnId, isProactive, userMessage: prompt.slice(0, 50) });
      deepResearch.initializeResearch(context, prompt);
      session.setConversation((prev) => {
        const updated = [...prev, pendingTurn];
        streamLog.debug("Conversation updated", { prevLength: prev.length, newLength: updated.length, pendingTurnId: pendingTurn.id, userMessage: pendingTurn.userMessage?.slice(0, 50) });
        return updated;
      });

      const protectedTypes = context?.forceCanvasMode === true ? ["Canvas"] : [];
      const pipeline = pipelineHook.create({ turnId, protectedTypes });

      try {
        const fileAtts = attachments?.filter(isFileAttachment) ?? [];
        if (fileAtts.length > 0) {
          streamLog.debug("Uploading attachments", { count: fileAtts.length, files: fileAtts.map((a) => ({ name: a.file.name, type: a.file.type, size: a.file.size })) });
        }
        const { body, headers } = buildRequest({ prompt, context, currentTree: bridge.getTree() ?? { root: "", elements: {} }, conversation: session.conversationRef.current, attachments, componentState: useStore.getState().componentState });
        streamLog.info("Sending request to API", { api, hasAuth: !!getHeaders });
        const reader = await connection.connect({ api, body, headers, signal, getHeaders });

        const result = await processStream({
          reader, turnId, setConversation: session.setConversation,
          handlers: {
            onPatch: (patches, atomic) => pipeline.push(patches, atomic),
            onToolProgress: (progress) => {
              addProgressRef.current({ toolCallId: progress.toolCallId, toolName: progress.toolName, status: progress.status, message: progress.message, data: progress.data, progress: normalizeDeepResearchProgress(progress.progress) });
              deepResearch.handleDeepResearchToolProgress(progress);
            },
            onPlanEvent: (event) => processPlanEvent(event, planStoreRef.current),
            onDocumentIndex: (uiComponent, current) => processDocumentIndex(uiComponent, current),
            onCitations: (citations) => {
              if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("onegenui:citations", { detail: { citations } }));
            },
          },
        });

        // Flush remaining buffered patches to store BEFORE reading final state
        pipeline.flush();
        const finalTree = bridge.getTree() ?? { root: "", elements: {} };
        streamLog.info("Stream completed", { totalPatches: result.patchCount, totalMessages: result.messageCount, treeElementCount: Object.keys(finalTree.elements).length });
        if (signal.aborted) { streamLog.warn("Request aborted before finalization"); return; }

        streamLog.debug("Finalizing turn", { turnId });
        session.setConversation((prev) => finalizeTurn(prev, turnId, { messages: result.messages, questions: result.questions, suggestions: result.suggestions, treeSnapshot: finalTree, documentIndex: result.documentIndex }));
        deepResearch.handleCompletion();
        onComplete?.(finalTree);
      } catch (err) {
        pipeline.reset();
        if ((err as Error).name === "AbortError") {
          streamLog.info("Request aborted", { turnId });
          deepResearch.handleAbort();
          session.setConversation((prev) => removeTurn(prev, turnId));
          return;
        }
        const error = err instanceof Error ? err : new Error(String(err));
        streamLog.error("Stream error", { error: error.message, turnId });
        session.setError(error);
        onError?.(error);
        deepResearch.handleError(error.message);
        session.setConversation((prev) => markTurnFailed(prev, turnId, error.message));
      } finally {
        session.sendingRef.current = false;
        connection.clearControllers();
        session.setIsStreaming(false);
        bridge.setStreaming(false);
        streamLog.debug("Send completed");
      }
    },
    [api, onComplete, onError, setTree, getChatId, getHeaders, bridge, connection, session, processStream, pipelineHook, deepResearch],
  );

  const answerQuestion = useCallback(
    (turnId: string, questionId: string, answers: Record<string, unknown>) => {
      const turn = session.conversation.find((t) => t.id === turnId);
      const question = turn?.questions?.find((q) => q.id === questionId);
      const allPrev = collectPreviousAnswers(session.conversation, turnId);
      session.setConversation((prev) => addQuestionAnswer(prev, turnId, questionId, answers));
      if (question) send(buildQuestionResponsePrompt(question.text, answers), buildQuestionResponseContext(question, turnId, answers, allPrev));
    },
    [session.conversation, send],
  );

  const loadSession = useCallback(
    (sess: { tree: UITree; conversation: ConversationTurn[] }) => {
      const rootEl = sess.tree?.elements?.[sess.tree?.root];
      log.debug("[useUIStream] loadSession called", { hasTree: !!sess.tree, rootKey: sess.tree?.root, rootChildrenCount: rootEl?.children?.length, elementsCount: sess.tree?.elements ? Object.keys(sess.tree.elements).length : 0, conversationLength: sess.conversation?.length });
      setTree(sess.tree);
      session.setConversation(sess.conversation);
      session.conversationRef.current = sess.conversation;
      setHistory([]); setHistoryIndex(-1);
      log.debug("[useUIStream] loadSession complete, tree set");
    },
    [setTree, setHistory, setHistoryIndex],
  );

  const deleteTurn = useCallback(
    (turnId: string) => {
      pushHistory();
      const result = rollbackToTurn(session.conversation, turnId);
      if (!result) return;
      setTree(result.restoredTree ?? { root: "", elements: {} });
      session.setConversation(result.newConversation);
    },
    [session.conversation, pushHistory, setTree],
  );

  const editTurn = useCallback(
    async (turnId: string, newMessage: string) => {
      pushHistory();
      const result = rollbackToTurn(session.conversation, turnId);
      if (!result) return;
      setTree(result.restoredTree);
      session.setConversation(result.newConversation);
      await send(newMessage, result.restoredTree ? { tree: result.restoredTree } : undefined);
    },
    [session.conversation, send, pushHistory, setTree],
  );

  const abort = useCallback(() => {
    connection.abort(); session.sendingRef.current = false; session.setIsStreaming(false);
  }, []);

  useEffect(() => () => { pipelineHook.cleanup(); connection.abort(); }, []);

  return {
    tree, conversation: session.conversation, isStreaming: session.isStreaming,
    error: session.error, send, clear: session.clear, loadSession,
    removeElement, removeSubItems, updateElement, updateElementLayout,
    deleteTurn, editTurn, undo, redo, canUndo, canRedo, answerQuestion, abort,
  };
}
