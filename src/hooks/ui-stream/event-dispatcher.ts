"use client";

/**
 * Stream Event Dispatcher - Routes stream events to handlers
 *
 * Centralized dispatch for all stream event types:
 * - Message, question, suggestion
 * - Plan events
 * - Tool progress
 * - Patches
 * - Document index
 * - Citations
 */

import type { JsonPatch, DocumentIndex } from "@onegenui/core";
import type {
  ChatMessage,
  QuestionPayload,
  SuggestionChip,
  ToolProgress,
  PersistedAttachment,
} from "../types";
import type { StreamEvent } from "./stream-parser";
import { streamLog } from "./logger";
import { processPlanEvent, type PlanStoreActions } from "./plan-handler";
import { processToolProgress, type ToolProgressStoreActions } from "./tool-progress-handler";
import { processDocumentIndex } from "./document-index-handler";

export interface EventDispatcherState {
  messages: ChatMessage[];
  questions: QuestionPayload[];
  suggestions: SuggestionChip[];
  toolProgress: ToolProgress[];
  persistedAttachments: PersistedAttachment[];
  documentIndex: DocumentIndex | null | undefined;
  patchBuffer: JsonPatch[];
  messageCount: number;
  patchCount: number;
}

export interface EventDispatcherDeps {
  planStore: PlanStoreActions;
  toolProgressStore: ToolProgressStoreActions;
  updateTurnData: () => void;
  resetIdleTimer: () => void;
}

export interface DispatchResult {
  state: EventDispatcherState;
  handled: boolean;
}

/**
 * Dispatch a stream event to the appropriate handler
 * Returns updated state and whether the event was handled
 */
export function dispatchStreamEvent(
  event: StreamEvent,
  state: EventDispatcherState,
  deps: EventDispatcherDeps,
): DispatchResult {
  const { planStore, toolProgressStore, updateTurnData, resetIdleTimer } = deps;
  const newState = { ...state };

  switch (event.type) {
    case "done":
    case "text-delta":
      resetIdleTimer();
      return { state: newState, handled: true };

    case "message":
      newState.messageCount++;
      streamLog.debug("Message received", {
        messageCount: newState.messageCount,
        contentLength: event.message.content?.length ?? 0,
      });
      newState.messages = [...state.messages, event.message];
      updateTurnData();
      return { state: newState, handled: true };

    case "question":
      newState.questions = [...state.questions, event.question];
      updateTurnData();
      return { state: newState, handled: true };

    case "suggestion":
      newState.suggestions = [...state.suggestions, ...event.suggestions];
      updateTurnData();
      return { state: newState, handled: true };

    case "tool-progress":
      processToolProgress(
        { type: "tool-progress", ...event.progress },
        state.toolProgress,
        toolProgressStore,
        updateTurnData,
      );
      return { state: newState, handled: true };

    case "patch":
      resetIdleTimer();
      newState.patchCount++;
      newState.patchBuffer = [...state.patchBuffer, event.patch];
      return { state: newState, handled: true };

    case "plan-created":
    case "step-started":
    case "step-done":
    case "subtask-started":
    case "subtask-done":
    case "level-started":
    case "level-completed":
    case "orchestration-done":
      // Convert event to payload format for plan handler
      processPlanEvent(event as unknown as Record<string, unknown>, planStore);
      return { state: newState, handled: true };

    case "persisted-attachments":
      newState.persistedAttachments = [
        ...state.persistedAttachments,
        ...(event.attachments as PersistedAttachment[]),
      ];
      updateTurnData();
      return { state: newState, handled: true };

    case "document-index-ui":
      const updatedIndex = processDocumentIndex(
        event.uiComponent as { type: string; props: DocumentIndex },
        state.documentIndex,
      );
      if (updatedIndex) {
        newState.documentIndex = updatedIndex;
        updateTurnData();
      }
      return { state: newState, handled: true };

    case "citations":
      // Emit custom event for CitationContext
      if (
        Array.isArray(event.citations) &&
        typeof window !== "undefined"
      ) {
        window.dispatchEvent(
          new CustomEvent("onegenui:citations", {
            detail: { citations: event.citations },
          }),
        );
      }
      return { state: newState, handled: true };

    case "unknown":
      streamLog.debug("Unknown event type", { payload: event.payload });
      return { state: newState, handled: false };

    default:
      return { state: newState, handled: false };
  }
}
