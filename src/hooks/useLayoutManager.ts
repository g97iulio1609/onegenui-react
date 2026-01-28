"use client";

import { useCallback, useMemo } from "react";
import type { UITree, UIElement, ElementLayout } from "@onegenui/core";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface UseLayoutManagerOptions {
  /** Current UI tree */
  tree: UITree | null;
  /** Callback to update the tree */
  onTreeUpdate?: (updater: (tree: UITree) => UITree) => void;
  /** Callback when layout changes (for AI context) */
  onLayoutChange?: (elementKey: string, layout: ElementLayout) => void;
}

export interface UseLayoutManagerReturn {
  /** Update layout for an element */
  updateLayout: (elementKey: string, layout: Partial<ElementLayout>) => void;
  /** Update size for an element */
  updateSize: (elementKey: string, width: number, height: number) => void;
  /** Update grid position for an element */
  updateGridPosition: (
    elementKey: string,
    position: {
      column?: number;
      row?: number;
      columnSpan?: number;
      rowSpan?: number;
    },
  ) => void;
  /** Enable/disable resize for an element */
  setResizable: (elementKey: string, resizable: boolean) => void;
  /** Get layout for an element */
  getLayout: (elementKey: string) => ElementLayout | undefined;
  /** Get all elements with layout */
  getLayoutElements: () => Array<{ key: string; layout: ElementLayout }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook to manage element layouts within a UI tree.
 *
 * Provides functions to update element sizes, grid positions, and resize configs.
 * Changes are persisted back to the tree and optionally notified to the AI.
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { tree, setTree } = useUIStream(...);
 *   const { updateSize, updateGridPosition } = useLayoutManager({
 *     tree,
 *     onTreeUpdate: (updater) => setTree(updater(tree!)),
 *     onLayoutChange: (key, layout) => console.log(`${key} layout changed`, layout),
 *   });
 *
 *   return (
 *     <FreeGridCanvas>
 *       <ResizableWrapper
 *         element={element}
 *         onResize={(key, size) => updateSize(key, size.width, size.height)}
 *       >
 *         <Card>Content</Card>
 *       </ResizableWrapper>
 *     </FreeGridCanvas>
 *   );
 * }
 * ```
 */
export function useLayoutManager({
  tree,
  onTreeUpdate,
  onLayoutChange,
}: UseLayoutManagerOptions): UseLayoutManagerReturn {
  /**
   * Update layout for an element
   */
  const updateLayout = useCallback(
    (elementKey: string, layoutUpdate: Partial<ElementLayout>) => {
      if (!tree || !onTreeUpdate) return;

      onTreeUpdate((currentTree) => {
        const element = currentTree.elements[elementKey];
        if (!element) return currentTree;

        const currentLayout = element.layout ?? {};
        const newLayout: ElementLayout = {
          ...currentLayout,
          ...layoutUpdate,
          // Deep merge size and grid
          size: layoutUpdate.size
            ? { ...currentLayout.size, ...layoutUpdate.size }
            : currentLayout.size,
          grid: layoutUpdate.grid
            ? { ...currentLayout.grid, ...layoutUpdate.grid }
            : currentLayout.grid,
        };

        const updatedElement: UIElement = {
          ...element,
          layout: newLayout,
        };

        onLayoutChange?.(elementKey, newLayout);

        return {
          ...currentTree,
          elements: {
            ...currentTree.elements,
            [elementKey]: updatedElement,
          },
        };
      });
    },
    [tree, onTreeUpdate, onLayoutChange],
  );

  /**
   * Update size for an element
   */
  const updateSize = useCallback(
    (elementKey: string, width: number, height: number) => {
      updateLayout(elementKey, {
        size: { width, height },
      });
    },
    [updateLayout],
  );

  /**
   * Update grid position for an element
   */
  const updateGridPosition = useCallback(
    (
      elementKey: string,
      position: {
        column?: number;
        row?: number;
        columnSpan?: number;
        rowSpan?: number;
      },
    ) => {
      updateLayout(elementKey, {
        grid: position,
      });
    },
    [updateLayout],
  );

  /**
   * Enable/disable resize for an element
   */
  const setResizable = useCallback(
    (elementKey: string, resizable: boolean) => {
      updateLayout(elementKey, { resizable });
    },
    [updateLayout],
  );

  /**
   * Get layout for an element
   */
  const getLayout = useCallback(
    (elementKey: string): ElementLayout | undefined => {
      if (!tree) return undefined;
      return tree.elements[elementKey]?.layout;
    },
    [tree],
  );

  /**
   * Get all elements with layout
   */
  const getLayoutElements = useMemo(() => {
    return (): Array<{ key: string; layout: ElementLayout }> => {
      if (!tree) return [];

      return Object.entries(tree.elements)
        .filter(([, element]) => element.layout !== undefined)
        .map(([key, element]) => ({
          key,
          layout: element.layout!,
        }));
    };
  }, [tree]);

  return {
    updateLayout,
    updateSize,
    updateGridPosition,
    setResizable,
    getLayout,
    getLayoutElements,
  };
}
