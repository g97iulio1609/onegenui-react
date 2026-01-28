"use client";

import { useContext, useCallback, useMemo } from "react";
import { SelectionContext } from "./context";
import type { SelectionContextValue } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook to access granular selection functionality.
 * Must be used within a SelectionProvider.
 */
export function useSelection(): SelectionContextValue {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}

/**
 * Simplified hook for components that only need to check selection state.
 * Returns helpers scoped to a specific element.
 */
export function useItemSelection(elementKey: string) {
  const { isSelected, getSelectedItems, granularSelection } = useSelection();

  const isItemSelected = useCallback(
    (itemId: string) => isSelected(elementKey, itemId),
    [elementKey, isSelected],
  );

  const selectedItems = useMemo(
    () => getSelectedItems(elementKey),
    [elementKey, getSelectedItems],
  );

  const hasSelection = useMemo(
    () => (granularSelection[elementKey]?.size ?? 0) > 0,
    [elementKey, granularSelection],
  );

  return {
    isItemSelected,
    selectedItems,
    hasSelection,
  };
}
