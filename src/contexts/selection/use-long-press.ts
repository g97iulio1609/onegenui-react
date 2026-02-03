/**
 * useLongPress - Long-press detection hook
 * Handles timing, movement tolerance, and cleanup
 */

import { useRef, useCallback, useEffect } from "react";
import { createLogger } from "@onegenui/utils";
import { isInteractiveElement, shouldNeverSelect } from "../../utils/dom";

const logger = createLogger({ prefix: "use-long-press" });

export interface LongPressConfig {
  /** Duration in ms to trigger long-press */
  duration: number;
  /** Movement tolerance in px */
  movementThreshold: number;
  /** Enable debug logging */
  debug?: boolean;
}

export const DEFAULT_LONG_PRESS_CONFIG: LongPressConfig = {
  duration: 450,
  movementThreshold: 10,
  debug: false,
};

export interface LongPressCallbacks {
  /** Called when long-press triggers */
  onLongPress: (target: HTMLElement, componentWrapper: HTMLElement) => void;
  /** Called when click happens (not long-press) */
  onClick: (target: HTMLElement, event: MouseEvent) => void;
  /** Called when right-click happens */
  onContextMenu?: () => void;
}

export interface UseLongPressReturn {
  /** Flag indicating if long-press just completed (to prevent click) */
  longPressJustCompleted: boolean;
}

/**
 * Hook for handling long-press detection on document
 * Automatically attaches/detaches event listeners
 */
export function useLongPress(
  callbacks: LongPressCallbacks,
  config: Partial<LongPressConfig> = {},
): UseLongPressReturn {
  const fullConfig = { ...DEFAULT_LONG_PRESS_CONFIG, ...config };
  const { duration, movementThreshold, debug } = fullConfig;

  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressTargetRef = useRef<HTMLElement | null>(null);
  const longPressCompletedRef = useRef(false);

  const log = useCallback(
    (message: string, ...args: unknown[]) => {
      if (debug) {
        logger.debug(`[LongPress] ${message}`, ...args);
      }
    },
    [debug],
  );

  const cancelPress = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    pressTargetRef.current = null;
  }, []);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // Only respond to primary button (left-click)
      if (e.button !== 0) {
        log("pointerdown SKIPPED - not primary button:", e.button);
        return;
      }

      const target = e.target as HTMLElement;
      log("pointerdown on:", target.tagName, target.className);

      // Reset flag on new press
      longPressCompletedRef.current = false;

      // Cancel any existing press
      cancelPress();

      // Skip interactive elements
      if (isInteractiveElement(target)) {
        log("pointerdown SKIPPED - interactive element:", target.tagName);
        return;
      }

      // Skip elements that should never trigger selection
      if (shouldNeverSelect(target)) {
        log("pointerdown SKIPPED - shouldNeverSelect:", target.tagName);
        return;
      }

      // Find parent JSON-UI component
      const componentWrapper = target.closest(
        "[data-jsonui-element-key]",
      ) as HTMLElement | null;
      if (!componentWrapper) return;

      // Skip non-meaningful elements
      const skipTags = new Set(["SCRIPT", "STYLE", "META", "LINK", "BR", "HR"]);
      if (skipTags.has(target.tagName)) return;

      // Skip if pressing the component wrapper itself
      if (target === componentWrapper) return;

      // Store target and start timer
      pressTargetRef.current = target;

      pressTimerRef.current = setTimeout(() => {
        if (!pressTargetRef.current) return;

        log("Long-press triggered on:", pressTargetRef.current.tagName);

        callbacks.onLongPress(pressTargetRef.current, componentWrapper);

        longPressCompletedRef.current = true;
        pressTargetRef.current = null;
      }, duration);
    };

    const handlePointerUp = () => cancelPress();

    const handlePointerMove = (e: PointerEvent) => {
      // Cancel if user moves significantly during press
      if (
        pressTargetRef.current &&
        Math.abs(e.movementX) + Math.abs(e.movementY) > movementThreshold
      ) {
        cancelPress();
      }
    };

    const handlePointerCancel = () => cancelPress();

    const handleClick = (e: MouseEvent) => {
      // Only respond to primary button
      if (e.button !== 0) {
        log("click SKIPPED - not primary button:", e.button);
        return;
      }

      const target = e.target as HTMLElement;
      log("click on:", target.tagName, target.className);

      // Skip if long-press just completed
      if (longPressCompletedRef.current) {
        log("click SKIPPED - long-press just completed");
        longPressCompletedRef.current = false;
        return;
      }

      // Skip if user has selected text
      const textSelection = window.getSelection();
      if (
        textSelection &&
        !textSelection.isCollapsed &&
        textSelection.toString().trim()
      ) {
        log("click SKIPPED - text selection active");
        return;
      }

      // Skip interactive elements
      if (isInteractiveElement(target)) {
        log("click SKIPPED - interactive element:", target.tagName);
        return;
      }

      // Skip elements that should never trigger selection
      if (shouldNeverSelect(target)) {
        log("click SKIPPED - shouldNeverSelect:", target.tagName);
        return;
      }

      callbacks.onClick(target, e);
    };

    const handleContextMenu = () => {
      cancelPress();
      callbacks.onContextMenu?.();
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("pointerup", handlePointerUp, true);
    document.addEventListener("pointermove", handlePointerMove, true);
    document.addEventListener("pointercancel", handlePointerCancel, true);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("contextmenu", handleContextMenu, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("pointerup", handlePointerUp, true);
      document.removeEventListener("pointermove", handlePointerMove, true);
      document.removeEventListener("pointercancel", handlePointerCancel, true);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      cancelPress();
    };
  }, [callbacks, duration, movementThreshold, cancelPress, log]);

  return {
    get longPressJustCompleted() {
      return longPressCompletedRef.current;
    },
  };
}
