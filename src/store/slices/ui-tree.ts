/**
 * UI Tree Slice - Streaming UI state management
 *
 * This slice manages the UI tree state during streaming generation.
 * Using Zustand ensures proper reactivity when the tree is updated
 * from async stream handlers.
 */
import type { UITree, UIElement, JsonPatch } from "@onegenui/core";
import { loggers } from "@onegenui/utils";
import type { SliceCreator } from "../types";

const log = loggers.react;

export interface UITreeSlice {
  // State
  uiTree: UITree | null;
  isTreeStreaming: boolean;
  treeVersion: number; // Force re-renders by incrementing

  // Actions
  setUITree: (tree: UITree | null) => void;
  updateUITree: (updater: (tree: UITree) => UITree) => void;
  setElement: (key: string, element: UIElement) => void;
  removeElement: (key: string) => void;
  applyTreePatch: (patch: JsonPatch) => void;
  setTreeStreaming: (streaming: boolean) => void;
  clearUITree: () => void;
  bumpTreeVersion: () => void;
}

const initialTree: UITree | null = null;

export const createUITreeSlice: SliceCreator<UITreeSlice> = (set, get) => ({
  // State
  uiTree: initialTree,
  isTreeStreaming: false,
  treeVersion: 0,

  // Actions
  setUITree: (tree) =>
    set((state) => {
      log.debug("[UITreeSlice] setUITree called", {
        hasTree: !!tree,
        elementsCount: tree?.elements ? Object.keys(tree.elements).length : 0,
        rootKey: tree?.root,
        prevVersion: state.treeVersion,
      });
      state.uiTree = tree;
      state.treeVersion += 1;
    }),

  updateUITree: (updater) =>
    set((state) => {
      if (state.uiTree) {
        const updated = updater(state.uiTree);
        state.uiTree = updated;
        state.treeVersion += 1;
      }
    }),

  setElement: (key, element) =>
    set((state) => {
      if (state.uiTree) {
        state.uiTree.elements[key] = element;
        state.treeVersion += 1;
      }
    }),

  removeElement: (key) =>
    set((state) => {
      if (state.uiTree && state.uiTree.elements[key]) {
        delete state.uiTree.elements[key];
        state.treeVersion += 1;
      }
    }),

  applyTreePatch: (patch) =>
    set((state) => {
      if (!state.uiTree) return;

      // Handle add/replace operations for elements
      if (
        (patch.op === "add" || patch.op === "replace") &&
        patch.path.startsWith("/elements/")
      ) {
        const key = patch.path.replace("/elements/", "").split("/")[0];
        if (key && patch.value) {
          if (patch.path === `/elements/${key}`) {
            // Full element replacement
            state.uiTree.elements[key] = patch.value as UIElement;
          } else {
            // Nested property update - ensure element exists
            if (!state.uiTree.elements[key]) {
              state.uiTree.elements[key] = {
                type: "unknown",
                props: {},
              } as UIElement;
            }
            // Apply nested update via JSON pointer
            applyNestedPatch(
              state.uiTree.elements[key],
              patch.path.replace(`/elements/${key}`, ""),
              patch.value,
            );
          }
          state.treeVersion += 1;
        }
      }

      // Handle root changes
      if (patch.path === "/root" && typeof patch.value === "string") {
        state.uiTree.root = patch.value;
        state.treeVersion += 1;
      }
    }),

  setTreeStreaming: (streaming) => set({ isTreeStreaming: streaming }),

  clearUITree: () =>
    set((state) => {
      state.uiTree = null;
      state.treeVersion = 0;
      state.isTreeStreaming = false;
    }),

  bumpTreeVersion: () =>
    set((state) => {
      state.treeVersion += 1;
    }),
});

/**
 * Apply a nested patch to an object using JSON pointer path
 */
function applyNestedPatch(obj: unknown, path: string, value: unknown): void {
  if (!path || path === "/") {
    return;
  }

  const parts = path.slice(1).split("/");
  let current = obj as Record<string, unknown>;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!;
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  const lastKey = parts[parts.length - 1]!;
  current[lastKey] = value;
}
