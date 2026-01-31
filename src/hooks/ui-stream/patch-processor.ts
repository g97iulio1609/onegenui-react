"use client";

/**
 * Patch Processor - Handles batched JSON patch application
 *
 * Manages:
 * - Patch buffering and batch scheduling
 * - Tree updates with protection for specific types
 * - Zustand store synchronization
 */

import type { UITree, JsonPatch } from "@onegenui/core";
import { applyPatchesBatch } from "../patch-utils";
import { streamLog } from "./logger";

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
      
      streamLog.debug("Tree updated", {
        elementCount: Object.keys(updatedTree.elements).length,
      });
    }
  }, 50); // Flush every 50ms for responsive UI

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
