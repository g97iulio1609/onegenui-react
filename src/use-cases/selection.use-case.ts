/**
 * Selection Use Cases - Pure Business Logic
 * Extracted from provider.tsx for testability and reusability
 */

import type {
  SelectedItem,
  SelectableItemData,
  DeepSelectionInfo,
} from "../contexts/selection/types";
import type { DeepSelectionData } from "../ports/selection.port";

// ─────────────────────────────────────────────────────────────────────────────
// Item Selection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Determine if an item should be added to or removed from selection
 */
export function computeToggleSelection(
  currentSelection: SelectedItem[],
  item: SelectedItem,
): SelectedItem[] {
  const isCurrentlySelected = currentSelection.some(
    (s) => s.itemId === item.itemId && s.elementKey === item.elementKey,
  );

  if (isCurrentlySelected) {
    return currentSelection.filter(
      (s) => !(s.itemId === item.itemId && s.elementKey === item.elementKey),
    );
  }

  return [...currentSelection, item];
}

/**
 * Add item to selection (no-op if already selected)
 */
export function computeAddSelection(
  currentSelection: SelectedItem[],
  item: SelectedItem,
): SelectedItem[] {
  const isCurrentlySelected = currentSelection.some(
    (s) => s.itemId === item.itemId && s.elementKey === item.elementKey,
  );

  if (isCurrentlySelected) {
    return currentSelection;
  }

  return [...currentSelection, item];
}

/**
 * Remove item from selection
 */
export function computeRemoveSelection(
  currentSelection: SelectedItem[],
  itemId: string,
  elementKey?: string,
): SelectedItem[] {
  return currentSelection.filter((s) => {
    if (elementKey) {
      return !(s.itemId === itemId && s.elementKey === elementKey);
    }
    return s.itemId !== itemId;
  });
}

/**
 * Replace entire selection with new items
 */
export function computeReplaceSelection(
  _currentSelection: SelectedItem[],
  newItems: SelectedItem[],
): SelectedItem[] {
  return [...newItems];
}

/**
 * Check if an item is in selection
 */
export function isItemSelected(
  selection: SelectedItem[],
  itemId: string,
  elementKey?: string,
): boolean {
  return selection.some((s) => {
    if (elementKey) {
      return s.itemId === itemId && s.elementKey === elementKey;
    }
    return s.itemId === itemId;
  });
}

/**
 * Get selection count by element key
 */
export function getSelectionCountByElement(
  selection: SelectedItem[],
  elementKey: string,
): number {
  return selection.filter((s) => s.elementKey === elementKey).length;
}

/**
 * Get all items for a specific element
 */
export function getSelectionForElement(
  selection: SelectedItem[],
  elementKey: string,
): SelectedItem[] {
  return selection.filter((s) => s.elementKey === elementKey);
}

/**
 * Compute multi-select with shift key
 * Returns items between last selected and current
 */
export function computeRangeSelection(
  allItems: SelectableItemData[],
  currentSelection: SelectedItem[],
  newItem: SelectableItemData,
  elementKey: string,
): SelectedItem[] {
  const itemsForElement = allItems.filter((i) => i.elementKey === elementKey);
  const lastSelected = currentSelection
    .filter((s) => s.elementKey === elementKey)
    .pop();

  if (!lastSelected) {
    return computeAddSelection(currentSelection, {
      itemId: newItem.itemId,
      elementKey: newItem.elementKey,
      data: newItem.data,
    });
  }

  const lastIndex = itemsForElement.findIndex(
    (i) => i.itemId === lastSelected.itemId,
  );
  const newIndex = itemsForElement.findIndex(
    (i) => i.itemId === newItem.itemId,
  );

  if (lastIndex === -1 || newIndex === -1) {
    return computeAddSelection(currentSelection, {
      itemId: newItem.itemId,
      elementKey: newItem.elementKey,
      data: newItem.data,
    });
  }

  const start = Math.min(lastIndex, newIndex);
  const end = Math.max(lastIndex, newIndex);

  const rangeItems = itemsForElement.slice(start, end + 1).map((item) => ({
    itemId: item.itemId,
    elementKey: item.elementKey,
    data: item.data,
  }));

  // Merge with existing selection, avoiding duplicates
  const merged = [...currentSelection];
  for (const item of rangeItems) {
    if (!isItemSelected(merged, item.itemId, item.elementKey)) {
      merged.push(item);
    }
  }

  return merged;
}

/**
 * Generate summary text for selected items
 */
export function generateSelectionSummary(selection: SelectedItem[]): string {
  if (selection.length === 0) {
    return "No items selected";
  }

  if (selection.length === 1) {
    const item = selection[0]!;
    return `1 item selected (${item.elementKey})`;
  }

  // Group by element key
  const groups = new Map<string, number>();
  for (const item of selection) {
    groups.set(item.elementKey, (groups.get(item.elementKey) || 0) + 1);
  }

  const parts = Array.from(groups.entries()).map(
    ([key, count]) => `${count} from ${key}`,
  );

  return `${selection.length} items selected: ${parts.join(", ")}`;
}

/**
 * Export selection as AI-friendly format
 */
export function exportSelectionForAI(selection: SelectedItem[]): {
  summary: string;
  items: Array<{
    type: string;
    id: string;
    elementKey: string;
    data?: unknown;
  }>;
} {
  return {
    summary: generateSelectionSummary(selection),
    items: selection.map((item) => ({
      type: "selected-item",
      id: item.itemId,
      elementKey: item.elementKey,
      data: item.data,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Deep Selection Use Cases
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate summary text for deep selections
 */
export function generateDeepSelectionSummary(
  selections: DeepSelectionData[],
): string {
  if (selections.length === 0) {
    return "No elements selected";
  }

  if (selections.length === 1) {
    const sel = selections[0]!;
    const preview =
      sel.textContent.length > 30
        ? sel.textContent.slice(0, 30) + "..."
        : sel.textContent;
    return `1 ${sel.tagName} selected: "${preview}"`;
  }

  // Group by element key
  const groups = new Map<string, number>();
  for (const sel of selections) {
    groups.set(sel.elementKey, (groups.get(sel.elementKey) || 0) + 1);
  }

  const parts = Array.from(groups.entries()).map(
    ([key, count]) => `${count} from ${key}`,
  );

  return `${selections.length} elements selected: ${parts.join(", ")}`;
}

/**
 * Export deep selections for AI context
 */
export function exportDeepSelectionForAI(selections: DeepSelectionData[]): {
  summary: string;
  selections: Array<{
    type: string;
    elementKey: string;
    cssPath: string;
    tagName: string;
    textContent: string;
    itemId?: string;
  }>;
} {
  return {
    summary: generateDeepSelectionSummary(selections),
    selections: selections.map((sel) => ({
      type: sel.selectionType,
      elementKey: sel.elementKey,
      cssPath: sel.cssPath,
      tagName: sel.tagName,
      textContent: sel.textContent,
      itemId: sel.itemId,
    })),
  };
}

/**
 * Export deep selections as plain text (for clipboard)
 */
export function exportDeepSelectionAsText(
  selections: DeepSelectionData[],
): string {
  if (selections.length === 0) return "";

  return selections.map((sel) => sel.textContent).join("\n");
}

/**
 * Export deep selections as JSON
 */
export function exportDeepSelectionAsJSON(
  selections: DeepSelectionData[],
): string {
  return JSON.stringify(
    selections.map((sel) => ({
      elementKey: sel.elementKey,
      cssPath: sel.cssPath,
      tagName: sel.tagName,
      textContent: sel.textContent,
      itemId: sel.itemId,
      selectionType: sel.selectionType,
    })),
    null,
    2,
  );
}

/**
 * Check if a CSS path is selected for an element
 */
export function isDeepSelectionSelected(
  selections: DeepSelectionData[],
  elementKey: string,
  cssPath: string,
): boolean {
  return selections.some(
    (s) => s.elementKey === elementKey && s.cssPath === cssPath,
  );
}

/**
 * Get deep selections grouped by element key
 */
export function groupDeepSelectionsByElement(
  selections: DeepSelectionData[],
): Map<string, DeepSelectionData[]> {
  const groups = new Map<string, DeepSelectionData[]>();

  for (const sel of selections) {
    const existing = groups.get(sel.elementKey) || [];
    existing.push(sel);
    groups.set(sel.elementKey, existing);
  }

  return groups;
}
