/**
 * Canvas Slice
 *
 * Manages inline Canvas editor state for GenUI components.
 * Separate from WorkspaceSlice which handles standalone documents.
 *
 * Key features:
 * - Per-canvas state management by canvasId (usually element.key)
 * - Streaming-safe updates without forcing re-mount
 * - Tiptap editor state synchronization
 * - Pending AI edits queue
 */

import type { SliceCreator } from "../types";

// =============================================================================
// Types
// =============================================================================

/** Tiptap document format */
export type CanvasEditorState = {
  type: "doc";
  content: unknown[];
};

/** Canvas instance state */
export interface CanvasInstance {
  /** Unique canvas ID (usually element.key from GenUI tree) */
  id: string;
  /** Current editor content (Tiptap format) */
  content: CanvasEditorState | null;
  /** Is content being streamed from AI */
  isStreaming: boolean;
  /** Content version (increments on each update) */
  version: number;
  /** Last update timestamp */
  updatedAt: number;
  /** Has unsaved local changes */
  isDirty: boolean;
  /** Document title (optional) */
  title?: string;
  /** Associated document ID for persistence */
  documentId?: string;
}

/** Pending AI content update */
export interface CanvasPendingUpdate {
  /** Canvas ID */
  canvasId: string;
  /** New content */
  content: CanvasEditorState;
  /** Update timestamp */
  timestamp: number;
}

// =============================================================================
// Slice Interface
// =============================================================================

export interface CanvasSlice {
  // State
  /** Map of canvas instances by ID */
  canvasInstances: Map<string, CanvasInstance>;
  /** Pending updates queue (for batching during streaming) */
  canvasPendingUpdates: CanvasPendingUpdate[];

  // Instance management
  /** Initialize or get a canvas instance */
  initCanvas: (
    canvasId: string,
    initialContent?: CanvasEditorState | null,
    options?: { title?: string; documentId?: string },
  ) => CanvasInstance;
  /** Remove a canvas instance */
  removeCanvas: (canvasId: string) => void;
  /** Check if canvas exists */
  hasCanvas: (canvasId: string) => boolean;
  /** Get canvas instance */
  getCanvas: (canvasId: string) => CanvasInstance | undefined;

  // Content updates
  /** Update canvas content (streaming-safe) */
  updateCanvasContent: (
    canvasId: string,
    content: CanvasEditorState | null,
  ) => void;
  /** Set streaming state */
  setCanvasStreaming: (canvasId: string, isStreaming: boolean) => void;
  /** Mark canvas as dirty (has unsaved changes) */
  setCanvasDirty: (canvasId: string, isDirty: boolean) => void;

  // Batch updates (for streaming optimization)
  /** Queue an update for later application */
  queueCanvasUpdate: (canvasId: string, content: CanvasEditorState) => void;
  /** Apply all pending updates for a canvas */
  flushCanvasUpdates: (canvasId: string) => void;
  /** Clear pending updates without applying */
  clearCanvasPendingUpdates: (canvasId: string) => void;

  // Selectors
  /** Get all canvas IDs */
  getCanvasIds: () => string[];
  /** Get streaming canvases */
  getStreamingCanvases: () => CanvasInstance[];
}

// =============================================================================
// Slice Implementation
// =============================================================================

export const createCanvasSlice: SliceCreator<CanvasSlice> = (set, get) => ({
  // Initial state
  canvasInstances: new Map(),
  canvasPendingUpdates: [],

  // Instance management
  initCanvas: (canvasId, initialContent = null, options = {}) => {
    const existing = get().canvasInstances.get(canvasId);
    if (existing) {
      return existing;
    }

    const instance: CanvasInstance = {
      id: canvasId,
      content: initialContent,
      isStreaming: false,
      version: 0,
      updatedAt: Date.now(),
      isDirty: false,
      title: options.title,
      documentId: options.documentId,
    };

    set((state) => {
      state.canvasInstances.set(canvasId, instance);
    });

    return instance;
  },

  removeCanvas: (canvasId) => {
    set((state) => {
      state.canvasInstances.delete(canvasId);
      // Also clear any pending updates
      state.canvasPendingUpdates = state.canvasPendingUpdates.filter(
        (u) => u.canvasId !== canvasId,
      );
    });
  },

  hasCanvas: (canvasId) => {
    return get().canvasInstances.has(canvasId);
  },

  getCanvas: (canvasId) => {
    return get().canvasInstances.get(canvasId);
  },

  // Content updates
  updateCanvasContent: (canvasId, content) => {
    set((state) => {
      const instance = state.canvasInstances.get(canvasId);
      if (instance) {
        instance.content = content;
        instance.version += 1;
        instance.updatedAt = Date.now();
        instance.isDirty = true;
      }
    });
  },

  setCanvasStreaming: (canvasId, isStreaming) => {
    set((state) => {
      const instance = state.canvasInstances.get(canvasId);
      if (instance) {
        instance.isStreaming = isStreaming;
        // When streaming ends, flush any pending updates
        if (!isStreaming) {
          const pendingForCanvas = state.canvasPendingUpdates.filter(
            (u) => u.canvasId === canvasId,
          );
          if (pendingForCanvas.length > 0) {
            // Apply the latest pending update
            const latest = pendingForCanvas[pendingForCanvas.length - 1];
            if (latest) {
              instance.content = latest.content;
              instance.version += 1;
              instance.updatedAt = Date.now();
            }
            // Clear pending updates for this canvas
            state.canvasPendingUpdates = state.canvasPendingUpdates.filter(
              (u) => u.canvasId !== canvasId,
            );
          }
        }
      }
    });
  },

  setCanvasDirty: (canvasId, isDirty) => {
    set((state) => {
      const instance = state.canvasInstances.get(canvasId);
      if (instance) {
        instance.isDirty = isDirty;
      }
    });
  },

  // Batch updates
  queueCanvasUpdate: (canvasId, content) => {
    set((state) => {
      state.canvasPendingUpdates.push({
        canvasId,
        content,
        timestamp: Date.now(),
      });
    });
  },

  flushCanvasUpdates: (canvasId) => {
    set((state) => {
      const pendingForCanvas = state.canvasPendingUpdates.filter(
        (u) => u.canvasId === canvasId,
      );
      if (pendingForCanvas.length > 0) {
        const instance = state.canvasInstances.get(canvasId);
        if (instance) {
          // Apply the latest pending update
          const latest = pendingForCanvas[pendingForCanvas.length - 1];
          if (latest) {
            instance.content = latest.content;
            instance.version += 1;
            instance.updatedAt = Date.now();
          }
        }
        // Clear pending updates for this canvas
        state.canvasPendingUpdates = state.canvasPendingUpdates.filter(
          (u) => u.canvasId !== canvasId,
        );
      }
    });
  },

  clearCanvasPendingUpdates: (canvasId) => {
    set((state) => {
      state.canvasPendingUpdates = state.canvasPendingUpdates.filter(
        (u) => u.canvasId !== canvasId,
      );
    });
  },

  // Selectors
  getCanvasIds: () => {
    return Array.from(get().canvasInstances.keys());
  },

  getStreamingCanvases: () => {
    return Array.from(get().canvasInstances.values()).filter(
      (c) => c.isStreaming,
    );
  },
});
