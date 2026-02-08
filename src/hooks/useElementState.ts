/**
 * useElementState — Framework hook for streaming-safe component state.
 *
 * Provides a React-like `[state, update]` tuple where:
 *
 * - **`state`** = tree props (always fresh from streaming patches)
 *   overlaid with user overrides stored in Zustand.
 * - **`update(partial)`** writes ONLY to the Zustand override layer,
 *   then debounce-syncs back to the UI tree for snapshot consistency.
 *
 * ### Why this works during streaming
 *
 * `componentState[key]` is populated exclusively by `updateState` calls
 * (user interactions). It is never pre-seeded with tree data.
 * Therefore every field in `componentState[key]` is — by construction —
 * a user override, and the spread `{ ...initialProps, ...overrides }`
 * always yields the correct merge without any dirty-field tracking.
 *
 * ### Data sent to AI
 *
 * At request time the full UI tree is sent alongside `componentState`.
 * The tree carries streaming-generated data; `componentState` carries
 * user modifications. The AI sees both, no duplication.
 *
 * @module hooks/useElementState
 */
import { useCallback, useEffect, useRef, useMemo } from "react";
import { loggers } from "@onegenui/utils";
import { useStore } from "../store";

const log = loggers.react;

export interface UseElementStateOptions {
  /** Auto-sync user overrides back to the UI tree (default: true) */
  syncToTree?: boolean;
  /** Debounce interval in ms for tree sync (default: 300) */
  debounceMs?: number;
}

/**
 * Manages per-element component state with automatic Zustand persistence
 * and debounced tree synchronisation.
 *
 * @param elementKey  Unique element identifier in the UI tree
 * @param initialProps  Current props from the tree (reactive to streaming patches)
 * @param options  Optional configuration
 * @returns `[mergedState, updateState]` tuple
 */
export function useElementState<T extends Record<string, unknown>>(
  elementKey: string,
  initialProps: T,
  options: UseElementStateOptions = {},
): [T, (updates: Partial<T>) => void] {
  const { syncToTree = true, debounceMs = 300 } = options;

  // Zustand selectors — stable references from the store
  const overrides = useStore((s) => s.componentState[elementKey]);
  const updateComponentState = useStore((s) => s.updateComponentState);
  const updateUITree = useStore((s) => s.updateUITree);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Merge ────────────────────────────────────────────────────────────────
  // Tree props as base, user overrides on top.
  // `overrides` is `undefined` until the first `updateState` call,
  // so during pure streaming the component sees tree data verbatim.
  const mergedState = useMemo<T>(
    () =>
      overrides
        ? ({ ...initialProps, ...(overrides as Partial<T>) } as T)
        : initialProps,
    [initialProps, overrides],
  );

  // ── Cleanup ──────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // ── Update ───────────────────────────────────────────────────────────────
  // Writes to Zustand immediately (reactive), then debounce-syncs to the
  // UI tree so that turn snapshots and subsequent AI requests include the
  // user's changes.
  const updateState = useCallback(
    (updates: Partial<T>) => {
      updateComponentState(elementKey, updates as Record<string, unknown>);

      if (syncToTree) {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
          log.debug("[useElementState] syncing to tree", { elementKey });
          updateUITree((tree) => {
            const el = tree.elements[elementKey];
            if (el) {
              return {
                ...tree,
                elements: {
                  ...tree.elements,
                  [elementKey]: {
                    ...el,
                    props: { ...el.props, ...updates },
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

  return [mergedState, updateState];
}
