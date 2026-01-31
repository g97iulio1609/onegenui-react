/**
 * EditableWrapper Component
 *
 * Intelligent wrapper that enables inline editing with platform-aware interaction:
 * - Desktop: Click anywhere on text to start editing immediately
 * - Mobile: First tap to select, second tap or explicit action to edit
 *
 * Works with UIElement.editable property from @onegenui/core
 */

"use client";

import React, {
  memo,
  useCallback,
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type MouseEvent,
  type TouchEvent,
} from "react";
import type { UIElement } from "@onegenui/core";
import { useEditMode } from "../contexts/edit-mode";
import { useIsMobile } from "../hooks";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface EditableWrapperProps {
  element: UIElement;
  children: ReactNode;
  /** Callback when text content changes */
  onTextChange?: (propName: string, newValue: string) => void;
  /** Force enable/disable editing regardless of element.editable */
  forceEditable?: boolean;
  /** Custom class name */
  className?: string;
}

interface EditableTextNodeProps {
  elementKey: string;
  propName: string;
  value: string;
  isMobile: boolean;
  onTextChange?: (propName: string, newValue: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// EditableTextNode - Handles individual text fields
// ─────────────────────────────────────────────────────────────────────────────

const EditableTextNode = memo(function EditableTextNode({
  elementKey,
  propName,
  value,
  isMobile,
  onTextChange,
}: EditableTextNodeProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { isEditing, recordChange, focusedKey, setFocusedKey } = useEditMode();
  const [localValue, setLocalValue] = useState(value);
  const [isActive, setIsActive] = useState(false);

  // On mobile, require explicit activation (selection first)
  // On desktop, activate on hover + click
  const canEdit = isEditing && (isMobile ? focusedKey === elementKey : true);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!isEditing) return;

      e.stopPropagation();

      if (isMobile) {
        // Mobile: set focus to this element (selection mode)
        setFocusedKey(elementKey);
      } else {
        // Desktop: start editing immediately
        setIsActive(true);
        setFocusedKey(elementKey);
        // Focus the element after render
        setTimeout(() => {
          if (ref.current) {
            ref.current.focus();
            // Select all text for easier editing
            const range = document.createRange();
            range.selectNodeContents(ref.current);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }, 0);
      }
    },
    [isEditing, isMobile, elementKey, setFocusedKey],
  );

  const handleDoubleClick = useCallback(
    (e: MouseEvent) => {
      if (!isEditing || !isMobile) return;

      e.stopPropagation();
      // Mobile: double tap starts editing
      setIsActive(true);
      setTimeout(() => {
        if (ref.current) {
          ref.current.focus();
        }
      }, 0);
    },
    [isEditing, isMobile],
  );

  const handleInput = useCallback(() => {
    if (ref.current) {
      const newValue = ref.current.textContent || "";
      setLocalValue(newValue);
      recordChange(elementKey, propName, newValue);
      onTextChange?.(propName, newValue);
    }
  }, [elementKey, propName, recordChange, onTextChange]);

  const handleBlur = useCallback(() => {
    setIsActive(false);
    // Keep focus key for mobile UX
    if (!isMobile) {
      setFocusedKey(null);
    }
  }, [isMobile, setFocusedKey]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setLocalValue(value);
        if (ref.current) {
          ref.current.textContent = value;
        }
        ref.current?.blur();
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        ref.current?.blur();
      }
    },
    [value],
  );

  const isFocused = focusedKey === elementKey;

  return (
    <span
      ref={ref}
      contentEditable={canEdit && isActive}
      suppressContentEditableWarning
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onInput={handleInput}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-editable={isEditing}
      data-active={isActive}
      data-focused={isFocused}
      data-prop={propName}
      className={`
        editable-text-node
        ${isEditing ? "editable-text-node--edit-mode" : ""}
        ${isActive ? "editable-text-node--active" : ""}
        ${isFocused ? "editable-text-node--focused" : ""}
      `}
      style={{
        cursor: isEditing ? "text" : "inherit",
        outline: "none",
        position: "relative",
        display: "inline",
        borderRadius: "2px",
        transition: "background-color 0.15s, box-shadow 0.15s",
      }}
    >
      {localValue}
    </span>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Text detection utilities
// ─────────────────────────────────────────────────────────────────────────────

const TEXT_PROP_NAMES = [
  "text",
  "title",
  "subtitle",
  "label",
  "description",
  "content",
  "heading",
  "caption",
  "placeholder",
  "value",
  "name",
  "message",
];

function isTextProp(key: string, value: unknown): boolean {
  if (typeof value !== "string") return false;
  if (value.length === 0) return false;
  // Check if key is a known text prop
  return TEXT_PROP_NAMES.some(
    (name) => key.toLowerCase().includes(name.toLowerCase()),
  );
}

function getEditableProps(
  element: UIElement,
): Array<{ key: string; value: string }> {
  const editable = element.editable;
  const props: Array<{ key: string; value: string }> = [];

  // If editable is explicitly false, return empty
  if (editable === false) return [];

  // If editable is not specified or true, auto-detect text props
  if (editable === undefined || editable === true) {
    for (const [key, value] of Object.entries(element.props || {})) {
      if (isTextProp(key, value)) {
        props.push({ key, value: value as string });
      }
    }
  } else if (Array.isArray(editable)) {
    // Only specified props are editable
    for (const propName of editable) {
      const value = element.props?.[propName];
      if (typeof value === "string") {
        props.push({ key: propName, value });
      }
    }
  }

  return props;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export const EditableWrapper = memo(function EditableWrapper({
  element,
  children,
  onTextChange,
  forceEditable,
  className = "",
}: EditableWrapperProps) {
  const isMobile = useIsMobile();
  const { isEditing, focusedKey, setFocusedKey, recordChange } = useEditMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActiveEditing, setIsActiveEditing] = useState(false);

  // Determine if this element is editable
  // Default: all elements are editable unless explicitly disabled
  const isElementEditable =
    forceEditable !== undefined ? forceEditable : element.editable !== false;

  // Don't wrap if not in edit mode or element is not editable
  if (!isEditing || !isElementEditable || element.locked) {
    return <>{children}</>;
  }

  const isFocused = focusedKey === element.key;

  // For mobile: show selection indicator
  const handleContainerClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      setFocusedKey(element.key);

      if (!isMobile) {
        // Desktop: start editing immediately
        setIsActiveEditing(true);
      }
    },
    [isMobile, element.key, setFocusedKey],
  );

  const handleDoubleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      // On mobile, double-click activates editing
      if (isMobile) {
        setIsActiveEditing(true);
      }
    },
    [isMobile],
  );

  const handleBlur = useCallback(() => {
    setIsActiveEditing(false);
    // Capture the text content and record as change
    if (containerRef.current) {
      const textContent = containerRef.current.textContent || "";
      // Try to determine which prop was edited (use "text" as default)
      const propName = element.props?.title
        ? "title"
        : element.props?.text
          ? "text"
          : element.props?.label
            ? "label"
            : element.props?.description
              ? "description"
              : "content";
      recordChange(element.key, propName, textContent);
      onTextChange?.(propName, textContent);
    }
  }, [element.key, element.props, recordChange, onTextChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsActiveEditing(false);
        containerRef.current?.blur();
      }
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      className={`editable-wrapper ${isFocused ? "editable-wrapper--focused" : ""} ${isActiveEditing ? "editable-wrapper--active" : ""} ${className}`}
      onClick={handleContainerClick}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      contentEditable={isActiveEditing}
      suppressContentEditableWarning
      data-element-key={element.key}
      data-editable="true"
      style={{
        position: "relative",
        outline: isActiveEditing ? "none" : undefined,
        cursor: isEditing ? "text" : undefined,
      }}
    >
      {/* Show edit indicator on mobile when focused but not editing */}
      {isMobile && isFocused && !isActiveEditing && (
        <div
          className="editable-indicator"
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(14, 165, 233, 0.3)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </div>
      )}

      {/* Render children normally - contentEditable on the wrapper handles editing */}
      {children}
    </div>
  );
});

/**
 * Process React children to find and replace text nodes with editable versions
 * This is a deep traversal that preserves the component tree structure
 */
function processChildForEditing(
  child: ReactNode,
  elementKey: string,
  editableProps: Array<{ key: string; value: string }>,
  isMobile: boolean,
  onTextChange?: (propName: string, newValue: string) => void,
): ReactNode {
  if (!React.isValidElement(child)) {
    // Check if this is a string that matches any editable prop
    if (typeof child === "string") {
      const matchingProp = editableProps.find((p) => p.value === child);
      if (matchingProp) {
        return (
          <EditableTextNode
            key={`${elementKey}-${matchingProp.key}`}
            elementKey={elementKey}
            propName={matchingProp.key}
            value={matchingProp.value}
            isMobile={isMobile}
            onTextChange={onTextChange}
          />
        );
      }
    }
    return child;
  }

  // Recurse into element children
  const childProps = child.props as Record<string, unknown>;
  const elementChildren = childProps.children;
  const restProps = { ...childProps };
  delete restProps.children;

  if (!elementChildren) {
    return child;
  }

  const processedChildren = React.Children.map(
    elementChildren as ReactNode,
    (grandchild) =>
      processChildForEditing(
        grandchild,
        elementKey,
        editableProps,
        isMobile,
        onTextChange,
      ),
  );

  return React.cloneElement(child, restProps, processedChildren);
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS Styles (to be included globally)
// ─────────────────────────────────────────────────────────────────────────────

export const editableWrapperStyles = `
/* Editable wrapper styles */
.editable-wrapper {
  transition: box-shadow 0.15s;
}

.editable-wrapper--focused {
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
  border-radius: 4px;
}

/* Editable text node styles */
.editable-text-node {
  border-radius: 2px;
}

.editable-text-node--edit-mode {
  cursor: text;
}

.editable-text-node--edit-mode:hover {
  background-color: rgba(14, 165, 233, 0.08);
}

.editable-text-node--focused {
  background-color: rgba(14, 165, 233, 0.1);
}

.editable-text-node--active {
  background-color: rgba(14, 165, 233, 0.15);
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.3);
}

.editable-text-node--active:focus {
  outline: none;
}

/* Edit mode indicator */
.editable-indicator {
  animation: pulse-edit 2s infinite;
}

@keyframes pulse-edit {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

/* Mobile-specific styles */
@media (pointer: coarse) {
  .editable-text-node--edit-mode {
    /* Larger touch target on mobile */
    padding: 2px 4px;
    margin: -2px -4px;
  }
}
`;
