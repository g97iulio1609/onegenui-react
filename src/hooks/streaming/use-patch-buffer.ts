/**
 * usePatchBuffer - Batch patch processing with debounced flush
 * Accumulates patches and flushes them periodically for performance
 */

import { useCallback, useRef } from "react";
import type { JsonPatch, UITree } from "@onegenui/core";
import { applyPatchesBatch } from "../patch-utils";
import type { BufferConfig } from "./types";
import { DEFAULT_BUFFER_CONFIG } from "./types";

export interface UsePatchBufferOptions {
  /** Buffer configuration */
  config?: Partial<BufferConfig>;
  /** Callback when patches are flushed */
  onFlush: (tree: UITree, patches: JsonPatch[]) => void;
}

export interface UsePatchBufferReturn {
  /** Add a patch to the buffer */
  addPatch: (patch: JsonPatch) => void;
  /** Add multiple patches to the buffer */
  addPatches: (patches: JsonPatch[]) => void;
  /** Force flush all pending patches */
  flush: () => void;
  /** Clear buffer without flushing */
  clear: () => void;
  /** Get current buffer size */
  getBufferSize: () => number;
}

/**
 * Hook for buffering and batching patch operations
 */
export function usePatchBuffer(
  getCurrentTree: () => UITree,
  turnId: string,
  options: UsePatchBufferOptions,
): UsePatchBufferReturn {
  const { config, onFlush } = options;
  const fullConfig: BufferConfig = { ...DEFAULT_BUFFER_CONFIG, ...config };

  const bufferRef = useRef<JsonPatch[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doFlush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (bufferRef.current.length === 0) return;

    const patches = [...bufferRef.current];
    bufferRef.current = [];

    const currentTree = getCurrentTree();
    const newTree = applyPatchesBatch(currentTree, patches, turnId);
    onFlush(newTree, patches);
  }, [getCurrentTree, turnId, onFlush]);

  const scheduleFlush = useCallback(() => {
    if (timerRef.current) return; // Already scheduled

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      doFlush();
    }, fullConfig.flushInterval);
  }, [doFlush, fullConfig.flushInterval]);

  const addPatch = useCallback(
    (patch: JsonPatch) => {
      bufferRef.current.push(patch);

      // Force flush if buffer is full
      if (bufferRef.current.length >= fullConfig.maxBufferSize) {
        doFlush();
      } else {
        scheduleFlush();
      }
    },
    [doFlush, scheduleFlush, fullConfig.maxBufferSize],
  );

  const addPatches = useCallback(
    (patches: JsonPatch[]) => {
      bufferRef.current.push(...patches);

      if (bufferRef.current.length >= fullConfig.maxBufferSize) {
        doFlush();
      } else {
        scheduleFlush();
      }
    },
    [doFlush, scheduleFlush, fullConfig.maxBufferSize],
  );

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    bufferRef.current = [];
  }, []);

  const getBufferSize = useCallback(() => {
    return bufferRef.current.length;
  }, []);

  return {
    addPatch,
    addPatches,
    flush: doFlush,
    clear,
    getBufferSize,
  };
}
