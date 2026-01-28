"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";

// Re-export types from store slices (which come from @onegenui/core)
export type {
  ToolProgressStatus,
  ToolProgressEvent,
  StoredProgressEvent,
} from "../store/slices/tool-progress";

// Use the stored event type for internal state
import type { StoredProgressEvent } from "../store/slices/tool-progress";

/**
 * Tool progress context value
 */
export interface ToolProgressContextValue {
  /** All active tool progress events (not yet complete) */
  activeProgress: StoredProgressEvent[];
  /** All tool progress events (including complete) */
  allProgress: StoredProgressEvent[];
  /** Whether any tool is currently running */
  isToolRunning: boolean;
  /** Add a new tool progress event */
  addProgress: (event: Omit<StoredProgressEvent, "timestamp" | "type">) => void;
  /** Update an existing tool progress event */
  updateProgress: (
    toolCallId: string,
    updates: Partial<
      Omit<StoredProgressEvent, "toolCallId" | "timestamp" | "type">
    >,
  ) => void;
  /** Clear all progress */
  clearProgress: () => void;
  /** Clear completed progress older than X ms */
  clearCompletedOlderThan: (ms: number) => void;
}

/**
 * Tool progress provider props
 */
export interface ToolProgressProviderProps {
  children: ReactNode;
  /** Auto-clear completed progress after X ms (default: 3000) */
  autoClearCompleteMs?: number;
  /** Maximum number of progress events to keep (default: 50) */
  maxEvents?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const ToolProgressContext = createContext<ToolProgressContextValue | null>(
  null,
);

// ─────────────────────────────────────────────────────────────────────────────
// Provider - Now uses Zustand for state
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ToolProgressProvider - Global provider for tool execution progress
 *
 * Wrap your app with this provider to enable automatic tool progress tracking.
 * The progress state is managed centrally via Zustand and can be consumed anywhere.
 */
export function ToolProgressProvider({
  children,
  autoClearCompleteMs = 3000,
  maxEvents: _maxEvents = 50,
}: ToolProgressProviderProps) {
  // Bridge to Zustand store
  const progressEvents = useStore((s) => s.progressEvents);
  const addProgressEvent = useStore((s) => s.addProgressEvent);
  const updateProgressEvent = useStore((s) => s.updateProgressEvent);
  const clearProgressEvents = useStore((s) => s.clearProgressEvents);
  const clearCompletedProgressOlderThan = useStore(
    (s) => s.clearCompletedProgressOlderThan,
  );
  const getActiveProgress = useStore((s) => s.getActiveProgress);
  const isToolRunning = useStore((s) => s.isToolRunning);

  // Add a new progress event (wrapper for Zustand)
  const addProgress = useCallback(
    (event: Omit<StoredProgressEvent, "timestamp" | "type">) => {
      addProgressEvent({
        toolCallId: event.toolCallId,
        toolName: event.toolName,
        status: event.status,
        message: event.message,
        data: event.data,
        progress: event.progress,
      });
    },
    [addProgressEvent],
  );

  // Update an existing progress event (wrapper for Zustand)
  const updateProgress = useCallback(
    (
      toolCallId: string,
      updates: Partial<
        Omit<StoredProgressEvent, "toolCallId" | "timestamp" | "type">
      >,
    ) => {
      updateProgressEvent(toolCallId, updates);
    },
    [updateProgressEvent],
  );

  // Clear all progress (wrapper for Zustand)
  const clearProgress = useCallback(() => {
    clearProgressEvents();
  }, [clearProgressEvents]);

  // Clear completed progress older than X ms (wrapper for Zustand)
  const clearCompletedOlderThan = useCallback(
    (ms: number) => {
      clearCompletedProgressOlderThan(ms);
    },
    [clearCompletedProgressOlderThan],
  );

  // Auto-clear completed progress
  useEffect(() => {
    if (autoClearCompleteMs <= 0) return;

    const interval = setInterval(() => {
      clearCompletedOlderThan(autoClearCompleteMs);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoClearCompleteMs, clearCompletedOlderThan]);

  // Computed values from Zustand
  const activeProgress = getActiveProgress();
  const toolRunning = isToolRunning();

  const value = useMemo<ToolProgressContextValue>(
    () => ({
      activeProgress,
      allProgress: progressEvents,
      isToolRunning: toolRunning,
      addProgress,
      updateProgress,
      clearProgress,
      clearCompletedOlderThan,
    }),
    [
      activeProgress,
      progressEvents,
      toolRunning,
      addProgress,
      updateProgress,
      clearProgress,
      clearCompletedOlderThan,
    ],
  );

  return (
    <ToolProgressContext.Provider value={value}>
      {children}
    </ToolProgressContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useToolProgress - Access the tool progress context
 *
 * @throws Error if used outside of ToolProgressProvider
 */
export function useToolProgress(): ToolProgressContextValue {
  const context = useContext(ToolProgressContext);
  if (!context) {
    throw new Error(
      "useToolProgress must be used within a ToolProgressProvider",
    );
  }
  return context;
}

/**
 * useToolProgressOptional - Access the tool progress context (optional)
 *
 * Returns null if used outside of ToolProgressProvider (doesn't throw)
 */
export function useToolProgressOptional(): ToolProgressContextValue | null {
  return useContext(ToolProgressContext);
}

/**
 * useIsToolRunning - Check if any tool is currently running
 */
export function useIsToolRunning(): boolean {
  // Select progressEvents directly and compute in selector for stability
  return useStore((s) =>
    s.progressEvents.some(
      (p) => p.status === "starting" || p.status === "progress",
    ),
  );
}

/**
 * useActiveToolProgress - Get only active (running) tool progress
 */
export function useActiveToolProgress(): StoredProgressEvent[] {
  // Use useShallow to prevent infinite loop - getActiveProgress returns new array each time
  return useStore(
    useShallow((s) =>
      s.progressEvents.filter(
        (e) => e.status === "starting" || e.status === "progress",
      ),
    ),
  );
}
