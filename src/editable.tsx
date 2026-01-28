"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react";
import { cn } from "./utils";

/**
 * EditableContext state management for inline editing
 */
interface EditableContextValue {
  /** Currently editing path (e.g., "elements/card-1/props/title") */
  editingPath: string | null;
  /** Current value being edited */
  editingValue: unknown;
  /** Start editing a field */
  startEdit: (path: string, currentValue: unknown) => void;
  /** Commit the edit with new value */
  commitEdit: (path: string, newValue: unknown) => void;
  /** Cancel editing */
  cancelEdit: () => void;
  /** Callback when a value is changed */
  onValueChange?: (path: string, newValue: unknown) => void;
}

const EditableContext = createContext<EditableContextValue | null>(null);

/**
 * Provider for editable content management
 */
export function EditableProvider({
  children,
  onValueChange,
}: {
  children: ReactNode;
  onValueChange?: (path: string, newValue: unknown) => void;
}) {
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<unknown>(null);

  const startEdit = useCallback((path: string, currentValue: unknown) => {
    setEditingPath(path);
    setEditingValue(currentValue);
  }, []);

  const commitEdit = useCallback(
    (path: string, newValue: unknown) => {
      onValueChange?.(path, newValue);
      setEditingPath(null);
      setEditingValue(null);
    },
    [onValueChange],
  );

  const cancelEdit = useCallback(() => {
    setEditingPath(null);
    setEditingValue(null);
  }, []);

  return (
    <EditableContext.Provider
      value={{
        editingPath,
        editingValue,
        startEdit,
        commitEdit,
        cancelEdit,
        onValueChange,
      }}
    >
      {children}
    </EditableContext.Provider>
  );
}

/**
 * Hook to access editable context
 */
export function useEditableContext() {
  return useContext(EditableContext);
}

/**
 * Props returned by useEditable hook
 */
export interface EditableProps {
  /** Whether this field is currently being edited */
  isEditing: boolean;
  /** Current value (editing value if editing, otherwise original) */
  value: unknown;
  /** Trigger edit mode */
  onStartEdit: () => void;
  /** Commit the current edit */
  onCommit: (newValue: unknown) => void;
  /** Cancel the current edit */
  onCancel: () => void;
  /** Style hint for editable elements */
  editableClassName: string;
}

/**
 * Hook for making content editable
 *
 * @param path - Unique path to this editable value (e.g., "elements/card-1/props/title")
 * @param currentValue - Current value to display
 * @param locked - If true, editing is disabled
 * @returns Props and handlers for editable content
 */
export function useEditable(
  path: string,
  currentValue: unknown,
  locked = false,
): EditableProps {
  const ctx = useEditableContext();

  const isEditing = ctx?.editingPath === path;
  const value = isEditing ? ctx?.editingValue : currentValue;

  const onStartEdit = useCallback(() => {
    if (locked || !ctx) return;
    ctx.startEdit(path, currentValue);
  }, [ctx, path, currentValue, locked]);

  const onCommit = useCallback(
    (newValue: unknown) => {
      if (!ctx) return;
      ctx.commitEdit(path, newValue);
    },
    [ctx, path],
  );

  const onCancel = useCallback(() => {
    ctx?.cancelEdit();
  }, [ctx]);

  const editableClassName = locked
    ? ""
    : "cursor-text rounded transition-[background-color,box-shadow] duration-150 hover:bg-black/5";

  return {
    isEditing,
    value,
    onStartEdit,
    onCommit,
    onCancel,
    editableClassName,
  };
}

/**
 * Generic editable text component
 */
export function EditableText({
  path,
  value,
  locked = false,
  as: Component = "span",
  className,
}: {
  path: string;
  value: string;
  locked?: boolean;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
  className?: string;
}) {
  const { isEditing, onStartEdit, onCommit, onCancel, editableClassName } =
    useEditable(path, value, locked);
  const [localValue, setLocalValue] = useState(value);

  // Sync local value when not editing
  React.useEffect(() => {
    if (!isEditing) {
      setLocalValue(value);
    }
  }, [value, isEditing]);

  if (isEditing) {
    return (
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => onCommit(localValue)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onCommit(localValue);
          }
          if (e.key === "Escape") {
            onCancel();
          }
        }}
        autoFocus
        className={cn(
          "w-full box-border -m-0.5 rounded px-1.5 py-0.5 font-inherit text-inherit outline-none",
          "bg-background text-foreground border border-border",
          className,
        )}
      />
    );
  }

  return (
    <Component
      className={cn(editableClassName, className)}
      onDoubleClick={onStartEdit}
      title={locked ? undefined : "Double-click to edit"}
    >
      {value}
    </Component>
  );
}

/**
 * Editable number component
 */
export function EditableNumber({
  path,
  value,
  locked = false,
  className,
}: {
  path: string;
  value: number;
  locked?: boolean;
  className?: string;
}) {
  const { isEditing, onStartEdit, onCommit, onCancel, editableClassName } =
    useEditable(path, value, locked);
  const [localValue, setLocalValue] = useState(String(value));

  // Sync local value when not editing
  React.useEffect(() => {
    if (!isEditing) {
      setLocalValue(String(value));
    }
  }, [value, isEditing]);

  if (isEditing) {
    return (
      <input
        type="number"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => onCommit(parseFloat(localValue) || 0)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onCommit(parseFloat(localValue) || 0);
          }
          if (e.key === "Escape") {
            onCancel();
          }
        }}
        autoFocus
        className={cn(
          "w-20 box-border -m-0.5 rounded px-1.5 py-0.5 font-inherit text-inherit outline-none",
          "bg-background text-foreground border border-border",
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(editableClassName, className)}
      onDoubleClick={onStartEdit}
      title={locked ? undefined : "Double-click to edit"}
    >
      {value}
    </span>
  );
}
