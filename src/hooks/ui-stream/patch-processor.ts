"use client";

/**
 * Patch Processor - Handles batched JSON patch application
 *
 * Manages:
 * - Patch buffering and batch scheduling
 * - Tree updates with protection for specific types
 * - Zustand store synchronization
 * - Selection preservation during updates
 */

import type { UITree, JsonPatch } from "@onegenui/core";
import { applyPatchesBatch } from "../patch-utils";
import { streamLog } from "./logger";

/** Flush interval in ms - tuned for near-real-time visual feedback */
const PATCH_FLUSH_INTERVAL_MS = 24;

// ─────────────────────────────────────────────────────────────────────────────
// Selection Preservation Utilities
// ─────────────────────────────────────────────────────────────────────────────

interface SavedSelection {
  anchorNodePath: number[];
  anchorOffset: number;
  focusNodePath: number[];
  focusOffset: number;
}

/** Get path from root to node as array of child indices */
function getNodePath(node: Node | null): number[] {
  const path: number[] = [];
  let current = node;
  while (current?.parentNode) {
    const parent = current.parentNode;
    const index = Array.from(parent.childNodes).indexOf(current as ChildNode);
    path.unshift(index);
    current = parent;
  }
  return path;
}

/** Resolve a node path back to a DOM node */
function resolveNodePath(path: number[], root: Document): Node | null {
  let node: Node = root.body;
  for (const index of path) {
    if (!node.childNodes[index]) return null;
    node = node.childNodes[index];
  }
  return node;
}

/** Save current browser selection state */
export function saveSelection(): SavedSelection | null {
  if (typeof window === "undefined") return null;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
  
  return {
    anchorNodePath: getNodePath(sel.anchorNode),
    anchorOffset: sel.anchorOffset,
    focusNodePath: getNodePath(sel.focusNode),
    focusOffset: sel.focusOffset,
  };
}

/** Restore browser selection from saved state */
export function restoreSelection(saved: SavedSelection | null): void {
  if (!saved || typeof window === "undefined") return;
  
  try {
    const anchorNode = resolveNodePath(saved.anchorNodePath, document);
    const focusNode = resolveNodePath(saved.focusNodePath, document);
    
    if (!anchorNode || !focusNode) return;
    
    const sel = window.getSelection();
    if (!sel) return;
    
    const range = document.createRange();
    range.setStart(anchorNode, Math.min(saved.anchorOffset, anchorNode.textContent?.length ?? 0));
    range.setEnd(focusNode, Math.min(saved.focusOffset, focusNode.textContent?.length ?? 0));
    
    sel.removeAllRanges();
    sel.addRange(range);
  } catch {
    // Selection restoration failed - likely DOM structure changed significantly
  }
}

export { PATCH_FLUSH_INTERVAL_MS };

export interface TreeStoreActions {
  setUITree: (tree: { root: string; elements: UITree["elements"] }) => void;
  bumpTreeVersion: () => void;
}

export interface PatchProcessorState {
  patchBuffer: JsonPatch[];
  patchFlushTimer: ReturnType<typeof setTimeout> | null;
  currentTree: UITree;
}

export interface PatchProcessorDeps {
  treeRef: React.MutableRefObject<UITree | null>;
  storeRef: React.MutableRefObject<TreeStoreActions>;
  turnId: string;
  context?: Record<string, unknown>;
}

/**
 * Schedule a patch flush with debouncing
 * Returns updated state and tree
 */
export function schedulePatchFlush(
  state: PatchProcessorState,
  deps: PatchProcessorDeps,
): PatchProcessorState {
  const { patchBuffer, patchFlushTimer } = state;
  const { treeRef, storeRef, turnId, context } = deps;

  // If timer already scheduled, just return current state
  if (patchFlushTimer) {
    return state;
  }

  let newTree = state.currentTree;
  let newBuffer = patchBuffer;
  let newTimer: ReturnType<typeof setTimeout> | null = null;

  // Schedule batch application with short delay
  newTimer = setTimeout(() => {
    if (patchBuffer.length > 0) {
      streamLog.debug("Flushing patches", { count: patchBuffer.length });
      
      // Save selection before DOM changes
      const savedSel = saveSelection();
      
      // Use treeRef.current as base for latest state
      const baseTree = treeRef.current ?? state.currentTree;
      
      // Protect Canvas from removal when forceCanvasMode is enabled
      const protectedTypes =
        context?.forceCanvasMode === true ? ["Canvas"] : [];
      
      const updatedTree = applyPatchesBatch(baseTree, patchBuffer, {
        turnId,
        protectedTypes,
      });
      
      // Update ref and local state
      treeRef.current = updatedTree;
      newTree = updatedTree;
      newBuffer = [];
      
      // Update Zustand store for reactivity
      const store = storeRef.current;
      store.setUITree({
        root: updatedTree.root,
        elements: { ...updatedTree.elements },
      });
      store.bumpTreeVersion();
      
      // Restore selection after DOM update (deferred for React reconciliation)
      if (savedSel) {
        requestAnimationFrame(() => restoreSelection(savedSel));
      }
      
      streamLog.debug("Tree updated", {
        elementCount: Object.keys(updatedTree.elements).length,
      });
    }
  }, PATCH_FLUSH_INTERVAL_MS);

  return {
    patchBuffer: newBuffer,
    patchFlushTimer: newTimer,
    currentTree: newTree,
  };
}

/**
 * Add patch to buffer and schedule flush
 */
export function addPatch(
  patch: JsonPatch,
  state: PatchProcessorState,
  deps: PatchProcessorDeps,
): PatchProcessorState {
  const newBuffer = [...state.patchBuffer, patch];
  const newState = { ...state, patchBuffer: newBuffer };
  
  if (!state.patchFlushTimer) {
    return schedulePatchFlush(newState, deps);
  }
  
  return newState;
}

/**
 * Clear buffer and timer (for cleanup on error)
 */
export function clearPatchProcessor(
  state: PatchProcessorState,
): PatchProcessorState {
  if (state.patchFlushTimer) {
    clearTimeout(state.patchFlushTimer);
  }
  return {
    patchBuffer: [],
    patchFlushTimer: null,
    currentTree: state.currentTree,
  };
}
