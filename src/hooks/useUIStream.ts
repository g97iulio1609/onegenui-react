"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import type { UITree, JsonPatch } from "@onegenui/core";
import { applyPatchesBatch } from "./patch-utils";
import type {
  UseUIStreamOptions,
  UseUIStreamReturn,
  ConversationTurn,
  ChatMessage,
  QuestionPayload,
  SuggestionChip,
  ToolProgress,
  PersistedAttachment,
  Attachment,
} from "./types";
import type { DocumentIndex } from "@onegenui/core";
import { useStore } from "../store";
import {
  removeElementFromTree,
  removeSubItemsFromTree,
  updateElementInTree,
  updateElementLayoutInTree,
  type LayoutUpdates,
} from "./ui-stream/tree-mutations";
import { useHistory } from "./ui-stream/use-history";
import { streamLog } from "./ui-stream/logger";
import { processPlanEvent } from "./ui-stream/plan-handler";
import { buildRequest, isFileAttachment } from "./ui-stream/request-builder";
import { processDocumentIndex } from "./ui-stream/document-index-handler";
import { useStoreRefs } from "./ui-stream/use-store-refs";
import {
  createPendingTurn,
  finalizeTurn,
  markTurnFailed,
  removeTurn,
  rollbackToTurn,
} from "./ui-stream/turn-manager";
import {
  collectPreviousAnswers,
  buildQuestionResponsePrompt,
  buildQuestionResponseContext,
  addQuestionAnswer,
} from "./ui-stream/question-handler";
import { readStreamWithTimeout } from "./ui-stream/stream-reader";
import {
  saveSelection,
  restoreSelection,
  PATCH_FLUSH_INTERVAL_MS,
} from "./ui-stream/patch-processor";

// ─────────────────────────────────────────────────────────────────────────────
// useUIStream Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook for streaming UI generation
 */
export function useUIStream({
  api,
  onComplete,
  onError,
  getHeaders,
  getChatId,
  onBackgroundComplete,
}: UseUIStreamOptions): UseUIStreamReturn {
  // Use Zustand store for tree state with shallow comparison
  const { storeTree, treeVersion } = useStore(
    useShallow((s) => ({
      storeTree: s.uiTree,
      treeVersion: s.treeVersion,
    }))
  );
  
  // Get store refs from extracted hook
  const { storeRef, planStoreRef, addProgressRef, storeSetUITreeRef, resetPlanExecution } = useStoreRefs();
  
  // CRITICAL: Create new tree reference when version changes to force re-renders
  const tree = useMemo(() => {
    if (!storeTree) return null;
    return { ...storeTree, elements: { ...storeTree.elements } };
  }, [storeTree, treeVersion]);
  
  // Conversation state and tree ref
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const treeRef = useRef<UITree | null>(null);
  
  // Sync treeRef when store changes
  useEffect(() => {
    treeRef.current = tree;
  }, [tree, treeVersion]);
  
  // Update store (treeRef syncs automatically via effect)
  const setTree = useCallback((newTree: UITree | null | ((prev: UITree | null) => UITree | null)) => {
    if (typeof newTree === "function") {
      const updatedTree = newTree(treeRef.current);
      treeRef.current = updatedTree;
      storeSetUITreeRef.current(updatedTree);
    } else {
      treeRef.current = newTree;
      storeSetUITreeRef.current(newTree);
    }
  }, [storeSetUITreeRef]);

  // History management
  const {
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    setHistory,
    setHistoryIndex,
  } = useHistory(tree, conversation, setTree, setConversation, treeRef);

  // Keep ref in sync
  useEffect(() => {
    treeRef.current = tree;
  }, [tree]);

  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const sendingRef = useRef(false);
  const patchFlushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    setTree(null);
    setConversation([]);
    treeRef.current = null;
    setError(null);
    resetPlanExecution();
    storeRef.current.clearUITree();
  }, [resetPlanExecution, setTree, storeRef]);

  const loadSession = useCallback(
    (session: { tree: UITree; conversation: ConversationTurn[] }) => {
      setTree(session.tree);
      treeRef.current = session.tree;
      setConversation(session.conversation);
      setHistory([]);
      setHistoryIndex(-1);
    },
    [setTree, setHistory, setHistoryIndex],
  );

  const removeElement = useCallback(
    (key: string) => {
      pushHistory();
      setTree((prev) => (prev ? removeElementFromTree(prev, key) : null));
    },
    [pushHistory, setTree],
  );

  const removeSubItems = useCallback(
    (elementKey: string, identifiers: (number | string)[]) => {
      if (identifiers.length === 0) return;
      pushHistory();
      setTree((prev) =>
        prev ? removeSubItemsFromTree(prev, elementKey, identifiers) : null,
      );
    },
    [pushHistory, setTree],
  );

  const updateElement = useCallback(
    (elementKey: string, updates: Record<string, unknown>) => {
      setTree((prev) =>
        prev ? updateElementInTree(prev, elementKey, updates) : null,
      );
    },
    [setTree],
  );

  const updateElementLayout = useCallback(
    (elementKey: string, layoutUpdates: LayoutUpdates) => {
      pushHistory();
      setTree((prev) =>
        prev
          ? updateElementLayoutInTree(prev, elementKey, layoutUpdates)
          : null,
      );
    },
    [pushHistory, setTree],
  );

  const send = useCallback(
    async (
      prompt: string,
      context?: Record<string, unknown>,
      attachments?: any[],
    ) => {
      // Get chatId from context (set by handleChatSend)
      const chatId = (context?.chatId as string | undefined) ?? getChatId?.();
      
      // Prevent concurrent sends
      if (sendingRef.current) {
        streamLog.warn("Ignoring concurrent send", { 
          prompt: prompt.slice(0, 100),
        });
        return;
      }
      sendingRef.current = true;
      
      streamLog.info("Starting send", { 
        promptLength: prompt.length, 
        hasContext: !!context,
        attachmentCount: attachments?.length ?? 0,
        chatId,
      });

      // Abort any existing request
      if (abortControllersRef.current.size > 0) {
        abortControllersRef.current.forEach((controller) => controller.abort());
        abortControllersRef.current.clear();
      }
      const abortController = new AbortController();
      const abortKey = chatId ?? "default";
      abortControllersRef.current.set(abortKey, abortController);
      const signal = abortController.signal;

      setIsStreaming(true);
      setError(null);

      // Start with existing tree or empty
      let currentTree: UITree = treeRef.current
        ? JSON.parse(JSON.stringify(treeRef.current))
        : { root: "", elements: {} };

      // If no tree existed, initialize it and sync ref immediately
      if (!treeRef.current) {
        streamLog.debug("Initializing empty tree");
        setTree(currentTree);
        treeRef.current = currentTree;
      }

      // Create pending turn using turn manager
      const isProactive = context?.hideUserMessage === true;
      const pendingTurn = createPendingTurn(prompt, { isProactive, attachments });
      const turnId = pendingTurn.id;
      streamLog.debug("Creating turn", { turnId, isProactive, userMessage: prompt.slice(0, 50) });
      
      // Add turn to conversation
      setConversation((prev) => {
        const updated = [...prev, pendingTurn];
        streamLog.debug("Conversation updated", { 
          prevLength: prev.length, 
          newLength: updated.length,
          pendingTurnId: pendingTurn.id,
          userMessage: pendingTurn.userMessage?.slice(0, 50),
        });
        return updated;
      });

      // Batch processing variables
      let patchBuffer: JsonPatch[] = [];
      
      // Clear any existing timer
      if (patchFlushTimerRef.current) {
        clearTimeout(patchFlushTimerRef.current);
        patchFlushTimerRef.current = null;
      }

      try {
        // Build request body and headers
        const fileAttachments = attachments?.filter(isFileAttachment) ?? [];
        if (fileAttachments.length > 0) {
          streamLog.debug("Uploading attachments", {
            count: fileAttachments.length,
            files: fileAttachments.map((att) => ({
              name: att.file.name,
              type: att.file.type,
              size: att.file.size,
            })),
          });
        }

        const { body, headers } = buildRequest({
          prompt,
          context,
          currentTree,
          conversation,
          attachments,
        });

        // Add dynamic headers (e.g. auth)
        if (getHeaders) {
          const dynamicHeaders = await getHeaders();
          Object.assign(headers, dynamicHeaders);
        }

        streamLog.info("Sending request to API", { api, hasAuth: !!getHeaders });

        const response = await fetch(api, {
          method: "POST",
          headers,
          body,
          signal,
        });

        streamLog.debug("Response received", { status: response.status, ok: response.ok });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();

        const currentMessages: ChatMessage[] = [];
        const currentQuestions: QuestionPayload[] = [];
        const currentSuggestions: SuggestionChip[] = [];
        const currentToolProgress: ToolProgress[] = [];
        const currentPersistedAttachments: PersistedAttachment[] = [];
        let currentDocumentIndex: DocumentIndex | undefined = undefined;
        let patchCount = 0;
        let messageCount = 0;

        // Update status to streaming
        setConversation((prev) =>
          prev.map((t) =>
            t.id === turnId ? { ...t, status: "streaming" as const } : t,
          ),
        );

        // Helper to update the pending turn
        const updateTurnData = () => {
          setConversation((prev) =>
            prev.map((t) =>
              t.id === turnId
                ? ({
                    ...t,
                    assistantMessages: [...currentMessages],
                    questions: [...currentQuestions],
                    suggestions: [...currentSuggestions],
                    toolProgress: [...currentToolProgress],
                    persistedAttachments:
                      currentPersistedAttachments.length > 0
                        ? [...currentPersistedAttachments]
                        : t.persistedAttachments,
                    documentIndex: currentDocumentIndex ?? t.documentIndex,
                  } as ConversationTurn)
                : t,
            ),
          );
        };

        streamLog.debug("Starting stream processing");

        // Process stream events using async iterator
        for await (const event of readStreamWithTimeout(reader)) {
          try {
            if (event.type === "done" || event.type === "text-delta") {
              continue;
            }
            
            if (event.type === "message") {
              messageCount++;
              streamLog.debug("Message received", { messageCount, contentLength: event.message.content?.length ?? 0 });
              currentMessages.push(event.message);
              updateTurnData();
            } else if (event.type === "question") {
              currentQuestions.push(event.question);
              updateTurnData();
            } else if (event.type === "suggestion") {
              currentSuggestions.push(...event.suggestions);
              updateTurnData();
            } else if (event.type === "tool-progress") {
              currentToolProgress.push(event.progress);
              updateTurnData();
              addProgressRef.current({
                toolCallId: event.progress.toolCallId,
                toolName: event.progress.toolName,
                status: event.progress.status,
                message: event.progress.message,
                data: event.progress.data,
              });
            } else if (event.type === "patch") {
              patchCount++;
              patchBuffer.push(event.patch);

              // Schedule batch application with short delay
              if (!patchFlushTimerRef.current) {
                patchFlushTimerRef.current = setTimeout(() => {
                  patchFlushTimerRef.current = null;
                  if (patchBuffer.length > 0) {
                    streamLog.debug("Flushing patches", { count: patchBuffer.length });
                    
                    const baseTree = treeRef.current ?? currentTree;
                    const protectedTypes =
                      context?.forceCanvasMode === true ? ["Canvas"] : [];
                    
                    const updatedTree = applyPatchesBatch(
                      baseTree,
                      patchBuffer,
                      { turnId, protectedTypes },
                    );
                    patchBuffer = [];
                    
                    // Update local tracking state and UI store
                    treeRef.current = updatedTree;
                    currentTree = updatedTree;
                    
                    // Save selection before DOM changes
                    const savedSel = saveSelection();
                    
                    const store = storeRef.current;
                    store.setUITree({
                      root: updatedTree.root,
                      elements: { ...updatedTree.elements },
                    });
                    store.bumpTreeVersion();
                    
                    // Restore selection after DOM update
                    if (savedSel) {
                      requestAnimationFrame(() => restoreSelection(savedSel));
                    }
                    
                    streamLog.debug("Tree updated", { 
                      elementCount: Object.keys(updatedTree.elements).length 
                    });
                  }
                }, PATCH_FLUSH_INTERVAL_MS);
              }
            } else if (event.type === "plan-created" || event.type === "step-started" ||
                       event.type === "step-done" || event.type === "subtask-started" ||
                       event.type === "subtask-done" || event.type === "level-started" ||
                       event.type === "level-completed" || event.type === "orchestration-done") {
              processPlanEvent(event as unknown as Record<string, unknown>, planStoreRef.current);
            } else if (event.type === "persisted-attachments") {
              currentPersistedAttachments.push(...(event.attachments as PersistedAttachment[]));
              updateTurnData();
            } else if (event.type === "document-index-ui") {
              const uiComponent = event.uiComponent as { type: string; props: DocumentIndex };
              const updated = processDocumentIndex(uiComponent, currentDocumentIndex);
              if (updated) {
                currentDocumentIndex = updated;
                updateTurnData();
              }
            } else if (event.type === "citations") {
              if (Array.isArray(event.citations) && typeof window !== "undefined") {
                window.dispatchEvent(
                  new CustomEvent("onegenui:citations", {
                    detail: { citations: event.citations },
                  }),
                );
              }
            }
          } catch (e) {
            streamLog.warn("Event processing error", { 
              error: e instanceof Error ? e.message : String(e),
              eventType: event.type 
            });
          }
        }

        // Final setTree with fresh reference and sync ref
        streamLog.info("Stream completed", { 
          totalPatches: patchCount, 
          totalMessages: messageCount,
          treeElementCount: Object.keys(currentTree.elements).length 
        });
        treeRef.current = currentTree;
        
        // Create a shallow copy with new elements reference to ensure React detects change
        setTree({
          root: currentTree.root,
          elements: { ...currentTree.elements },
        });

        // Clear flush timer if pending
        if (patchFlushTimerRef.current) {
          clearTimeout(patchFlushTimerRef.current);
          patchFlushTimerRef.current = null;
        }

        // Flush any remaining patches before finalization
        if (patchBuffer.length > 0) {
          streamLog.debug("Final patch flush", { count: patchBuffer.length });
          // Use treeRef for consistency
          const baseTree = treeRef.current ?? currentTree;
          
          // Protect Canvas from removal when forceCanvasMode is enabled
          const protectedTypes =
            context?.forceCanvasMode === true ? ["Canvas"] : [];
          
          currentTree = applyPatchesBatch(baseTree, patchBuffer, { turnId, protectedTypes });
          patchBuffer = [];
          treeRef.current = currentTree;
          
          const store = storeRef.current;
          store.setUITree({
            root: currentTree.root,
            elements: { ...currentTree.elements },
          });
          store.bumpTreeVersion();
          
          streamLog.debug("Final tree state", { 
            elementCount: Object.keys(currentTree.elements).length,
          });
        }

        // Check abort before final state updates
        if (signal.aborted) {
          streamLog.warn("Request aborted before finalization");
          return;
        }

        // Finalize turn using turn manager
        streamLog.debug("Finalizing turn", { turnId });
        setConversation((prev) =>
          finalizeTurn(prev, turnId, {
            messages: currentMessages,
            questions: currentQuestions,
            suggestions: currentSuggestions,
            treeSnapshot: currentTree,
            documentIndex: currentDocumentIndex,
          }),
        );

        onComplete?.(currentTree);
      } catch (err) {
        // Clear buffer and timer on any error
        if (patchFlushTimerRef.current) {
          clearTimeout(patchFlushTimerRef.current);
          patchFlushTimerRef.current = null;
        }
        patchBuffer = [];

        if ((err as Error).name === "AbortError") {
          streamLog.info("Request aborted", { turnId });
          setConversation((prev) => removeTurn(prev, turnId));
          return;
        }
        const error = err instanceof Error ? err : new Error(String(err));
        streamLog.error("Stream error", { error: error.message, turnId });
        setError(error);
        onError?.(error);
        // Mark turn as failed using turn manager
        setConversation((prev) => markTurnFailed(prev, turnId, error.message));
      } finally {
        // Cleanup
        sendingRef.current = false;
        abortControllersRef.current.clear();
        setIsStreaming(false);
        streamLog.debug("Send completed");
      }
    },
    [api, onComplete, onError, setTree, getChatId],
  );

  const answerQuestion = useCallback(
    (turnId: string, questionId: string, answers: Record<string, unknown>) => {
      const turn = conversation.find((t) => t.id === turnId);
      const question = turn?.questions?.find((q) => q.id === questionId);

      // Collect all previous answers using extracted helper
      const allPreviousAnswers = collectPreviousAnswers(conversation, turnId);

      // Update conversation with answer
      setConversation((prev) => addQuestionAnswer(prev, turnId, questionId, answers));

      // Send question response if question found
      if (question) {
        const prompt = buildQuestionResponsePrompt(question.text, answers);
        const context = buildQuestionResponseContext(
          question,
          turnId,
          answers,
          allPreviousAnswers,
        );
        send(prompt, context);
      }
    },
    [conversation, send],
  );

  // Cleanup on unmount - abort all active streams and clear timers
  useEffect(() => {
    return () => {
      // Clear any pending patch flush timer
      if (patchFlushTimerRef.current) {
        clearTimeout(patchFlushTimerRef.current);
        patchFlushTimerRef.current = null;
      }
      // Abort all active streams
      for (const controller of abortControllersRef.current.values()) {
        controller.abort();
      }
      abortControllersRef.current.clear();
    };
  }, []);

  // Delete a turn and rollback to previous state
  const deleteTurn = useCallback(
    (turnId: string) => {
      pushHistory();
      const result = rollbackToTurn(conversation, turnId);
      if (!result) return;
      
      // Use restored tree or empty tree if first turn deleted
      const treeToRestore = result.restoredTree ?? { root: "", elements: {} };
      setTree(treeToRestore);
      treeRef.current = treeToRestore;
      setConversation(result.newConversation);
    },
    [conversation, pushHistory, setTree],
  );

  // Edit a turn message and regenerate
  const editTurn = useCallback(
    async (turnId: string, newMessage: string) => {
      pushHistory();
      const result = rollbackToTurn(conversation, turnId);
      if (!result) return;
      
      setTree(result.restoredTree);
      treeRef.current = result.restoredTree;
      setConversation(result.newConversation);

      await send(newMessage, result.restoredTree ? { tree: result.restoredTree } : undefined);
    },
    [conversation, send, pushHistory, setTree],
  );

  // Abort the current streaming request
  const abort = useCallback(() => {
    abortControllersRef.current.forEach((controller) => controller.abort());
    abortControllersRef.current.clear();
    sendingRef.current = false;
    setIsStreaming(false);
  }, []);

  return {
    tree,
    conversation,
    isStreaming,
    error,
    send,
    clear,
    loadSession,
    removeElement,
    removeSubItems,
    updateElement,
    updateElementLayout,
    deleteTurn,
    editTurn,
    undo,
    redo,
    canUndo,
    canRedo,
    answerQuestion,
    abort,
  };
}
