/**
 * ComponentStateSlice — User-override layer for domain components.
 *
 * Stores ONLY fields that were explicitly modified by the user
 * (via `useElementState.updateState`). Tree-sourced data is NOT
 * duplicated here — it lives in the UITree slice.
 *
 * At request time both the tree and this slice are sent to the AI,
 * giving it the complete picture without redundancy.
 *
 * @module store/slices/component-state
 */
import type { SliceCreator } from "../types";

export interface ComponentStateSlice {
  /** Per-element user overrides, indexed by elementKey */
  componentState: Record<string, Record<string, unknown>>;

  /** Shallow-merge updates into an element's overrides */
  updateComponentState: (
    elementKey: string,
    updates: Record<string, unknown>,
  ) => void;

  /** Remove all overrides for a specific element */
  clearComponentState: (elementKey: string) => void;

  /** Remove all overrides (e.g. on chat clear) */
  clearAllComponentState: () => void;
}

export const createComponentStateSlice: SliceCreator<ComponentStateSlice> = (
  set,
) => ({
  componentState: {},

  updateComponentState: (elementKey, updates) =>
    set((s) => {
      if (!s.componentState[elementKey]) {
        s.componentState[elementKey] = {};
      }
      Object.assign(s.componentState[elementKey], updates);
    }),

  clearComponentState: (elementKey) =>
    set((s) => {
      delete s.componentState[elementKey];
    }),

  clearAllComponentState: () => set({ componentState: {} }),
});
