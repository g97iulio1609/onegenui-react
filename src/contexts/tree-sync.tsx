"use client";

/**
 * TreeSyncContext - Enables components to sync their local state back to the tree
 *
 * This is critical for AI context: when users modify data in components (e.g., workout sets),
 * those changes must be reflected in the tree so the AI receives current data.
 */

import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

/**
 * Function type for updating element props in the tree
 */
export type UpdateElementFn = (
  elementKey: string,
  updates: Record<string, unknown>,
) => void;

/**
 * Tree sync context value
 */
export interface TreeSyncContextValue {
  /** Update element props in the tree */
  updateElement: UpdateElementFn;
  /** Whether tree sync is enabled */
  isEnabled: boolean;
}

const TreeSyncContext = createContext<TreeSyncContextValue | null>(null);

/**
 * Props for TreeSyncProvider
 */
export interface TreeSyncProviderProps {
  /** Function to update element props (from useUIStream) */
  updateElement: UpdateElementFn;
  children: ReactNode;
}

/**
 * Provider that enables components to sync state back to the tree
 *
 * Wrap your Renderer with this provider to enable tree syncing.
 */
export function TreeSyncProvider({
  updateElement,
  children,
}: TreeSyncProviderProps) {
  const value: TreeSyncContextValue = {
    updateElement,
    isEnabled: true,
  };

  return (
    <TreeSyncContext.Provider value={value}>
      {children}
    </TreeSyncContext.Provider>
  );
}

/**
 * Hook to access tree sync context
 * Returns a no-op if not within a provider (graceful degradation)
 */
export function useTreeSyncContext(): TreeSyncContextValue {
  const ctx = useContext(TreeSyncContext);
  if (!ctx) {
    return {
      updateElement: () => {},
      isEnabled: false,
    };
  }
  return ctx;
}

const DEFAULT_DEBOUNCE_MS = 300;

/**
 * Hook to sync component state to the tree element props
 *
 * Use this in domain components to keep the tree in sync with local state.
 * This ensures the AI receives current data when making requests.
 *
 * @param elementKey - The element key to sync to
 * @param updates - Props to update on the element
 * @param options - Debounce options
 *
 * @example
 * ```tsx
 * function Workout({ element }: ComponentRenderProps) {
 *   const [items, setItems] = useState(element.props.items);
 *
 *   // Sync items back to tree whenever they change
 *   useTreeSync(element.key, { items });
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useTreeSync(
  elementKey: string,
  updates: Record<string, unknown>,
  options?: {
    /** Debounce delay in ms (default: 300) */
    debounceMs?: number;
    /** Skip initial sync on mount */
    skipMount?: boolean;
  },
) {
  const { updateElement, isEnabled } = useTreeSyncContext();
  const debounceMs = options?.debounceMs ?? DEFAULT_DEBOUNCE_MS;
  const skipMount = options?.skipMount ?? false;

  const mountedRef = useRef(false);
  const lastUpdatesRef = useRef<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Sync updates to tree with debounce
  useEffect(() => {
    if (!isEnabled || !elementKey) return;

    // Skip mount if requested
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (skipMount) return;
    }

    // Serialize for change detection
    const serialized = JSON.stringify(updates);
    if (serialized === lastUpdatesRef.current) return;
    lastUpdatesRef.current = serialized;

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Debounced update
    timerRef.current = setTimeout(() => {
      updateElement(elementKey, updates);
      timerRef.current = null;
    }, debounceMs);
  }, [elementKey, updates, isEnabled, updateElement, debounceMs, skipMount]);
}

/**
 * Hook to get a function for syncing specific props to tree
 *
 * Use this when you need more control over when syncing happens.
 *
 * @param elementKey - The element key to sync to
 * @returns A function to call with updates
 *
 * @example
 * ```tsx
 * function Workout({ element }: ComponentRenderProps) {
 *   const syncToTree = useTreeSyncCallback(element.key);
 *
 *   const handleSetChange = (setId: string, weight: number) => {
 *     // Update local state
 *     setItems(prev => updateSet(prev, setId, { weight }));
 *     // Sync to tree
 *     syncToTree({ items: newItems });
 *   };
 * }
 * ```
 */
export function useTreeSyncCallback(
  elementKey: string,
): (updates: Record<string, unknown>) => void {
  const { updateElement, isEnabled } = useTreeSyncContext();

  return useCallback(
    (updates: Record<string, unknown>) => {
      if (isEnabled && elementKey) {
        updateElement(elementKey, updates);
      }
    },
    [elementKey, updateElement, isEnabled],
  );
}
