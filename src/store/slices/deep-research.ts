/**
 * Deep Research Slice - State management for deep research feature
 *
 * Manages research settings, active sessions, and results
 * Uses centralized configuration from @onegenui/deep-research
 */
import type { SliceCreator } from "../types";

// =============================================================================
// Types (aligned with @onegenui/deep-research/config)
// =============================================================================

export type DeepResearchEffortLevel = "standard" | "deep" | "max";

export interface DeepResearchSettings {
  enabled: boolean;
  effortLevel: DeepResearchEffortLevel;
  maxSteps: number;
  parallelRequests: number;
  autoStopOnQuality: boolean;
  includeVisualizations: boolean;
  qualityThreshold: number;
}

export interface AuthenticatedSource {
  platform: string;
  displayName: string;
  isConnected: boolean;
  lastValidated?: Date;
}

export interface ResearchPhase {
  id: string;
  label: string;
  status: "pending" | "running" | "complete" | "error";
  progress: number;
  details?: string;
  startTime?: number;
  endTime?: number;
}

export interface ResearchSource {
  id: string;
  url: string;
  title: string;
  domain: string;
  credibility: number;
  status: "fetching" | "analyzing" | "complete" | "error";
}

export interface ActiveResearch {
  id: string;
  query: string;
  effortLevel: DeepResearchEffortLevel;
  status:
    | "initializing"
    | "searching"
    | "analyzing"
    | "synthesizing"
    | "complete"
    | "error"
    | "stopped";
  startTime: number;
  estimatedTimeMs: number;
  progress: number;
  currentPhase: string;
  phases: ResearchPhase[];
  sources: ResearchSource[];
  sourcesTarget: number;
  error?: string;
}

export interface ResearchResultSummary {
  id: string;
  query: string;
  completedAt: number;
  sourcesUsed: number;
  qualityScore: number;
  hasVisualizations: boolean;
}

// =============================================================================
// Configuration (aligned with @onegenui/deep-research EFFORT_PRESETS)
// =============================================================================

interface EffortPreset {
  maxSteps: number;
  parallelRequests: number;
  qualityThreshold: number;
  estimatedTimeMs: number;
  sourcesTarget: number;
}

const EFFORT_PRESETS: Record<DeepResearchEffortLevel, EffortPreset> = {
  standard: {
    maxSteps: 50,
    parallelRequests: 10,
    qualityThreshold: 0.75,
    estimatedTimeMs: 3 * 60 * 1000,
    sourcesTarget: 25,
  },
  deep: {
    maxSteps: 100,
    parallelRequests: 15,
    qualityThreshold: 0.8,
    estimatedTimeMs: 10 * 60 * 1000,
    sourcesTarget: 50,
  },
  max: {
    maxSteps: 200,
    parallelRequests: 20,
    qualityThreshold: 0.9,
    estimatedTimeMs: 30 * 60 * 1000,
    sourcesTarget: 100,
  },
};

const RESEARCH_PHASES: Array<{ id: string; label: string }> = [
  { id: "query-decomposition", label: "Query Decomposition" },
  { id: "source-discovery", label: "Source Discovery" },
  { id: "content-extraction", label: "Content Extraction" },
  { id: "analysis", label: "Analysis" },
  { id: "synthesis", label: "Synthesis" },
  { id: "visualization", label: "Visualization" },
];

const createDefaultSettings = (): DeepResearchSettings => ({
  enabled: false,
  effortLevel: "standard",
  ...EFFORT_PRESETS.standard,
  autoStopOnQuality: true,
  includeVisualizations: true,
});

const MAX_HISTORY_SIZE = 20;

// =============================================================================
// Slice Interface
// =============================================================================

export interface DeepResearchSlice {
  // Settings
  deepResearchSettings: DeepResearchSettings;
  setDeepResearchEnabled: (enabled: boolean) => void;
  setDeepResearchEffortLevel: (level: DeepResearchEffortLevel) => void;
  setDeepResearchSettings: (settings: Partial<DeepResearchSettings>) => void;
  resetDeepResearchSettings: () => void;

  // Authenticated sources
  authenticatedSources: AuthenticatedSource[];
  setAuthenticatedSources: (sources: AuthenticatedSource[]) => void;
  updateAuthenticatedSource: (
    platform: string,
    updates: Partial<AuthenticatedSource>,
  ) => void;

  // Active research session
  activeResearch: ActiveResearch | null;
  startResearch: (query: string) => void;
  updateResearchProgress: (updates: Partial<ActiveResearch>) => void;
  updateResearchPhase: (
    phaseId: string,
    updates: Partial<ResearchPhase>,
  ) => void;
  addResearchSource: (source: ResearchSource) => void;
  updateResearchSource: (
    sourceId: string,
    updates: Partial<ResearchSource>,
  ) => void;
  stopResearch: () => void;
  completeResearch: (qualityScore: number) => void;
  failResearch: (error: string) => void;
  clearActiveResearch: () => void;

  // Research history
  researchHistory: ResearchResultSummary[];
  addToResearchHistory: (result: ResearchResultSummary) => void;
  clearResearchHistory: () => void;
}

// =============================================================================
// Slice Creator
// =============================================================================

export const createDeepResearchSlice: SliceCreator<DeepResearchSlice> = (
  set,
) => ({
  // Settings
  deepResearchSettings: createDefaultSettings(),

  setDeepResearchEnabled: (enabled) =>
    set((state) => {
      state.deepResearchSettings.enabled = enabled;
    }),

  setDeepResearchEffortLevel: (level) =>
    set((state) => {
      const preset = EFFORT_PRESETS[level];
      state.deepResearchSettings = {
        ...state.deepResearchSettings,
        effortLevel: level,
        maxSteps: preset.maxSteps,
        parallelRequests: preset.parallelRequests,
        qualityThreshold: preset.qualityThreshold,
      };
    }),

  setDeepResearchSettings: (settings) =>
    set((state) => {
      Object.assign(state.deepResearchSettings, settings);
    }),

  resetDeepResearchSettings: () =>
    set((state) => {
      state.deepResearchSettings = createDefaultSettings();
    }),

  // Authenticated sources
  authenticatedSources: [],

  setAuthenticatedSources: (sources) =>
    set((state) => {
      state.authenticatedSources = sources;
    }),

  updateAuthenticatedSource: (platform, updates) =>
    set((state) => {
      const index = state.authenticatedSources.findIndex(
        (s) => s.platform === platform,
      );
      if (index >= 0) {
        Object.assign(state.authenticatedSources[index]!, updates);
      }
    }),

  // Active research
  activeResearch: null,

  startResearch: (query) =>
    set((state) => {
      const level = state.deepResearchSettings.effortLevel;
      const preset = EFFORT_PRESETS[level];

      state.activeResearch = {
        id: `research-${Date.now()}`,
        query,
        effortLevel: level,
        status: "initializing",
        startTime: Date.now(),
        estimatedTimeMs: preset.estimatedTimeMs,
        progress: 0,
        currentPhase: RESEARCH_PHASES[0]!.label,
        phases: RESEARCH_PHASES.map((p, i) => ({
          ...p,
          status: i === 0 ? "running" : "pending",
          progress: 0,
        })),
        sources: [],
        sourcesTarget: preset.sourcesTarget,
      };
    }),

  updateResearchProgress: (updates) =>
    set((state) => {
      if (state.activeResearch) {
        Object.assign(state.activeResearch, updates);
      }
    }),

  updateResearchPhase: (phaseId, updates) =>
    set((state) => {
      if (state.activeResearch) {
        const phase = state.activeResearch.phases.find((p) => p.id === phaseId);
        if (phase) {
          Object.assign(phase, updates);
        }
      }
    }),

  addResearchSource: (source) =>
    set((state) => {
      if (state.activeResearch) {
        state.activeResearch.sources.push(source);
      }
    }),

  updateResearchSource: (sourceId, updates) =>
    set((state) => {
      if (state.activeResearch) {
        const source = state.activeResearch.sources.find(
          (s) => s.id === sourceId,
        );
        if (source) {
          Object.assign(source, updates);
        }
      }
    }),

  stopResearch: () =>
    set((state) => {
      if (state.activeResearch) {
        state.activeResearch.status = "stopped";
      }
    }),

  completeResearch: (qualityScore) =>
    set((state) => {
      if (state.activeResearch) {
        state.activeResearch.status = "complete";
        state.activeResearch.progress = 100;

        // Add to history
        state.researchHistory.unshift({
          id: state.activeResearch.id,
          query: state.activeResearch.query,
          completedAt: Date.now(),
          sourcesUsed: state.activeResearch.sources.filter(
            (s) => s.status === "complete",
          ).length,
          qualityScore,
          hasVisualizations: state.deepResearchSettings.includeVisualizations,
        });

        // Trim history
        if (state.researchHistory.length > MAX_HISTORY_SIZE) {
          state.researchHistory = state.researchHistory.slice(
            0,
            MAX_HISTORY_SIZE,
          );
        }
      }
    }),

  failResearch: (error) =>
    set((state) => {
      if (state.activeResearch) {
        state.activeResearch.status = "error";
        state.activeResearch.error = error;
      }
    }),

  clearActiveResearch: () =>
    set((state) => {
      state.activeResearch = null;
    }),

  // History
  researchHistory: [],

  addToResearchHistory: (result) =>
    set((state) => {
      state.researchHistory.unshift(result);
      if (state.researchHistory.length > MAX_HISTORY_SIZE) {
        state.researchHistory = state.researchHistory.slice(
          0,
          MAX_HISTORY_SIZE,
        );
      }
    }),

  clearResearchHistory: () =>
    set((state) => {
      state.researchHistory = [];
    }),
});
