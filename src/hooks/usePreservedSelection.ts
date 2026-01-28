"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Information about a preserved text selection
 */
export interface PreservedTextSelection {
  /** The selected text content */
  text: string;
  /** The saved Range object for potential restoration */
  range: Range | null;
  /** The JSON-UI element key containing the selection (if within a component) */
  elementKey?: string;
  /** The component type (e.g., "List", "Email", "Document") */
  elementType?: string;
  /** Timestamp when the selection was preserved */
  timestamp: number;
  /** Whether the text was auto-copied to clipboard */
  copiedToClipboard: boolean;
}

export interface UsePreservedSelectionReturn {
  /** Currently preserved selection (if any) */
  preserved: PreservedTextSelection | null;
  /** Preserve the current browser text selection before it's lost */
  preserve: () => Promise<void>;
  /** Attempt to restore the preserved selection in the DOM */
  restore: () => boolean;
  /** Clear the preserved selection */
  clear: () => void;
  /** Copy preserved text to clipboard (returns success status) */
  copyToClipboard: () => Promise<boolean>;
  /** Whether there is a preserved selection */
  hasPreserved: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook to preserve text selection when focus moves to another element.
 *
 * This solves the problem where clicking on an input/textarea clears
 * the user's text selection. The hook:
 * 1. Saves the selection text and Range before it's lost
 * 2. Optionally auto-copies to clipboard for convenience
 * 3. Allows restoring the selection if the DOM structure hasn't changed
 *
 * @example
 * ```tsx
 * function ChatInput() {
 *   const { preserved, preserve, clear } = usePreservedSelection();
 *
 *   const handleFocus = useCallback(() => {
 *     preserve(); // Save any current text selection
 *   }, [preserve]);
 *
 *   return (
 *     <>
 *       <input onFocus={handleFocus} ... />
 *       {preserved && (
 *         <TextSelectionBadge
 *           text={preserved.text}
 *           onClear={clear}
 *         />
 *       )}
 *     </>
 *   );
 * }
 * ```
 */
export function usePreservedSelection(): UsePreservedSelectionReturn {
  const [preserved, setPreserved] = useState<PreservedTextSelection | null>(
    null,
  );
  const rangeRef = useRef<Range | null>(null);

  /**
   * Preserve the current browser text selection.
   * Saves both the text and the Range for potential restoration.
   * Also auto-copies to clipboard for convenience.
   */
  const preserve = useCallback(async () => {
    if (typeof window === "undefined") return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (!text) return;

    // Clone the range before it's lost
    let clonedRange: Range | null = null;
    try {
      clonedRange = selection.getRangeAt(0).cloneRange();
      rangeRef.current = clonedRange;
    } catch {
      // Range might not be available in some cases
      rangeRef.current = null;
    }

    // Find the containing JSON-UI component
    const anchorNode = selection.anchorNode;
    const parentElement = anchorNode?.parentElement;
    const componentWrapper = parentElement?.closest(
      "[data-jsonui-element-key]",
    ) as HTMLElement | null;

    const elementKey =
      componentWrapper?.getAttribute("data-jsonui-element-key") ?? undefined;
    const elementType =
      componentWrapper?.getAttribute("data-jsonui-element-type") ?? undefined;

    // Try to copy to clipboard
    let copiedToClipboard = false;
    try {
      await navigator.clipboard.writeText(text);
      copiedToClipboard = true;
    } catch {
      // Clipboard write might fail (permissions, etc.)
      copiedToClipboard = false;
    }

    setPreserved({
      text,
      range: clonedRange,
      elementKey,
      elementType,
      timestamp: Date.now(),
      copiedToClipboard,
    });
  }, []);

  /**
   * Attempt to restore the preserved selection in the DOM.
   * Returns true if successful, false if the Range is no longer valid.
   */
  const restore = useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    if (!rangeRef.current) return false;

    const selection = window.getSelection();
    if (!selection) return false;

    try {
      selection.removeAllRanges();
      selection.addRange(rangeRef.current);
      return true;
    } catch {
      // Range might be invalid if DOM changed
      return false;
    }
  }, []);

  /**
   * Clear the preserved selection.
   */
  const clear = useCallback(() => {
    setPreserved(null);
    rangeRef.current = null;
  }, []);

  /**
   * Copy the preserved text to clipboard.
   */
  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    if (!preserved?.text) return false;

    try {
      await navigator.clipboard.writeText(preserved.text);
      setPreserved((prev) =>
        prev ? { ...prev, copiedToClipboard: true } : null,
      );
      return true;
    } catch {
      return false;
    }
  }, [preserved]);

  // Auto-clear after 5 minutes to prevent stale data
  useEffect(() => {
    if (!preserved) return;

    const timeout = setTimeout(
      () => {
        clear();
      },
      5 * 60 * 1000,
    );

    return () => clearTimeout(timeout);
  }, [preserved, clear]);

  return {
    preserved,
    preserve,
    restore,
    clear,
    copyToClipboard,
    hasPreserved: preserved !== null,
  };
}
