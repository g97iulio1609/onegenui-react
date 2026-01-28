"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  resolveAction,
  executeAction,
  type Action,
  type ActionHandler,
  type ActionConfirm,
  type ResolvedAction,
} from "@onegenui/core";
import { useData } from "./data";
import { useStore } from "../store";
import { cn } from "../utils";

/**
 * Pending confirmation state
 */
export interface PendingConfirmation {
  /** The resolved action */
  action: ResolvedAction;
  /** The action handler */
  handler: ActionHandler;
  /** Resolve callback */
  resolve: () => void;
  /** Reject callback */
  reject: () => void;
}

/**
 * Action tracking callback type
 */
export type ActionTrackingCallback = (info: {
  actionName: string;
  params: Record<string, unknown>;
  elementType?: string;
  context?: Record<string, unknown>;
}) => void;

/**
 * Action context value
 */
export interface ActionContextValue {
  /** Registered action handlers */
  handlers: Record<string, ActionHandler>;
  /** Currently loading action names */
  loadingActions: Set<string>;
  /** Pending confirmation dialog */
  pendingConfirmation: PendingConfirmation | null;
  /** Execute an action */
  execute: (action: Action) => Promise<void>;
  /** Confirm the pending action */
  confirm: () => void;
  /** Cancel the pending action */
  cancel: () => void;
  /** Register an action handler */
  registerHandler: (name: string, handler: ActionHandler) => void;
}

const ActionContext = createContext<ActionContextValue | null>(null);

/**
 * Props for ActionProvider
 */
export interface ActionProviderProps {
  /** Initial action handlers */
  handlers?: Record<string, ActionHandler>;
  /** Navigation function */
  navigate?: (path: string) => void;
  /** Optional callback to track executed actions (for proactive AI) */
  onActionExecuted?: ActionTrackingCallback;
  children: ReactNode;
}

/**
 * Provider for action execution - Now uses Zustand for state
 */
export function ActionProvider({
  handlers: initialHandlers = {},
  navigate,
  onActionExecuted,
  children,
}: ActionProviderProps) {
  const { data, set } = useData();

  // Bridge to Zustand store
  const loadingActions = useStore((s) => s.loadingActions);
  const setActionLoading = useStore((s) => s.setActionLoading);
  const clearActionLoading = useStore((s) => s.clearActionLoading);
  const pendingConfirmations = useStore((s) => s.pendingConfirmations);
  const addConfirmation = useStore((s) => s.addConfirmation);
  const removeConfirmation = useStore((s) => s.removeConfirmation);
  const addToHistory = useStore((s) => s.addToHistory);

  // Local handlers state (not in store - these are callback functions)
  const [handlers, setHandlers] =
    React.useState<Record<string, ActionHandler>>(initialHandlers);

  // Track current pending confirmation with callbacks (not serializable in store)
  const [localPendingConfirmation, setLocalPendingConfirmation] =
    React.useState<PendingConfirmation | null>(null);

  const registerHandler = useCallback(
    (name: string, handler: ActionHandler) => {
      setHandlers((prev) => ({ ...prev, [name]: handler }));
    },
    [],
  );

  const execute = useCallback(
    async (action: Action) => {
      const resolved = resolveAction(action, data);
      const handler = handlers[resolved.name];

      if (!handler) {
        console.warn(`No handler registered for action: ${resolved.name}`);
        return;
      }

      // Track the action execution if callback is provided
      const trackExecution = () => {
        addToHistory({
          actionName: resolved.name,
          payload: resolved.params,
        });
        onActionExecuted?.({
          actionName: resolved.name,
          params: resolved.params,
        });
      };

      // If confirmation is required, show dialog
      if (resolved.confirm) {
        const confirmId = addConfirmation({
          actionName: resolved.name,
          title: resolved.confirm.title,
          message: resolved.confirm.message,
          confirmText: resolved.confirm.confirmLabel,
          cancelText: resolved.confirm.cancelLabel,
          payload: resolved.params,
        });

        return new Promise<void>((resolve, reject) => {
          setLocalPendingConfirmation({
            action: resolved,
            handler,
            resolve: () => {
              removeConfirmation(confirmId);
              setLocalPendingConfirmation(null);
              resolve();
            },
            reject: () => {
              removeConfirmation(confirmId);
              setLocalPendingConfirmation(null);
              reject(new Error("Action cancelled"));
            },
          });
        }).then(async () => {
          setActionLoading(resolved.name, true);
          try {
            await executeAction({
              action: resolved,
              handler,
              setData: set,
              navigate,
              executeAction: async (name) => {
                const subAction: Action = { name };
                await execute(subAction);
              },
            });
            trackExecution();
          } finally {
            clearActionLoading(resolved.name);
          }
        });
      }

      // Execute immediately
      setActionLoading(resolved.name, true);
      try {
        await executeAction({
          action: resolved,
          handler,
          setData: set,
          navigate,
          executeAction: async (name) => {
            const subAction: Action = { name };
            await execute(subAction);
          },
        });
        trackExecution();
      } finally {
        clearActionLoading(resolved.name);
      }
    },
    [
      data,
      handlers,
      set,
      navigate,
      onActionExecuted,
      setActionLoading,
      clearActionLoading,
      addConfirmation,
      removeConfirmation,
      addToHistory,
    ],
  );

  const confirm = useCallback(() => {
    localPendingConfirmation?.resolve();
  }, [localPendingConfirmation]);

  const cancel = useCallback(() => {
    localPendingConfirmation?.reject();
  }, [localPendingConfirmation]);

  const value = useMemo<ActionContextValue>(
    () => ({
      handlers,
      loadingActions,
      pendingConfirmation: localPendingConfirmation,
      execute,
      confirm,
      cancel,
      registerHandler,
    }),
    [
      handlers,
      loadingActions,
      localPendingConfirmation,
      execute,
      confirm,
      cancel,
      registerHandler,
    ],
  );

  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  );
}

/**
 * Hook to access action context
 */
export function useActions(): ActionContextValue {
  const ctx = useContext(ActionContext);
  if (!ctx) {
    throw new Error("useActions must be used within an ActionProvider");
  }
  return ctx;
}

/**
 * Hook to execute an action
 */
export function useAction(action: Action): {
  execute: () => Promise<void>;
  isLoading: boolean;
} {
  const { execute, loadingActions } = useActions();
  const isLoading = loadingActions.has(action.name);

  const executeAction = useCallback(() => execute(action), [execute, action]);

  return { execute: executeAction, isLoading };
}

/**
 * Props for ConfirmDialog component
 */
export interface ConfirmDialogProps {
  /** The confirmation config */
  confirm: ActionConfirm;
  /** Called when confirmed */
  onConfirm: () => void;
  /** Called when cancelled */
  onCancel: () => void;
}

// ... existing code ...

/**
 * Default confirmation dialog component
 */
export function ConfirmDialog({
  confirm,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isDanger = confirm.variant === "danger";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-[400px] w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="m-0 mb-2 text-lg font-semibold">{confirm.title}</h3>
        <p className="m-0 mb-6 text-gray-500">{confirm.message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {confirm.cancelLabel ?? "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "px-4 py-2 rounded-md border-none text-white cursor-pointer transition-colors",
              isDanger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-500 hover:bg-blue-600",
            )}
          >
            {confirm.confirmLabel ?? "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
