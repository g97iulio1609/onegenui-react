"use client";

/**
 * Tree Store Bridge - Single source of truth for UI tree state
 *
 * Eliminates the triple state tracking problem (treeRef + currentTree + storeTree)
 * by providing a unified interface that reads/writes exclusively through Zustand.
 *
 * All tree mutations go through setUITree which auto-bumps treeVersion.
 */

import type { UITree, JsonPatch } from "@onegenui/core";
import {
  applyPatchesBatch,
  type ApplyPatchOptions,
} from "../patch-utils";
import { useStore } from "../../store";

export interface TreeStoreBridge {
  /** Read current tree directly from store (no ref, no copy) */
  getTree(): UITree | null;
  /** Apply JSON patches atomically — reads store, patches, writes back */
  applyPatches(patches: JsonPatch[], options?: ApplyPatchOptions): UITree | null;
  /** Set tree directly (auto-bumps treeVersion) */
  setTree(tree: UITree | null): void;
  /** Set streaming flag */
  setStreaming(streaming: boolean): void;
  /** Clear tree and reset version */
  clear(): void;
}

/**
 * Create a TreeStoreBridge instance.
 *
 * Uses useStore.getState() for synchronous, consistent access.
 * Safe to call from async callbacks — no stale closures.
 */
export function createTreeStoreBridge(): TreeStoreBridge {
  return {
    getTree() {
      return useStore.getState().uiTree;
    },

    applyPatches(patches, options = {}) {
      const state = useStore.getState();
      const tree = state.uiTree;
      if (!tree || patches.length === 0) return tree;

      const updated = applyPatchesBatch(tree, patches, options);
      state.setUITree(updated);
      return updated;
    },

    setTree(tree) {
      if (tree) {
        useStore.getState().setUITree(tree);
      } else {
        useStore.getState().clearUITree();
      }
    },

    setStreaming(streaming) {
      useStore.getState().setTreeStreaming(streaming);
    },

    clear() {
      useStore.getState().clearUITree();
    },
  };
}
