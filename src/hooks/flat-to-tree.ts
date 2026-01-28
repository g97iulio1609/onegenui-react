import type { UITree, UIElement } from "@onegenui/core";
import type { FlatElement } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// flatToTree
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a flat element list to a UITree
 */
export function flatToTree(elements: FlatElement[]): UITree {
  const elementMap: Record<string, UIElement> = {};
  let root = "";

  // First pass: add all elements to map
  for (const element of elements) {
    elementMap[element.key] = {
      key: element.key,
      type: element.type,
      props: element.props,
      children: [],
      visible: element.visible,
      parentKey: element.parentKey,
    };
  }

  // Second pass: build parent-child relationships
  for (const element of elements) {
    if (element.parentKey) {
      const parent = elementMap[element.parentKey];
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(element.key);
      }
    } else {
      root = element.key;
    }
  }

  return { root, elements: elementMap };
}
