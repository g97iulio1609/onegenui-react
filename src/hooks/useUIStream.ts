"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
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
  ConversationMessage,
  Attachment,
} from "./types";
import { buildConversationMessages, isFileAttachment, isLibraryAttachment } from "./types";
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
import { useConversation } from "./ui-stream/use-conversation";

// ─────────────────────────────────────────────────────────────────────────────
// Debug Logger for useUIStream
// ─────────────────────────────────────────────────────────────────────────────

const LOG_ENDPOINT = "/api/debug-log";
const LOG_BUFFER: string[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function formatLog(level: string, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  const dataStr = data ? `\n  DATA: ${JSON.stringify(data, null, 2).replace(/\n/g, "\n  ")}` : "";
  return `[${timestamp}] [${level}] [useUIStream] ${message}${dataStr}`;
}

function flushLogs(): void {
  if (LOG_BUFFER.length === 0) return;
  const logs = LOG_BUFFER.splice(0, LOG_BUFFER.length);
  if (typeof window !== "undefined") {
    fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs }),
    }).catch(() => {});
  }
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushLogs();
  }, 500);
}

const streamLog = {
  debug: (msg: string, data?: unknown) => {
    console.log(`[useUIStream] ${msg}`, data ?? "");
    LOG_BUFFER.push(formatLog("DEBUG", msg, data));
    scheduleFlush();
  },
  info: (msg: string, data?: unknown) => {
    console.log(`[useUIStream] ${msg}`, data ?? "");
    LOG_BUFFER.push(formatLog("INFO", msg, data));
    scheduleFlush();
  },
  warn: (msg: string, data?: unknown) => {
    console.warn(`[useUIStream] ${msg}`, data ?? "");
    LOG_BUFFER.push(formatLog("WARN", msg, data));
    scheduleFlush();
  },
  error: (msg: string, data?: unknown) => {
    console.error(`[useUIStream] ${msg}`, data ?? "");
    LOG_BUFFER.push(formatLog("ERROR", msg, data));
    scheduleFlush();
  },
};

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
}: UseUIStreamOptions): UseUIStreamReturn {
  // Use Zustand store for tree state (ensures proper reactivity during streaming)
  const storeTree = useStore((s) => s.uiTree);
  const treeVersion = useStore((s) => s.treeVersion);
  const storeSetUITree = useStore((s) => s.setUITree);
  const storeClearUITree = useStore((s) => s.clearUITree);
  const storeSetTreeStreaming = useStore((s) => s.setTreeStreaming);
  const storeBumpTreeVersion = useStore((s) => s.bumpTreeVersion);
  
  // CRITICAL: Create new tree reference when version changes to force re-renders
  // Without this, React.memo components won't detect tree mutations
  const tree = useMemo(() => {
    if (!storeTree) return null;
    // Shallow copy to create new reference - structural sharing preserved internally
    return {
      ...storeTree,
      elements: { ...storeTree.elements },
    };
  }, [storeTree, treeVersion]);
  
  // Local state for backward compat - sync from store
  const [localTree, setLocalTree] = useState<UITree | null>(null);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const treeRef = useRef<UITree | null>(null);
  
  // Keep store setters in refs to avoid calling during render
  const storeSetUITreeRef = useRef(storeSetUITree);
  useEffect(() => {
    storeSetUITreeRef.current = storeSetUITree;
  }, [storeSetUITree]);
  
  // Sync local tree FROM store when store changes (triggered by treeVersion)
  useEffect(() => {
    if (tree && tree !== localTree) {
      setLocalTree(tree);
      treeRef.current = tree;
    }
  }, [tree, treeVersion]); // treeVersion ensures we catch all updates
  
  // Wrapper to update store - local sync happens via effect above
  const setTree = useCallback((newTree: UITree | null | ((prev: UITree | null) => UITree | null)) => {
    if (typeof newTree === "function") {
      const currentTree = treeRef.current;
      const updatedTree = newTree(currentTree);
      treeRef.current = updatedTree;
      storeSetUITreeRef.current(updatedTree);
    } else {
      treeRef.current = newTree;
      storeSetUITreeRef.current(newTree);
    }
  }, []);

  // Tool progress actions from Zustand store (direct store access for reliability)
  const addProgressEvent = useStore((s) => s.addProgressEvent);

  // Plan execution actions from Zustand store
  const setPlanCreated = useStore((s) => s.setPlanCreated);
  const setStepStarted = useStore((s) => s.setStepStarted);
  const setStepDone = useStore((s) => s.setStepDone);
  const setSubtaskStarted = useStore((s) => s.setSubtaskStarted);
  const setSubtaskDone = useStore((s) => s.setSubtaskDone);
  const setLevelStarted = useStore((s) => s.setLevelStarted);
  const setOrchestrationDone = useStore((s) => s.setOrchestrationDone);
  const resetPlanExecution = useStore((s) => s.resetPlanExecution);

  // Keep refs for async callbacks
  const addProgressRef = useRef(addProgressEvent);
  useEffect(() => {
    addProgressRef.current = addProgressEvent;
  }, [addProgressEvent]);
  
  // Keep store setters in refs for async use
  const storeRef = useRef({
    setUITree: storeSetUITree,
    bumpTreeVersion: storeBumpTreeVersion,
    setTreeStreaming: storeSetTreeStreaming,
    clearUITree: storeClearUITree,
  });
  useEffect(() => {
    storeRef.current = {
      setUITree: storeSetUITree,
      bumpTreeVersion: storeBumpTreeVersion,
      setTreeStreaming: storeSetTreeStreaming,
      clearUITree: storeClearUITree,
    };
  }, [storeSetUITree, storeBumpTreeVersion, storeSetTreeStreaming, storeClearUITree]);

  const planStoreRef = useRef({
    setPlanCreated,
    setStepStarted,
    setStepDone,
    setSubtaskStarted,
    setSubtaskDone,
    setLevelStarted,
    setOrchestrationDone,
  });
  useEffect(() => {
    planStoreRef.current = {
      setPlanCreated,
      setStepStarted,
      setStepDone,
      setSubtaskStarted,
      setSubtaskDone,
      setLevelStarted,
      setOrchestrationDone,
    };
  }, [
    setPlanCreated,
    setStepStarted,
    setStepDone,
    setSubtaskStarted,
    setSubtaskDone,
    setLevelStarted,
    setOrchestrationDone,
  ]);

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
  const abortControllerRef = useRef<AbortController | null>(null);
  const sendingRef = useRef(false); // Guard against concurrent sends

  const clear = useCallback(() => {
    setTree(null);
    setConversation([]);
    treeRef.current = null;
    setError(null);
    resetPlanExecution();
    storeRef.current.clearUITree();
  }, [resetPlanExecution, setTree]);

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
      // Prevent concurrent sends
      if (sendingRef.current) {
        streamLog.warn("Ignoring concurrent send request", { prompt: prompt.slice(0, 100) });
        return;
      }
      sendingRef.current = true;
      
      streamLog.info("Starting send", { 
        promptLength: prompt.length, 
        hasContext: !!context,
        attachmentCount: attachments?.length ?? 0 
      });

      // Abort any existing request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

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
        treeRef.current = currentTree; // Sync ref immediately to prevent race conditions
      }

      // OPTIMISTIC UI: Create the turn immediately so user message is visible
      // For proactive responses, we hide the user message
      const isProactive = context?.hideUserMessage === true;
      const turnId = `turn-${Date.now()}`;
      streamLog.debug("Creating turn", { turnId, isProactive });
      const pendingTurn: ConversationTurn = {
        id: turnId,
        userMessage: prompt,
        assistantMessages: [],
        treeSnapshot: null, // Will be set on completion
        timestamp: Date.now(),
        isProactive,
        attachments,
        isLoading: true, // Mark as loading during streaming
        status: "pending", // Initial status
      };
      setConversation((prev) => [...prev, pendingTurn]);

      // Batch processing variables - declared outside try for cleanup in catch
      let patchBuffer: JsonPatch[] = [];
      let patchFlushTimer: ReturnType<typeof setTimeout> | null = null;

      try {
        const hasTreeContext =
          context && typeof context === "object" && "tree" in context;

        // Build conversation history for multi-turn support
        // This enables the AI to maintain context across turns natively
        const conversationMessages = buildConversationMessages(conversation);

        let body: string | FormData;
        const headers: Record<string, string> = {};

        // Separate file attachments from library attachments
        const fileAttachments = attachments?.filter(isFileAttachment) ?? [];
        const libraryAttachments = attachments?.filter(isLibraryAttachment) ?? [];

        if (fileAttachments.length > 0) {
          // Use FormData for file uploads
          console.debug("[useUIStream] Uploading attachments:", {
            count: fileAttachments.length,
            files: fileAttachments.map((att) => ({
              name: att.file.name,
              type: att.file.type,
              size: att.file.size,
            })),
            libraryDocs: libraryAttachments.map((att) => att.documentId),
          });
          const formData = new FormData();
          formData.append("prompt", prompt);
          if (context) {
            formData.append("context", JSON.stringify(context));
          }
          if (!hasTreeContext) {
            formData.append("currentTree", JSON.stringify(currentTree));
          }
          // Include conversation history for multi-turn context
          if (conversationMessages.length > 0) {
            formData.append("messages", JSON.stringify(conversationMessages));
          }

          fileAttachments.forEach((att) => {
            formData.append("files", att.file);
          });

          // Include library document IDs
          if (libraryAttachments.length > 0) {
            formData.append(
              "libraryDocumentIds",
              JSON.stringify(libraryAttachments.map((a) => a.documentId)),
            );
          }

          body = formData;
          // Don't set Content-Type header for FormData, browser sets it with boundary
        } else if (libraryAttachments.length > 0) {
          // Only library documents, use JSON
          const bodyPayload: Record<string, unknown> = {
            prompt,
            context,
            libraryDocumentIds: libraryAttachments.map((a) => a.documentId),
          };
          if (!hasTreeContext) {
            bodyPayload.currentTree = currentTree;
          }
          if (conversationMessages.length > 0) {
            bodyPayload.messages = conversationMessages;
          }
          body = JSON.stringify(bodyPayload);
          headers["Content-Type"] = "application/json";
        } else {
          // Use JSON for text-only requests
          const bodyPayload: Record<string, unknown> = { prompt, context };
          if (!hasTreeContext) {
            bodyPayload.currentTree = currentTree;
          }
          // Include conversation history for multi-turn context
          if (conversationMessages.length > 0) {
            bodyPayload.messages = conversationMessages;
          }
          body = JSON.stringify(bodyPayload);
          headers["Content-Type"] = "application/json";
        }

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
          signal: abortControllerRef.current.signal,
        });

        streamLog.debug("Response received", { status: response.status, ok: response.ok });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

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

        // Process incoming stream data with timeout protection
        let buffer = "";
        const STREAM_TIMEOUT_MS = 60000; // 60 second timeout between chunks
        let lastChunkTime = Date.now();

        while (true) {
          // Create read with timeout
          const readPromise = reader.read();
          const timeoutPromise = new Promise<{ done: true; value: undefined }>((_, reject) => {
            const checkInterval = setInterval(() => {
              if (Date.now() - lastChunkTime > STREAM_TIMEOUT_MS) {
                clearInterval(checkInterval);
                reject(new Error(`Stream timeout: no data received for ${STREAM_TIMEOUT_MS / 1000}s`));
              }
            }, 5000);
            // Clear interval when read completes
            readPromise.finally(() => clearInterval(checkInterval));
          });

          const { done, value } = await Promise.race([readPromise, timeoutPromise]);
          if (done) break;

          lastChunkTime = Date.now();

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line) continue;
            const colIdx = line.indexOf(":");
            if (colIdx === -1) continue;

            const lineType = line.slice(0, colIdx);
            const content = line.slice(colIdx + 1);

            try {
              // Only process "d" or "data" line types
              if (lineType === "d" || lineType === "data") {
                // Data Part - parse and apply patch
                if (content.trim() === "[DONE]") {
                  streamLog.debug("Stream DONE received");
                  continue;
                }

                const data = JSON.parse(content);

                // Handle wrapped format: { type: "data", data: {...} }
                const payload = data?.type === "data" ? data.data : data;

                if (payload?.type === "text-delta") {
                  // Text delta from AI SDK - not used, all chat comes from op:"message"
                  continue;
                } else if (payload?.op) {
                  // JSON Patch operation
                  const { op, path, value } = payload;

                  if (op === "message") {
                    const msgContent = payload.content || value;
                    if (msgContent) {
                      messageCount++;
                      streamLog.debug("Message received", { messageCount, contentLength: msgContent.length });
                      currentMessages.push({
                        role: payload.role || "assistant",
                        content: msgContent,
                      });
                      updateTurnData();
                    }
                  } else if (op === "question") {
                    // Extract question object - handles both { op: 'question', question: {...} } and { op: 'question', value: {...} }
                    const question = value || payload.question;
                    if (question)
                      currentQuestions.push(question as QuestionPayload);
                    updateTurnData();
                  } else if (op === "suggestion") {
                    const suggestions = value || payload.suggestions;
                    if (Array.isArray(suggestions))
                      currentSuggestions.push(...suggestions);
                    updateTurnData();
                  } else if (op === "tool-progress") {
                    // Tool progress via op format (from SSE)
                    const progress: ToolProgress = {
                      toolName: payload.toolName as string,
                      toolCallId: payload.toolCallId as string,
                      status: payload.status as ToolProgress["status"],
                      message: payload.message as string | undefined,
                      data: payload.data,
                    };
                    streamLog.debug("Tool progress", { toolName: progress.toolName, status: progress.status });
                    currentToolProgress.push(progress);
                    updateTurnData();

                    // Update global tool progress store directly
                    addProgressRef.current({
                      toolCallId: progress.toolCallId,
                      toolName: progress.toolName,
                      status: progress.status,
                      message: progress.message,
                      data: progress.data,
                    });
                  } else if (path) {
                    // Tree mutation patch - accumulate in buffer for batch processing
                    patchCount++;
                    patchBuffer.push({
                      op,
                      path,
                      value,
                    } as JsonPatch);

                    // Schedule batch application with short delay for immediate feel
                    // Flush every 50ms or on next frame, whichever comes first
                    if (!patchFlushTimer) {
                      patchFlushTimer = setTimeout(() => {
                        patchFlushTimer = null;
                        if (patchBuffer.length > 0) {
                          streamLog.debug("Flushing patches", { count: patchBuffer.length });
                          // CRITICAL: Use treeRef.current as the base, not the captured currentTree
                          // This ensures we're always working with the latest state
                          const baseTree = treeRef.current ?? currentTree;
                          const updatedTree = applyPatchesBatch(
                            baseTree,
                            patchBuffer,
                            turnId,
                          );
                          patchBuffer = [];
                          // Update both ref and state atomically
                          treeRef.current = updatedTree;
                          currentTree = updatedTree; // Keep local var in sync for subsequent patches
                          
                          // Update Zustand store directly for guaranteed reactivity
                          const store = storeRef.current;
                          store.setUITree({
                            root: updatedTree.root,
                            elements: { ...updatedTree.elements },
                          });
                          store.bumpTreeVersion();
                          
                          streamLog.debug("Tree updated", { 
                            elementCount: Object.keys(updatedTree.elements).length 
                          });
                        }
                      }, 50); // Flush every 50ms for more responsive UI
                    }
                  }
                } else if (payload?.type === "plan-created") {
                  // Multi-agent: Plan created - use Zustand store
                  const plan = payload.plan as {
                    goal: string;
                    steps: Array<{
                      id: number;
                      task: string;
                      agent: string;
                      dependencies?: number[];
                      parallel?: boolean;
                      subtasks?: Array<{
                        id: number;
                        task: string;
                        agent: string;
                      }>;
                    }>;
                  };
                  const store = planStoreRef.current;
                  store.setPlanCreated(
                    plan.goal,
                    plan.steps.map((s) => ({
                      id: s.id,
                      task: s.task,
                      agent: s.agent,
                      dependencies: s.dependencies ?? [],
                      parallel: s.parallel,
                      subtasks: s.subtasks?.map((st) => ({
                        id: st.id,
                        task: st.task,
                        agent: st.agent,
                      })),
                    })),
                  );
                } else if (payload?.type === "persisted-attachments") {
                  // Persisted attachments for saving in conversation
                  const attachments =
                    payload.attachments as PersistedAttachment[];
                  currentPersistedAttachments.push(...attachments);
                  updateTurnData();
                } else if (payload?.type === "tool-progress") {
                  // Tool progress for granular updates
                  const progress: ToolProgress = {
                    toolName: payload.toolName as string,
                    toolCallId: payload.toolCallId as string,
                    status: payload.status as ToolProgress["status"],
                    message: payload.message as string | undefined,
                    data: payload.data,
                  };
                  currentToolProgress.push(progress);
                  updateTurnData();

                  // Update global tool progress store directly
                  console.debug("[useUIStream] Tool progress received:", {
                    toolName: progress.toolName,
                    status: progress.status,
                  });
                  addProgressRef.current({
                    toolCallId: progress.toolCallId,
                    toolName: progress.toolName,
                    status: progress.status,
                    message: progress.message,
                    data: progress.data,
                  });
                } else if (payload?.type === "document-index-ui") {
                  // Document index from Vectorless smart parsing
                  // Supports multi-document: aggregates subsequent documents
                  const uiComponent = payload.uiComponent as {
                    type: string;
                    props: DocumentIndex;
                  };
                  if (uiComponent?.props) {
                    if (!currentDocumentIndex) {
                      // First document
                      currentDocumentIndex = uiComponent.props;
                    } else {
                      // Additional document - merge into existing
                      const newDoc = uiComponent.props;
                      currentDocumentIndex = {
                        title: `${currentDocumentIndex.title} + ${newDoc.title}`,
                        description: [
                          currentDocumentIndex.description,
                          newDoc.description,
                        ]
                          .filter(Boolean)
                          .join("\n\n---\n\n"),
                        pageCount:
                          currentDocumentIndex.pageCount + newDoc.pageCount,
                        nodes: [
                          ...currentDocumentIndex.nodes,
                          // Add separator node for clarity
                          {
                            title: `📄 ${newDoc.title}`,
                            nodeId: `doc-${Date.now()}`,
                            startPage: 1,
                            endPage: newDoc.pageCount,
                            summary: newDoc.description,
                            children: newDoc.nodes,
                          },
                        ],
                      };
                    }
                    updateTurnData();
                  }
                } else if (payload?.type === "level-started") {
                  // Multi-agent: Parallel level started - use Zustand store
                  planStoreRef.current.setLevelStarted(payload.level as number);
                } else if (payload?.type === "step-started") {
                  // Multi-agent: Step started - use Zustand store
                  planStoreRef.current.setStepStarted(payload.stepId as number);
                } else if (payload?.type === "subtask-started") {
                  // Multi-agent: Subtask started - use Zustand store
                  planStoreRef.current.setSubtaskStarted(
                    payload.parentId as number,
                    payload.stepId as number,
                  );
                } else if (payload?.type === "step-done") {
                  // Multi-agent: Step completed - use Zustand store
                  planStoreRef.current.setStepDone(
                    payload.stepId as number,
                    payload.result,
                  );
                } else if (payload?.type === "subtask-done") {
                  // Multi-agent: Subtask completed - use Zustand store
                  planStoreRef.current.setSubtaskDone(
                    payload.parentId as number,
                    payload.stepId as number,
                    payload.result,
                  );
                } else if (payload?.type === "orchestration-done") {
                  // Multi-agent: Orchestration complete - use Zustand store
                  planStoreRef.current.setOrchestrationDone();
                } else if (payload?.type === "citations") {
                  // Document citations from Vectorless
                  // Will be handled by CitationContext in the app
                  // Emit a custom event that CitationContext can listen to
                  if (
                    payload.citations &&
                    Array.isArray(payload.citations) &&
                    typeof window !== "undefined"
                  ) {
                    window.dispatchEvent(
                      new CustomEvent("onegenui:citations", {
                        detail: { citations: payload.citations },
                      }),
                    );
                  }
                }
              }
            } catch (e) {
              // Log parse errors for debugging but don't crash the stream
              streamLog.warn("Parse error on stream line", { 
                error: e instanceof Error ? e.message : String(e),
                lineType,
                contentPreview: content.slice(0, 100) 
              });
            }
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
        if (patchFlushTimer) {
          clearTimeout(patchFlushTimer);
          patchFlushTimer = null;
        }

        // Flush any remaining patches before finalization
        if (patchBuffer.length > 0) {
          streamLog.debug("Final patch flush", { count: patchBuffer.length });
          // Use treeRef for consistency
          const baseTree = treeRef.current ?? currentTree;
          currentTree = applyPatchesBatch(baseTree, patchBuffer, turnId);
          patchBuffer = [];
          treeRef.current = currentTree;
          
          // Update Zustand store for final state
          const store = storeRef.current;
          store.setUITree({
            root: currentTree.root,
            elements: { ...currentTree.elements },
          });
          store.bumpTreeVersion();
          
          streamLog.debug("Final tree state", { 
            elementCount: Object.keys(currentTree.elements).length 
          });
        }

        // Check abort before final state updates
        if (signal.aborted) {
          streamLog.warn("Request aborted before finalization");
          return;
        }

        // Finalize - mark loading complete
        streamLog.debug("Finalizing turn", { turnId });
        setConversation((prev) =>
          prev.map((t) =>
            t.id === turnId
              ? ({
                  ...t,
                  assistantMessages: [...currentMessages],
                  questions: [...currentQuestions],
                  suggestions: [...currentSuggestions],
                  treeSnapshot: JSON.parse(JSON.stringify(currentTree)),
                  documentIndex: currentDocumentIndex ?? t.documentIndex,
                  isLoading: false, // Loading complete
                  status: "complete", // Successful completion
                } as ConversationTurn)
              : t,
          ),
        );

        onComplete?.(currentTree);
      } catch (err) {
        // Clear buffer and timer on any error
        if (patchFlushTimer) {
          clearTimeout(patchFlushTimer);
          patchFlushTimer = null;
        }
        patchBuffer = [];

        if ((err as Error).name === "AbortError") {
          streamLog.info("Request aborted", { turnId });
          setConversation((prev) => prev.filter((t) => t.id !== turnId));
          return;
        }
        const error = err instanceof Error ? err : new Error(String(err));
        streamLog.error("Stream error", { error: error.message, turnId });
        setError(error);
        onError?.(error);
        // Mark turn as failed instead of removing it
        setConversation((prev) =>
          prev.map((t) =>
            t.id === turnId
              ? ({
                  ...t,
                  error: error.message,
                  isLoading: false,
                  status: "failed", // Mark as failed
                } as ConversationTurn)
              : t,
          ),
        );
      } finally {
        sendingRef.current = false;
        setIsStreaming(false);
        streamLog.debug("Send completed, isStreaming=false");
      }
    },
    [api, onComplete, onError, setTree],
  );

  const answerQuestion = useCallback(
    (turnId: string, questionId: string, answers: Record<string, unknown>) => {
      const turn = conversation.find((t) => t.id === turnId);
      const question = turn?.questions?.find((q) => q.id === questionId);

      // Collect all previous question answers from the conversation
      const allPreviousAnswers: Record<string, unknown> = {};
      for (const t of conversation) {
        if (t.questionAnswers) {
          // For each question answer in the turn, extract the actual values
          for (const [qId, qAnswers] of Object.entries(t.questionAnswers)) {
            if (typeof qAnswers === "object" && qAnswers !== null) {
              Object.assign(allPreviousAnswers, qAnswers);
            }
          }
        }
      }

      // Add the current turn's existing answers
      if (turn?.questionAnswers) {
        for (const qAnswers of Object.values(turn.questionAnswers)) {
          if (typeof qAnswers === "object" && qAnswers !== null) {
            Object.assign(
              allPreviousAnswers,
              qAnswers as Record<string, unknown>,
            );
          }
        }
      }

      setConversation((prev) =>
        prev.map((t) => {
          if (t.id !== turnId) return t;
          const existing = t.questionAnswers ?? {};
          return {
            ...t,
            questionAnswers: {
              ...existing,
              [questionId]: answers,
            },
          };
        }),
      );

      if (question) {
        const answerSummary = Object.entries(answers)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");

        const prompt = `[User Response] ${question.text}\nAnswer: ${answerSummary}`;

        // Combine all previous answers with current answers
        const combinedAnswers = { ...allPreviousAnswers, ...answers };

        send(prompt, {
          isQuestionResponse: true,
          questionId,
          turnId,
          originalQuestion: question.text,
          answers,
          previousAnswers: allPreviousAnswers,
          allCollectedData: combinedAnswers,
          hideUserMessage: true,
        });
      }
    },
    [conversation, send],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Delete a turn and rollback to previous state
  const deleteTurn = useCallback(
    (turnId: string) => {
      // Save current state to history before mutation
      pushHistory();

      // Find the turn first
      const currentConversation = conversation;
      const turnIndex = currentConversation.findIndex((t) => t.id === turnId);
      if (turnIndex === -1) return;

      // Get the new conversation (all turns before this one)
      const newConversation = currentConversation.slice(0, turnIndex);

      // Restore tree to previous turn's snapshot (or null if first turn)
      const previousTurn = newConversation[newConversation.length - 1];
      const restoredTree = previousTurn?.treeSnapshot ?? null;
      
      // Update tree first (outside of setConversation callback)
      setTree(restoredTree);
      treeRef.current = restoredTree;
      
      // Then update conversation
      setConversation(newConversation);
    },
    [conversation, pushHistory, setTree],
  );

  // Edit a turn message and regenerate
  const editTurn = useCallback(
    async (turnId: string, newMessage: string) => {
      // Save current state to history before mutation
      pushHistory();

      // Find the turn index
      const turnIndex = conversation.findIndex((t) => t.id === turnId);
      if (turnIndex === -1) return;

      // Remove this turn and all subsequent turns
      const newConversation = conversation.slice(0, turnIndex);
      
      // Restore tree to previous turn's snapshot
      const previousTurn = newConversation[newConversation.length - 1];
      const restoredTree = previousTurn?.treeSnapshot ?? null;
      
      // Update tree first
      setTree(restoredTree);
      treeRef.current = restoredTree;
      
      // Then update conversation
      setConversation(newConversation);

      // Re-send with edited message
      await send(newMessage, restoredTree ? { tree: restoredTree } : undefined);
    },
    [conversation, send, pushHistory, setTree],
  );

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
  };
}
