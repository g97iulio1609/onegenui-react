"use client";

// =============================================================================
// Action Tracking Provider
// =============================================================================

import {
  createContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type { TrackedAction, ActionTrackerOptions } from "../../hooks/types";
import type { ActionContextValue } from "./types";
import { DEFAULT_OPTIONS } from "./types";
import { generateId, isUserCurrentlyEditing } from "./utils";

export const ActionContext = createContext<ActionContextValue | null>(null);

interface ActionProviderProps {
  children: ReactNode;
  initialOptions?: Partial<ActionTrackerOptions>;
}

export function ActionProvider({
  children,
  initialOptions,
}: ActionProviderProps) {
  const [options, setOptionsState] = useState<ActionTrackerOptions>(() => ({
    ...DEFAULT_OPTIONS,
    ...initialOptions,
  }));

  const [actions, setActions] = useState<TrackedAction[]>([]);
  const [lastAction, setLastAction] = useState<TrackedAction | null>(null);

  // Refs for async operations
  const subscribersRef = useRef<Set<(actions: TrackedAction[]) => void>>(
    new Set(),
  );
  const pendingActionsRef = useRef<TrackedAction[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Core Logic: Smart Debounce with Focus Awareness
  const notifySubscribers = useCallback((batch: TrackedAction[]) => {
    subscribersRef.current.forEach((cb) => {
      try {
        cb(batch);
      } catch (e) {
        console.error("[ActionTracker] Subscriber error:", e);
      }
    });
  }, []);

  const tryFlush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (pendingActionsRef.current.length === 0) return;

    if (isUserCurrentlyEditing()) {
      timerRef.current = setTimeout(tryFlush, 1000);
      return;
    }

    const batch = [...pendingActionsRef.current];
    pendingActionsRef.current = [];
    notifySubscribers(batch);
  }, [notifySubscribers]);

  const scheduleFlush = useCallback(
    (delayMs: number) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(tryFlush, delayMs);
    },
    [tryFlush],
  );

  // Public API
  const trackAction = useCallback(
    (actionData: Omit<TrackedAction, "id" | "timestamp">) => {
      if (!options.enabled) return;

      const action: TrackedAction = {
        ...actionData,
        id: generateId(),
        timestamp: Date.now(),
      };

      setActions((prev) => {
        const next = [...prev, action];
        return next.slice(-(options.maxActionsInContext ?? 5));
      });
      setLastAction(action);

      pendingActionsRef.current.push(action);
      scheduleFlush(options.debounceMs ?? 2500);
    },
    [
      options.enabled,
      options.maxActionsInContext,
      options.debounceMs,
      scheduleFlush,
    ],
  );

  const clearActions = useCallback(() => {
    setActions([]);
    setLastAction(null);
    pendingActionsRef.current = [];
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const getActionsForContext = useCallback(() => {
    return actions.slice(-(options.maxActionsInContext ?? 5));
  }, [actions, options.maxActionsInContext]);

  const onAction = useCallback(
    (callback: (actions: TrackedAction[]) => void) => {
      subscribersRef.current.add(callback);
      return () => subscribersRef.current.delete(callback);
    },
    [],
  );

  const setOptions = useCallback(
    (newOptions: Partial<ActionTrackerOptions>) => {
      setOptionsState((prev) => ({ ...prev, ...newOptions }));
    },
    [],
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Global focus listener - triggers flush when user leaves any input
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const tag = target?.tagName?.toLowerCase();
      const isEditable =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable;

      if (!isEditable) return;

      setTimeout(() => {
        if (!isUserCurrentlyEditing() && pendingActionsRef.current.length > 0) {
          scheduleFlush(options.debounceMs ?? 2500);
        }
      }, 100);
    };

    document.addEventListener("focusout", handleFocusOut, true);
    return () => document.removeEventListener("focusout", handleFocusOut, true);
  }, [options.debounceMs, scheduleFlush]);

  const value: ActionContextValue = {
    actions,
    trackAction,
    clearActions,
    getActionsForContext,
    lastAction,
    onAction,
    options,
    setOptions,
  };

  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  );
}
