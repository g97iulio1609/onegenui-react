"use client";

/**
 * Deep Research Tracker Hook - Manages deep research lifecycle in streams
 *
 * Module-level: constants (DEEP_RESEARCH_PHASES, PHASE_KEYWORDS) and
 * pure functions (mapDeepResearchPhase, normalizeDeepResearchProgress).
 *
 * Hook: Zustand store refs + initializeResearch, handleDeepResearchToolProgress,
 * handleCompletion, handleAbort, handleError.
 */

import { useRef, useEffect, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { useStore } from "../../store";
import type { DeepResearchEffortLevel, ResearchPhase } from "../../store/slices/deep-research";
import type { ToolProgress } from "../types";

// ── Constants ────────────────────────────────────────────────────────────────

export const DEEP_RESEARCH_PHASES: ReadonlyArray<ResearchPhase> = [
  { id: "decomposing", label: "Decomposing", status: "pending", progress: 0 },
  { id: "searching", label: "Searching", status: "pending", progress: 0 },
  { id: "ranking", label: "Ranking", status: "pending", progress: 0 },
  { id: "extracting", label: "Extracting", status: "pending", progress: 0 },
  { id: "analyzing", label: "Analyzing", status: "pending", progress: 0 },
  { id: "synthesizing", label: "Synthesizing", status: "pending", progress: 0 },
  { id: "visualizing", label: "Visualizing", status: "pending", progress: 0 },
];

export const PHASE_KEYWORDS: readonly [string, number][] = [
  ["decompos", 0], ["search", 1], ["rank", 2], ["extract", 3],
  ["analyz", 4], ["synth", 5], ["visual", 6],
] as const;

// ── Pure functions ───────────────────────────────────────────────────────────

export function mapDeepResearchPhase(message: string): ResearchPhase | null {
  const normalized = message.toLowerCase();
  for (const [keyword, index] of PHASE_KEYWORDS) {
    if (normalized.includes(keyword)) return DEEP_RESEARCH_PHASES[index] ?? null;
  }
  return null;
}

export function normalizeDeepResearchProgress(progress: number | undefined): number | undefined {
  if (typeof progress !== "number") return undefined;
  return Math.round(progress <= 1 ? progress * 100 : progress);
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export interface UseDeepResearchTrackerReturn {
  deepResearchActiveRef: React.MutableRefObject<boolean>;
  deepResearchToolCallIdRef: React.MutableRefObject<string | null>;
  initializeResearch: (context: Record<string, unknown> | undefined, prompt: string) => void;
  handleDeepResearchToolProgress: (progress: ToolProgress) => void;
  handleCompletion: () => void;
  handleAbort: () => void;
  handleError: (errorMessage: string) => void;
}

export function useDeepResearchTracker(): UseDeepResearchTrackerReturn {
  const { updateResearchProgress, updateResearchPhase, addResearchSource, completeResearch, failResearch } = useStore(
    useShallow((s) => ({
      updateResearchProgress: s.updateResearchProgress, updateResearchPhase: s.updateResearchPhase,
      addResearchSource: s.addResearchSource, completeResearch: s.completeResearch, failResearch: s.failResearch,
    })),
  );

  const deepResearchSettings = useStore((s) => s.deepResearchSettings);
  const deepResearchActiveRef = useRef(false);
  useEffect(() => { deepResearchActiveRef.current = deepResearchSettings.enabled; }, [deepResearchSettings.enabled]);

  const updateProgressRef = useRef(updateResearchProgress);
  const updatePhaseRef = useRef(updateResearchPhase);
  const addSourceRef = useRef(addResearchSource);
  const completeRef = useRef(completeResearch);
  const failRef = useRef(failResearch);
  useEffect(() => {
    updateProgressRef.current = updateResearchProgress;
    updatePhaseRef.current = updateResearchPhase;
    addSourceRef.current = addResearchSource;
    completeRef.current = completeResearch;
    failRef.current = failResearch;
  }, [updateResearchProgress, updateResearchPhase, addResearchSource, completeResearch, failResearch]);

  const deepResearchToolCallIdRef = useRef<string | null>(null);

  const initializeResearch = useCallback((context: Record<string, unknown> | undefined, prompt: string) => {
    deepResearchToolCallIdRef.current = null;
    if (!context?.deepResearch || !deepResearchActiveRef.current) return;
    const effort = (context.deepResearch as { effort?: DeepResearchEffortLevel }).effort ?? "standard";
    useStore.getState().setDeepResearchEffortLevel(effort);
    useStore.getState().startResearch(prompt);
    updateProgressRef.current({
      effortLevel: effort, status: "searching", currentPhase: "Decomposing",
      phases: DEEP_RESEARCH_PHASES.map((phase, i) => ({
        ...phase,
        status: i === 0 ? ("running" as const) : ("pending" as const),
        progress: 0,
        startTime: i === 0 ? Date.now() : undefined,
      })),
    });
  }, []);

  const handleDeepResearchToolProgress = useCallback((progress: ToolProgress) => {
    if (progress.toolName !== "deep-research") return;
    deepResearchToolCallIdRef.current = deepResearchToolCallIdRef.current ?? progress.toolCallId;

    const pv = normalizeDeepResearchProgress(progress.progress);
    if (typeof pv === "number") {
      updateProgressRef.current({ progress: pv, status: progress.status === "error" ? "error" : "searching" });
    }

    const message = progress.message?.trim();
    if (message) {
      const phase = mapDeepResearchPhase(message);
      if (phase) {
        updateProgressRef.current({ currentPhase: phase.label });
        updatePhaseRef.current(phase.id, { status: "running", startTime: Date.now() });
      }
      const sourceMatch = message.match(/\bhttps?:\/\/\S+/i);
      if (sourceMatch?.[0]) {
        try {
          const urlObj = new URL(sourceMatch[0]);
          addSourceRef.current({
            id: `src-${Date.now()}`, url: sourceMatch[0], title: urlObj.hostname,
            domain: urlObj.hostname.replace("www.", ""), credibility: 0.5, status: "analyzing",
          });
        } catch { /* ignore invalid URL */ }
      }
    }

    if (progress.status === "complete") {
      for (const p of DEEP_RESEARCH_PHASES) {
        updatePhaseRef.current(p.id, { status: "complete", progress: 100, endTime: Date.now() });
      }
      completeRef.current(0.8);
      updateProgressRef.current({ status: "complete", progress: 100, currentPhase: "Completed" });
    } else if (progress.status === "error") {
      failRef.current(progress.message ?? "Deep research failed");
    }
  }, []);

  const handleCompletion = useCallback(() => {
    if (deepResearchToolCallIdRef.current) updateProgressRef.current({ status: "complete", progress: 100 });
  }, []);

  const handleAbort = useCallback(() => {
    if (deepResearchToolCallIdRef.current) updateProgressRef.current({ status: "stopped" });
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    if (deepResearchToolCallIdRef.current) failRef.current(errorMessage);
  }, []);

  return {
    deepResearchActiveRef, deepResearchToolCallIdRef, initializeResearch,
    handleDeepResearchToolProgress, handleCompletion, handleAbort, handleError,
  };
}
