/**
 * Plan Execution Slice - Unified plan and progress tracking
 *
 * Integrates planning with tool progress for native "generating" state.
 * Replaces separate usePlanState hook with Zustand-based centralized state.
 */
import type { SliceCreator } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type PlanStepStatus = "pending" | "running" | "complete" | "error";

export interface PlanSubtask {
  id: number;
  task: string;
  agent: string;
  status: PlanStepStatus;
  startTime?: number;
  endTime?: number;
}

export interface PlanStep {
  id: number;
  task: string;
  agent: string;
  status: PlanStepStatus;
  dependencies: number[];
  parallel?: boolean;
  subtasks?: PlanSubtask[];
  startTime?: number;
  endTime?: number;
  result?: unknown;
}

export interface ExecutionPlan {
  goal: string;
  steps: PlanStep[];
}

export interface PlanExecutionState {
  /** Current execution plan */
  plan: ExecutionPlan | null;
  /** Whether orchestration is active */
  isOrchestrating: boolean;
  /** Current parallel execution level */
  parallelLevel: number | null;
  /** Timestamp when orchestration started */
  orchestrationStartTime: number | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Slice Interface
// ─────────────────────────────────────────────────────────────────────────────

export interface PlanExecutionSlice {
  // State
  planExecution: PlanExecutionState;

  // Actions
  setPlanCreated: (
    goal: string,
    steps: Array<{
      id: number;
      task: string;
      agent: string;
      dependencies?: number[];
      parallel?: boolean;
      subtasks?: Array<{ id: number; task: string; agent: string }>;
    }>,
  ) => void;
  setStepStarted: (stepId: number) => void;
  setStepDone: (stepId: number, result?: unknown) => void;
  setStepError: (stepId: number, error: string) => void;
  setSubtaskStarted: (parentId: number, subtaskId: number) => void;
  setSubtaskDone: (
    parentId: number,
    subtaskId: number,
    result?: unknown,
  ) => void;
  setLevelStarted: (level: number) => void;
  setOrchestrationDone: () => void;
  resetPlanExecution: () => void;

  // Getters
  getActiveStep: () => PlanStep | null;
  getActiveSubtask: () => PlanSubtask | null;
  getCompletedStepIds: () => number[];
  getPlanProgress: () => {
    completed: number;
    total: number;
    percentage: number;
  };
  isPlanRunning: () => boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────────────────────────────────────

const initialPlanState: PlanExecutionState = {
  plan: null,
  isOrchestrating: false,
  parallelLevel: null,
  orchestrationStartTime: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Slice Implementation
// ─────────────────────────────────────────────────────────────────────────────

export const createPlanExecutionSlice: SliceCreator<PlanExecutionSlice> = (
  set,
  get,
) => ({
  planExecution: initialPlanState,

  setPlanCreated: (goal, steps) => {
    set((state) => {
      state.planExecution = {
        plan: {
          goal,
          steps: steps.map((s) => ({
            id: s.id,
            task: s.task,
            agent: s.agent,
            dependencies: s.dependencies ?? [],
            parallel: s.parallel,
            status: "pending" as PlanStepStatus,
            subtasks: s.subtasks?.map((st) => ({
              id: st.id,
              task: st.task,
              agent: st.agent,
              status: "pending" as PlanStepStatus,
            })),
          })),
        },
        isOrchestrating: true,
        parallelLevel: null,
        orchestrationStartTime: Date.now(),
      };
    });
  },

  setStepStarted: (stepId) => {
    set((state) => {
      const step = state.planExecution.plan?.steps.find((s) => s.id === stepId);
      if (step) {
        step.status = "running";
        step.startTime = Date.now();
      }
    });
  },

  setStepDone: (stepId, result) => {
    set((state) => {
      const step = state.planExecution.plan?.steps.find((s) => s.id === stepId);
      if (step) {
        step.status = "complete";
        step.endTime = Date.now();
        step.result = result;
      }
    });
  },

  setStepError: (stepId, error) => {
    set((state) => {
      const step = state.planExecution.plan?.steps.find((s) => s.id === stepId);
      if (step) {
        step.status = "error";
        step.endTime = Date.now();
        step.result = { error };
      }
    });
  },

  setSubtaskStarted: (parentId, subtaskId) => {
    set((state) => {
      const step = state.planExecution.plan?.steps.find(
        (s) => s.id === parentId,
      );
      const subtask = step?.subtasks?.find((st) => st.id === subtaskId);
      if (subtask) {
        subtask.status = "running";
        subtask.startTime = Date.now();
      }
    });
  },

  setSubtaskDone: (parentId, subtaskId, result) => {
    set((state) => {
      const step = state.planExecution.plan?.steps.find(
        (s) => s.id === parentId,
      );
      const subtask = step?.subtasks?.find((st) => st.id === subtaskId);
      if (subtask) {
        subtask.status = "complete";
        subtask.endTime = Date.now();
      }
    });
  },

  setLevelStarted: (level) => {
    set((state) => {
      state.planExecution.parallelLevel = level;
    });
  },

  setOrchestrationDone: () => {
    set((state) => {
      state.planExecution.isOrchestrating = false;
      state.planExecution.parallelLevel = null;
    });
  },

  resetPlanExecution: () => {
    set((state) => {
      state.planExecution = initialPlanState;
    });
  },

  // Getters
  getActiveStep: () => {
    const plan = get().planExecution.plan;
    return plan?.steps.find((s) => s.status === "running") ?? null;
  },

  getActiveSubtask: () => {
    const plan = get().planExecution.plan;
    for (const step of plan?.steps ?? []) {
      const activeSubtask = step.subtasks?.find(
        (st) => st.status === "running",
      );
      if (activeSubtask) return activeSubtask;
    }
    return null;
  },

  getCompletedStepIds: () => {
    const plan = get().planExecution.plan;
    return (
      plan?.steps.filter((s) => s.status === "complete").map((s) => s.id) ?? []
    );
  },

  getPlanProgress: () => {
    const plan = get().planExecution.plan;
    if (!plan) return { completed: 0, total: 0, percentage: 0 };
    const completed = plan.steps.filter((s) => s.status === "complete").length;
    const total = plan.steps.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  },

  isPlanRunning: () => {
    return get().planExecution.isOrchestrating;
  },
});
