/**
 * Store Types - Shared types for Zustand slices with immer middleware
 *
 * This is the official Zustand pattern for typing slices with middleware.
 * See: https://zustand.docs.pmnd.rs/guides/typescript#slices-pattern
 */
import type { StateCreator } from "zustand";

// Import all slice types
import type { DomainSlice } from "./slices/domain";
import type { UISlice } from "./slices/ui";
import type { SelectionSlice } from "./slices/selection";
import type { SettingsSlice } from "./slices/settings";
import type { AnalyticsSlice } from "./slices/analytics";
import type { ActionsSlice } from "./slices/actions";
import type { ValidationSlice } from "./slices/validation";
import type { ToolProgressSlice } from "./slices/tool-progress";
import type { PlanExecutionSlice } from "./slices/plan-execution";
import type { DeepResearchSlice } from "./slices/deep-research";

// =============================================================================
// Combined Store Type
// =============================================================================

/**
 * The complete store state combining all slices
 */
export type StoreState = DomainSlice &
  UISlice &
  SelectionSlice &
  SettingsSlice &
  AnalyticsSlice &
  ActionsSlice &
  ValidationSlice &
  ToolProgressSlice &
  PlanExecutionSlice &
  DeepResearchSlice;

// =============================================================================
// Slice Creator Type (with immer middleware)
// =============================================================================

/**
 * Type for slice creators that work with immer middleware.
 *
 * The type parameters tell TypeScript:
 * - T: The slice type being created
 * - StoreState: The full combined store type
 * - [["zustand/immer", never]]: The middleware chain includes immer
 * - []: No additional middleware after immer for this slice
 *
 * This allows each slice to:
 * 1. Use immer's draft syntax in set()
 * 2. Access the full store state in get()
 * 3. Export clean types without immer internals
 */
export type SliceCreator<T> = StateCreator<
  StoreState,
  [["zustand/immer", never]],
  [],
  T
>;

// =============================================================================
// Re-export slice types for convenience
// =============================================================================

export type {
  DomainSlice,
  UISlice,
  SelectionSlice,
  SettingsSlice,
  AnalyticsSlice,
  ActionsSlice,
  ValidationSlice,
  ToolProgressSlice,
  PlanExecutionSlice,
  DeepResearchSlice,
};
