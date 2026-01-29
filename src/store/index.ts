/**
 * Root Store - Combined Zustand store with all slices
 *
 * Uses the official Zustand slice pattern with immer middleware.
 * See: https://zustand.docs.pmnd.rs/guides/typescript#slices-pattern
 */
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";
import { useShallow } from "zustand/react/shallow";
import type { StoreApi, UseBoundStore } from "zustand";

// Enable Immer MapSet plugin for Set/Map support in store
enableMapSet();

import {
  createDomainSlice,
  createUISlice,
  createSelectionSlice,
  createSettingsSlice,
  createAnalyticsSlice,
  createActionsSlice,
  createValidationSlice,
  createToolProgressSlice,
  createPlanExecutionSlice,
  createDeepResearchSlice,
  createUITreeSlice,
} from "./slices";

import type { StoreState } from "./types";
export type { StoreState } from "./types";
export type { UITreeSlice } from "./slices/ui-tree";
export type { DeepSelectionInfo, DeepSelectionInput } from "./slices/selection";
export type {
  PlanExecutionState,
  PlanStep,
  PlanSubtask,
  PlanStepStatus,
  ExecutionPlan,
} from "./slices/plan-execution";
export type {
  DeepResearchSlice,
  DeepResearchEffortLevel,
  DeepResearchSettings,
  AuthenticatedSource,
  ResearchPhase,
  ResearchSource,
  ActiveResearch,
  ResearchResultSummary,
} from "./slices/deep-research";

// =============================================================================
// Store Type (exported for external use)
// =============================================================================

/**
 * Public store hook type - hides internal immer types
 */
export type OneGenUIStore = UseBoundStore<StoreApi<StoreState>>;

// =============================================================================
// Store Creation
// =============================================================================

/**
 * Main store hook. Use this to access the store state and actions.
 *
 * @example
 * ```tsx
 * const theme = useStore((s) => s.theme);
 * const setTheme = useStore((s) => s.setTheme);
 * ```
 */
export const useStore: OneGenUIStore = create<StoreState>()(
  devtools(
    subscribeWithSelector(
      immer((...args) => ({
        ...createDomainSlice(...args),
        ...createUISlice(...args),
        ...createSelectionSlice(...args),
        ...createSettingsSlice(...args),
        ...createAnalyticsSlice(...args),
        ...createActionsSlice(...args),
        ...createValidationSlice(...args),
        ...createToolProgressSlice(...args),
        ...createPlanExecutionSlice(...args),
        ...createDeepResearchSlice(...args),
        ...createUITreeSlice(...args),
      })),
    ),
    {
      name: "onegenui-store",
      enabled: process.env.NODE_ENV !== "production",
    },
  ),
) as OneGenUIStore;

/**
 * Alias for useStore - alternative name
 */
export const useUIStore: OneGenUIStore = useStore;

// =============================================================================
// Selector Hooks (for optimized re-renders)
// =============================================================================

// Domain selectors
export const useDataModel = () => useStore((s) => s.dataModel);
export const useAuth = () => useStore((s) => s.auth);
export const useIsLoading = () => useStore((s) => s.isLoading);

// UI selectors
export const useConfirmations = () => useStore((s) => s.confirmations);
export const useToolProgress = () => useStore((s) => s.toolProgress);
export const useGlobalLoading = () => useStore((s) => s.globalLoading);
export const useSidebarOpen = () => useStore((s) => s.sidebarOpen);

// Selection selectors - Component level
export const useSelectedKey = () => useStore((s) => s.selectedKey);
export const useSelectedElement = () => useStore((s) => s.selectedElement);
export const useMultiSelectedKeys = () => useStore((s) => s.multiSelectedKeys);
export const useHoveredKey = () => useStore((s) => s.hoveredKey);

// Selection selectors - Deep selection
export const useDeepSelections = () => useStore((s) => s.deepSelections);
export const useDeepSelectionActive = () =>
  useStore((s) => s.deepSelectionActive);
// Use useShallow for derived objects that are computed on every call
export const useGranularSelection = () =>
  useStore(
    useShallow((s) => {
      const result: Record<string, Set<string>> = {};
      for (const sel of s.deepSelections) {
        if (sel.itemId) {
          if (!result[sel.elementKey]) {
            result[sel.elementKey] = new Set();
          }
          result[sel.elementKey]!.add(sel.itemId);
        }
      }
      return result;
    }),
  );

// Settings selectors
export const useTheme = () => useStore((s) => s.theme);
export const useAISettings = () => useStore((s) => s.aiSettings);
export const useCompactMode = () => useStore((s) => s.compactMode);

// Analytics selectors - use useShallow for array slicing
export const useRecentActions = (count = 10) =>
  useStore(useShallow((s) => s.actions.slice(0, count)));

// Actions selectors
export const useLoadingActions = () => useStore((s) => s.loadingActions);
export const usePendingConfirmations = () =>
  useStore((s) => s.pendingConfirmations);
export const useActionHistory = () => useStore((s) => s.actionHistory);

// Validation selectors
export const useFieldStates = () => useStore((s) => s.fieldStates);
export const useIsValidating = () => useStore((s) => s.isValidating);
// Use useShallow for derived form state
export const useFormState = () =>
  useStore(
    useShallow((s) => {
      const states = Object.values(s.fieldStates);
      let touchedCount = 0;
      let errorCount = 0;
      let isValid = true;
      let isDirty = false;

      for (const state of states) {
        if (state.touched) {
          touchedCount++;
          isDirty = true;
        }
        if (state.validationResult && !state.validationResult.isValid) {
          isValid = false;
          errorCount += state.validationResult.errors.length;
        }
      }

      return {
        isValid,
        isDirty,
        isValidating: s.isValidating,
        touchedCount,
        errorCount,
      };
    }),
  );

// Tool Progress selectors
export const useProgressEvents = () => useStore((s) => s.progressEvents);
// Use useShallow for filtered arrays
export const useActiveToolProgress = () =>
  useStore(
    useShallow((s) =>
      s.progressEvents.filter(
        (e) => e.status === "starting" || e.status === "progress",
      ),
    ),
  );
// Boolean primitives are stable, no useShallow needed
export const useIsAnyToolRunning = () =>
  useStore((s) =>
    s.progressEvents.some(
      (p) => p.status === "starting" || p.status === "progress",
    ),
  );

// Plan Execution selectors
export const selectPlanExecution = (s: StoreState) => s.planExecution;
export const usePlanExecution = () => useStore(selectPlanExecution);
export const useIsPlanRunning = () =>
  useStore((s) => s.planExecution.isOrchestrating);
export const usePlanProgress = () =>
  useStore(
    useShallow((s) => {
      const plan = s.planExecution.plan;
      if (!plan) return { completed: 0, total: 0, percentage: 0 };
      const completed = plan.steps.filter(
        (st) => st.status === "complete",
      ).length;
      const total = plan.steps.length;
      return {
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    }),
  );
export const useActiveStep = () =>
  useStore(
    (s) =>
      s.planExecution.plan?.steps.find((st) => st.status === "running") ?? null,
  );

// Deep Research selectors
export const useDeepResearchSettings = () =>
  useStore((s) => s.deepResearchSettings);
export const useDeepResearchEnabled = () =>
  useStore((s) => s.deepResearchSettings.enabled);
export const useDeepResearchEffortLevel = () =>
  useStore((s) => s.deepResearchSettings.effortLevel);
export const useActiveResearch = () => useStore((s) => s.activeResearch);
export const useAuthenticatedSources = () =>
  useStore((s) => s.authenticatedSources);
export const useResearchHistory = () => useStore((s) => s.researchHistory);
export const useIsResearchActive = () =>
  useStore(
    (s) =>
      s.activeResearch !== null &&
      s.activeResearch.status !== "complete" &&
      s.activeResearch.status !== "error" &&
      s.activeResearch.status !== "stopped",
  );
export const useResearchProgress = () =>
  useStore(
    useShallow((s) => {
      const research = s.activeResearch;
      if (!research)
        return { progress: 0, phase: "", sourcesFound: 0, sourcesTarget: 0 };
      return {
        progress: research.progress,
        phase: research.currentPhase,
        sourcesFound: research.sources.length,
        sourcesTarget: research.sourcesTarget,
      };
    }),
  );

// UI Tree selectors
export const useUITree = () => useStore((s) => s.uiTree);
export const useTreeVersion = () => useStore((s) => s.treeVersion);
export const useIsTreeStreaming = () => useStore((s) => s.isTreeStreaming);
export const useUITreeActions = () =>
  useStore(
    useShallow((s) => ({
      setUITree: s.setUITree,
      updateUITree: s.updateUITree,
      setElement: s.setElement,
      removeElement: s.removeElement,
      applyTreePatch: s.applyTreePatch,
      setTreeStreaming: s.setTreeStreaming,
      clearUITree: s.clearUITree,
      bumpTreeVersion: s.bumpTreeVersion,
    })),
  );

// =============================================================================
// Re-export slice creators for direct use
// =============================================================================

export {
  createDomainSlice,
  createUISlice,
  createSelectionSlice,
  createSettingsSlice,
  createAnalyticsSlice,
  createActionsSlice,
  createValidationSlice,
  createToolProgressSlice,
  createPlanExecutionSlice,
  createDeepResearchSlice,
  createUITreeSlice,
} from "./slices";
