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
  type ReactNode,
  type MouseEvent,
} from "react";
import type { UIElement } from "@onegenui/core";
import { useEditMode } from "../../contexts/edit-mode";
import { useIsMobile } from "../../hooks";
import type { EditableWrapperProps } from "./types";
import { getEditableProps } from "./utils";
import { EditableTextNode } from "./EditableTextNode";

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

  const isElementEditable =
    forceEditable !== undefined ? forceEditable : element.editable !== false;

  if (!isEditing || !isElementEditable || element.locked) {
    return <>{children}</>;
  }

  const isFocused = focusedKey === element.key;

  const handleContainerClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      setFocusedKey(element.key);

      if (!isMobile) {
        setIsActiveEditing(true);
      }
    },
    [isMobile, element.key, setFocusedKey],
  );

  const handleDoubleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (isMobile) {
        setIsActiveEditing(true);
      }
    },
    [isMobile],
  );

  const handleBlur = useCallback(() => {
    setIsActiveEditing(false);
    if (containerRef.current) {
      const textContent = containerRef.current.textContent || "";
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsActiveEditing(false);
      containerRef.current?.blur();
    }
  }, []);

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
      {children}
    </div>
  );
});

/**
 * Process React children to find and replace text nodes with editable versions
 */
export function processChildForEditing(
  child: ReactNode,
  elementKey: string,
  editableProps: Array<{ key: string; value: string }>,
  isMobile: boolean,
  onTextChange?: (propName: string, newValue: string) => void,
): ReactNode {
  if (!React.isValidElement(child)) {
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

export { getEditableProps };
