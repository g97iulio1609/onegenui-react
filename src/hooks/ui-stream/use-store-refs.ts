"use client";

/**
 * Store Refs Hook - Manages Zustand store references for async operations
 *
 * Centralizes:
 * - Store selector subscriptions
 * - Refs for async callback access
 * - Plan execution store actions
 */

import { useRef, useEffect } from "react";
import { useStore } from "../../store";
import type { PlanStoreActions } from "./plan-handler";

export interface TreeStoreRef {
  setUITree: ReturnType<typeof useStore>["setUITree"];
  setTreeStreaming: ReturnType<typeof useStore>["setTreeStreaming"];
  clearUITree: ReturnType<typeof useStore>["clearUITree"];
}

/**
 * Hook to get stable refs for store actions
 * Safe to use in async callbacks
 */
export function useStoreRefs() {
  // Tree store actions
  const storeSetUITree = useStore((s) => s.setUITree);
  const storeClearUITree = useStore((s) => s.clearUITree);
  const storeSetTreeStreaming = useStore((s) => s.setTreeStreaming);

  // Tool progress
  const addProgressEvent = useStore((s) => s.addProgressEvent);

  // Plan execution actions
  const setPlanCreated = useStore((s) => s.setPlanCreated);
  const setStepStarted = useStore((s) => s.setStepStarted);
  const setStepDone = useStore((s) => s.setStepDone);
  const setSubtaskStarted = useStore((s) => s.setSubtaskStarted);
  const setSubtaskDone = useStore((s) => s.setSubtaskDone);
  const setLevelStarted = useStore((s) => s.setLevelStarted);
  const setOrchestrationDone = useStore((s) => s.setOrchestrationDone);
  const resetPlanExecution = useStore((s) => s.resetPlanExecution);

  // Keep refs for async callbacks
  const addProgressRef = useRef(addProgressEvent);
  useEffect(() => {
    addProgressRef.current = addProgressEvent;
  }, [addProgressEvent]);

  // Tree store ref
  const storeRef = useRef<TreeStoreRef>({
    setUITree: storeSetUITree,
    setTreeStreaming: storeSetTreeStreaming,
    clearUITree: storeClearUITree,
  });
  useEffect(() => {
    storeRef.current = {
      setUITree: storeSetUITree,
      setTreeStreaming: storeSetTreeStreaming,
      clearUITree: storeClearUITree,
    };
  }, [storeSetUITree, storeSetTreeStreaming, storeClearUITree]);

  // Plan store ref
  const planStoreRef = useRef<PlanStoreActions>({
    setPlanCreated,
    setStepStarted,
    setStepDone,
    setSubtaskStarted,
    setSubtaskDone,
    setLevelStarted,
    setOrchestrationDone,
  });
  useEffect(() => {
    planStoreRef.current = {
      setPlanCreated,
      setStepStarted,
      setStepDone,
      setSubtaskStarted,
      setSubtaskDone,
      setLevelStarted,
      setOrchestrationDone,
    };
  }, [
    setPlanCreated,
    setStepStarted,
    setStepDone,
    setSubtaskStarted,
    setSubtaskDone,
    setLevelStarted,
    setOrchestrationDone,
  ]);

  return {
    storeRef,
    planStoreRef,
    addProgressRef,
    resetPlanExecution,
  };
}
