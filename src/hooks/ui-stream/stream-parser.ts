"use client";

/**
 * Stream Parser - SSE event parsing and dispatch
 *
 * Handles parsing of Server-Sent Events from the API:
 * - Text deltas
 * - JSON patches
 * - Messages
 * - Questions
 * - Suggestions
 * - Tool progress
 * - Plan events
 * - Document index
 */

import type { JsonPatch } from "@onegenui/core";
import type {
  ChatMessage,
  QuestionPayload,
  SuggestionChip,
  ToolProgress,
} from "../types";
import { streamLog } from "./logger";

/** Parsed SSE event with typed payload */
export type StreamEvent =
  | { type: "text-delta" }
  | { type: "done" }
  | { type: "message"; message: ChatMessage }
  | { type: "question"; question: QuestionPayload }
  | { type: "suggestion"; suggestions: SuggestionChip[] }
  | { type: "tool-progress"; progress: ToolProgress }
  | { type: "patch"; patch: JsonPatch }
  | { type: "plan-created"; plan: unknown }
  | { type: "persisted-attachments"; attachments: unknown[] }
  | { type: "document-index-ui"; uiComponent: unknown }
  | { type: "level-started"; level: number }
  | { type: "step-started"; stepId: number }
  | { type: "subtask-started"; parentId: number; stepId: number }
  | { type: "subtask-done"; parentId: number; stepId: number; result: unknown }
  | { type: "step-done"; stepId: number; result: unknown }
  | { type: "level-completed"; level: number }
  | { type: "orchestration-done"; finalResult?: unknown }
  | { type: "citations"; citations: unknown[] }
  | { type: "unknown"; payload: unknown };

/**
 * Parse a single SSE line into a stream event
 */
export function parseSSELine(line: string): StreamEvent | null {
  if (!line) return null;

  const colIdx = line.indexOf(":");
  if (colIdx === -1) return null;

  const lineType = line.slice(0, colIdx);
  const content = line.slice(colIdx + 1);

  // Only process "d" or "data" line types
  if (lineType !== "d" && lineType !== "data") {
    return null;
  }

  if (content.trim() === "[DONE]") {
    streamLog.debug("Stream DONE received");
    return { type: "done" };
  }

  try {
    const data = JSON.parse(content);
    // Handle wrapped format: { type: "data", data: {...} }
    const payload = data?.type === "data" ? data.data : data;
    return parsePayload(payload);
  } catch {
    streamLog.warn("Failed to parse SSE line", { content: content.slice(0, 100) });
    return null;
  }
}

/**
 * Parse payload into typed event
 */
function parsePayload(payload: Record<string, unknown> | null): StreamEvent | null {
  if (!payload) return null;

  // Type-based events
  if (payload.type === "text-delta") {
    return { type: "text-delta" };
  }

  if (payload.type === "plan-created") {
    return { type: "plan-created", plan: payload.plan };
  }

  if (payload.type === "persisted-attachments") {
    return { type: "persisted-attachments", attachments: payload.attachments as unknown[] };
  }

  if (payload.type === "tool-progress") {
    return {
      type: "tool-progress",
      progress: {
        toolName: payload.toolName as string,
        toolCallId: payload.toolCallId as string,
        status: payload.status as ToolProgress["status"],
        message: payload.message as string | undefined,
        data: payload.data,
      },
    };
  }

  if (payload.type === "document-index-ui") {
    return { type: "document-index-ui", uiComponent: payload.uiComponent };
  }

  if (payload.type === "level-started") {
    return { type: "level-started", level: payload.level as number };
  }

  if (payload.type === "step-started") {
    return { type: "step-started", stepId: payload.stepId as number };
  }

  if (payload.type === "subtask-started") {
    return {
      type: "subtask-started",
      parentId: payload.parentId as number,
      stepId: payload.stepId as number,
    };
  }

  if (payload.type === "subtask-done") {
    return {
      type: "subtask-done",
      parentId: payload.parentId as number,
      stepId: payload.stepId as number,
      result: payload.result,
    };
  }

  if (payload.type === "step-done") {
    return {
      type: "step-done",
      stepId: payload.stepId as number,
      result: payload.result,
    };
  }

  if (payload.type === "level-completed") {
    return { type: "level-completed", level: payload.level as number };
  }

  if (payload.type === "orchestration-done") {
    return { type: "orchestration-done", finalResult: payload.finalResult };
  }

  if (payload.type === "citations") {
    return { type: "citations", citations: payload.citations as unknown[] };
  }

  // Op-based events
  if (payload.op) {
    const { op, path, value } = payload;

    if (op === "message") {
      const content = (payload.content || value) as string;
      if (content) {
        return {
          type: "message",
          message: {
            role: (payload.role as ChatMessage["role"]) || "assistant",
            content,
          },
        };
      }
    }

    if (op === "question") {
      const question = value || payload.question;
      if (question) {
        return { type: "question", question: question as QuestionPayload };
      }
    }

    if (op === "suggestion") {
      const suggestions = value || payload.suggestions;
      if (Array.isArray(suggestions)) {
        return { type: "suggestion", suggestions: suggestions as SuggestionChip[] };
      }
    }

    if (op === "tool-progress") {
      return {
        type: "tool-progress",
        progress: {
          toolName: payload.toolName as string,
          toolCallId: payload.toolCallId as string,
          status: payload.status as ToolProgress["status"],
          message: payload.message as string | undefined,
          data: payload.data,
        },
      };
    }

    // Tree patch
    if (path) {
      return {
        type: "patch",
        patch: { op, path, value } as JsonPatch,
      };
    }
  }

  return { type: "unknown", payload };
}

/**
 * Create a line buffer for processing chunked SSE data
 */
export function createLineBuffer(): {
  add: (chunk: string) => string[];
  flush: () => string | null;
} {
  let buffer = "";

  return {
    add(chunk: string): string[] {
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      return lines;
    },
    flush(): string | null {
      const remaining = buffer;
      buffer = "";
      return remaining || null;
    },
  };
}
