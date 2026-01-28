/**
 * Analytics Slice - Action tracking, metrics
 */
import type { SliceCreator } from "../types";

export interface TrackedAction {
  id: string;
  type: string;
  elementKey?: string;
  elementType?: string;
  timestamp: number;
  data?: unknown;
}

export interface AnalyticsSlice {
  // Action history
  actions: TrackedAction[];
  trackAction: (action: Omit<TrackedAction, "id" | "timestamp">) => void;
  clearActions: () => void;

  // Metrics
  metrics: {
    totalActions: number;
    sessionStart: number;
    lastActionTime: number;
  };

  // Get recent actions (for AI context)
  getRecentActions: (count?: number) => TrackedAction[];
  getActionsByType: (type: string) => TrackedAction[];
  getActionsByElement: (elementKey: string) => TrackedAction[];
}

const MAX_ACTIONS = 100;
let analyticsIdCounter = 0;

export const createAnalyticsSlice: SliceCreator<AnalyticsSlice> = (
  set,
  get,
) => ({
  // Actions
  actions: [],
  trackAction: (action) => {
    const tracked: TrackedAction = {
      ...action,
      id: `analytics_${++analyticsIdCounter}`,
      timestamp: Date.now(),
    };

    set((state) => {
      state.actions.unshift(tracked);
      if (state.actions.length > MAX_ACTIONS) {
        state.actions = state.actions.slice(0, MAX_ACTIONS);
      }
      state.metrics.totalActions++;
      state.metrics.lastActionTime = tracked.timestamp;
    });
  },
  clearActions: () =>
    set((state) => {
      state.actions = [];
      state.metrics.totalActions = 0;
    }),

  // Metrics
  metrics: {
    totalActions: 0,
    sessionStart: Date.now(),
    lastActionTime: 0,
  },

  // Getters
  getRecentActions: (count = 10) => get().actions.slice(0, count),
  getActionsByType: (type) => get().actions.filter((a) => a.type === type),
  getActionsByElement: (elementKey) =>
    get().actions.filter((a) => a.elementKey === elementKey),
});
