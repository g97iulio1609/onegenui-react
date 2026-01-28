/**
 * Actions Slice - Action execution state management
 *
 * Manages:
 * - Loading states per action
 * - Pending confirmations
 * - Action history
 */
import type { SliceCreator } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pending confirmation dialog
 */
export interface PendingConfirmation {
  id: string;
  actionName: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  payload?: unknown;
  timestamp: number;
}

/**
 * Action execution record
 */
export interface ActionExecution {
  id: string;
  actionName: string;
  status: "pending" | "running" | "success" | "error";
  startTime: number;
  endTime?: number;
  error?: string;
  payload?: unknown;
  result?: unknown;
}

// ─────────────────────────────────────────────────────────────────────────────
// Slice Interface
// ─────────────────────────────────────────────────────────────────────────────

export interface ActionsSlice {
  // ─────────────────────────────────────────────────────────────────────────
  // Loading states
  // ─────────────────────────────────────────────────────────────────────────
  loadingActions: Set<string>;
  isActionLoading: (actionName: string) => boolean;
  setActionLoading: (actionName: string, loading: boolean) => void;
  clearActionLoading: (actionName: string) => void;
  clearAllLoading: () => void;

  // ─────────────────────────────────────────────────────────────────────────
  // Pending Action Confirmations (different from UISlice confirmations)
  // ─────────────────────────────────────────────────────────────────────────
  pendingConfirmations: PendingConfirmation[];
  addPendingConfirmation: (
    confirmation: Omit<PendingConfirmation, "id" | "timestamp">,
  ) => string;
  removePendingConfirmation: (id: string) => void;
  getPendingConfirmation: (id: string) => PendingConfirmation | undefined;
  clearPendingConfirmations: () => void;

  // Convenience aliases
  addConfirmation: (
    confirmation: Omit<PendingConfirmation, "id" | "timestamp">,
  ) => string;
  removeConfirmation: (id: string) => void;

  // ─────────────────────────────────────────────────────────────────────────
  // Action history
  // ─────────────────────────────────────────────────────────────────────────
  actionHistory: ActionExecution[];
  maxHistorySize: number;

  startAction: (actionName: string, payload?: unknown) => string;
  completeAction: (id: string, result?: unknown) => void;
  failAction: (id: string, error: string) => void;
  getActionStatus: (id: string) => ActionExecution | undefined;
  getRecentActionExecutions: (count?: number) => ActionExecution[];
  addToHistory: (info: { actionName: string; payload?: unknown }) => void;
  clearHistory: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Slice Implementation
// ─────────────────────────────────────────────────────────────────────────────

let actionIdCounter = 0;
const generateActionId = () => `action_${++actionIdCounter}_${Date.now()}`;

let confirmationIdCounter = 0;
const generateConfirmationId = () =>
  `confirm_${++confirmationIdCounter}_${Date.now()}`;

export const createActionsSlice: SliceCreator<ActionsSlice> = (set, get) => ({
  // ─────────────────────────────────────────────────────────────────────────
  // Loading states
  // ─────────────────────────────────────────────────────────────────────────
  loadingActions: new Set(),

  isActionLoading: (actionName) => get().loadingActions.has(actionName),

  setActionLoading: (actionName, loading) =>
    set((state) => {
      if (loading) {
        state.loadingActions.add(actionName);
      } else {
        state.loadingActions.delete(actionName);
      }
    }),

  clearActionLoading: (actionName) =>
    set((state) => {
      state.loadingActions.delete(actionName);
    }),

  clearAllLoading: () => set({ loadingActions: new Set() }),

  // ─────────────────────────────────────────────────────────────────────────
  // Pending Action Confirmations
  // ─────────────────────────────────────────────────────────────────────────
  pendingConfirmations: [],

  addPendingConfirmation: (confirmation) => {
    const id = generateConfirmationId();
    set((state) => {
      state.pendingConfirmations.push({
        ...confirmation,
        id,
        timestamp: Date.now(),
      });
    });
    return id;
  },

  removePendingConfirmation: (id) =>
    set((state) => {
      state.pendingConfirmations = state.pendingConfirmations.filter(
        (c) => c.id !== id,
      );
    }),

  getPendingConfirmation: (id) => {
    return get().pendingConfirmations.find((c) => c.id === id);
  },

  clearPendingConfirmations: () => set({ pendingConfirmations: [] }),

  // Convenience aliases
  addConfirmation: (confirmation) => {
    const id = generateConfirmationId();
    set((state) => {
      state.pendingConfirmations.push({
        ...confirmation,
        id,
        timestamp: Date.now(),
      });
    });
    return id;
  },

  removeConfirmation: (id) =>
    set((state) => {
      state.pendingConfirmations = state.pendingConfirmations.filter(
        (c) => c.id !== id,
      );
    }),

  // ─────────────────────────────────────────────────────────────────────────
  // Action history
  // ─────────────────────────────────────────────────────────────────────────
  actionHistory: [],
  maxHistorySize: 100,

  startAction: (actionName, payload) => {
    const id = generateActionId();

    set((state) => {
      state.loadingActions.add(actionName);
      state.actionHistory.push({
        id,
        actionName,
        status: "running",
        startTime: Date.now(),
        payload,
      });
      if (state.actionHistory.length > state.maxHistorySize) {
        state.actionHistory = state.actionHistory.slice(-state.maxHistorySize);
      }
    });

    return id;
  },

  completeAction: (id, result) =>
    set((state) => {
      const execution = state.actionHistory.find((a) => a.id === id);
      if (execution) {
        state.loadingActions.delete(execution.actionName);
        execution.status = "success";
        execution.endTime = Date.now();
        execution.result = result;
      }
    }),

  failAction: (id, error) =>
    set((state) => {
      const execution = state.actionHistory.find((a) => a.id === id);
      if (execution) {
        state.loadingActions.delete(execution.actionName);
        execution.status = "error";
        execution.endTime = Date.now();
        execution.error = error;
      }
    }),

  getActionStatus: (id) => {
    return get().actionHistory.find((a) => a.id === id);
  },

  getRecentActionExecutions: (count = 10) => {
    return get().actionHistory.slice(-count);
  },

  addToHistory: (info) => {
    const id = generateActionId();

    set((state) => {
      state.actionHistory.push({
        id,
        actionName: info.actionName,
        status: "success",
        startTime: Date.now(),
        endTime: Date.now(),
        payload: info.payload,
      });
      if (state.actionHistory.length > state.maxHistorySize) {
        state.actionHistory = state.actionHistory.slice(-state.maxHistorySize);
      }
    });
  },

  clearHistory: () => set({ actionHistory: [] }),
});
