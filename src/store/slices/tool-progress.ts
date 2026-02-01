/**
 * Tool Progress Slice - Tool execution progress tracking
 *
 * Manages:
 * - Active tool progress
 * - Tool execution history
 * - Auto-cleanup of completed tools
 */
import type { ToolProgressStatus, ToolProgressEvent } from "@onegenui/core";
import type { SliceCreator } from "../types";

// Re-export types from core for convenience
export type { ToolProgressStatus, ToolProgressEvent } from "@onegenui/core";

/**
 * Slice-specific progress event (with required timestamp and message history)
 */
export interface StoredProgressEvent extends ToolProgressEvent {
  timestamp: number;
  /** History of unique messages for this tool execution */
  messageHistory?: Array<{ message: string; timestamp: number }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Slice Interface
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolProgressSlice {
  // ─────────────────────────────────────────────────────────────────────────
  // Progress events (stored with required timestamp)
  // ─────────────────────────────────────────────────────────────────────────
  progressEvents: StoredProgressEvent[];
  maxEvents: number;

  // Add/update progress (timestamp added automatically)
  addProgress: (event: Omit<ToolProgressEvent, "timestamp" | "type">) => void;
  addProgressEvent: (
    event: Omit<ToolProgressEvent, "timestamp" | "type">,
  ) => void;
  updateProgress: (
    toolCallId: string,
    updates: Partial<
      Omit<ToolProgressEvent, "toolCallId" | "timestamp" | "type">
    >,
  ) => void;
  updateProgressEvent: (
    toolCallId: string,
    updates: Partial<
      Omit<ToolProgressEvent, "toolCallId" | "timestamp" | "type">
    >,
  ) => void;

  // Clear operations
  clearProgress: () => void;
  clearProgressEvents: () => void;
  clearCompletedOlderThan: (ms: number) => void;
  clearCompletedProgressOlderThan: (ms: number) => void;
  removeProgress: (toolCallId: string) => void;

  // ─────────────────────────────────────────────────────────────────────────
  // Getters
  // ─────────────────────────────────────────────────────────────────────────
  getProgress: (toolCallId: string) => StoredProgressEvent | undefined;
  getActiveProgress: () => StoredProgressEvent[];
  getAllProgress: () => StoredProgressEvent[];
  isToolRunning: () => boolean;
  isSpecificToolRunning: (toolName: string) => boolean;
  getProgressByToolName: (toolName: string) => StoredProgressEvent[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Slice Implementation
// ─────────────────────────────────────────────────────────────────────────────

export const createToolProgressSlice: SliceCreator<ToolProgressSlice> = (
  set,
  get,
) => {
  // Shared implementation for add
  const addProgressImpl = (
    event: Omit<ToolProgressEvent, "timestamp" | "type">,
  ) =>
    set((state) => {
      const timestamp = Date.now();
      const existingIndex = state.progressEvents.findIndex(
        (p) => p.toolCallId === event.toolCallId,
      );

      if (existingIndex >= 0) {
        // Update existing: preserve message history
        const existing = state.progressEvents[existingIndex];
        const messageHistory = existing?.messageHistory ?? [];
        
        // Add new message to history if unique
        if (event.message && !messageHistory.some(h => h.message === event.message)) {
          messageHistory.push({ message: event.message, timestamp });
        }

        const storedEvent: StoredProgressEvent = {
          type: "tool-progress",
          ...event,
          timestamp,
          messageHistory,
        };
        state.progressEvents[existingIndex] = storedEvent;
      } else {
        // New event: initialize message history
        const messageHistory = event.message 
          ? [{ message: event.message, timestamp }]
          : [];
        
        const storedEvent: StoredProgressEvent = {
          type: "tool-progress",
          ...event,
          timestamp,
          messageHistory,
        };
        state.progressEvents.push(storedEvent);
        if (state.progressEvents.length > state.maxEvents) {
          state.progressEvents = state.progressEvents.slice(-state.maxEvents);
        }
      }
    });

  // Shared implementation for update
  const updateProgressImpl = (
    toolCallId: string,
    updates: Partial<
      Omit<ToolProgressEvent, "toolCallId" | "timestamp" | "type">
    >,
  ) =>
    set((state) => {
      const idx = state.progressEvents.findIndex(
        (p) => p.toolCallId === toolCallId,
      );
      if (idx >= 0) {
        const existing = state.progressEvents[idx];
        if (existing) {
          Object.assign(existing, updates, { timestamp: Date.now() });
        }
      }
    });

  // Shared implementation for clear
  const clearProgressImpl = () => set({ progressEvents: [] });

  // Shared implementation for clear old
  const clearCompletedOlderThanImpl = (ms: number) => {
    const cutoff = Date.now() - ms;
    set((state) => {
      state.progressEvents = state.progressEvents.filter(
        (p) =>
          (p.status !== "complete" && p.status !== "error") ||
          p.timestamp > cutoff,
      );
    });
  };

  return {
    progressEvents: [],
    maxEvents: 50,

    addProgress: addProgressImpl,
    addProgressEvent: addProgressImpl,

    updateProgress: updateProgressImpl,
    updateProgressEvent: updateProgressImpl,

    clearProgress: clearProgressImpl,
    clearProgressEvents: clearProgressImpl,

    clearCompletedOlderThan: clearCompletedOlderThanImpl,
    clearCompletedProgressOlderThan: clearCompletedOlderThanImpl,

    removeProgress: (toolCallId) =>
      set((state) => {
        state.progressEvents = state.progressEvents.filter(
          (p) => p.toolCallId !== toolCallId,
        );
      }),

    getProgress: (toolCallId) => {
      return get().progressEvents.find((p) => p.toolCallId === toolCallId);
    },

    getActiveProgress: () => {
      return get().progressEvents.filter(
        (p) => p.status === "starting" || p.status === "progress",
      );
    },

    getAllProgress: () => {
      return get().progressEvents;
    },

    isToolRunning: () => {
      return get().progressEvents.some(
        (p) => p.status === "starting" || p.status === "progress",
      );
    },

    isSpecificToolRunning: (toolName) => {
      return get().progressEvents.some(
        (p) =>
          p.toolName === toolName &&
          (p.status === "starting" || p.status === "progress"),
      );
    },

    getProgressByToolName: (toolName) => {
      return get().progressEvents.filter((p) => p.toolName === toolName);
    },
  };
};
