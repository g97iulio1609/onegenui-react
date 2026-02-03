/**
 * ComponentStateSlice - Centralized component state management
 *
 * Each component can register its state here via useElementState hook.
 * This state is automatically:
 * 1. Stored in Zustand (reactive)
 * 2. Synced to UI tree (for AI context)
 * 3. Included in API requests
 *
 * @module store/slices/component-state
 */
import type { SliceCreator } from "../types";

export interface ComponentStateSlice {
  /** State for each element, indexed by elementKey */
  componentState: Record<string, Record<string, unknown>>;

  /** Set entire state for an element */
  setComponentState: (
    elementKey: string,
    state: Record<string, unknown>,
  ) => void;

  /** Update specific fields in element state (shallow merge) */
  updateComponentState: (
    elementKey: string,
    updates: Record<string, unknown>,
  ) => void;

  /** Deep merge updates into element state */
  mergeComponentState: (
    elementKey: string,
    updates: Record<string, unknown>,
  ) => void;

  /** Clear state for a specific element */
  clearComponentState: (elementKey: string) => void;

  /** Clear all component state (e.g., on chat clear) */
  clearAllComponentState: () => void;

  /** Get state for an element (returns empty object if not found) */
  getElementState: (elementKey: string) => Record<string, unknown>;
}

export const createComponentStateSlice: SliceCreator<ComponentStateSlice> = (
  set,
  get,
) => ({
  componentState: {},

  setComponentState: (elementKey, state) =>
    set((s) => {
      s.componentState[elementKey] = state;
    }),

  updateComponentState: (elementKey, updates) =>
    set((s) => {
      if (!s.componentState[elementKey]) {
        s.componentState[elementKey] = {};
      }
      Object.assign(s.componentState[elementKey], updates);
    }),

  mergeComponentState: (elementKey, updates) =>
    set((s) => {
      s.componentState[elementKey] = {
        ...(s.componentState[elementKey] ?? {}),
        ...updates,
      };
    }),

  clearComponentState: (elementKey) =>
    set((s) => {
      delete s.componentState[elementKey];
    }),

  clearAllComponentState: () => set({ componentState: {} }),

  getElementState: (elementKey) => get().componentState[elementKey] ?? {},
});
