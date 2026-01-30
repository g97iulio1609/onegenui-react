/**
 * DocumentBlock - Simplified document display component
 *
 * Renders document content in markdown/html format with optional
 * "Open in Canvas" action for full editing.
 */
"use client";

import DOMPurify from "dompurify";
import { memo, useMemo } from "react";
import type { UIElement } from "@onegenui/core";

export interface DocumentBlockProps {
  /** Document title */
  title: string;
  /** Document content */
  content: string;
  /** Content format */
  format?: "markdown" | "html" | "text";
  /** Allow editing inline */
  editable?: boolean;
  /** Document ID for opening in Canvas */
  documentId?: string;
  /** Show "Open in Canvas" button */
  showOpenInCanvas?: boolean;
}

interface DocumentBlockComponentProps {
  element: UIElement<"Document", DocumentBlockProps>;
  onAction?: (action: { type: string; payload?: unknown }) => void;
  renderText?: (
    content: string,
    options?: { markdown?: boolean },
  ) => React.ReactNode;
  loading?: boolean;
}

export const DocumentBlock = memo(function DocumentBlock({
  element,
  onAction,
  renderText,
  loading,
}: DocumentBlockComponentProps) {
  const {
    title,
    content,
    format = "markdown",
    editable = false,
    documentId,
    showOpenInCanvas = true,
  } = element.props;

  const renderedContent = useMemo(() => {
    if (format === "html") {
      return (
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
        />
      );
    }
    if (format === "markdown" && renderText) {
      return renderText(content, { markdown: true });
    }
    return <pre className="whitespace-pre-wrap text-sm">{content}</pre>;
  }, [content, format, renderText]);

  const handleOpenInCanvas = () => {
    onAction?.({
      type: "canvas:open",
      payload: {
        documentId,
        title,
        content,
        format,
      },
    });
  };

  if (loading) {
    return (
      <div className="w-full p-6 bg-zinc-900/50 rounded-xl border border-white/5 animate-pulse">
        <div className="h-6 w-1/3 bg-zinc-800 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-800 rounded w-5/6" />
          <div className="h-4 bg-zinc-800 rounded w-4/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="document-block w-full bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-zinc-900/30">
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-zinc-400"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
          </svg>
          <h3 className="text-sm font-medium text-white">{title}</h3>
        </div>
        {showOpenInCanvas && (
          <button
            onClick={handleOpenInCanvas}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors border-none cursor-pointer"
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
              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
            </svg>
            Open in Canvas
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">{renderedContent}</div>
    </div>
  );
});

export default DocumentBlock;
