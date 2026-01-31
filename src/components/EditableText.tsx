/**
 * EditableText Component
 *
 * A wrapper that makes text content editable when edit mode is active.
 * Uses contentEditable for inline editing.
 */

"use client";

import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  memo,
  type KeyboardEvent,
  type FocusEvent,
} from "react";
import { useElementEdit } from "../contexts/edit-mode";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface EditableTextProps {
  /** The element key for tracking changes */
  elementKey: string;
  /** The prop name being edited */
  propName: string;
  /** Current text value */
  value: string;
  /** Custom class name */
  className?: string;
  /** Tag to render (default: span) */
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Placeholder when empty */
  placeholder?: string;
  /** Disable editing for this specific text */
  disabled?: boolean;
  /** Allow multiline editing (uses div instead of span) */
  multiline?: boolean;
  /** Optional style override */
  style?: React.CSSProperties;
  /** Callback when value changes */
  onValueChange?: (newValue: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const EditableText = memo(function EditableText({
  elementKey,
  propName,
  value,
  className = "",
  as: Tag = "span",
  placeholder = "Click to edit...",
  disabled = false,
  multiline = false,
  style,
  onValueChange,
}: EditableTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [localValue, setLocalValue] = useState(value);
  const { isEditing, isFocused, handleChange, handleFocus } =
    useElementEdit(elementKey);

  // Sync local value with prop
  useEffect(() => {
    setLocalValue(value);
    if (ref.current && !isFocused) {
      ref.current.textContent = value || "";
    }
  }, [value, isFocused]);

  const handleInput = useCallback(() => {
    if (ref.current) {
      const newValue = ref.current.textContent || "";
      setLocalValue(newValue);
      handleChange(propName, newValue);
      onValueChange?.(newValue);
    }
  }, [handleChange, propName, onValueChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      // Prevent enter from creating new lines in single-line mode
      if (!multiline && e.key === "Enter") {
        e.preventDefault();
        ref.current?.blur();
      }
      // Allow escape to cancel editing
      if (e.key === "Escape") {
        if (ref.current) {
          ref.current.textContent = value;
          setLocalValue(value);
        }
        ref.current?.blur();
      }
    },
    [multiline, value],
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLElement>) => {
      // Ensure final value is recorded
      if (ref.current) {
        const finalValue = ref.current.textContent || "";
        if (finalValue !== value) {
          handleChange(propName, finalValue);
          onValueChange?.(finalValue);
        }
      }
    },
    [handleChange, propName, value, onValueChange],
  );

  const handleFocusEvent = useCallback(() => {
    handleFocus();
    // Select all text on focus for easier editing
    if (ref.current && document.activeElement === ref.current) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [handleFocus]);

  const canEdit = isEditing && !disabled;
  const isEmpty = !localValue || localValue.trim() === "";

  // Determine the tag to use
  const ActualTag = multiline ? "div" : Tag;

  return (
    <ActualTag
      ref={ref as React.RefObject<HTMLDivElement & HTMLSpanElement>}
      className={`editable-text ${className} ${canEdit ? "editable-text--active" : ""} ${isFocused ? "editable-text--focused" : ""} ${isEmpty ? "editable-text--empty" : ""}`}
      contentEditable={canEdit}
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onFocus={handleFocusEvent}
      onBlur={handleBlur}
      data-placeholder={placeholder}
      data-element-key={elementKey}
      data-prop-name={propName}
      style={{
        ...style,
        outline: canEdit ? undefined : "none",
        cursor: canEdit ? "text" : "inherit",
        minWidth: canEdit ? "1ch" : undefined,
      }}
    >
      {localValue || (canEdit ? "" : value)}
    </ActualTag>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// CSS (to be included in styles)
// ─────────────────────────────────────────────────────────────────────────────

export const editableTextStyles = `
.editable-text {
  position: relative;
  transition: background-color 0.15s, box-shadow 0.15s;
}

.editable-text--active {
  cursor: text;
}

.editable-text--active:hover {
  background-color: rgba(14, 165, 233, 0.05);
  border-radius: 4px;
}

.editable-text--focused {
  background-color: rgba(14, 165, 233, 0.1);
  border-radius: 4px;
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.3);
  outline: none;
}

.editable-text--empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  font-style: italic;
  pointer-events: none;
}
`;
