"use client";

import React, { useMemo, useEffect, useCallback } from "react";
import { SelectionContext } from "./context";
import { SELECTION_STYLE_ID, SELECTION_CSS } from "./styles";
import { getUniqueCSSPath } from "./utils";
import { useSelectionState } from "./use-selection-state";
import { useLongPress } from "./use-long-press";
import type { SelectionContextValue, SelectionProviderProps } from "./types";

/**
 * Provider for granular item selection within components.
 *
 * Architecture:
 * - `deepSelections` is the SINGLE SOURCE OF TRUTH for all selections
 * - `granularSelection` is DERIVED from deepSelections (flat structure for component API)
 * - This ensures visual state and logical state are always in sync
 *
 * Features:
 * - Automatic event delegation: components only need data-* attributes
 * - Global CSS injection for consistent styling
 * - Zero boilerplate in components
 *
 * Components should add these attributes to selectable items:
 * - data-selectable-item: marks the element as selectable
 * - data-element-key: the component's element.key
 * - data-item-id: unique identifier for the item
 */
export function SelectionProvider({ children }: SelectionProviderProps) {
  const selectionState = useSelectionState();
  const {
    deepSelections,
    granularSelection,
    addSelection,
    removeSelectionByElement,
    toggleSelection,
    clearSelection,
    isSelected,
    getSelectedItems,
    selectedElementsRef,
    deepSelectionActiveRef,
    setDeepSelectionActive,
  } = selectionState;

  // Function to check if deep selection is active
  const isDeepSelectionActive = useCallback(
    () => deepSelectionActiveRef.current,
    [deepSelectionActiveRef],
  );

  // Clear all deep selections and remove visual feedback
  const clearDeepSelection = () => {
    // Clear elements from ref
    selectedElementsRef.current.forEach((el) => {
      el.classList.remove("jsonui-deep-selected", "jsonui-item-selected");
      el.removeAttribute("aria-selected");
    });
    selectedElementsRef.current.clear();

    // Also query DOM directly in case elements were re-rendered
    if (typeof document !== "undefined") {
      document
        .querySelectorAll(".jsonui-deep-selected, .jsonui-item-selected")
        .forEach((el) => {
          el.classList.remove("jsonui-deep-selected", "jsonui-item-selected");
          el.removeAttribute("aria-selected");
        });
    }

    clearSelection();
  };

  // Handle long-press selection
  const handleLongPress = (
    target: HTMLElement,
    componentWrapper: HTMLElement,
  ) => {
    const elementKey = componentWrapper.getAttribute("data-jsonui-element-key");
    if (!elementKey) return;

    // Check if already selected (toggle off)
    if (selectedElementsRef.current.has(target)) {
      target.classList.remove("jsonui-deep-selected");
      target.removeAttribute("aria-selected");
      removeSelectionByElement(target);
      return;
    }

    // Set flag to prevent component-level selection (via context ref, no global pollution)
    setDeepSelectionActive();

    // Generate CSS path
    const cssPath = getUniqueCSSPath(target, componentWrapper);
    const textContent = (target.textContent || "").trim().substring(0, 100);

    // Apply visual selection
    target.classList.add("jsonui-deep-selected");
    target.setAttribute("aria-selected", "true");

    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Find containing selectable-item
    const selectableItem = target.closest(
      "[data-selectable-item]",
    ) as HTMLElement | null;
    const itemId = selectableItem?.getAttribute("data-item-id") || undefined;

    addSelection({
      elementKey,
      cssPath,
      tagName: target.tagName.toLowerCase(),
      textContent,
      element: target,
      selectionType: "granular",
      itemId,
    });
  };

  // Handle click selection
  const handleClick = (target: HTMLElement, _event: MouseEvent) => {
    // Check for selectable-item click
    const selectableItem = target.closest(
      "[data-selectable-item]",
    ) as HTMLElement | null;
    if (selectableItem) {
      const componentWrapper = selectableItem.closest(
        "[data-jsonui-element-key]",
      ) as HTMLElement | null;
      if (!componentWrapper) return;

      const elementKey = componentWrapper.getAttribute(
        "data-jsonui-element-key",
      );
      if (!elementKey) return;

      // Toggle if already selected
      if (selectedElementsRef.current.has(selectableItem)) {
        selectableItem.classList.remove(
          "jsonui-deep-selected",
          "jsonui-item-selected",
        );
        selectableItem.removeAttribute("aria-selected");
        removeSelectionByElement(selectableItem);
        return;
      }

      const itemId = selectableItem.getAttribute("data-item-id") || undefined;
      const cssPath = getUniqueCSSPath(selectableItem, componentWrapper);
      const textContent = (selectableItem.textContent || "")
        .trim()
        .substring(0, 200);

      // Apply visual selection
      selectableItem.classList.add(
        "jsonui-deep-selected",
        "jsonui-item-selected",
      );
      selectableItem.setAttribute("aria-selected", "true");

      addSelection({
        elementKey,
        cssPath,
        tagName: selectableItem.tagName.toLowerCase(),
        textContent,
        element: selectableItem,
        selectionType: "item",
        itemId,
      });
      return;
    }

    // Check for click outside to clear selection
    const componentWrapper = target.closest("[data-jsonui-element-key]");
    const isInChatArea =
      target.closest("[data-chat-sidebar]") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest("[data-jsonui-no-clear-selection]");

    if (
      !componentWrapper &&
      !isInChatArea &&
      selectedElementsRef.current.size > 0
    ) {
      clearDeepSelection();
    }
  };

  // Use the long-press hook for event handling
  useLongPress(
    {
      onLongPress: handleLongPress,
      onClick: handleClick,
    },
    { debug: false },
  );

  // Keyboard shortcuts for selection
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape - clear all selections
      if (e.key === "Escape" && deepSelections.length > 0) {
        e.preventDefault();
        clearDeepSelection();
        return;
      }

      // Delete/Backspace - clear selections (alternative to Escape)
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        deepSelections.length > 0 &&
        !document.activeElement?.matches("input, textarea, [contenteditable]")
      ) {
        e.preventDefault();
        clearDeepSelection();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deepSelections, clearDeepSelection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      selectedElementsRef.current.forEach((el) => {
        el.classList.remove("jsonui-deep-selected");
        el.removeAttribute("aria-selected");
      });
    };
  }, [selectedElementsRef]);

  // CSS Injection
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(SELECTION_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = SELECTION_STYLE_ID;
    style.textContent = SELECTION_CSS;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById(SELECTION_STYLE_ID);
      if (el) el.remove();
    };
  }, []);

  const value = useMemo<SelectionContextValue>(
    () => ({
      granularSelection,
      toggleSelection,
      clearSelection,
      isSelected,
      getSelectedItems,
      deepSelections,
      clearDeepSelection,
      isDeepSelectionActive,
    }),
    [
      granularSelection,
      toggleSelection,
      clearSelection,
      isSelected,
      getSelectedItems,
      deepSelections,
      isDeepSelectionActive,
    ],
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}
