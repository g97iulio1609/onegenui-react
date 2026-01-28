/**
 * useSelectionState - Selection state management with Zustand
 *
 * This hook bridges the Context API with Zustand for granular subscriptions.
 * The Zustand store is the single source of truth for serializable data.
 * DOM element references are computed on-demand via findElementByCssPath().
 */

import { useCallback, useMemo, useRef } from "react";
import {
  useStore,
  useDeepSelections,
  useDeepSelectionActive,
} from "../../store";
import type { DeepSelectionInfo, DeepSelectionInput } from "./types";

export interface UseSelectionStateReturn {
  /** All current deep selections (from Zustand store, with element computed) */
  deepSelections: DeepSelectionInfo[];
  /** Derived granular selection map (flat structure for component API) */
  granularSelection: Record<string, Set<string>>;
  /** Add a new selection (element is tracked in WeakMap, not stored) */
  addSelection: (selection: DeepSelectionInput) => void;
  /** Remove a selection by element reference */
  removeSelectionByElement: (
    element: HTMLElement,
  ) => DeepSelectionInfo | undefined;
  /** Toggle selection for an item (programmatic) */
  toggleSelection: (elementKey: string, itemId: string) => void;
  /** Clear selection for specific element or all */
  clearSelection: (elementKey?: string) => DeepSelectionInfo[];
  /** Check if item is selected */
  isSelected: (elementKey: string, itemId: string) => boolean;
  /** Get selected items for an element */
  getSelectedItems: (elementKey: string) => string[];
  /** Ref to track selected DOM elements (for visual feedback) */
  selectedElementsRef: React.RefObject<Set<HTMLElement>>;
  /** Flag indicating deep selection is active */
  deepSelectionActiveRef: React.RefObject<boolean>;
  /** Set deep selection active flag with auto-reset */
  setDeepSelectionActive: () => void;
}

// WeakMap to track element → cssPath mapping for removal
const elementToCssPath = new WeakMap<HTMLElement, string>();
const elementToElementKey = new WeakMap<HTMLElement, string>();

/**
 * Hook for managing selection state via Zustand store
 */
export function useSelectionState(): UseSelectionStateReturn {
  // Zustand selectors
  const storeSelections = useDeepSelections();
  const isDeepActive = useDeepSelectionActive();

  // Zustand actions
  const addDeepSelection = useStore((s) => s.addDeepSelection);
  const removeDeepSelectionByElement = useStore(
    (s) => s.removeDeepSelectionByElement,
  );
  const clearDeepSelections = useStore((s) => s.clearDeepSelections);
  const clearDeepSelectionsForElement = useStore(
    (s) => s.clearDeepSelectionsForElement,
  );
  const setDeepSelectionActiveStore = useStore((s) => s.setDeepSelectionActive);

  // Refs for DOM elements and active flag
  const selectedElementsRef = useRef<Set<HTMLElement>>(new Set());
  const deepSelectionActiveRef = useRef(false);

  // Sync ref with store
  deepSelectionActiveRef.current = isDeepActive;

  // Convert store selections to context format (add DOM element ref)
  const deepSelections = useMemo<DeepSelectionInfo[]>(() => {
    return storeSelections.map((sel) => ({
      ...sel,
      element: findElementByCssPath(sel.elementKey, sel.cssPath),
    }));
  }, [storeSelections]);

  // Derived state: granularSelection provides flat structure for component API
  const granularSelection = useMemo(() => {
    const result: Record<string, Set<string>> = {};
    for (const sel of storeSelections) {
      if (sel.itemId) {
        if (!result[sel.elementKey]) {
          result[sel.elementKey] = new Set();
        }
        result[sel.elementKey]!.add(sel.itemId);
      }
    }
    return result;
  }, [storeSelections]);

  const addSelection = useCallback(
    (selection: DeepSelectionInput) => {
      // Store element mapping for later removal (not in Zustand)
      if (selection.element) {
        elementToCssPath.set(selection.element, selection.cssPath);
        elementToElementKey.set(selection.element, selection.elementKey);
        selectedElementsRef.current.add(selection.element);
      }

      // Send only serializable data to the store
      addDeepSelection({
        elementKey: selection.elementKey,
        cssPath: selection.cssPath,
        tagName: selection.tagName,
        textContent: selection.textContent,
        itemId: selection.itemId,
        selectionType: selection.selectionType,
      });
    },
    [addDeepSelection],
  );

  const removeSelectionByElement = useCallback(
    (element: HTMLElement): DeepSelectionInfo | undefined => {
      const cssPath = elementToCssPath.get(element);
      const elementKey = elementToElementKey.get(element);

      if (!cssPath || !elementKey) return undefined;

      // Find the selection to return
      const removed = deepSelections.find(
        (s) => s.elementKey === elementKey && s.cssPath === cssPath,
      );

      // Remove from store
      removeDeepSelectionByElement(elementKey, cssPath);
      selectedElementsRef.current.delete(element);

      return removed;
    },
    [deepSelections, removeDeepSelectionByElement],
  );

  const toggleSelection = useCallback(
    (elementKey: string, itemId: string) => {
      const existing = storeSelections.find(
        (s) => s.elementKey === elementKey && s.itemId === itemId,
      );

      if (existing) {
        // Remove visual feedback
        const el = findElementByCssPath(elementKey, existing.cssPath);
        if (el) {
          el.classList.remove("jsonui-deep-selected", "jsonui-item-selected");
          el.removeAttribute("aria-selected");
          selectedElementsRef.current.delete(el);
        }
        removeDeepSelectionByElement(elementKey, existing.cssPath);
      } else {
        // Add - but we need the element to get cssPath
        // This is for programmatic toggle, cssPath will be empty
        addDeepSelection({
          elementKey,
          cssPath: "",
          tagName: "div",
          textContent: "",
          itemId,
          selectionType: "item",
        });
      }
    },
    [storeSelections, removeDeepSelectionByElement, addDeepSelection],
  );

  const clearSelection = useCallback(
    (elementKey?: string): DeepSelectionInfo[] => {
      // Get selections to return
      const removed = elementKey
        ? deepSelections.filter((s) => s.elementKey === elementKey)
        : deepSelections;

      // Clean up DOM references
      for (const sel of removed) {
        if (sel.element) {
          sel.element.classList.remove(
            "jsonui-deep-selected",
            "jsonui-item-selected",
          );
          sel.element.removeAttribute("aria-selected");
          selectedElementsRef.current.delete(sel.element);
        }
      }

      // Clear from store
      if (elementKey) {
        clearDeepSelectionsForElement(elementKey);
      } else {
        clearDeepSelections();
      }

      return removed;
    },
    [deepSelections, clearDeepSelections, clearDeepSelectionsForElement],
  );

  const isSelected = useCallback(
    (elementKey: string, itemId: string) => {
      return granularSelection[elementKey]?.has(itemId) ?? false;
    },
    [granularSelection],
  );

  const getSelectedItems = useCallback(
    (elementKey: string) => {
      return Array.from(granularSelection[elementKey] ?? []);
    },
    [granularSelection],
  );

  const setDeepSelectionActive = useCallback(() => {
    setDeepSelectionActiveStore(true);
  }, [setDeepSelectionActiveStore]);

  return {
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
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Find element by CSS path
// ─────────────────────────────────────────────────────────────────────────────

function findElementByCssPath(
  elementKey: string,
  cssPath: string,
): HTMLElement | null {
  if (typeof document === "undefined" || !cssPath) {
    return null;
  }

  const wrapper = document.querySelector(
    `[data-jsonui-element-key="${elementKey}"]`,
  );
  if (!wrapper) return null;

  try {
    const el = wrapper.querySelector(cssPath);
    return el as HTMLElement | null;
  } catch {
    return null;
  }
}
