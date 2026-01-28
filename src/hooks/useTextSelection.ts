"use client";

import { useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Information about user's native text selection
 */
export interface TextSelectionInfo {
  /** The selected text content */
  text: string;
  /** The JSON-UI element key containing the selection (if within a component) */
  elementKey?: string;
  /** The component type (e.g., "List", "Email", "Document") */
  elementType?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook to capture native browser text selection.
 *
 * This allows users to:
 * 1. Select text with click+drag (or long-press on mobile)
 * 2. Copy the text normally
 * 3. Have the selection passed to AI as context when sending a message
 *
 * @example
 * ```tsx
 * const { getTextSelection, clearTextSelection, hasTextSelection } = useTextSelection();
 *
 * const handleSend = () => {
 *   const selection = getTextSelection();
 *   if (selection) {
 *     // Include in AI context
 *     context.textSelection = selection;
 *   }
 *   // ... send message
 *   clearTextSelection();
 * };
 * ```
 */
export function useTextSelection() {
  /**
   * Get the current native text selection, if any.
   * Returns null if no text is selected or selection is collapsed.
   */
  const getTextSelection = useCallback((): TextSelectionInfo | null => {
    if (typeof window === "undefined") return null;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return null;

    const text = selection.toString().trim();
    if (!text) return null;

    // Find the JSON-UI component containing the selection
    const anchorNode = selection.anchorNode;
    const parentElement = anchorNode?.parentElement;
    const componentWrapper = parentElement?.closest(
      "[data-jsonui-element-key]",
    ) as HTMLElement | null;

    const elementKey =
      componentWrapper?.getAttribute("data-jsonui-element-key") ?? undefined;
    const elementType =
      componentWrapper?.getAttribute("data-jsonui-element-type") ?? undefined;

    return {
      text,
      elementKey,
      elementType,
    };
  }, []);

  const restoreTextSelection = useCallback((range: Range) => {
    if (typeof window === "undefined") return;
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  /**
   * Clear the native text selection.
   * Call this after processing the selection (e.g., after sending a message).
   */
  const clearTextSelection = useCallback(() => {
    if (typeof window === "undefined") return;
    window.getSelection()?.removeAllRanges();
    document.dispatchEvent(new CustomEvent("jsonui-text-selection-cleared"));
  }, []);

  /**
   * Check if there's an active text selection.
   */
  const hasTextSelection = useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    const selection = window.getSelection();
    return !!(
      selection &&
      !selection.isCollapsed &&
      selection.toString().trim()
    );
  }, []);

  return {
    getTextSelection,
    restoreTextSelection,
    clearTextSelection,
    hasTextSelection,
  };
}
