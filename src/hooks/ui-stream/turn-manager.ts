"use client";

/**
 * Turn Manager - Handles conversation turn lifecycle
 *
 * Manages:
 * - Creating new turns
 * - Updating turn data during streaming
 * - Finalizing completed turns
 * - Marking failed turns
 */

import type { UITree, DocumentIndex } from "@onegenui/core";
import type {
  ConversationTurn,
  ChatMessage,
  QuestionPayload,
  SuggestionChip,
  ToolProgress,
  PersistedAttachment,
  Attachment,
} from "../types";

export interface TurnData {
  messages: ChatMessage[];
  questions: QuestionPayload[];
  suggestions: SuggestionChip[];
  toolProgress: ToolProgress[];
  persistedAttachments: PersistedAttachment[];
  documentIndex: DocumentIndex | null | undefined;
}

function createTurnId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `turn-${crypto.randomUUID()}`;
  }

  return `turn-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Create a new pending conversation turn
 */
export function createPendingTurn(
  prompt: string,
  options: {
    isProactive?: boolean;
    attachments?: Attachment[];
  } = {},
): ConversationTurn {
  const { isProactive = false, attachments } = options;
  return {
    id: createTurnId(),
    userMessage: prompt,
    assistantMessages: [],
    treeSnapshot: null,
    timestamp: Date.now(),
    isProactive,
    attachments,
    isLoading: true,
    status: "streaming",
  } as ConversationTurn;
}

/**
 * Update turn with streaming data
 */
export function updateTurnData(
  turns: ConversationTurn[],
  turnId: string,
  data: Partial<TurnData>,
): ConversationTurn[] {
  return turns.map((t) =>
    t.id === turnId
      ? ({
          ...t,
          assistantMessages: data.messages ?? t.assistantMessages,
          questions: data.questions ?? t.questions,
          suggestions: data.suggestions ?? t.suggestions,
          toolProgress: data.toolProgress ?? t.toolProgress,
          persistedAttachments:
            data.persistedAttachments && data.persistedAttachments.length > 0
              ? data.persistedAttachments
              : t.persistedAttachments,
          documentIndex: data.documentIndex ?? t.documentIndex,
        } as ConversationTurn)
      : t,
  );
}

/**
 * Finalize a completed turn
 */
export function finalizeTurn(
  turns: ConversationTurn[],
  turnId: string,
  finalData: {
    messages: ChatMessage[];
    questions: QuestionPayload[];
    suggestions: SuggestionChip[];
    treeSnapshot: UITree;
    documentIndex: DocumentIndex | null | undefined;
  },
): ConversationTurn[] {
  return turns.map((t) =>
    t.id === turnId
      ? ({
          ...t,
          assistantMessages: [...finalData.messages],
          questions: [...finalData.questions],
          suggestions: [...finalData.suggestions],
          treeSnapshot: JSON.parse(JSON.stringify(finalData.treeSnapshot)),
          documentIndex: finalData.documentIndex ?? t.documentIndex,
          isLoading: false,
          status: "complete",
        } as ConversationTurn)
      : t,
  );
}

/**
 * Mark turn as failed
 */
export function markTurnFailed(
  turns: ConversationTurn[],
  turnId: string,
  errorMessage: string,
): ConversationTurn[] {
  return turns.map((t) =>
    t.id === turnId
      ? ({
          ...t,
          error: errorMessage,
          isLoading: false,
          status: "failed",
        } as ConversationTurn)
      : t,
  );
}

/**
 * Remove turn from conversation
 */
export function removeTurn(
  turns: ConversationTurn[],
  turnId: string,
): ConversationTurn[] {
  return turns.filter((t) => t.id !== turnId);
}

export interface TurnRollbackResult {
  newConversation: ConversationTurn[];
  restoredTree: UITree | null;
}

/**
 * Rollback to state before a specific turn
 * Returns new conversation and tree to restore
 */
export function rollbackToTurn(
  turns: ConversationTurn[],
  turnId: string,
): TurnRollbackResult | null {
  const turnIndex = turns.findIndex((t) => t.id === turnId);
  if (turnIndex === -1) return null;

  const newConversation = turns.slice(0, turnIndex);
  const previousTurn = newConversation[newConversation.length - 1];
  const restoredTree = previousTurn?.treeSnapshot ?? null;

  return { newConversation, restoredTree };
}
