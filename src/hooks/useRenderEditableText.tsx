/**
 * useRenderEditableText hook
 *
 * Provides a render function for editable text props.
 * When edit mode is active, returns an editable span.
 * When not in edit mode, returns the text as-is.
 */

"use client";

import React, { useCallback, type ReactNode } from "react";
import type { UIElement } from "@onegenui/core";
import { useEditMode } from "../contexts/edit-mode";
import { useIsMobile } from "../hooks/useIsMobile";
import { EditableText } from "../components/EditableText";

export interface RenderEditableTextOptions {
  className?: string;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  multiline?: boolean;
  placeholder?: string;
}

export type RenderEditableTextFn = (
  propName: string,
  value: string | null | undefined,
  options?: RenderEditableTextOptions,
) => ReactNode;

/**
 * Hook that creates a renderEditableText function for a specific element.
 *
 * @param element - The UIElement to create the render function for
 * @returns A function to render editable text
 */
export function useRenderEditableText(
  element: UIElement,
): RenderEditableTextFn {
  const { isEditing } = useEditMode();
  const isMobile = useIsMobile();

  // Determine if this element can be edited
  const canEdit =
    isEditing && element.editable !== false && !element.locked;

  const renderEditableText = useCallback(
    (
      propName: string,
      value: string | null | undefined,
      options?: RenderEditableTextOptions,
    ): ReactNode => {
      // If no value, return null or placeholder
      if (value === null || value === undefined || value === "") {
        if (canEdit && options?.placeholder) {
          // Return editable placeholder in edit mode
          return (
            <EditableText
              elementKey={element.key}
              propName={propName}
              value=""
              placeholder={options.placeholder}
              as={options?.as}
              multiline={options?.multiline}
              className={options?.className}
            />
          );
        }
        return null;
      }

      // If not in edit mode, return plain text
      if (!canEdit) {
        const Tag = options?.as || "span";
        return (
          <Tag className={options?.className}>{value}</Tag>
        );
      }

      // In edit mode, return editable text
      return (
        <EditableText
          elementKey={element.key}
          propName={propName}
          value={value}
          placeholder={options?.placeholder}
          as={options?.as}
          multiline={options?.multiline}
          className={options?.className}
        />
      );
    },
    [canEdit, element.key],
  );

  return renderEditableText;
}

/**
 * Creates a renderEditableText function without hooks (for use in renderer)
 *
 * @param element - The UIElement
 * @param isEditing - Whether edit mode is active
 * @returns A function to render editable text
 */
export function createRenderEditableText(
  element: UIElement,
  isEditing: boolean,
): RenderEditableTextFn {
  const canEdit =
    isEditing && element.editable !== false && !element.locked;

  return (
    propName: string,
    value: string | null | undefined,
    options?: RenderEditableTextOptions,
  ): ReactNode => {
    if (value === null || value === undefined || value === "") {
      if (canEdit && options?.placeholder) {
        return React.createElement(EditableText, {
          elementKey: element.key,
          propName,
          value: "",
          placeholder: options.placeholder,
          as: options.as,
          multiline: options.multiline,
          className: options.className,
        });
      }
      return null;
    }

    if (!canEdit) {
      const Tag = options?.as || "span";
      return React.createElement(Tag, { className: options?.className }, value);
    }

    return React.createElement(EditableText, {
      elementKey: element.key,
      propName,
      value,
      placeholder: options?.placeholder,
      as: options?.as,
      multiline: options?.multiline,
      className: options?.className,
    });
  };
}
