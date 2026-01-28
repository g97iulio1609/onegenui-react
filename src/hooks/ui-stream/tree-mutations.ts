import type { UITree } from "@onegenui/core";
import { removeNodeFromTree } from "../patch-utils";

/**
 * Array prop names commonly used for sub-items
 */
const ARRAY_PROP_NAMES = [
  "items",
  "rows",
  "entries",
  "cards",
  "events",
  "steps",
  "tasks",
  "options",
  "data",
  "children",
  "nodes",
  "sections",
  "flights",
  "exercises",
  "meals",
  "messages",
  "emails",
  "columns",
];

/**
 * Remove an element from the tree by key
 */
export function removeElementFromTree(tree: UITree, key: string): UITree {
  const newTree = JSON.parse(JSON.stringify(tree));
  removeNodeFromTree(newTree, key);
  return newTree;
}

/**
 * Find array indices from mixed identifiers (numbers or string IDs)
 */
function findIndicesFromIdentifiers(
  prop: unknown[],
  identifiers: (number | string)[],
): number[] {
  const indices: number[] = [];

  for (const id of identifiers) {
    if (typeof id === "number") {
      if (id >= 0 && id < prop.length) {
        indices.push(id);
      }
    } else {
      // String ID - try exact match on id/key
      let idx = prop.findIndex(
        (item: unknown) =>
          (item as Record<string, unknown>)?.id === id ||
          (item as Record<string, unknown>)?.key === id,
      );

      // Try item-{depth}-{index} format
      if (idx === -1) {
        const depthMatch = id.match(/^item-(\d+)-(\d+)$/);
        if (depthMatch?.[2]) {
          const parsedIndex = parseInt(depthMatch[2], 10);
          if (parsedIndex >= 0 && parsedIndex < prop.length) {
            idx = parsedIndex;
          }
        }
      }

      // Try simpler {prefix}-{index} format
      if (idx === -1) {
        const simpleMatch = id.match(/^[a-z]+-(\d+)$/i);
        if (simpleMatch?.[1]) {
          const parsedIndex = parseInt(simpleMatch[1], 10);
          if (parsedIndex >= 0 && parsedIndex < prop.length) {
            idx = parsedIndex;
          }
        }
      }

      if (idx !== -1) {
        indices.push(idx);
      }
    }
  }

  return indices;
}

/**
 * Remove sub-items from an element's array prop
 */
export function removeSubItemsFromTree(
  tree: UITree,
  elementKey: string,
  identifiers: (number | string)[],
): UITree {
  if (identifiers.length === 0) return tree;

  const element = tree.elements[elementKey];
  if (!element) return tree;

  const newTree = JSON.parse(JSON.stringify(tree));
  const newElement = newTree.elements[elementKey];

  for (const propName of ARRAY_PROP_NAMES) {
    const prop = newElement.props?.[propName];
    if (Array.isArray(prop) && prop.length > 0) {
      const indicesToRemove = findIndicesFromIdentifiers(prop, identifiers);

      // Sort descending to remove from end first
      const uniqueSorted = [...new Set(indicesToRemove)].sort((a, b) => b - a);

      for (const idx of uniqueSorted) {
        if (idx >= 0 && idx < prop.length) {
          prop.splice(idx, 1);
        }
      }
      break;
    }
  }

  return newTree;
}

/**
 * Update element props in the tree
 */
export function updateElementInTree(
  tree: UITree,
  elementKey: string,
  updates: Record<string, unknown>,
): UITree {
  const newTree = JSON.parse(JSON.stringify(tree));
  const element = newTree.elements[elementKey];
  if (element) {
    element.props = { ...element.props, ...updates };
  }
  return newTree;
}

/**
 * Layout update options
 */
export interface LayoutUpdates {
  width?: number;
  height?: number;
  column?: number;
  row?: number;
  columnSpan?: number;
  rowSpan?: number;
  resizable?: boolean;
}

/**
 * Update element layout in the tree
 */
export function updateElementLayoutInTree(
  tree: UITree,
  elementKey: string,
  layoutUpdates: LayoutUpdates,
): UITree {
  const element = tree.elements[elementKey];
  if (!element) return tree;

  const newTree = JSON.parse(JSON.stringify(tree));
  const newElement = newTree.elements[elementKey];

  if (!newElement.layout) {
    newElement.layout = {};
  }

  // Update size
  if (layoutUpdates.width !== undefined || layoutUpdates.height !== undefined) {
    if (!newElement.layout.size) {
      newElement.layout.size = {};
    }
    if (layoutUpdates.width !== undefined) {
      newElement.layout.size.width = layoutUpdates.width;
    }
    if (layoutUpdates.height !== undefined) {
      newElement.layout.size.height = layoutUpdates.height;
    }
  }

  // Update grid
  if (
    layoutUpdates.column !== undefined ||
    layoutUpdates.row !== undefined ||
    layoutUpdates.columnSpan !== undefined ||
    layoutUpdates.rowSpan !== undefined
  ) {
    if (!newElement.layout.grid) {
      newElement.layout.grid = {};
    }
    if (layoutUpdates.column !== undefined) {
      newElement.layout.grid.column = layoutUpdates.column;
    }
    if (layoutUpdates.row !== undefined) {
      newElement.layout.grid.row = layoutUpdates.row;
    }
    if (layoutUpdates.columnSpan !== undefined) {
      newElement.layout.grid.columnSpan = layoutUpdates.columnSpan;
    }
    if (layoutUpdates.rowSpan !== undefined) {
      newElement.layout.grid.rowSpan = layoutUpdates.rowSpan;
    }
  }

  // Update resizable
  if (layoutUpdates.resizable !== undefined) {
    newElement.layout.resizable = layoutUpdates.resizable;
  }

  return newTree;
}
