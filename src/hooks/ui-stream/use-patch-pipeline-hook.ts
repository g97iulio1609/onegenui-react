"use client";

/**
 * Patch Pipeline Hook - Creates and manages PatchPipeline instances
 *
 * Wraps createPatchPipeline with lifecycle management:
 * - create: resets previous pipeline, creates a new one bound to a turnId
 * - cleanup: resets and nullifies the current pipeline
 */

import { useRef, useCallback } from "react";
import { createPatchPipeline, type PatchPipeline } from "./patch-pipeline";
import type { TreeStoreBridge } from "./tree-store-bridge";

export interface UsePatchPipelineReturn {
  create: (options: {
    turnId: string;
    protectedTypes?: string[];
  }) => PatchPipeline;
  cleanup: () => void;
}

export function usePatchPipelineHook(
  bridge: TreeStoreBridge,
): UsePatchPipelineReturn {
  const pipelineRef = useRef<PatchPipeline | null>(null);

  const create = useCallback(
    (options: { turnId: string; protectedTypes?: string[] }) => {
      pipelineRef.current?.reset();
      const pipeline = createPatchPipeline(bridge, {
        patchOptions: {
          turnId: options.turnId,
          protectedTypes: options.protectedTypes ?? [],
        },
      });
      pipelineRef.current = pipeline;
      return pipeline;
    },
    [bridge],
  );

  const cleanup = useCallback(() => {
    pipelineRef.current?.reset();
    pipelineRef.current = null;
  }, []);

  return { create, cleanup };
}
