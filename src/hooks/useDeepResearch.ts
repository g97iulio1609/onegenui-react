"use client";

import { useCallback, useRef } from "react";
import { useStore } from "../store";
import type { DeepResearchEffortLevel } from "../store/slices/deep-research";

// =============================================================================
// Types
// =============================================================================

export interface DeepResearchCallbacks {
  onProgress?: (progress: number, phase: string) => void;
  onSourceFound?: (source: {
    url: string;
    title: string;
    domain: string;
  }) => void;
  onComplete?: (result: DeepResearchResult) => void;
  onError?: (error: Error) => void;
}

export interface DeepResearchResult {
  qualityScore: number;
  sourcesUsed: number;
  report?: unknown;
}

export interface DeepResearchPhase {
  id: string;
  label: string;
  weight: number;
}

// =============================================================================
// Configuration (aligned with @onegenui/deep-research)
// =============================================================================

const EFFORT_DISPLAY: Record<DeepResearchEffortLevel, string> = {
  standard: "~3 min",
  deep: "~10 min",
  max: "~30 min",
};

const RESEARCH_PHASES: DeepResearchPhase[] = [
  { id: "query-decomposition", label: "Query Decomposition", weight: 5 },
  { id: "source-discovery", label: "Source Discovery", weight: 25 },
  { id: "content-extraction", label: "Content Extraction", weight: 30 },
  { id: "analysis", label: "Analysis", weight: 20 },
  { id: "synthesis", label: "Synthesis", weight: 15 },
  { id: "visualization", label: "Visualization", weight: 5 },
];

// =============================================================================
// Event Handler for Streaming API
// =============================================================================

export interface DeepResearchEvent {
  type:
    | "phase-start"
    | "phase-progress"
    | "phase-complete"
    | "source-found"
    | "complete"
    | "error";
  phaseId?: string;
  progress?: number;
  message?: string;
  source?: { url: string; title: string; domain: string };
  result?: DeepResearchResult;
  error?: string;
}

/**
 * Hook for executing deep research from React components
 *
 * Integrates with:
 * - DeepResearchSlice for research-specific state
 * - ToolProgressSlice for unified progress display
 *
 * Designed to work with streaming API responses via handleEvent()
 */
export function useDeepResearch(callbacks: DeepResearchCallbacks = {}) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const toolCallIdRef = useRef<string>("");
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  // Deep Research store actions
  const startResearchAction = useStore((s) => s.startResearch);
  const updateResearchProgress = useStore((s) => s.updateResearchProgress);
  const updateResearchPhase = useStore((s) => s.updateResearchPhase);
  const addResearchSource = useStore((s) => s.addResearchSource);
  const completeResearch = useStore((s) => s.completeResearch);
  const failResearch = useStore((s) => s.failResearch);
  const stopResearchAction = useStore((s) => s.stopResearch);
  const clearActiveResearch = useStore((s) => s.clearActiveResearch);

  // Tool Progress store actions
  const addProgress = useStore((s) => s.addProgress);
  const updateProgress = useStore((s) => s.updateProgress);
  const removeProgress = useStore((s) => s.removeProgress);

  // Settings & state
  const settings = useStore((s) => s.deepResearchSettings);
  const activeResearch = useStore((s) => s.activeResearch);

  /**
   * Handle streaming events from the deep research API
   */
  const handleEvent = useCallback(
    (event: DeepResearchEvent) => {
      const toolCallId = toolCallIdRef.current;
      if (!toolCallId) return;

      switch (event.type) {
        case "phase-start": {
          if (event.phaseId) {
            const phase = RESEARCH_PHASES.find((p) => p.id === event.phaseId);
            if (phase) {
              updateResearchProgress({ currentPhase: phase.label });
              updateResearchPhase(event.phaseId, {
                status: "running",
                progress: 0,
                startTime: Date.now(),
              });
              updateProgress(toolCallId, {
                status: "progress",
                message: phase.label,
                progress: event.progress ?? 0,
              });
            }
          }
          break;
        }

        case "phase-progress": {
          if (event.phaseId && event.progress !== undefined) {
            updateResearchPhase(event.phaseId, { progress: event.progress });
            updateResearchProgress({ progress: event.progress });
            updateProgress(toolCallId, {
              status: "progress",
              progress: event.progress,
              message: event.message,
            });
            callbacksRef.current.onProgress?.(
              event.progress,
              event.message ?? "",
            );
          }
          break;
        }

        case "phase-complete": {
          if (event.phaseId) {
            updateResearchPhase(event.phaseId, {
              status: "complete",
              progress: 100,
              endTime: Date.now(),
            });
          }
          break;
        }

        case "source-found": {
          if (event.source) {
            addResearchSource({
              id: `src-${Date.now()}`,
              url: event.source.url,
              title: event.source.title,
              domain: event.source.domain,
              credibility: 0.5,
              status: "fetching",
            });
            callbacksRef.current.onSourceFound?.(event.source);
          }
          break;
        }

        case "complete": {
          const result = event.result ?? { qualityScore: 0.8, sourcesUsed: 0 };
          completeResearch(result.qualityScore);
          updateProgress(toolCallId, {
            status: "complete",
            message: "Research complete",
            progress: 100,
            data: result,
          });
          callbacksRef.current.onComplete?.(result);

          // Auto-remove from tool progress after delay
          setTimeout(() => removeProgress(toolCallId), 5000);
          break;
        }

        case "error": {
          const errorMessage = event.error ?? "Research failed";
          failResearch(errorMessage);
          updateProgress(toolCallId, {
            status: "error",
            message: errorMessage,
          });
          callbacksRef.current.onError?.(new Error(errorMessage));
          break;
        }
      }
    },
    [
      updateResearchProgress,
      updateResearchPhase,
      addResearchSource,
      completeResearch,
      failResearch,
      updateProgress,
      removeProgress,
    ],
  );

  /**
   * Start deep research on a query
   *
   * Returns an abort function to cancel the research
   */
  const startResearch = useCallback(
    (
      query: string,
      effortOverride?: DeepResearchEffortLevel,
    ): { abort: () => void; toolCallId: string } => {
      if (!settings.enabled) {
        console.warn("Deep Research is not enabled");
        return { abort: () => {}, toolCallId: "" };
      }

      // Abort any existing research
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const effort = effortOverride ?? settings.effortLevel;
      const toolCallId = `deep-research-${Date.now()}`;
      toolCallIdRef.current = toolCallId;

      // Initialize deep research state
      startResearchAction(query);

      // Add to tool progress for unified display
      addProgress({
        toolCallId,
        toolName: "deep-research",
        status: "starting",
        message: `Starting ${effort} research...`,
        data: {
          query,
          effort,
          estimatedTime: EFFORT_DISPLAY[effort],
        },
      });

      return {
        abort: () => abortControllerRef.current?.abort(),
        toolCallId,
      };
    },
    [settings, startResearchAction, addProgress],
  );

  /**
   * Stop ongoing research
   */
  const stopResearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    stopResearchAction();

    const toolCallId = toolCallIdRef.current;
    if (toolCallId) {
      updateProgress(toolCallId, {
        status: "complete",
        message: "Research stopped",
      });
      setTimeout(() => removeProgress(toolCallId), 2000);
    }
  }, [stopResearchAction, updateProgress, removeProgress]);

  /**
   * Clear research state
   */
  const clearResearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearActiveResearch();

    const toolCallId = toolCallIdRef.current;
    if (toolCallId) {
      removeProgress(toolCallId);
    }
  }, [clearActiveResearch, removeProgress]);

  /**
   * Get abort signal for API requests
   */
  const getAbortSignal = useCallback(() => {
    return abortControllerRef.current?.signal;
  }, []);

  const isResearching =
    activeResearch?.status === "initializing" ||
    activeResearch?.status === "searching" ||
    activeResearch?.status === "analyzing" ||
    activeResearch?.status === "synthesizing";

  return {
    // State
    isResearching,
    progress: activeResearch?.progress ?? 0,
    currentPhase: activeResearch?.currentPhase ?? "",
    sourcesFound: activeResearch?.sources.length ?? 0,
    error: activeResearch?.error ?? null,
    activeResearch,

    // Actions
    startResearch,
    stopResearch,
    clearResearch,
    handleEvent,
    getAbortSignal,

    // Settings
    isEnabled: settings.enabled,
    effortLevel: settings.effortLevel,

    // Constants
    phases: RESEARCH_PHASES,
  };
}
