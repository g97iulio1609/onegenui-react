/**
 * CanvasBlock - Generative UI component for Canvas editor
 *
 * This is a placeholder component that renders a canvas-ready container.
 * The actual Lexical editor is loaded at the application level (dashboard)
 * to avoid bundling Lexical in the react package.
 */
"use client";

import { memo, useCallback, useState, useEffect, useMemo } from "react";
import type { UIElement } from "@onegenui/core";

export interface CanvasBlockProps {
  /** Document unique identifier */
  documentId?: string;
  /** Initial content (serialized state) */
  initialContent?: unknown;
  /** Markdown content (easier for AI to generate) */
  markdown?: string;
  /** Images to embed in document */
  images?: Array<{
    url: string;
    alt?: string;
    caption?: string;
  }>;
  /** Editor mode */
  mode?: "view" | "edit" | "collab";
  /** Width (CSS value) */
  width?: string;
  /** Height (CSS value) */
  height?: string;
  /** Show formatting toolbar */
  showToolbar?: boolean;
  /** Action to trigger on save */
  onSaveAction?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Document title */
  title?: string;
}

interface CanvasBlockComponentProps {
  element: UIElement<"Canvas", CanvasBlockProps>;
  onAction?: (action: { type: string; payload?: unknown }) => void;
  loading?: boolean;
  /** Custom editor component to render (injected from app level) */
  EditorComponent?: React.ComponentType<{
    initialState?: unknown;
    onChange?: (state: unknown, serialized: unknown) => void;
    placeholder?: string;
    editable?: boolean;
    enableFloatingToolbar?: boolean;
    enableDragDrop?: boolean;
    className?: string;
  }>;
}

function CanvasBlockSkeleton() {
  return (
    <div className="w-full min-h-[200px] bg-zinc-900/50 rounded-xl border border-white/5 flex items-center justify-center">
      <div className="text-zinc-500 text-sm">Loading editor...</div>
    </div>
  );
}

export const CanvasBlock = memo(function CanvasBlock({
  element,
  onAction,
  loading,
  EditorComponent,
}: CanvasBlockComponentProps) {
  const {
    documentId,
    initialContent,
    markdown,
    images,
    mode = "edit",
    width = "100%",
    height = "300px",
    showToolbar = true,
    placeholder = "Start typing... Use '/' for commands",
    title,
  } = element.props;

  const [content, setContent] = useState<unknown>(initialContent || null);
  // Key to force editor re-render when content is externally updated
  const [editorKey, setEditorKey] = useState(0);

  // Process markdown into content if provided (easier for AI)
  const processedContent = useMemo(() => {
    // If we have initialContent, use it directly
    if (initialContent) return initialContent;

    // If we have markdown, convert to editor-friendly format
    // The actual conversion happens in the editor component
    if (markdown) {
      return { markdown, images };
    }

    // If we only have images, create a simple structure
    if (images && images.length > 0) {
      return { images };
    }

    return null;
  }, [initialContent, markdown, images]);

  // Sync with external content changes (from AI updates)
  useEffect(() => {
    if (processedContent !== undefined && processedContent !== null) {
      setContent(processedContent);
      // Force editor to re-initialize with new content
      setEditorKey((k) => k + 1);
    }
  }, [processedContent]);

  const handleChange = useCallback(
    (_state: unknown, serialized: unknown) => {
      setContent(serialized as unknown);
      onAction?.({
        type: "canvas:change",
        payload: {
          documentId,
          content: serialized,
        },
      });
    },
    [documentId, onAction],
  );

  const handleSave = useCallback(() => {
    if (content) {
      onAction?.({
        type: "canvas:save",
        payload: {
          documentId,
          content,
        },
      });
    }
  }, [documentId, content, onAction]);

  const handleOpenInCanvas = useCallback(() => {
    onAction?.({
      type: "canvas:open",
      payload: {
        documentId,
        title,
        content: initialContent,
      },
    });
  }, [documentId, title, initialContent, onAction]);

  if (loading) {
    return <CanvasBlockSkeleton />;
  }

  // If no editor component provided, show placeholder with "Open in Canvas" button
  if (!EditorComponent) {
    return (
      <div
        className="canvas-block w-full bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden"
        style={{ minHeight: height }}
        data-document-id={documentId}
      >
        {title && (
          <div className="px-4 py-3 border-b border-white/5">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        )}
        <div
          className="flex flex-col items-center justify-center gap-4 p-8"
          style={{ minHeight: "200px" }}
        >
          <p className="text-zinc-400 text-sm">
            {initialContent ? "Document content available" : "Empty document"}
          </p>
          <button
            onClick={handleOpenInCanvas}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors border-none cursor-pointer"
          >
            <svg
              width="16"
              height="16"
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
        </div>
      </div>
    );
  }

  return (
    <div
      className="canvas-block"
      style={{ width, minHeight: height }}
      data-document-id={documentId}
    >
      {title && (
        <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      )}
      <div className="bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden">
        <EditorComponent
          key={editorKey}
          initialState={content}
          onChange={handleChange}
          placeholder={placeholder}
          editable={mode !== "view"}
          enableFloatingToolbar={showToolbar && mode === "edit"}
          enableDragDrop={mode === "edit"}
          className="prose prose-invert max-w-none p-4"
        />
      </div>
      {mode === "edit" && (
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors border-none cursor-pointer"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
});

export default CanvasBlock;
