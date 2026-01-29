/**
 * Slices barrel export
 */
export { createDomainSlice, type DomainSlice } from "./domain";
export {
  createUISlice,
  type UISlice,
  type ConfirmationDialog,
  type ToolProgress,
} from "./ui";
export {
  createSelectionSlice,
  type SelectionSlice,
  type DeepSelectionInfo,
  type DeepSelectionInput,
} from "./selection";
export {
  createSettingsSlice,
  type SettingsSlice,
  type ThemeMode,
  type AIModel,
  type AISettings,
} from "./settings";
export {
  createAnalyticsSlice,
  type AnalyticsSlice,
  type TrackedAction,
} from "./analytics";
export {
  createActionsSlice,
  type ActionsSlice,
  type PendingConfirmation,
  type ActionExecution,
} from "./actions";
export {
  createValidationSlice,
  type ValidationSlice,
  type FieldValidationResult,
  type FieldState,
  type FormValidationState,
} from "./validation";
export {
  createToolProgressSlice,
  type ToolProgressSlice,
  type ToolProgressStatus,
  type ToolProgressEvent,
} from "./tool-progress";
export {
  createPlanExecutionSlice,
  type PlanExecutionSlice,
  type PlanExecutionState,
  type PlanStep,
  type PlanSubtask,
  type PlanStepStatus,
  type ExecutionPlan,
} from "./plan-execution";
export {
  createDeepResearchSlice,
  type DeepResearchSlice,
  type DeepResearchEffortLevel,
  type DeepResearchSettings,
  type AuthenticatedSource,
  type ResearchPhase,
  type ResearchSource,
  type ActiveResearch,
  type ResearchResultSummary,
} from "./deep-research";
export { createUITreeSlice, type UITreeSlice } from "./ui-tree";
export {
  createWorkspaceSlice,
  type WorkspaceSlice,
  type WorkspaceDocument,
  type PendingAIEdit,
  type WorkspaceLayout,
} from "./workspace";
