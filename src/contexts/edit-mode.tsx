/**
 * Edit Mode Context
 *
 * Provides global edit mode state for inline editing of UI components.
 * When edit mode is enabled, text props become editable via contentEditable.
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

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
  ) => void;
  /** Commit all pending changes */
  commitChanges: () => void;
  /** Discard all pending changes */
  discardChanges: () => void;
  /** Callback when changes are committed */
  onCommit?: (changes: Array<ElementChange>) => void;
}

export interface ElementChange {
  key: string;
  props: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const EditModeContext = createContext<EditModeContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export interface EditModeProviderProps {
  children: ReactNode;
  /** Initial edit mode state */
  initialEditing?: boolean;
  /** Callback when changes are committed */
  onCommit?: (changes: Array<ElementChange>) => void;
}

export function EditModeProvider({
  children,
  initialEditing = false,
  onCommit,
}: EditModeProviderProps) {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<
    Map<string, Record<string, unknown>>
  >(new Map());

  const enableEditing = useCallback(() => setIsEditing(true), []);
  const disableEditing = useCallback(() => {
    setIsEditing(false);
    setFocusedKey(null);
  }, []);
  const toggleEditing = useCallback(() => setIsEditing((prev) => !prev), []);

  const recordChange = useCallback(
    (elementKey: string, propName: string, newValue: unknown) => {
      setPendingChanges((prev) => {
        const next = new Map(prev);
        const existing = next.get(elementKey) || {};
        next.set(elementKey, { ...existing, [propName]: newValue });
        return next;
      });
    },
    [],
  );

  const commitChanges = useCallback(() => {
    if (pendingChanges.size === 0) return;

    const changes: ElementChange[] = [];
    pendingChanges.forEach((props, key) => {
      changes.push({ key, props });
    });

    if (onCommit) {
      onCommit(changes);
    }

    setPendingChanges(new Map());
  }, [pendingChanges, onCommit]);

  const discardChanges = useCallback(() => {
    setPendingChanges(new Map());
  }, []);

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
