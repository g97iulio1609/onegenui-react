/**
 * EditableTextNode - Handles individual text fields inline editing
 */

"use client";

import React, {
  memo,
  useCallback,
  useRef,
  useState,
  useEffect,
  type MouseEvent,
} from "react";
import { useEditMode } from "../../contexts/edit-mode";
import type { EditableTextNodeProps } from "./types";

export const EditableTextNode = memo(function EditableTextNode({
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

  const canEdit = isEditing && (isMobile ? focusedKey === elementKey : true);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!isEditing) return;

      e.stopPropagation();

      if (isMobile) {
        setFocusedKey(elementKey);
      } else {
        setIsActive(true);
        setFocusedKey(elementKey);
        setTimeout(() => {
          if (ref.current) {
            ref.current.focus();
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
