"use client";

import React from "react";
import type { PreservedTextSelection } from "../hooks/usePreservedSelection";
import { cn } from "../utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TextSelectionBadgeProps {
  /** The preserved selection to display */
  selection: PreservedTextSelection;
  /** Callback when user clears the selection */
  onClear: () => void;
  /** Callback to restore the selection in the DOM */
  onRestore?: () => void;
  /** Maximum characters to show before truncating */
  maxLength?: number;
  /** Custom className for styling */
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Badge component that displays a preserved text selection.
 *
 * Shows:
 * - Truncated preview of the selected text
 * - "Copied" indicator if auto-copied to clipboard
 * - Button to restore selection in DOM (if possible)
 * - Button to clear/dismiss
 *
 * @example
 * ```tsx
 * {preserved && (
 *   <TextSelectionBadge
 *     selection={preserved}
 *     onClear={clear}
 *     onRestore={restore}
 *   />
 * )}
 * ```
 */
export function TextSelectionBadge({
  selection,
  onClear,
  onRestore,
  maxLength = 50,
  className,
}: TextSelectionBadgeProps) {
  const truncatedText =
    selection.text.length > maxLength
      ? `${selection.text.substring(0, maxLength)}...`
      : selection.text;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-foreground",
        "bg-primary/10 border border-primary/20",
        className,
      )}
    >
      {/* Text indicator icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-primary"
      >
        <path d="M17 6.1H3" />
        <path d="M21 12.1H3" />
        <path d="M15.1 18H3" />
      </svg>

      {/* Text preview */}
      <span
        className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap italic text-muted-foreground"
        title={selection.text}
      >
        "{truncatedText}"
      </span>

      {/* Copied indicator */}
      {selection.copiedToClipboard && (
        <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded font-medium">
          Copied
        </span>
      )}

      {/* Element info if available */}
      {selection.elementType && (
        <span className="text-[10px] px-1.5 py-0.5 bg-violet-500/20 text-violet-500 rounded">
          {selection.elementType}
        </span>
      )}

      {/* Restore button */}
      {onRestore && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRestore();
          }}
          title="Restore selection"
          className="flex items-center justify-center p-1 border-none rounded bg-transparent text-muted-foreground cursor-pointer transition-all hover:bg-primary/20 hover:text-primary"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      )}

      {/* Clear button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClear();
        }}
        title="Clear"
        className="flex items-center justify-center p-1 border-none rounded bg-transparent text-muted-foreground cursor-pointer transition-all hover:bg-destructive/20 hover:text-destructive"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}
