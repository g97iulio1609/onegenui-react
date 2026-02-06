/**
 * Stream utility functions - pure functions for parsing SSE streams
 * Extracted from useUIStream for testability and reusability
 */

import type { JsonPatch } from "@onegenui/core";
import type {
  ParsedLine,
  LineType,
  StreamPayload,
  PatchPayload,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// SSE Line Parsing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse an SSE line into type and content
 * @param line - Raw SSE line (e.g., "d:{...}" or "data:{...}")
 * @returns Parsed line or null if invalid
 */
export function parseSSELine(line: string): ParsedLine | null {
  if (!line) return null;

  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return null;

  const type = line.slice(0, colonIdx) as LineType;
  const content = line.slice(colonIdx + 1);

  // Validate known types (only "d" and "data" are supported)
  if (type !== "d" && type !== "data") {
    return null;
  }

  return { type, content };
}

/**
 * Parse the data part of an SSE line
 * Handles wrapped format: { type: "data", data: {...} }
 * @param content - JSON string content
 * @returns Parsed payload or null if invalid
 */
export function parseDataPart(
  content: string,
): StreamPayload | PatchPayload | null {
  if (content.trim() === "[DONE]") return null;

  try {
    const data = JSON.parse(content);

    // Handle wrapped format
    if (data?.type === "data" && data.data) {
      return data.data;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Check if a payload is a valid patch operation
 */
export function isPatchOperation(payload: unknown): payload is PatchPayload {
  if (!payload || typeof payload !== "object") return false;
  const p = payload as Record<string, unknown>;
  return typeof p.op === "string";
}

/**
 * Check if a payload is a tree mutation patch (has path)
 */
export function isTreePatch(payload: PatchPayload): boolean {
  return (
    !!payload.path &&
    (payload.op === "add" ||
      payload.op === "replace" ||
      payload.op === "remove" ||
      payload.op === "set")
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Buffer Line Processing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Process a buffer of text and extract complete lines
 * @param buffer - Current buffer text
 * @param chunk - New chunk to add
 * @returns Object with complete lines and remaining buffer
 */
export function processBufferChunk(
  buffer: string,
  chunk: string,
): {
  lines: string[];
  remaining: string;
} {
  const combined = buffer + chunk;
  const lines = combined.split("\n");
  const remaining = lines.pop() ?? "";

  return { lines, remaining };
}

// ─────────────────────────────────────────────────────────────────────────────
// Patch Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a patch payload to a JsonPatch
 */
export function payloadToPatch(payload: PatchPayload): JsonPatch | null {
  if (!payload.path) return null;

  return {
    op: payload.op as JsonPatch["op"],
    path: payload.path,
    value: payload.value,
  };
}

/**
 * Sort patches by path depth (parents before children)
 * This ensures parent elements exist before children reference them
 */
export function sortPatchesByDepth(patches: JsonPatch[]): JsonPatch[] {
  return [...patches].sort((a, b) => {
    const depthA = (a.path.match(/\//g) || []).length;
    const depthB = (b.path.match(/\//g) || []).length;
    return depthA - depthB;
  });
}

/**
 * Group patches by whether they're structural (add element) or updates (props)
 */
export function groupPatches(patches: JsonPatch[]): {
  structural: JsonPatch[];
  updates: JsonPatch[];
} {
  const structural: JsonPatch[] = [];
  const updates: JsonPatch[] = [];

  for (const patch of patches) {
    // Structural: adding new elements to /elements/xxx
    const isElementAdd =
      patch.op === "add" && patch.path.match(/^\/elements\/[^/]+$/) !== null;

    // Structural: setting root
    const isRootSet = patch.path === "/root";

    if (isElementAdd || isRootSet) {
      structural.push(patch);
    } else {
      updates.push(patch);
    }
  }

  return { structural, updates };
}

/**
 * Validate that a patch has required fields
 */
export function isValidPatch(patch: unknown): patch is JsonPatch {
  if (!patch || typeof patch !== "object") return false;

  const p = patch as Record<string, unknown>;

  if (typeof p.op !== "string") return false;
  if (typeof p.path !== "string") return false;
  if (!p.path.startsWith("/")) return false;

  const validOps = ["add", "replace", "remove", "set"];
  return validOps.includes(p.op);
}

// ─────────────────────────────────────────────────────────────────────────────
// Stream Line Classification
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Classify a stream payload by its intended handler
 */
export type PayloadClassification =
  | { kind: "ignore" }
  | { kind: "message"; content: string; role: "assistant" | "user" | "system" }
  | { kind: "question"; question: import("../types").QuestionPayload }
  | { kind: "suggestion"; suggestions: import("../types").SuggestionChip[] }
  | { kind: "tree-patch"; patch: JsonPatch }
  | { kind: "plan-created"; plan: import("../types").ExecutionPlan }
  | {
      kind: "persisted-attachments";
      attachments: import("../types").PersistedAttachment[];
    }
  | { kind: "tool-progress"; progress: import("../types").ToolProgress }
  | { kind: "document-index"; index: import("@onegenui/core").DocumentIndex }
  | { kind: "orchestration"; event: string; payload: unknown }
  | {
      kind: "citations";
      citations: Array<{
        id: string;
        title: string;
        pageNumber?: number | null;
        excerpt?: string | null;
        documentTitle?: string | null;
      }>;
    };

/**
 * Classify a parsed payload for routing to appropriate handler
 */
export function classifyPayload(
  payload: StreamPayload | PatchPayload | null,
): PayloadClassification {
  if (!payload) return { kind: "ignore" };

  // Type guards for discriminated union
  if ("type" in payload) {
    const typed = payload as StreamPayload;

    switch (typed.type) {
      case "plan-created":
        return { kind: "plan-created", plan: typed.plan };

      case "persisted-attachments":
        return {
          kind: "persisted-attachments",
          attachments: typed.attachments,
        };

      case "tool-progress":
        return {
          kind: "tool-progress",
          progress: {
            toolName: typed.toolName,
            toolCallId: typed.toolCallId,
            status: typed.status,
            message: typed.message,
            data: typed.data,
            progress: typed.progress,
          },
        };

      case "document-index-ui":
        if (typed.uiComponent?.props) {
          return { kind: "document-index", index: typed.uiComponent.props };
        }
        return { kind: "ignore" };

      case "citations":
        if (typed.citations && Array.isArray(typed.citations)) {
          return { kind: "citations", citations: typed.citations };
        }
        return { kind: "ignore" };

      case "level-started":
      case "step-started":
      case "subtask-started":
      case "step-done":
      case "subtask-done":
      case "orchestration-done":
        return { kind: "orchestration", event: typed.type, payload: typed };
    }
  }

  // Patch operations
  if (isPatchOperation(payload)) {
    const patchPayload = payload as PatchPayload;

    switch (patchPayload.op) {
      case "message": {
        const content = patchPayload.content || (patchPayload.value as string);
        if (content) {
          return {
            kind: "message",
            content,
            role: patchPayload.role || "assistant",
          };
        }
        return { kind: "ignore" };
      }

      case "question": {
        const question = patchPayload.value || patchPayload.question;
        if (question) {
          return {
            kind: "question",
            question: question as import("../types").QuestionPayload,
          };
        }
        return { kind: "ignore" };
      }

      case "suggestion": {
        const suggestions = patchPayload.value || patchPayload.suggestions;
        if (Array.isArray(suggestions)) {
          return { kind: "suggestion", suggestions };
        }
        return { kind: "ignore" };
      }

      default:
        if (isTreePatch(patchPayload)) {
          const patch = payloadToPatch(patchPayload);
          if (patch) {
            return { kind: "tree-patch", patch };
          }
        }
        return { kind: "ignore" };
    }
  }

  return { kind: "ignore" };
}
