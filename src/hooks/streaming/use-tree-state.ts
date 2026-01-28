/**
 * useTreeState - UI Tree state management
 * Handles tree updates and validation
 */

import { useState, useCallback, useRef, useEffect } from "react";
import type { UITree } from "@onegenui/core";
import { removeNodeFromTree } from "../patch-utils";

export interface UseTreeStateReturn {
  /** Current tree state */
  tree: UITree | null;
  /** Set tree directly */
  setTree: (tree: UITree | null) => void;
  /** Get current tree (for use in callbacks) */
  getTree: () => UITree | null;
  /** Initialize or reset tree */
  initTree: () => UITree;
  /** Update tree with new reference (triggers re-render) */
  updateTree: (tree: UITree) => void;
  /** Remove an element from the tree */
  removeElement: (key: string) => void;
  /** Update an element's props */
  updateElementProps: (key: string, updates: Record<string, unknown>) => void;
  /** Update an element's layout */
  updateElementLayout: (key: string, layoutUpdates: LayoutUpdates) => void;
}

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
 * Hook for managing UI tree state
 */
export function useTreeState(): UseTreeStateReturn {
  const [tree, setTreeState] = useState<UITree | null>(null);
  const treeRef = useRef<UITree | null>(null);

  // Keep ref in sync
  useEffect(() => {
    treeRef.current = tree;
  }, [tree]);

  const setTree = useCallback((newTree: UITree | null) => {
    setTreeState(newTree);
    treeRef.current = newTree;
  }, []);

  const getTree = useCallback(() => {
    return treeRef.current;
  }, []);

  const initTree = useCallback(() => {
    const emptyTree: UITree = { root: "", elements: {} };
    if (!treeRef.current) {
      setTree(emptyTree);
    }
    return treeRef.current ?? emptyTree;
  }, [setTree]);

  const updateTree = useCallback((newTree: UITree) => {
    setTreeState({ ...newTree });
    treeRef.current = newTree;
  }, []);

  const removeElement = useCallback((key: string) => {
    setTreeState((prev) => {
      if (!prev) return null;
      const newTree = JSON.parse(JSON.stringify(prev));
      removeNodeFromTree(newTree, key);
      return newTree;
    });
  }, []);

  const updateElementProps = useCallback(
    (key: string, updates: Record<string, unknown>) => {
      setTreeState((prev) => {
        if (!prev) return null;
        const newTree = JSON.parse(JSON.stringify(prev));
        const element = newTree.elements[key];
        if (element) {
          element.props = { ...element.props, ...updates };
        }
        return newTree;
      });
    },
    [],
  );

  const updateElementLayout = useCallback(
    (key: string, layoutUpdates: LayoutUpdates) => {
      setTreeState((prev) => {
        if (!prev) return null;
        const newTree = JSON.parse(JSON.stringify(prev));
        const element = newTree.elements[key];
        if (!element) return prev;

        // Initialize layout if not present
        if (!element.layout) {
          element.layout = {};
        }

        // Update size if provided
        if (
          layoutUpdates.width !== undefined ||
          layoutUpdates.height !== undefined
        ) {
          if (!element.layout.size) {
            element.layout.size = {};
          }
          if (layoutUpdates.width !== undefined) {
            element.layout.size.width = layoutUpdates.width;
          }
          if (layoutUpdates.height !== undefined) {
            element.layout.size.height = layoutUpdates.height;
          }
        }

        // Update grid if provided
        if (
          layoutUpdates.column !== undefined ||
          layoutUpdates.row !== undefined ||
          layoutUpdates.columnSpan !== undefined ||
          layoutUpdates.rowSpan !== undefined
        ) {
          if (!element.layout.grid) {
            element.layout.grid = {};
          }
          if (layoutUpdates.column !== undefined) {
            element.layout.grid.column = layoutUpdates.column;
          }
          if (layoutUpdates.row !== undefined) {
            element.layout.grid.row = layoutUpdates.row;
          }
          if (layoutUpdates.columnSpan !== undefined) {
            element.layout.grid.columnSpan = layoutUpdates.columnSpan;
          }
          if (layoutUpdates.rowSpan !== undefined) {
            element.layout.grid.rowSpan = layoutUpdates.rowSpan;
          }
        }

        // Update resizable if provided
        if (layoutUpdates.resizable !== undefined) {
          element.layout.resizable = layoutUpdates.resizable;
        }

        return newTree;
      });
    },
    [],
  );

  return {
    tree,
    setTree,
    getTree,
    initTree,
    updateTree,
    removeElement,
    updateElementProps,
    updateElementLayout,
  };
}
