/**
 * useElementState - Hook for component state management via Zustand
 *
 * Replaces useState in domain components. State is automatically:
 * 1. Stored in Zustand (ComponentStateSlice)
 * 2. Synced to UI tree (optional, default: true)
 * 3. Sent to AI in API requests
 *
 * Merge strategy:
 * - `initialProps` (from tree) is always the base — reflects latest patches
 *   during streaming without stale overrides.
 * - Only fields explicitly modified by the user via `updateState` ("dirty
 *   fields") are read from `componentState` and applied on top, so user
 *   edits survive tree updates.
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

  // Refs
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track fields explicitly modified by user via updateState.
  // Only these fields are read from componentState; everything else
  // comes straight from initialProps (the tree), guaranteeing streaming
  // patches are never masked by a stale componentState snapshot.
  const dirtyFieldsRef = useRef<Set<string>>(new Set());

  // Merge: tree props as base, user-modified ("dirty") fields from
  // componentState layered on top.
  const mergedState = useMemo<T>(() => {
    const base = { ...initialProps };
    if (componentState) {
      for (const field of dirtyFieldsRef.current) {
        if (field in componentState) {
          (base as Record<string, unknown>)[field] = componentState[field];
        }
      }
    }
    return base as T;
    // componentState is in deps so the memo re-runs when updateState writes
    // to Zustand, even though we only read dirty fields from it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProps, componentState]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Update function — marks touched fields as dirty so they survive
  // future tree updates, writes to Zustand, and syncs to tree.
  const updateState = useCallback(
    (updates: Partial<T>) => {
      // Mark fields as user-modified
      for (const key of Object.keys(updates)) {
        dirtyFieldsRef.current.add(key);
      }

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

  // Keep componentState in sync for AI context (proactive AI reads this).
  // Writes non-dirty fields from initialProps so the AI always sees the
  // latest tree data; dirty fields are left untouched (already current
  // from updateState calls).
  useEffect(() => {
    if (Object.keys(initialProps).length === 0) return;

    const nonDirtyUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(initialProps)) {
      if (!dirtyFieldsRef.current.has(key)) {
        nonDirtyUpdates[key] = value;
      }
    }
    if (Object.keys(nonDirtyUpdates).length > 0) {
      updateComponentState(elementKey, nonDirtyUpdates);
    }
  }, [elementKey, initialProps, updateComponentState]);

  return [mergedState, updateState];
}
