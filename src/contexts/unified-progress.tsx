/**
 * Unified Progress Context - Combines plan execution with tool progress
 *
 * Provides a single "generating" state that integrates:
 * - Plan steps (multi-agent orchestration)
 * - Tool progress (individual tool execution)
 *
 * This replaces separate usePlanState and useToolProgress with unified tracking.
 */
"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";
import type { PlanStep, PlanSubtask } from "../store/slices/plan-execution";
import type { StoredProgressEvent } from "../store/slices/tool-progress";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type UnifiedProgressItemType = "plan-step" | "plan-subtask" | "tool";
export type UnifiedProgressStatus =
  | "pending"
  | "running"
  | "complete"
  | "error";

export interface UnifiedProgressItem {
  id: string;
  type: UnifiedProgressItemType;
  label: string;
  message?: string;
  status: UnifiedProgressStatus;
  progress?: number; // 0-100
  startTime?: number;
  endTime?: number;
  parentId?: string; // For subtasks
  children?: UnifiedProgressItem[]; // For plan steps with subtasks
}

export interface UnifiedProgressState {
  /** Whether any generation is in progress */
  isGenerating: boolean;
  /** Current goal/description of what's being generated */
  goal: string | null;
  /** All progress items (plan steps + tools) */
  items: UnifiedProgressItem[];
  /** Currently active items */
  activeItems: UnifiedProgressItem[];
  /** Overall progress percentage */
  overallProgress: number;
  /** Time elapsed since generation started (ms) */
  elapsedTime: number | null;
}

export interface UnifiedProgressContextValue extends UnifiedProgressState {
  /** Get item by ID */
  getItem: (id: string) => UnifiedProgressItem | undefined;
  /** Check if a specific item is running */
  isItemRunning: (id: string) => boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const UnifiedProgressContext =
  createContext<UnifiedProgressContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export interface UnifiedProgressProviderProps {
  children: ReactNode;
}

function mapPlanStepStatus(status: string): UnifiedProgressStatus {
  switch (status) {
    case "running":
      return "running";
    case "complete":
      return "complete";
    case "error":
      return "error";
    default:
      return "pending";
  }
}

function mapToolStatus(status: string): UnifiedProgressStatus {
  switch (status) {
    case "starting":
    case "progress":
      return "running";
    case "complete":
      return "complete";
    case "error":
      return "error";
    default:
      return "pending";
  }
}

function subtaskToUnified(
  subtask: PlanSubtask,
  parentId: string,
): UnifiedProgressItem {
  return {
    id: `subtask-${subtask.id}`,
    type: "plan-subtask",
    label: subtask.task,
    status: mapPlanStepStatus(subtask.status),
    startTime: subtask.startTime,
    endTime: subtask.endTime,
    parentId,
  };
}

function stepToUnified(step: PlanStep): UnifiedProgressItem {
  const id = `step-${step.id}`;
  return {
    id,
    type: "plan-step",
    label: step.task,
    status: mapPlanStepStatus(step.status),
    startTime: step.startTime,
    endTime: step.endTime,
    children: step.subtasks?.map((st) => subtaskToUnified(st, id)),
  };
}

function toolToUnified(tool: StoredProgressEvent): UnifiedProgressItem {
  return {
    id: `tool-${tool.toolCallId}`,
    type: "tool",
    label: tool.toolName,
    message: tool.message,
    status: mapToolStatus(tool.status),
    progress: tool.progress,
    startTime: tool.timestamp,
  };
}

export function UnifiedProgressProvider({
  children,
}: UnifiedProgressProviderProps) {
  // Get plan execution state
  const planExecution = useStore((s) => s.planExecution);

  // Get tool progress - use useShallow to prevent infinite loops
  const progressEvents = useStore(useShallow((s) => s.progressEvents));

  // Build unified items
  const items = useMemo(() => {
    const result: UnifiedProgressItem[] = [];

    // Add plan steps
    if (planExecution.plan) {
      for (const step of planExecution.plan.steps) {
        result.push(stepToUnified(step));
      }
    }

    // Add tool progress (only if not in plan-based orchestration)
    // During orchestration, tools are tracked via plan steps
    if (!planExecution.isOrchestrating) {
      for (const tool of progressEvents) {
        result.push(toolToUnified(tool));
      }
    }

    return result;
  }, [planExecution.plan, planExecution.isOrchestrating, progressEvents]);

  // Active items
  const activeItems = useMemo(
    () => items.filter((item) => item.status === "running"),
    [items],
  );

  // Is generating
  const isGenerating = useMemo(() => {
    if (planExecution.isOrchestrating) return true;
    return progressEvents.some(
      (p) => p.status === "starting" || p.status === "progress",
    );
  }, [planExecution.isOrchestrating, progressEvents]);

  // Goal
  const goal = planExecution.plan?.goal ?? null;

  // Overall progress
  const overallProgress = useMemo(() => {
    if (!planExecution.plan) {
      // No plan - use tool progress
      const activeTools = progressEvents.filter(
        (p) => p.status === "starting" || p.status === "progress",
      );
      if (activeTools.length === 0) return 0;
      const sum = activeTools.reduce((acc, t) => acc + (t.progress ?? 0), 0);
      return Math.round(sum / activeTools.length);
    }

    // Plan-based progress
    const steps = planExecution.plan.steps;
    const completed = steps.filter((s) => s.status === "complete").length;
    return steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0;
  }, [planExecution.plan, progressEvents]);

  // Elapsed time
  const elapsedTime = useMemo(() => {
    if (!planExecution.orchestrationStartTime) return null;
    if (!planExecution.isOrchestrating) return null;
    return Date.now() - planExecution.orchestrationStartTime;
  }, [planExecution.orchestrationStartTime, planExecution.isOrchestrating]);

  // Getters
  const getItem = useCallback(
    (id: string) => items.find((item) => item.id === id),
    [items],
  );

  const isItemRunning = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      return item?.status === "running";
    },
    [items],
  );

  const value = useMemo<UnifiedProgressContextValue>(
    () => ({
      isGenerating,
      goal,
      items,
      activeItems,
      overallProgress,
      elapsedTime,
      getItem,
      isItemRunning,
    }),
    [
      isGenerating,
      goal,
      items,
      activeItems,
      overallProgress,
      elapsedTime,
      getItem,
      isItemRunning,
    ],
  );

  return (
    <UnifiedProgressContext.Provider value={value}>
      {children}
    </UnifiedProgressContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useUnifiedProgress - Access the unified progress context
 */
export function useUnifiedProgress(): UnifiedProgressContextValue {
  const context = useContext(UnifiedProgressContext);
  if (!context) {
    throw new Error(
      "useUnifiedProgress must be used within a UnifiedProgressProvider",
    );
  }
  return context;
}

/**
 * useUnifiedProgressOptional - Access unified progress (optional)
 */
export function useUnifiedProgressOptional(): UnifiedProgressContextValue | null {
  return useContext(UnifiedProgressContext);
}

/**
 * useIsGenerating - Check if any generation is in progress
 */
export function useIsGenerating(): boolean {
  return useStore((s) => {
    if (s.planExecution.isOrchestrating) return true;
    return s.progressEvents.some(
      (p) => p.status === "starting" || p.status === "progress",
    );
  });
}

/**
 * useGeneratingGoal - Get the current generation goal
 */
export function useGeneratingGoal(): string | null {
  return useStore((s) => s.planExecution.plan?.goal ?? null);
}
