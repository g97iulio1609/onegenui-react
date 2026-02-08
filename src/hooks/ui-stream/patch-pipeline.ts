"use client";

/**
 * Patch Pipeline - requestAnimationFrame-based patch application
 *
 * Replaces the old setTimeout(24ms) approach with browser-aligned rendering.
 * Features:
 * - Backpressure: force-flush when buffer exceeds maxBufferSize
 * - Atomic groups: patches that must be applied together (e.g., skeleton + children)
 * - Selection preservation across DOM updates
 */

import type { JsonPatch } from "@onegenui/core";
import type { ApplyPatchOptions } from "../patch-utils";
import type { TreeStoreBridge } from "./tree-store-bridge";
import { streamLog } from "./logger";

// ─────────────────────────────────────────────────────────────────────────────
// Selection Preservation
// ─────────────────────────────────────────────────────────────────────────────

interface SavedSelection {
  anchorNodePath: number[];
  anchorOffset: number;
  focusNodePath: number[];
  focusOffset: number;
}

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

function resolveNodePath(path: number[], root: Document): Node | null {
  let node: Node = root.body;
  for (const idx of path) {
    if (!node.childNodes[idx]) return null;
    node = node.childNodes[idx];
  }
  return node;
}

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

export function restoreSelection(saved: SavedSelection | null): void {
  if (!saved || typeof window === "undefined") return;
  try {
    const anchor = resolveNodePath(saved.anchorNodePath, document);
    const focus = resolveNodePath(saved.focusNodePath, document);
    if (!anchor || !focus) return;
    const sel = window.getSelection();
    if (!sel) return;
    const range = document.createRange();
    range.setStart(anchor, Math.min(saved.anchorOffset, anchor.textContent?.length ?? 0));
    range.setEnd(focus, Math.min(saved.focusOffset, focus.textContent?.length ?? 0));
    sel.removeAllRanges();
    sel.addRange(range);
  } catch {
    // DOM structure changed — selection cannot be restored
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Patch Pipeline
// ─────────────────────────────────────────────────────────────────────────────

/** A group of patches, optionally atomic (must be applied together) */
interface PatchGroup {
  patches: JsonPatch[];
  atomic: boolean;
}

export interface PatchPipelineOptions {
  maxBufferSize?: number;
  patchOptions?: ApplyPatchOptions;
}

export interface PatchPipeline {
  /** Push patches into the buffer. If atomic=true, they're applied as one batch. */
  push(patches: JsonPatch[], atomic?: boolean): void;
  /** Force-flush all buffered patches immediately */
  flush(): void;
  /** Clear buffer without applying */
  reset(): void;
  /** Destroy: flush + cancel any pending rAF */
  destroy(): void;
}

export function createPatchPipeline(
  bridge: TreeStoreBridge,
  options: PatchPipelineOptions = {},
): PatchPipeline {
  const maxBuffer = options.maxBufferSize ?? 50;
  const patchOpts = options.patchOptions ?? {};

  let buffer: PatchGroup[] = [];
  let totalPatches = 0;
  let rafId: number | null = null;

  function applyBuffer(): void {
    if (buffer.length === 0) return;

    // Drain buffer BEFORE applying — prevents infinite retry on error
    const toApply = buffer;
    const count = totalPatches;
    buffer = [];
    totalPatches = 0;
    rafId = null;

    const savedSel = saveSelection();

    // Collect all non-atomic patches into one batch for efficiency
    const allPatches: JsonPatch[] = [];
    for (const group of toApply) {
      if (group.atomic) {
        // Flush accumulated non-atomic patches first
        if (allPatches.length > 0) {
          try {
            bridge.applyPatches([...allPatches], patchOpts);
          } catch (e) {
            streamLog.error("Patch application failed", { error: e, patchCount: allPatches.length });
          }
          allPatches.length = 0;
        }
        // Apply atomic group as single batch
        try {
          bridge.applyPatches(group.patches, patchOpts);
        } catch (e) {
          streamLog.error("Atomic patch application failed", { error: e, patchCount: group.patches.length });
        }
      } else {
        allPatches.push(...group.patches);
      }
    }
    // Flush remaining non-atomic patches
    if (allPatches.length > 0) {
      try {
        bridge.applyPatches(allPatches, patchOpts);
      } catch (e) {
        streamLog.error("Patch application failed", { error: e, patchCount: allPatches.length });
      }
    }

    streamLog.debug("Pipeline flushed", { groups: toApply.length, totalPatches: count });

    // Restore selection after DOM reconciliation
    if (savedSel) {
      requestAnimationFrame(() => restoreSelection(savedSel));
    }
  }

  function scheduleFlush(): void {
    if (rafId !== null) return;
    if (typeof requestAnimationFrame !== "undefined") {
      rafId = requestAnimationFrame(applyBuffer);
    } else {
      // SSR/test fallback
      setTimeout(applyBuffer, 0);
    }
  }

  return {
    push(patches, atomic = false) {
      if (patches.length === 0) return;
      buffer.push({ patches, atomic });
      totalPatches += patches.length;

      // Backpressure: force-flush if buffer is too large
      if (totalPatches >= maxBuffer) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        applyBuffer();
      } else {
        scheduleFlush();
      }
    },

    flush() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      applyBuffer();
    },

    reset() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      buffer = [];
      totalPatches = 0;
    },

    destroy() {
      this.flush();
    },
  };
}
