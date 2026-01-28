/**
 * useDomTracking - DOM tracking and event coordination
 * Handles DOM element references and visual feedback
 */

import { useCallback } from "react";
import type { DeepSelectionInput } from "./types";
import { getUniqueCSSPath } from "./utils";

export interface UseDomTrackingReturn {
  /** Apply visual selection to an element */
  applyVisualSelection: (
    element: HTMLElement,
    isItemSelection?: boolean,
  ) => void;
  /** Remove visual selection from an element */
  removeVisualSelection: (element: HTMLElement) => void;
  /** Clear all visual selections from DOM */
  clearAllVisualSelections: (selectedElementsRef: Set<HTMLElement>) => void;
  /** Create selection input from a DOM element (id/timestamp added by store) */
  createSelectionInput: (
    element: HTMLElement,
    componentWrapper: HTMLElement,
    selectionType: "granular" | "item",
  ) => DeepSelectionInput;
  /** Trigger haptic feedback if available */
  triggerHaptic: () => void;
}

/**
 * Hook for DOM tracking and visual feedback management
 */
export function useDomTracking(): UseDomTrackingReturn {
  const applyVisualSelection = useCallback(
    (element: HTMLElement, isItemSelection = false) => {
      element.classList.add("jsonui-deep-selected");
      if (isItemSelection) {
        element.classList.add("jsonui-item-selected");
      }
      element.setAttribute("aria-selected", "true");
    },
    [],
  );

  const removeVisualSelection = useCallback((element: HTMLElement) => {
    element.classList.remove("jsonui-deep-selected", "jsonui-item-selected");
    element.removeAttribute("aria-selected");
  }, []);

  const clearAllVisualSelections = useCallback(
    (selectedElementsRef: Set<HTMLElement>) => {
      // Clear from ref
      selectedElementsRef.forEach((el) => {
        el.classList.remove("jsonui-deep-selected", "jsonui-item-selected");
        el.removeAttribute("aria-selected");
      });
      selectedElementsRef.clear();

      // Also query DOM directly in case elements were re-rendered
      if (typeof document !== "undefined") {
        document
          .querySelectorAll(".jsonui-deep-selected, .jsonui-item-selected")
          .forEach((el) => {
            el.classList.remove("jsonui-deep-selected", "jsonui-item-selected");
            el.removeAttribute("aria-selected");
          });
      }
    },
    [],
  );

  const createSelectionInput = useCallback(
    (
      element: HTMLElement,
      componentWrapper: HTMLElement,
      selectionType: "granular" | "item",
    ): DeepSelectionInput => {
      const elementKey =
        componentWrapper.getAttribute("data-jsonui-element-key") || "";
      const cssPath = getUniqueCSSPath(element, componentWrapper);
      const textContent = (element.textContent || "").trim().substring(0, 200);

      // Find containing selectable-item (if any)
      const selectableItem = element.closest(
        "[data-selectable-item]",
      ) as HTMLElement | null;
      const itemId = selectableItem?.getAttribute("data-item-id") || undefined;

      return {
        elementKey,
        cssPath,
        tagName: element.tagName.toLowerCase(),
        textContent,
        element,
        selectionType,
        itemId,
      };
    },
    [],
  );

  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, []);

  return {
    applyVisualSelection,
    removeVisualSelection,
    clearAllVisualSelections,
    createSelectionInput,
    triggerHaptic,
  };
}
