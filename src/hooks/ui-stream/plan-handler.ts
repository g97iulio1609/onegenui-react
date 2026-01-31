"use client";

/**
 * Plan Execution Handler - Processes plan events from stream
 *
 * Handles multi-agent orchestration events:
 * - plan-created: Initial plan with steps
 * - step-started / step-done: Step lifecycle
 * - subtask-started / subtask-done: Subtask lifecycle
 * - level-started: Parallel execution levels
 * - orchestration-done: Plan completion
 */

export interface PlanStep {
  id: number;
  task: string;
  agent: string;
  dependencies: number[];
  parallel?: boolean;
  subtasks?: Array<{
    id: number;
    task: string;
    agent: string;
  }>;
}

export interface PlanPayload {
  goal: string;
  steps: Array<{
    id: number;
    task: string;
    agent: string;
    dependencies?: number[];
    parallel?: boolean;
    subtasks?: Array<{
      id: number;
      task: string;
      agent: string;
    }>;
  }>;
}

export interface PlanStoreActions {
  setPlanCreated: (goal: string, steps: PlanStep[]) => void;
  setStepStarted: (stepId: number) => void;
  setStepDone: (stepId: number, result?: string) => void;
  setSubtaskStarted: (stepId: number, subtaskId: number) => void;
  setSubtaskDone: (stepId: number, subtaskId: number, result?: string) => void;
  setLevelStarted: (level: number) => void;
  setOrchestrationDone: (finalResult?: string) => void;
}

/**
 * Handle plan-created event
 */
export function handlePlanCreated(
  payload: { plan: PlanPayload },
  store: PlanStoreActions,
): void {
  const { plan } = payload;
  store.setPlanCreated(
    plan.goal,
    plan.steps.map((s) => ({
      id: s.id,
      task: s.task,
      agent: s.agent,
      dependencies: s.dependencies ?? [],
      parallel: s.parallel,
      subtasks: s.subtasks?.map((st) => ({
        id: st.id,
        task: st.task,
        agent: st.agent,
      })),
    })),
  );
}

/**
 * Handle step-started event
 */
export function handleStepStarted(
  payload: { stepId: number },
  store: PlanStoreActions,
): void {
  store.setStepStarted(payload.stepId);
}

/**
 * Handle step-done event
 */
export function handleStepDone(
  payload: { stepId: number; result?: string },
  store: PlanStoreActions,
): void {
  store.setStepDone(payload.stepId, payload.result);
}

/**
 * Handle subtask-started event
 */
export function handleSubtaskStarted(
  payload: { parentId: number; stepId: number },
  store: PlanStoreActions,
): void {
  store.setSubtaskStarted(payload.parentId, payload.stepId);
}

/**
 * Handle subtask-done event
 */
export function handleSubtaskDone(
  payload: { parentId: number; stepId: number; result?: unknown },
  store: PlanStoreActions,
): void {
  store.setSubtaskDone(payload.parentId, payload.stepId, payload.result);
}

/**
 * Handle level-started event
 */
export function handleLevelStarted(
  payload: { level: number },
  store: PlanStoreActions,
): void {
  store.setLevelStarted(payload.level);
}

/**
 * Handle orchestration-done event
 */
export function handleOrchestrationDone(
  payload: { finalResult?: string },
  store: PlanStoreActions,
): void {
  store.setOrchestrationDone(payload.finalResult);
}

/**
 * Process plan event from stream payload
 */
export function processPlanEvent(
  payload: Record<string, unknown>,
  store: PlanStoreActions,
): boolean {
  const type = payload.type as string;

  switch (type) {
    case "plan-created":
      handlePlanCreated(payload as { plan: PlanPayload }, store);
      return true;

    case "step-started":
      handleStepStarted(payload as { stepId: number }, store);
      return true;

    case "step-done":
      handleStepDone(payload as { stepId: number; result?: string }, store);
      return true;

    case "subtask-started":
      handleSubtaskStarted(
        payload as { parentId: number; stepId: number },
        store,
      );
      return true;

    case "subtask-done":
      handleSubtaskDone(
        payload as { parentId: number; stepId: number; result?: unknown },
        store,
      );
      return true;

    case "level-started":
      handleLevelStarted(payload as { level: number }, store);
      return true;

    case "orchestration-done":
      handleOrchestrationDone(payload as { finalResult?: string }, store);
      return true;

    default:
      return false;
  }
}
