"use client";

/**
 * Tool Progress Handler - Processes tool progress events from stream
 *
 * Handles real-time updates about tool execution:
 * - starting: Tool invocation began
 * - progress: Tool is executing
 * - complete: Tool finished successfully
 * - error: Tool failed
 */

import type { ToolProgress } from "../types";

export interface ToolProgressStoreActions {
  addProgressEvent: (event: {
    toolCallId: string;
    toolName: string;
    status: ToolProgress["status"];
    message?: string;
    data?: unknown;
  }) => void;
}

/**
 * Parse tool progress from stream payload
 */
export function parseToolProgress(
  payload: Record<string, unknown>,
): ToolProgress {
  return {
    toolName: payload.toolName as string,
    toolCallId: payload.toolCallId as string,
    status: payload.status as ToolProgress["status"],
    message: payload.message as string | undefined,
    data: payload.data,
  };
}

/**
 * Process tool progress event and update stores
 */
export function processToolProgress(
  payload: Record<string, unknown>,
  localProgressList: ToolProgress[],
  store: ToolProgressStoreActions,
  updateCallback?: () => void,
): void {
  const progress = parseToolProgress(payload);

  // Add to local list for conversation turn
  localProgressList.push(progress);

  // Trigger UI update
  updateCallback?.();

  // Update global store
  store.addProgressEvent({
    toolCallId: progress.toolCallId,
    toolName: progress.toolName,
    status: progress.status,
    message: progress.message,
    data: progress.data,
  });
}

/**
 * Check if payload is a tool progress event
 */
export function isToolProgressEvent(
  payload: Record<string, unknown>,
): boolean {
  return payload?.type === "tool-progress";
}
