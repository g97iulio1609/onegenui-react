/**
 * Streaming module types
 * Extracted from useUIStream for modularity
 */

import type { JsonPatch, UITree } from "@onegenui/core";
import type {
  ChatMessage,
  QuestionPayload,
  SuggestionChip,
  ToolProgress,
  PersistedAttachment,
  ExecutionPlan,
} from "../types";
import type { DocumentIndex } from "@onegenui/core";

// ─────────────────────────────────────────────────────────────────────────────
// Stream Parsing Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parsed SSE line type (only modern types supported)
 */
export type LineType = "d" | "data";

/**
 * Parsed SSE line
 */
export interface ParsedLine {
  type: LineType;
  content: string;
}

/**
 * Stream payload discriminated union
 * Note: Excludes PatchPayload - use separate type guard for patch ops
 */
export type StreamPayload =
  | { type: "text-delta"; textDelta: string }
  | { type: "plan-created"; plan: ExecutionPlan }
  | { type: "persisted-attachments"; attachments: PersistedAttachment[] }
  | {
      type: "tool-progress";
      toolName: string;
      toolCallId: string;
      status: ToolProgress["status"];
      message?: string;
      data?: unknown;
    }
  | {
      type: "document-index-ui";
      uiComponent: { type: string; props: DocumentIndex };
    }
  | { type: "citations"; citations: unknown[] }
  | { type: "level-started"; level: number }
  | { type: "step-started"; stepId: number }
  | { type: "subtask-started"; stepId: number }
  | { type: "step-done"; stepId: number }
  | { type: "subtask-done"; stepId: number }
  | { type: "orchestration-done" };

/**
 * Patch operation payload
 */
export interface PatchPayload {
  op:
    | "add"
    | "replace"
    | "remove"
    | "set"
    | "message"
    | "question"
    | "suggestion";
  path?: string;
  value?: unknown;
  content?: string;
  role?: "assistant" | "user" | "system";
  question?: QuestionPayload;
  suggestions?: SuggestionChip[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Stream State Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Configuration for stream buffering
 */
export interface BufferConfig {
  /** Flush interval in milliseconds */
  flushInterval: number;
  /** Maximum patches to buffer before forced flush */
  maxBufferSize: number;
}

/**
 * Default buffer configuration
 */
export const DEFAULT_BUFFER_CONFIG: BufferConfig = {
  flushInterval: 50,
  maxBufferSize: 100,
};

/**
 * Accumulated data during a streaming turn
 */
export interface TurnAccumulator {
  messages: ChatMessage[];
  questions: QuestionPayload[];
  suggestions: SuggestionChip[];
  toolProgress: ToolProgress[];
  persistedAttachments: PersistedAttachment[];
  documentIndex?: DocumentIndex;
  patchBuffer: JsonPatch[];
}

/**
 * Create empty turn accumulator
 */
export function createTurnAccumulator(): TurnAccumulator {
  return {
    messages: [],
    questions: [],
    suggestions: [],
    toolProgress: [],
    persistedAttachments: [],
    patchBuffer: [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// History Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * History snapshot for undo/redo
 */
export interface HistorySnapshot {
  tree: UITree | null;
  conversation: import("../types").ConversationTurn[];
}
