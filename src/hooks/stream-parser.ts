/**
 * Stream Parser Module
 *
 * Pure functions for parsing SSE stream lines into typed operations.
 * Follows Single Responsibility Principle - only handles parsing, not state management.
 */

import type { JsonPatch } from "@onegenui/core";
import type { QuestionPayload, SuggestionChip } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type StreamMessage = {
  role: "assistant" | "user";
  content: string;
};

// Re-export imported types for module consumers
export type { QuestionPayload, SuggestionChip };

export type ParsedOperation =
  | { type: "message"; message: StreamMessage }
  | { type: "question"; question: QuestionPayload }
  | { type: "suggestion"; suggestions: SuggestionChip[] }
  | { type: "patch"; patch: JsonPatch }
  | { type: "text-delta"; text: string }
  | { type: "unknown"; raw: unknown };

// ─────────────────────────────────────────────────────────────────────────────
// Parsing Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse a single SSE line into a ParsedOperation
 */
export function parseSSELine(line: string): ParsedOperation | null {
  if (!line) return null;

  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return null;

  const lineType = line.slice(0, colonIdx);
  const content = line.slice(colonIdx + 1).trim();

  try {
    // AI SDK v6 Data Stream Protocol types
    if (lineType === "0") {
      // Text Part
      const text = JSON.parse(content);
      if (typeof text === "string") {
        return { type: "text-delta", text };
      }
    } else if (lineType === "d") {
      // Data Part
      const data = JSON.parse(content);
      return parseDataPayload(data);
    } else if (lineType === "data") {
      // Standard SSE format
      if (content === "[DONE]") return null;
      const json = JSON.parse(content);
      return parseDataPayload(json);
    }
  } catch {
    // Failed to parse, ignore
    return null;
  }

  return null;
}

/**
 * Parse a data payload (object or array format)
 */
function parseDataPayload(data: unknown): ParsedOperation {
  if (!data || typeof data !== "object") {
    return { type: "unknown", raw: data };
  }

  // Handle AI SDK wrapped format: { type: "data", data: {...} }
  if (
    "type" in data &&
    (data as { type: string }).type === "data" &&
    "data" in data
  ) {
    return parseDataPayload((data as { data: unknown }).data);
  }

  // Handle text-delta format from AI SDK
  if ("type" in data && (data as { type: string }).type === "text-delta") {
    const delta = (data as { delta?: string }).delta;
    if (delta) {
      return { type: "text-delta", text: delta };
    }
    return { type: "unknown", raw: data };
  }

  // Array format: [op, path, value]
  if (Array.isArray(data) && data.length > 0) {
    const [op, path, value] = data;
    return parseOperation(op, path, value, data);
  }

  // Object format: { op, path, value }
  if ("op" in data) {
    const { op, path, value } = data as {
      op: string;
      path?: string;
      value?: unknown;
    };
    return parseOperation(op, path, value, data);
  }

  return { type: "unknown", raw: data };
}

/**
 * Parse an operation by its op type
 */
function parseOperation(
  op: string,
  path: string | undefined | null,
  value: unknown,
  rawObject: unknown,
): ParsedOperation {
  switch (op) {
    case "message": {
      const raw = rawObject as Record<string, unknown>;
      const role = (raw.role as string) || "assistant";
      const content =
        (raw.content as string) || (typeof value === "string" ? value : "");
      if (content) {
        return {
          type: "message",
          message: { role: role as "assistant" | "user", content },
        };
      }
      return { type: "unknown", raw: rawObject };
    }

    case "question": {
      const raw = rawObject as Record<string, unknown>;
      // Handle both flat format (id, type... mixed with op) and nested format ({ op: 'question', question: {...} })
      const questionData = value || raw.question || raw;
      const question = questionData as QuestionPayload;

      if (question && question.id) {
        return { type: "question", question };
      }
      return { type: "unknown", raw: rawObject };
    }

    case "suggestion": {
      const raw = rawObject as Record<string, unknown>;
      const suggestions = (value || raw.suggestions) as SuggestionChip[];
      if (Array.isArray(suggestions)) {
        return { type: "suggestion", suggestions };
      }
      return { type: "unknown", raw: rawObject };
    }

    case "set":
    case "add":
    case "replace":
    case "remove": {
      if (path) {
        return {
          type: "patch",
          patch: { op: op as JsonPatch["op"], path, value },
        };
      }
      return { type: "unknown", raw: rawObject };
    }

    default:
      return { type: "unknown", raw: rawObject };
  }
}

/**
 * Parse a buffer of text into lines, returning parsed operations and remaining buffer
 */
export function parseStreamBuffer(buffer: string): {
  operations: ParsedOperation[];
  remainingBuffer: string;
} {
  const lines = buffer.split("\n");
  const remainingBuffer = lines.pop() ?? "";
  const operations: ParsedOperation[] = [];

  for (const line of lines) {
    const parsed = parseSSELine(line);
    if (parsed) {
      operations.push(parsed);
    }
  }

  return { operations, remainingBuffer };
}
