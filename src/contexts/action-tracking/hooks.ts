"use client";

// =============================================================================
// Action Tracking Hooks
// =============================================================================

import { useContext, useCallback, useEffect } from "react";
import type { TrackedAction, ActionType } from "../../hooks/types";
import type { ActionContextValue } from "./types";
import { ActionContext } from "./provider";

export function useActionContext(): ActionContextValue {
  const context = useContext(ActionContext);
  if (!context) {
    throw new Error("useActionContext must be used within ActionProvider");
  }
  return context;
}

export function useElementActionTracker(
  elementKey: string,
  elementType: string,
) {
  const { trackAction, options } = useActionContext();

  const track = useCallback(
    (
      type: ActionType,
      context?: TrackedAction["context"],
      payload?: unknown,
    ) => {
      if (!options.enabled) return;
      trackAction({ type, elementKey, elementType, context, payload });
    },
    [trackAction, elementKey, elementType, options.enabled],
  );

  return { track, isEnabled: options.enabled };
}

export function useActionSubscriber(
  callback: (actions: TrackedAction[]) => void,
  deps: unknown[] = [],
) {
  const { onAction } = useActionContext();

  useEffect(() => {
    return onAction(callback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAction, ...deps]);
}
