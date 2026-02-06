"use client";

/**
 * Stream Parser - SSE line parser for wire protocol v3.
 */

import { WireFrameSchema, type JsonPatch } from "@onegenui/core";
import type {
  ChatMessage,
  QuestionPayload,
  SuggestionChip,
  ToolProgress,
} from "../types";
import { streamLog } from "./logger";

export type StreamEvent =
  | { type: "text-delta" }
  | { type: "done" }
  | { type: "error"; error: { code: string; message: string; recoverable: boolean } }
  | { type: "streaming-started"; timestamp: number }
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

function parsePatch(patch: JsonPatch): StreamEvent | null {
  if (patch.op === "message") {
    const content = (patch as { content?: unknown }).content ?? patch.value;
    if (!content) return null;

    return {
      type: "message",
      message: {
        role:
          (patch as { role?: "user" | "assistant" | "system" }).role ??
          "assistant",
        content: String(content),
      },
    };
  }

  if (patch.op === "question") {
    const question =
      (patch as { question?: unknown }).question ??
      patch.value;
    return question ? { type: "question", question: question as QuestionPayload } : null;
  }

  if (patch.op === "suggestion") {
    const suggestions =
      (patch as { suggestions?: unknown }).suggestions ??
      patch.value;
    return Array.isArray(suggestions)
      ? { type: "suggestion", suggestions: suggestions as SuggestionChip[] }
      : null;
  }

  if (patch.path) {
    return { type: "patch", patch };
  }

  return null;
}

function parseControlEvent(control: {
  action: string;
  data?: unknown;
}): StreamEvent | null {
  const data = (control.data ?? {}) as Record<string, unknown>;

  switch (control.action) {
    case "start":
      return {
        type: "streaming-started",
        timestamp: Date.now(),
      };
    case "persisted-attachments":
      return {
        type: "persisted-attachments",
        attachments: (data.attachments as unknown[]) ?? [],
      };
    case "plan-created":
      return { type: "plan-created", plan: data.plan };
    case "step-started":
      return { type: "step-started", stepId: Number(data.stepId ?? 0) };
    case "step-done":
      return {
        type: "step-done",
        stepId: Number(data.stepId ?? 0),
        result: data.result,
      };
    case "subtask-started":
      return {
        type: "subtask-started",
        parentId: Number(data.parentId ?? 0),
        stepId: Number(data.stepId ?? 0),
      };
    case "subtask-done":
      return {
        type: "subtask-done",
        parentId: Number(data.parentId ?? 0),
        stepId: Number(data.stepId ?? 0),
        result: data.result,
      };
    case "level-started":
      return { type: "level-started", level: Number(data.level ?? 0) };
    case "level-completed":
      return { type: "level-completed", level: Number(data.level ?? 0) };
    case "orchestration-done":
      return { type: "orchestration-done", finalResult: data.finalResult };
    case "document-index-ui":
      return { type: "document-index-ui", uiComponent: data.uiComponent };
    case "citations":
      return { type: "citations", citations: (data.citations as unknown[]) ?? [] };
    default:
      return { type: "unknown", payload: { control } };
  }
}

export function parseSSELine(line: string): StreamEvent | null {
  if (!line) return null;

  const separatorIndex = line.indexOf(":");
  if (separatorIndex === -1) return null;

  const lineType = line.slice(0, separatorIndex);
  if (lineType !== "d" && lineType !== "data") {
    return null;
  }

  const content = line.slice(separatorIndex + 1).trim();
  if (!content) return null;

  try {
    const payload = JSON.parse(content) as unknown;
    const frame = WireFrameSchema.safeParse(payload);
    if (!frame.success) {
      streamLog.warn("Invalid wire frame", {
        issues: frame.error.issues.map((issue) => issue.message),
      });
      return null;
    }

    const event = frame.data.event;
    switch (event.kind) {
      case "control":
        return parseControlEvent(event);
      case "progress":
        return {
          type: "tool-progress",
          progress: {
            toolName: event.toolName ?? "system",
            toolCallId: event.toolCallId ?? `progress-${frame.data.sequence}`,
            status: event.status ?? "progress",
            message: event.message,
            data: event.data,
            progress: event.progress,
          },
        };
      case "message":
        return {
          type: "message",
          message: {
            role: event.role,
            content: event.content,
          },
        };
      case "patch":
        if (event.patch) {
          return parsePatch(event.patch);
        }
        if (event.patches && event.patches.length > 0) {
          return parsePatch(event.patches[0] as JsonPatch);
        }
        return null;
      case "error":
        return {
          type: "error",
          error: {
            code: event.code,
            message: event.message,
            recoverable: event.recoverable,
          },
        };
      case "done":
        return { type: "done" };
      default:
        return { type: "unknown", payload: event };
    }
  } catch {
    streamLog.warn("Failed to parse SSE line", {
      content: content.slice(0, 100),
    });
    return null;
  }
}

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
