"use client";

import React, { type ReactNode, useMemo } from "react";
import type { UIElement, UITree } from "@onegenui/core";
import { useIsVisible } from "../contexts/visibility";
import { useActions } from "../contexts/actions";
import { useMarkdown } from "../contexts/markdown";
import { useEditMode } from "../contexts/edit-mode";
import { ResizableWrapper } from "../components/ResizableWrapper";
import { SelectionWrapper } from "../components/SelectionWrapper";
import { EditableWrapper } from "../components/EditableWrapper";
import { createRenderEditableText } from "../hooks/useRenderEditableText";
import type { ComponentRegistry, ComponentRenderer } from "./types";

interface ElementRendererProps {
  element: UIElement;
  tree: UITree;
  registry: ComponentRegistry;
  loading?: boolean;
  fallback?: ComponentRenderer;
  selectable?: boolean;
  onElementSelect?: (element: UIElement) => void;
  selectionDelayMs: number;
  selectedKey?: string | null;
  onResize?: (
    elementKey: string,
    size: { width: number; height: number },
  ) => void;
}

/**
 * Recursively checks if any descendant element has changed between two trees.
 * This ensures parent components re-render when deeply nested children update.
 */
function hasDescendantChanged(
  elementKey: string,
  prevTree: UITree,
  nextTree: UITree,
  visited: Set<string> = new Set(),
): boolean {
  // Prevent infinite loops in case of circular references
  if (visited.has(elementKey)) return false;
  visited.add(elementKey);

  const prevElement = prevTree.elements[elementKey];
  const nextElement = nextTree.elements[elementKey];

  // Element itself changed
  if (prevElement !== nextElement) {
    return true;
  }

  // Check all children recursively
  const children = prevElement?.children;
  if (children) {
    for (const childKey of children) {
      if (hasDescendantChanged(childKey, prevTree, nextTree, visited)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Memoization comparator: structural sharing in patch-utils.ts means only
 * modified elements get new references. This enables O(1) equality checks
 * for leaf nodes, with recursive descent for container components.
 */
function elementRendererPropsAreEqual(
  prevProps: ElementRendererProps,
  nextProps: ElementRendererProps,
): boolean {
  // Element reference check (structural sharing)
  if (prevProps.element !== nextProps.element) {
    return false;
  }

  const wasSelected = prevProps.selectedKey === prevProps.element.key;
  const isSelected = nextProps.selectedKey === nextProps.element.key;
  if (wasSelected !== isSelected) {
    return false;
  }

  if (prevProps.loading !== nextProps.loading) {
    return false;
  }

  // CRITICAL: When tree changes, check if THIS element or ANY descendant changed
  // This ensures containers re-render when deeply nested children update
  if (prevProps.tree !== nextProps.tree) {
    if (hasDescendantChanged(
      prevProps.element.key,
      prevProps.tree,
      nextProps.tree,
    )) {
      return false;
    }
  }

  return true;
}

export const ElementRenderer = React.memo(function ElementRenderer({
  element,
  tree,
  registry,
  loading,
  fallback,
  selectable,
  onElementSelect,
  selectionDelayMs,
  selectedKey,
  onResize,
}: ElementRendererProps) {
  // All hooks MUST be called before any conditional returns (Rules of Hooks)
  const isVisible = useIsVisible(element.visible);
  const { execute } = useActions();
  const { renderText } = useMarkdown();
  const { isEditing } = useEditMode();

  // Create renderEditableText function for this element (must be before conditionals)
  const renderEditableText = useMemo(
    () => createRenderEditableText(element, isEditing),
    [element, isEditing],
  );

  if (!isVisible) {
    return null;
  }

  if (
    element.type === "__placeholder__" ||
    element._meta?.isPlaceholder
  ) {
    return (
      <div
        key={element.key}
        className="w-full h-16 bg-muted/10 animate-pulse rounded-lg my-2 border border-border/20"
        data-placeholder-for={element.key}
      />
    );
  }

  const Component = registry[element.type] ?? fallback;

  if (!Component) {
    console.warn(`No renderer for component type: ${element.type}`);
    return null;
  }

  const children = element.children?.map((childKey, index) => {
    const childElement = tree.elements[childKey];
    if (!childElement) {
      if (loading) {
        return (
          <div
            key={`${childKey}-skeleton`}
            className="w-full h-12 bg-muted/10 animate-pulse rounded-md my-1"
          />
        );
      }
      return null;
    }
    return (
      <ElementRenderer
        key={`${childKey}-${index}`}
        element={childElement}
        tree={tree}
        registry={registry}
        loading={loading}
        fallback={fallback}
        selectable={selectable}
        onElementSelect={onElementSelect}
        selectionDelayMs={selectionDelayMs}
        selectedKey={selectedKey}
        onResize={onResize}
      />
    );
  });

  const isResizable = element.layout?.resizable !== false;
  // All elements are editable by default when in edit mode
  // unless explicitly disabled (editable: false) or locked
  const isEditable =
    isEditing && element.editable !== false && !element.locked;

  const content = (
    <Component
      element={element}
      onAction={execute}
      loading={loading}
      renderText={renderText}
      renderEditableText={renderEditableText}
    >
      {children}
    </Component>
  );

  // Wrap with EditableWrapper if editing is enabled (for automatic text detection)
  const editableContent = isEditable ? (
    <EditableWrapper element={element}>{content}</EditableWrapper>
  ) : (
    content
  );

  if (selectable && onElementSelect) {
    const selectionContent = (
      <SelectionWrapper
        element={element}
        enabled={selectable}
        onSelect={onElementSelect}
        delayMs={selectionDelayMs}
        isSelected={selectedKey === element.key}
      >
        {editableContent}
      </SelectionWrapper>
    );

    if (isResizable) {
      return (
        <ResizableWrapper
          element={element}
          onResize={onResize}
          showHandles={selectedKey === element.key}
        >
          {selectionContent}
        </ResizableWrapper>
      );
    }

    return selectionContent;
  }

  if (isResizable) {
    return (
      <ResizableWrapper element={element} onResize={onResize}>
        {editableContent}
      </ResizableWrapper>
    );
  }

  return editableContent;
}, elementRendererPropsAreEqual);
