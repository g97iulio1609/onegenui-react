"use client";

/**
 * Stream Event Loop Hook - Async iterator dispatch for SSE events
 *
 * Extracts the for-await event dispatch loop from useUIStream.
 * Manages mutable accumulators (messages, questions, suggestions, etc.)
 * and delegates side-effects to caller-provided handlers.
 */

import { useCallback } from "react";
import type { JsonPatch, DocumentIndex } from "@onegenui/core";
import type {
  ChatMessage, QuestionPayload, SuggestionChip,
  ToolProgress, PersistedAttachment, ConversationTurn,
} from "../types";
import { readStreamWithTimeout } from "./stream-reader";
import { streamLog } from "./logger";

export interface EventLoopHandlers {
  onPatch: (patches: JsonPatch[], atomic?: boolean) => void;
  onToolProgress: (progress: ToolProgress) => void;
  onPlanEvent: (event: Record<string, unknown>) => void;
  onDocumentIndex: (uiComponent: { type: string; props: DocumentIndex }, current: DocumentIndex | undefined) => DocumentIndex | null;
  onCitations: (citations: unknown[]) => void;
}

export interface ProcessStreamParams {
  reader: ReadableStreamDefaultReader<Uint8Array>;
  turnId: string;
  setConversation: React.Dispatch<React.SetStateAction<ConversationTurn[]>>;
  handlers: EventLoopHandlers;
}

export interface EventLoopResult {
  messages: ChatMessage[];
  questions: QuestionPayload[];
  suggestions: SuggestionChip[];
  persistedAttachments: PersistedAttachment[];
  documentIndex: DocumentIndex | undefined;
  patchCount: number;
  messageCount: number;
}

const PLAN_EVENT_TYPES = new Set([
  "plan-created", "step-started", "step-done", "subtask-started",
  "subtask-done", "level-started", "level-completed", "orchestration-done",
]);

const CRITICAL_EVENT_TYPES = new Set([
  "message", "patch", "question", "suggestion", "persisted-attachments",
]);

function applyMessageEvent(messages: ChatMessage[], message: ChatMessage): void {
  const mode = message.mode ?? "final";
  const messageId = message.id;
  if (!messageId || mode === "final") {
    messages.push({ ...message, mode: "final" });
    return;
  }
  const existingIndex = messages.findIndex((item) => item.id === messageId);
  if (existingIndex === -1) {
    messages.push({ ...message, mode: "final" });
    return;
  }
  const existing = messages[existingIndex];
  if (!existing) return;
  const nextContent = mode === "append" ? `${existing.content}${message.content}` : message.content;
  messages[existingIndex] = { ...existing, ...message, mode: "final", content: nextContent };
}

export function useStreamEventLoop() {
  const processStream = useCallback(
    async (params: ProcessStreamParams): Promise<EventLoopResult> => {
      const { reader, turnId, setConversation, handlers } = params;
      const msgs: ChatMessage[] = [];
      const questions: QuestionPayload[] = [];
      const suggestions: SuggestionChip[] = [];
      const toolProgress: ToolProgress[] = [];
      const attachments: PersistedAttachment[] = [];
      let docIndex: DocumentIndex | undefined;
      let patchCount = 0;
      let messageCount = 0;

      const updateTurnData = () => {
        setConversation((prev) =>
          prev.map((t) =>
            t.id === turnId
              ? ({
                  ...t,
                  assistantMessages: [...msgs],
                  questions: [...questions],
                  suggestions: [...suggestions],
                  toolProgress: [...toolProgress],
                  persistedAttachments: attachments.length > 0 ? [...attachments] : t.persistedAttachments,
                  documentIndex: docIndex ?? t.documentIndex,
                } as ConversationTurn)
              : t,
          ),
        );
      };

      setConversation((prev) =>
        prev.map((t) => (t.id === turnId ? { ...t, status: "streaming" as const } : t)),
      );
      streamLog.debug("Starting stream processing");

      for await (const event of readStreamWithTimeout(reader)) {
        try {
          if (event.type === "done" || event.type === "text-delta") continue;
          if (event.type === "error") throw new Error(`[${event.error.code}] ${event.error.message}`);

          if (event.type === "message") {
            messageCount++;
            streamLog.debug("Message received", { messageCount, contentLength: event.message.content?.length ?? 0 });
            applyMessageEvent(msgs, event.message);
            updateTurnData();
          } else if (event.type === "question") {
            questions.push(event.question); updateTurnData();
          } else if (event.type === "suggestion") {
            suggestions.push(...event.suggestions); updateTurnData();
          } else if (event.type === "tool-progress") {
            toolProgress.push(event.progress); updateTurnData();
            handlers.onToolProgress(event.progress);
          } else if (event.type === "patch") {
            patchCount += event.patches.length;
            handlers.onPatch(event.patches, event.atomic);
          } else if (PLAN_EVENT_TYPES.has(event.type)) {
            handlers.onPlanEvent(event as unknown as Record<string, unknown>);
          } else if (event.type === "persisted-attachments") {
            attachments.push(...(event.attachments as PersistedAttachment[])); updateTurnData();
          } else if (event.type === "document-index-ui") {
            const ui = event.uiComponent as { type: string; props: DocumentIndex };
            const updated = handlers.onDocumentIndex(ui, docIndex);
            if (updated) { docIndex = updated; updateTurnData(); }
          } else if (event.type === "citations" && Array.isArray(event.citations)) {
            handlers.onCitations(event.citations);
          }
        } catch (e) {
          if (CRITICAL_EVENT_TYPES.has(event.type)) throw e;
          streamLog.warn("Event processing error", {
            error: e instanceof Error ? e.message : String(e), eventType: event.type,
          });
        }
      }

      return { messages: msgs, questions, suggestions, persistedAttachments: attachments, documentIndex: docIndex, patchCount, messageCount };
    },
    [],
  );

  return { processStream };
}
