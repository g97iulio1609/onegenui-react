/**
 * Workspace Slice
 *
 * Manages Canvas workspace state:
 * - Open documents (tabs)
 * - Active document
 * - Workspace layout mode
 * - YOLO mode toggle
 * - AI edit approvals
 */

import type { SliceCreator } from "../types";

/**
 * Editor content type - supports both Lexical and Tiptap formats
 * 
 * Lexical format has a root node with children
 * Tiptap format has a type and content array
 */
export type EditorContent = Record<string, unknown>;

/** @deprecated Use EditorContent instead */
export type SerializedEditorState = EditorContent;

/** Document in workspace */
export interface WorkspaceDocument {
  /** Unique document ID */
  id: string;
  /** Document title */
  title: string;
  /** Editor content (Lexical or Tiptap format) */
  content: EditorContent | null;
  /** Last saved timestamp */
  savedAt: number | null;
  /** Last modified timestamp */
  modifiedAt: number;
  /** Has unsaved changes */
  isDirty: boolean;
  /** Document format */
  format: "tiptap" | "lexical" | "markdown" | "html";
}

/** Pending AI edit requiring approval */
export interface PendingAIEdit {
  /** Edit ID */
  id: string;
  /** Target document ID */
  documentId: string;
  /** Description of the edit */
  description: string;
  /** Preview of changes (diff) */
  preview: {
    before: string;
    after: string;
  };
  /** New content if approved */
  newContent: EditorContent;
  /** Created timestamp */
  createdAt: number;
}

/** Workspace layout mode */
export type WorkspaceLayout =
  | "chat-only" // Full chat, no canvas
  | "split" // Chat + Canvas side by side
  | "canvas-only"; // Full canvas, chat minimized

export interface WorkspaceSlice {
  // State
  /** Open documents */
  documents: WorkspaceDocument[];
  /** Active document ID */
  activeDocumentId: string | null;
  /** Workspace layout mode */
  workspaceLayout: WorkspaceLayout;
  /** YOLO mode - auto-apply AI edits */
  yoloMode: boolean;
  /** Pending AI edits requiring approval */
  pendingEdits: PendingAIEdit[];
  /** Is workspace panel visible */
  isWorkspaceOpen: boolean;

  // Document actions
  /** Create new document */
  createDocument: (title?: string) => WorkspaceDocument;
  /** Open existing document */
  openDocument: (doc: WorkspaceDocument) => void;
  /** Close document by ID */
  closeDocument: (id: string) => void;
  /** Set active document */
  setActiveDocument: (id: string) => void;
  /** Update document content */
  updateDocumentContent: (
    id: string,
    content: EditorContent | null,
  ) => void;
  /** Rename document */
  renameDocument: (id: string, title: string) => void;
  /** Mark document as saved */
  markDocumentSaved: (id: string) => void;

  // Layout actions
  /** Set workspace layout */
  setWorkspaceLayout: (layout: WorkspaceLayout) => void;
  /** Toggle workspace panel */
  toggleWorkspace: () => void;

  // AI edit actions
  /** Toggle YOLO mode */
  setYoloMode: (enabled: boolean) => void;
  /** Add pending AI edit */
  addPendingEdit: (edit: Omit<PendingAIEdit, "id" | "createdAt">) => void;
  /** Approve pending edit */
  approvePendingEdit: (editId: string) => void;
  /** Reject pending edit */
  rejectPendingEdit: (editId: string) => void;
  /** Clear all pending edits */
  clearPendingEdits: () => void;

  // Helpers
  /** Get active document */
  getActiveDocument: () => WorkspaceDocument | null;
  /** Check if document is open */
  isDocumentOpen: (id: string) => boolean;
}

export const createWorkspaceSlice: SliceCreator<WorkspaceSlice> = (
  set,
  get,
) => ({
  // Initial state
  documents: [],
  activeDocumentId: null,
  workspaceLayout: "chat-only",
  yoloMode: false,
  pendingEdits: [],
  isWorkspaceOpen: false,

  // Document actions
  createDocument: (title) => {
    const doc: WorkspaceDocument = {
      id: crypto.randomUUID(),
      title: title || `Document ${get().documents.length + 1}`,
      content: null,
      savedAt: null,
      modifiedAt: Date.now(),
      isDirty: false,
      format: "tiptap",
    };
    set((state) => ({
      documents: [...state.documents, doc],
      activeDocumentId: doc.id,
      isWorkspaceOpen: true,
      workspaceLayout:
        state.workspaceLayout === "chat-only" ? "split" : state.workspaceLayout,
    }));
    return doc;
  },

  openDocument: (doc) => {
    set((state) => {
      const exists = state.documents.some((d) => d.id === doc.id);
      return {
        documents: exists ? state.documents : [...state.documents, doc],
        activeDocumentId: doc.id,
        isWorkspaceOpen: true,
        workspaceLayout:
          state.workspaceLayout === "chat-only"
            ? "split"
            : state.workspaceLayout,
      };
    });
  },

  closeDocument: (id) => {
    set((state) => {
      const newDocs = state.documents.filter((d) => d.id !== id);
      const wasActive = state.activeDocumentId === id;
      return {
        documents: newDocs,
        activeDocumentId: wasActive
          ? newDocs[newDocs.length - 1]?.id || null
          : state.activeDocumentId,
        isWorkspaceOpen: newDocs.length > 0,
        workspaceLayout:
          newDocs.length === 0 ? "chat-only" : state.workspaceLayout,
      };
    });
  },

  setActiveDocument: (id) => {
    set({ activeDocumentId: id });
  },

  updateDocumentContent: (id, content) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id
          ? { ...doc, content, modifiedAt: Date.now(), isDirty: true }
          : doc,
      ),
    }));
  },

  renameDocument: (id, title) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, title, isDirty: true } : doc,
      ),
    }));
  },

  markDocumentSaved: (id) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, savedAt: Date.now(), isDirty: false } : doc,
      ),
    }));
  },

  // Layout actions
  setWorkspaceLayout: (layout) => {
    set({
      workspaceLayout: layout,
      isWorkspaceOpen: layout !== "chat-only",
    });
  },

  toggleWorkspace: () => {
    set((state) => ({
      isWorkspaceOpen: !state.isWorkspaceOpen,
      workspaceLayout: state.isWorkspaceOpen ? "chat-only" : "split",
    }));
  },

  // AI edit actions
  setYoloMode: (enabled) => {
    set({ yoloMode: enabled });
  },

  addPendingEdit: (edit) => {
    const pendingEdit: PendingAIEdit = {
      ...edit,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    const { yoloMode } = get();

    if (yoloMode) {
      // Auto-apply in YOLO mode
      get().updateDocumentContent(edit.documentId, edit.newContent);
    } else {
      set((state) => ({
        pendingEdits: [...state.pendingEdits, pendingEdit],
      }));
    }
  },

  approvePendingEdit: (editId) => {
    const edit = get().pendingEdits.find((e) => e.id === editId);
    if (edit) {
      get().updateDocumentContent(edit.documentId, edit.newContent);
    }
    set((state) => ({
      pendingEdits: state.pendingEdits.filter((e) => e.id !== editId),
    }));
  },

  rejectPendingEdit: (editId) => {
    set((state) => ({
      pendingEdits: state.pendingEdits.filter((e) => e.id !== editId),
    }));
  },

  clearPendingEdits: () => {
    set({ pendingEdits: [] });
  },

  // Helpers
  getActiveDocument: () => {
    const { documents, activeDocumentId } = get();
    return documents.find((d) => d.id === activeDocumentId) || null;
  },

  isDocumentOpen: (id) => {
    return get().documents.some((d) => d.id === id);
  },
});
