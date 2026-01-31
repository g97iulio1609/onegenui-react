/**
 * Edit Mode Context
 *
 * Provides global edit mode state for inline editing of UI components.
 * When edit mode is enabled, text props become editable via contentEditable.
 *
 * Features:
 * - Auto-save with debounce
 * - Undo/Redo support
 * - Change history tracking
 * - Keyboard shortcuts (Escape to cancel)
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SinglePropChange {
  elementKey: string;
  propName: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface ElementChange {
  key: string;
  props: Record<string, unknown>;
  /** Previous values before the change (for undo) */
  previousProps?: Record<string, unknown>;
  /** Timestamp of the change */
  timestamp: number;
}

export interface ChangeHistoryItem {
  changes: SinglePropChange[];
  timestamp: number;
}

export interface EditModeContextValue {
  /** Whether edit mode is active */
  isEditing: boolean;
  /** Enable edit mode */
  enableEditing: () => void;
  /** Disable edit mode */
  disableEditing: () => void;
  /** Toggle edit mode */
  toggleEditing: () => void;
  /** Currently focused element key (for highlighting) */
  focusedKey: string | null;
  /** Set focused element */
  setFocusedKey: (key: string | null) => void;
  /** Track pending changes before commit */
  pendingChanges: Map<string, Record<string, unknown>>;
  /** Record a pending change */
  recordChange: (
    elementKey: string,
    propName: string,
    newValue: unknown,
    previousValue?: unknown,
  ) => void;
  /** Commit all pending changes (or auto-committed) */
  commitChanges: () => void;
  /** Discard all pending changes */
  discardChanges: () => void;
  /** Undo last change */
  undo: () => void;
  /** Redo last undone change */
  redo: () => void;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Change history for diff view */
  history: ChangeHistoryItem[];
  /** Number of pending changes */
  pendingCount: number;
  /** Callback when changes are committed */
  onCommit?: (changes: Array<ElementChange>) => void;
}

export interface EditModeProviderProps {
  children: ReactNode;
  /** Initial edit mode state */
  initialEditing?: boolean;
  /** Callback when changes are committed */
  onCommit?: (changes: Array<ElementChange>) => void;
  /** Auto-save delay in ms (0 to disable, default 1500) */
  autoSaveDelay?: number;
  /** Max history items to keep */
  maxHistoryItems?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const EditModeContext = createContext<EditModeContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function EditModeProvider({
  children,
  initialEditing = false,
  onCommit,
  autoSaveDelay = 1500,
  maxHistoryItems = 50,
}: EditModeProviderProps) {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<
    Map<string, Record<string, unknown>>
  >(new Map());
  const [previousValues, setPreviousValues] = useState<
    Map<string, Record<string, unknown>>
  >(new Map());

  // History for undo/redo
  const [history, setHistory] = useState<ChangeHistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Auto-save debounce timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const enableEditing = useCallback(() => setIsEditing(true), []);

  const disableEditing = useCallback(() => {
    setIsEditing(false);
    setFocusedKey(null);
    // Commit any pending changes when disabling
    if (pendingChanges.size > 0) {
      // This will be handled by commitChanges
    }
  }, [pendingChanges.size]);

  const toggleEditing = useCallback(() => setIsEditing((prev) => !prev), []);

  const recordChange = useCallback(
    (
      elementKey: string,
      propName: string,
      newValue: unknown,
      previousValue?: unknown,
    ) => {
      setPendingChanges((prev) => {
        const next = new Map(prev);
        const existing = next.get(elementKey) || {};
        next.set(elementKey, { ...existing, [propName]: newValue });
        return next;
      });

      // Track previous value for undo
      if (previousValue !== undefined) {
        setPreviousValues((prev) => {
          const next = new Map(prev);
          const existing = next.get(elementKey) || {};
          // Only store the first previous value (before any edits in this session)
          if (!(propName in existing)) {
            next.set(elementKey, { ...existing, [propName]: previousValue });
          }
          return next;
        });
      }

      // Reset auto-save timer
      if (autoSaveDelay > 0) {
        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current);
        }
        autoSaveTimerRef.current = setTimeout(() => {
          // Auto-commit will be triggered here
          commitChangesRef.current?.();
        }, autoSaveDelay);
      }
    },
    [autoSaveDelay],
  );

  // Use ref for commitChanges to avoid circular dependency
  const commitChangesRef = useRef<(() => void) | undefined>(undefined);

  const commitChanges = useCallback(() => {
    if (pendingChanges.size === 0) return;

    const propChanges: SinglePropChange[] = [];
    const elementChanges: ElementChange[] = [];
    const now = Date.now();

    pendingChanges.forEach((props, key) => {
      const prevProps = previousValues.get(key) || {};
      
      // Convert to individual prop changes for history display
      for (const [propName, newValue] of Object.entries(props)) {
        propChanges.push({
          elementKey: key,
          propName,
          oldValue: prevProps[propName],
          newValue,
        });
      }
      
      // Keep element changes for onCommit callback
      elementChanges.push({
        key,
        props,
        previousProps: prevProps,
        timestamp: now,
      });
    });

    // Add to history with SinglePropChange format
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ changes: propChanges, timestamp: now });
      // Limit history size
      if (newHistory.length > maxHistoryItems) {
        return newHistory.slice(-maxHistoryItems);
      }
      return newHistory;
    });
    setHistoryIndex((prev) => prev + 1);

    if (onCommit) {
      onCommit(elementChanges);
    }

    // Clear pending changes and previous values
    setPendingChanges(new Map());
    setPreviousValues(new Map());

    // Clear auto-save timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, [pendingChanges, previousValues, historyIndex, maxHistoryItems, onCommit]);

  // Keep ref updated
  commitChangesRef.current = commitChanges;

  const discardChanges = useCallback(() => {
    setPendingChanges(new Map());
    setPreviousValues(new Map());
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, []);

  const undo = useCallback(() => {
    if (historyIndex < 0) return;

    const item = history[historyIndex];
    if (!item) return;

    // Reconstruct ElementChange[] from SinglePropChange[] for onCommit
    const elementMap = new Map<string, { props: Record<string, unknown>; previousProps: Record<string, unknown> }>();
    
    for (const change of item.changes) {
      const existing = elementMap.get(change.elementKey) || { props: {}, previousProps: {} };
      // Undo: swap old/new - new becomes "what to restore", old becomes "what was there"
      existing.props[change.propName] = change.oldValue;
      existing.previousProps[change.propName] = change.newValue;
      elementMap.set(change.elementKey, existing);
    }

    const undoChanges: ElementChange[] = Array.from(elementMap.entries()).map(([key, data]) => ({
      key,
      props: data.props,
      previousProps: data.previousProps,
      timestamp: Date.now(),
    }));

    if (onCommit) {
      onCommit(undoChanges);
    }

    setHistoryIndex((prev) => prev - 1);
  }, [history, historyIndex, onCommit]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;

    const item = history[historyIndex + 1];
    if (!item) return;

    // Reconstruct ElementChange[] from SinglePropChange[] for onCommit
    const elementMap = new Map<string, { props: Record<string, unknown>; previousProps: Record<string, unknown> }>();
    
    for (const change of item.changes) {
      const existing = elementMap.get(change.elementKey) || { props: {}, previousProps: {} };
      // Redo: apply the new values again
      existing.props[change.propName] = change.newValue;
      existing.previousProps[change.propName] = change.oldValue;
      elementMap.set(change.elementKey, existing);
    }

    const redoChanges: ElementChange[] = Array.from(elementMap.entries()).map(([key, data]) => ({
      key,
      props: data.props,
      previousProps: data.previousProps,
      timestamp: Date.now(),
    }));

    if (onCommit) {
      onCommit(redoChanges);
    }

    setHistoryIndex((prev) => prev + 1);
  }, [history, historyIndex, onCommit]);

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;
  const pendingCount = pendingChanges.size;

  const value = useMemo(
    (): EditModeContextValue => ({
      isEditing,
      enableEditing,
      disableEditing,
      toggleEditing,
      focusedKey,
      setFocusedKey,
      pendingChanges,
      recordChange,
      commitChanges,
      discardChanges,
      undo,
      redo,
      canUndo,
      canRedo,
      history,
      pendingCount,
      onCommit,
    }),
    [
      isEditing,
      enableEditing,
      disableEditing,
      toggleEditing,
      focusedKey,
      setFocusedKey,
      pendingChanges,
      recordChange,
      commitChanges,
      discardChanges,
      undo,
      redo,
      canUndo,
      canRedo,
      history,
      pendingCount,
      onCommit,
    ],
  );

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useEditMode(): EditModeContextValue {
  const context = useContext(EditModeContext);
  if (!context) {
    // Return a no-op context when used outside provider
    return {
      isEditing: false,
      enableEditing: () => {},
      disableEditing: () => {},
      toggleEditing: () => {},
      focusedKey: null,
      setFocusedKey: () => {},
      pendingChanges: new Map(),
      recordChange: () => {},
      commitChanges: () => {},
      discardChanges: () => {},
      undo: () => {},
      redo: () => {},
      canUndo: false,
      canRedo: false,
      history: [],
      pendingCount: 0,
    };
  }
  return context;
}

/**
 * Hook to check if a specific element is being edited
 */
export function useIsElementEditing(elementKey: string): boolean {
  const { isEditing, focusedKey } = useEditMode();
  return isEditing && focusedKey === elementKey;
}

/**
 * Hook for element-specific edit functionality
 */
export function useElementEdit(elementKey: string) {
  const { isEditing, recordChange, focusedKey, setFocusedKey } = useEditMode();

  const handleChange = useCallback(
    (propName: string, newValue: unknown) => {
      recordChange(elementKey, propName, newValue);
    },
    [elementKey, recordChange],
  );

  const handleFocus = useCallback(() => {
    setFocusedKey(elementKey);
  }, [elementKey, setFocusedKey]);

  const handleBlur = useCallback(() => {
    // Only clear focus if this element is focused
    // (to prevent race conditions)
  }, []);

  return {
    isEditing,
    isFocused: focusedKey === elementKey,
    handleChange,
    handleFocus,
    handleBlur,
  };
}
