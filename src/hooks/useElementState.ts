/**
 * useElementState - Hook for component state management via Zustand
 *
 * Replaces useState in domain components. State is automatically:
 * 1. Stored in Zustand (ComponentStateSlice)
 * 2. Synced to UI tree (optional, default: true)
 * 3. Sent to AI in API requests
 *
 * @example
 * ```tsx
 * function Workout({ element }: ComponentRenderProps) {
 *   const [state, updateState] = useElementState(element.key, {
 *     items: element.props.items,
 *   });
 *
 *   // state.items contains updated data
 *   // updateState({ items: newItems }) syncs automatically
 * }
 * ```
 *
 * @module hooks/useElementState
 */
import { useCallback, useEffect, useRef, useMemo } from "react";
import { loggers } from "@onegenui/utils";
import { useStore } from "../store";

const log = loggers.react;

export interface UseElementStateOptions {
  /** Auto-sync to UI tree (default: true) */
  syncToTree?: boolean;
  /** Debounce ms for tree sync (default: 300) */
  debounceMs?: number;
}

/**
 * Hook to manage component state via Zustand with automatic tree sync
 *
 * @param elementKey - Unique key of the element
 * @param initialProps - Initial props from tree
 * @param options - Configuration options
 * @returns Tuple of [mergedState, updateFunction]
 */
export function useElementState<T extends Record<string, unknown>>(
  elementKey: string,
  initialProps: T,
  options: UseElementStateOptions = {},
): [T, (updates: Partial<T>) => void] {
  const { syncToTree = true, debounceMs = 300 } = options;

  // Zustand selectors
  const componentState = useStore((s) => s.componentState[elementKey]);
  const updateComponentState = useStore((s) => s.updateComponentState);
  const updateUITree = useStore((s) => s.updateUITree);

  // Refs for debounce and mount check
  const mountedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Merge initialProps with componentState
  const mergedState = useMemo<T>(
    () => ({
      ...initialProps,
      ...((componentState ?? {}) as Partial<T>),
    }),
    [initialProps, componentState],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Update function
  const updateState = useCallback(
    (updates: Partial<T>) => {
      // Update Zustand immediately
      updateComponentState(elementKey, updates as Record<string, unknown>);

      // Sync to tree (debounced)
      if (syncToTree) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
          log.debug("[useElementState] Syncing to tree", { elementKey });
          updateUITree((tree) => {
            const element = tree.elements[elementKey];
            if (element) {
              return {
                ...tree,
                elements: {
                  ...tree.elements,
                  [elementKey]: {
                    ...element,
                    props: { ...element.props, ...updates },
                  },
                },
              };
            }
            return tree;
          });
          timerRef.current = null;
        }, debounceMs);
      }
    },
    [elementKey, updateComponentState, updateUITree, syncToTree, debounceMs],
  );

  // ALWAYS initialize componentState on mount with initialProps
  // This ensures proactive AI has access to complete component data
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      // Always set initial state - proactive AI needs this data
      if (Object.keys(initialProps).length > 0) {
        updateComponentState(
          elementKey,
          initialProps as Record<string, unknown>,
        );
      }
    }
  }, [elementKey, initialProps, updateComponentState]);

  return [mergedState, updateState];
}
