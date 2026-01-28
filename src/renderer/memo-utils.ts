/**
 * Element props equality comparator for memoization
 */

import type { ElementRendererProps } from "./types";

/**
 * Memoization comparator: structural sharing in patch-utils.ts means only
 * modified elements get new references. This enables O(1) equality checks
 * instead of deep comparison.
 */
export function elementRendererPropsAreEqual(
  prevProps: ElementRendererProps,
  nextProps: ElementRendererProps,
): boolean {
  // Element reference check (structural sharing)
  if (prevProps.element !== nextProps.element) {
    return false;
  }

  // Selection state change
  const wasSelected = prevProps.selectedKey === prevProps.element.key;
  const isSelected = nextProps.selectedKey === nextProps.element.key;
  if (wasSelected !== isSelected) {
    return false;
  }

  // Loading state change
  if (prevProps.loading !== nextProps.loading) {
    return false;
  }

  // Tree change - check if children have changed
  if (prevProps.tree !== nextProps.tree) {
    const children = prevProps.element.children;
    if (children) {
      for (const childKey of children) {
        if (
          prevProps.tree.elements[childKey] !==
          nextProps.tree.elements[childKey]
        ) {
          return false;
        }
      }
    }
  }

  return true;
}
