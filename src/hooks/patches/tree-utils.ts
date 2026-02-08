/**
 * UITree manipulation utilities
 */

import type { UITree, UIElement } from "@onegenui/core";

/**
 * Remove a node and its descendants from the tree
 */
export function removeNodeFromTree(tree: UITree, key: string): void {
  const element = tree.elements[key];
  if (!element) return;

  // Remove from parent
  if (element.parentKey) {
    const parent = tree.elements[element.parentKey];
    if (parent && Array.isArray(parent.children)) {
      parent.children = parent.children.filter((k) => k !== key);
    }
  } else if (tree.root === key) {
    tree.root = "";
  }

  // Recursive removal using stack (avoids deep recursion)
  const stack = [key];
  while (stack.length > 0) {
    const currentKey = stack.pop()!;
    const current = tree.elements[currentKey];
    delete tree.elements[currentKey];

    if (current && Array.isArray(current.children)) {
      stack.push(...current.children);
    }
  }
}

/**
 * Ensure all children references have corresponding elements in the tree.
 * Creates placeholder elements for any missing children.
 */
export function ensureChildrenExist(
  elements: Record<string, UIElement>,
  children: string[] | undefined,
  createPlaceholder: (key: string, turnId?: string) => UIElement,
  turnId?: string,
): void {
  if (!children) return;
  for (const childKey of children) {
    if (!elements[childKey]) {
      elements[childKey] = createPlaceholder(childKey, turnId);
    }
  }
}

/**
 * Get the root element from a tree
 */
export function getRootElement(tree: UITree): UIElement | null {
  if (!tree.root) return null;
  return tree.elements[tree.root] || null;
}

/**
 * Get all descendant keys of an element
 */
export function getDescendantKeys(tree: UITree, key: string): string[] {
  const result: string[] = [];
  const stack = [key];

  while (stack.length > 0) {
    const currentKey = stack.pop()!;
    const element = tree.elements[currentKey];

    if (element && currentKey !== key) {
      result.push(currentKey);
    }

    if (element && Array.isArray(element.children)) {
      stack.push(...element.children);
    }
  }

  return result;
}
