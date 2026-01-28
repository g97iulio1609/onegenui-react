"use client";

// =============================================================================
// Action Tracking Types
// =============================================================================

import type { TrackedAction, ActionTrackerOptions } from "../../hooks/types";

export interface ActionContextValue {
  /** Recent actions (limited by maxActionsInContext) */
  actions: TrackedAction[];
  /** Track a new user action */
  trackAction: (action: Omit<TrackedAction, "id" | "timestamp">) => void;
  /** Clear all tracked actions */
  clearActions: () => void;
  /** Get actions for AI context */
  getActionsForContext: () => TrackedAction[];
  /** Last action tracked */
  lastAction: TrackedAction | null;
  /** Subscribe to action events (for proactive AI) */
  onAction: (callback: (actions: TrackedAction[]) => void) => () => void;
  /** Options */
  options: ActionTrackerOptions;
  /** Update options */
  setOptions: (options: Partial<ActionTrackerOptions>) => void;
}

export const DEFAULT_OPTIONS: ActionTrackerOptions = {
  enabled: true,
  debounceMs: 2500,
  maxActionsInContext: 5,
};
