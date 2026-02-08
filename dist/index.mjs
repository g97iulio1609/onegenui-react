// src/contexts/data.tsx
import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect
} from "react";
import { getByPath } from "@onegenui/core";

// src/store/index.ts
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";
import { useShallow } from "zustand/react/shallow";

// src/store/slices/domain.ts
var initialDataModel = {};
var initialAuth = {
  isSignedIn: false,
  user: void 0
};
var createDomainSlice = (set) => ({
  // Data model
  dataModel: initialDataModel,
  setDataModel: (data) => set({ dataModel: data }),
  updateDataModel: (path, value) => set((state) => {
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    const parts = normalizedPath.includes("/") ? normalizedPath.split("/") : normalizedPath.split(".");
    if (parts.length === 0 || parts.length === 1 && parts[0] === "") return;
    const obj = state.dataModel;
    if (parts.length === 1) {
      obj[parts[0]] = value;
      return;
    }
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }
    const lastKey = parts[parts.length - 1];
    current[lastKey] = value;
  }),
  resetDataModel: () => set({ dataModel: initialDataModel }),
  // Auth
  auth: initialAuth,
  setAuth: (auth) => set({ auth }),
  // Loading
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading })
});

// src/store/slices/ui.ts
var confirmationIdCounter = 0;
var createUISlice = (set) => ({
  // Confirmations
  confirmations: [],
  showConfirmation: (dialog) => {
    const id = `ui_confirm_${++confirmationIdCounter}`;
    set((state) => {
      state.confirmations.push({ ...dialog, id });
    });
    return id;
  },
  hideConfirmation: (id) => set((state) => {
    state.confirmations = state.confirmations.filter((c) => c.id !== id);
  }),
  // Tool progress
  toolProgress: /* @__PURE__ */ new Map(),
  setToolProgress: (progress) => set((state) => {
    state.toolProgress.set(progress.id, progress);
  }),
  clearToolProgress: (id) => set((state) => {
    state.toolProgress.delete(id);
  }),
  clearAllToolProgress: () => set({ toolProgress: /* @__PURE__ */ new Map() }),
  // Global loading
  globalLoading: false,
  setGlobalLoading: (globalLoading) => set({ globalLoading }),
  // Sidebar
  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => {
    state.sidebarOpen = !state.sidebarOpen;
  })
});

// src/store/slices/selection.ts
var selectionIdCounter = 0;
var generateSelectionId = () => `sel_${++selectionIdCounter}_${Date.now()}`;
var createSelectionSlice = (set, get) => ({
  // ─────────────────────────────────────────────────────────────────────────
  // Single selection
  // ─────────────────────────────────────────────────────────────────────────
  selectedKey: null,
  selectedElement: null,
  select: (key, element) => set({ selectedKey: key, selectedElement: element }),
  clearSelection: () => set({ selectedKey: null, selectedElement: null }),
  // ─────────────────────────────────────────────────────────────────────────
  // Multi-selection
  // ─────────────────────────────────────────────────────────────────────────
  multiSelectedKeys: /* @__PURE__ */ new Set(),
  addToMultiSelection: (key) => set((state) => {
    state.multiSelectedKeys.add(key);
  }),
  removeFromMultiSelection: (key) => set((state) => {
    state.multiSelectedKeys.delete(key);
  }),
  toggleMultiSelection: (key) => {
    const { multiSelectedKeys } = get();
    if (multiSelectedKeys.has(key)) {
      get().removeFromMultiSelection(key);
    } else {
      get().addToMultiSelection(key);
    }
  },
  clearMultiSelection: () => set({ multiSelectedKeys: /* @__PURE__ */ new Set() }),
  isMultiSelected: (key) => get().multiSelectedKeys.has(key),
  // ─────────────────────────────────────────────────────────────────────────
  // Deep selection
  // ─────────────────────────────────────────────────────────────────────────
  deepSelections: [],
  deepSelectionActive: false,
  addDeepSelection: (selection) => {
    const id = generateSelectionId();
    set((state) => {
      state.deepSelections.push({ ...selection, id, timestamp: Date.now() });
    });
    return id;
  },
  removeDeepSelection: (id) => set((state) => {
    state.deepSelections = state.deepSelections.filter((s) => s.id !== id);
  }),
  removeDeepSelectionByElement: (elementKey, cssPath) => set((state) => {
    state.deepSelections = state.deepSelections.filter(
      (s) => !(s.elementKey === elementKey && s.cssPath === cssPath)
    );
  }),
  clearDeepSelections: () => set({ deepSelections: [] }),
  clearDeepSelectionsForElement: (elementKey) => set((state) => {
    state.deepSelections = state.deepSelections.filter(
      (s) => s.elementKey !== elementKey
    );
  }),
  isDeepSelected: (elementKey, cssPath) => {
    return get().deepSelections.some(
      (s) => s.elementKey === elementKey && s.cssPath === cssPath
    );
  },
  getDeepSelectionsForElement: (elementKey) => {
    return get().deepSelections.filter((s) => s.elementKey === elementKey);
  },
  setDeepSelectionActive: (active) => {
    set({ deepSelectionActive: active });
    if (active) {
      setTimeout(() => {
        set({ deepSelectionActive: false });
      }, 100);
    }
  },
  // Derived state: flat selection map for component API
  getGranularSelection: () => {
    const result = {};
    for (const sel of get().deepSelections) {
      if (sel.itemId) {
        if (!result[sel.elementKey]) {
          result[sel.elementKey] = /* @__PURE__ */ new Set();
        }
        result[sel.elementKey].add(sel.itemId);
      }
    }
    return result;
  },
  // ─────────────────────────────────────────────────────────────────────────
  // Hover
  // ─────────────────────────────────────────────────────────────────────────
  hoveredKey: null,
  setHoveredKey: (hoveredKey) => set({ hoveredKey }),
  // ─────────────────────────────────────────────────────────────────────────
  // Focus
  // ─────────────────────────────────────────────────────────────────────────
  focusedKey: null,
  setFocusedKey: (focusedKey) => set({ focusedKey })
});

// src/store/slices/settings.ts
var defaultAISettings = {
  model: "gemini-3-flash-preview",
  temperature: 1,
  maxTokens: 65e3,
  streamingEnabled: true,
  autoSuggestions: true
};
var createSettingsSlice = (set) => ({
  // Theme
  theme: "system",
  setTheme: (theme) => set({ theme }),
  // AI settings
  aiSettings: defaultAISettings,
  setAISettings: (settings) => set((state) => {
    Object.assign(state.aiSettings, settings);
  }),
  resetAISettings: () => set({ aiSettings: defaultAISettings }),
  // Preferences
  compactMode: false,
  setCompactMode: (compactMode) => set({ compactMode }),
  animationsEnabled: true,
  setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled })
});

// src/store/slices/analytics.ts
var MAX_ACTIONS = 100;
var analyticsIdCounter = 0;
var createAnalyticsSlice = (set, get) => ({
  // Actions
  actions: [],
  trackAction: (action) => {
    const tracked = {
      ...action,
      id: `analytics_${++analyticsIdCounter}`,
      timestamp: Date.now()
    };
    set((state) => {
      state.actions.unshift(tracked);
      if (state.actions.length > MAX_ACTIONS) {
        state.actions = state.actions.slice(0, MAX_ACTIONS);
      }
      state.metrics.totalActions++;
      state.metrics.lastActionTime = tracked.timestamp;
    });
  },
  clearActions: () => set((state) => {
    state.actions = [];
    state.metrics.totalActions = 0;
  }),
  // Metrics
  metrics: {
    totalActions: 0,
    sessionStart: Date.now(),
    lastActionTime: 0
  },
  // Getters
  getRecentActions: (count = 10) => get().actions.slice(0, count),
  getActionsByType: (type) => get().actions.filter((a) => a.type === type),
  getActionsByElement: (elementKey) => get().actions.filter((a) => a.elementKey === elementKey)
});

// src/store/slices/actions.ts
var actionIdCounter = 0;
var generateActionId = () => `action_${++actionIdCounter}_${Date.now()}`;
var confirmationIdCounter2 = 0;
var generateConfirmationId = () => `confirm_${++confirmationIdCounter2}_${Date.now()}`;
var createActionsSlice = (set, get) => ({
  // ─────────────────────────────────────────────────────────────────────────
  // Loading states
  // ─────────────────────────────────────────────────────────────────────────
  loadingActions: /* @__PURE__ */ new Set(),
  isActionLoading: (actionName) => get().loadingActions.has(actionName),
  setActionLoading: (actionName, loading) => set((state) => {
    if (loading) {
      state.loadingActions.add(actionName);
    } else {
      state.loadingActions.delete(actionName);
    }
  }),
  clearActionLoading: (actionName) => set((state) => {
    state.loadingActions.delete(actionName);
  }),
  clearAllLoading: () => set({ loadingActions: /* @__PURE__ */ new Set() }),
  // ─────────────────────────────────────────────────────────────────────────
  // Pending Action Confirmations
  // ─────────────────────────────────────────────────────────────────────────
  pendingConfirmations: [],
  addPendingConfirmation: (confirmation) => {
    const id = generateConfirmationId();
    set((state) => {
      state.pendingConfirmations.push({
        ...confirmation,
        id,
        timestamp: Date.now()
      });
    });
    return id;
  },
  removePendingConfirmation: (id) => set((state) => {
    state.pendingConfirmations = state.pendingConfirmations.filter(
      (c) => c.id !== id
    );
  }),
  getPendingConfirmation: (id) => {
    return get().pendingConfirmations.find((c) => c.id === id);
  },
  clearPendingConfirmations: () => set({ pendingConfirmations: [] }),
  // Convenience aliases
  addConfirmation: (confirmation) => {
    const id = generateConfirmationId();
    set((state) => {
      state.pendingConfirmations.push({
        ...confirmation,
        id,
        timestamp: Date.now()
      });
    });
    return id;
  },
  removeConfirmation: (id) => set((state) => {
    state.pendingConfirmations = state.pendingConfirmations.filter(
      (c) => c.id !== id
    );
  }),
  // ─────────────────────────────────────────────────────────────────────────
  // Action history
  // ─────────────────────────────────────────────────────────────────────────
  actionHistory: [],
  maxHistorySize: 100,
  startAction: (actionName, payload) => {
    const id = generateActionId();
    set((state) => {
      state.loadingActions.add(actionName);
      state.actionHistory.push({
        id,
        actionName,
        status: "running",
        startTime: Date.now(),
        payload
      });
      if (state.actionHistory.length > state.maxHistorySize) {
        state.actionHistory = state.actionHistory.slice(-state.maxHistorySize);
      }
    });
    return id;
  },
  completeAction: (id, result) => set((state) => {
    const execution = state.actionHistory.find((a) => a.id === id);
    if (execution) {
      state.loadingActions.delete(execution.actionName);
      execution.status = "success";
      execution.endTime = Date.now();
      execution.result = result;
    }
  }),
  failAction: (id, error) => set((state) => {
    const execution = state.actionHistory.find((a) => a.id === id);
    if (execution) {
      state.loadingActions.delete(execution.actionName);
      execution.status = "error";
      execution.endTime = Date.now();
      execution.error = error;
    }
  }),
  getActionStatus: (id) => {
    return get().actionHistory.find((a) => a.id === id);
  },
  getRecentActionExecutions: (count = 10) => {
    return get().actionHistory.slice(-count);
  },
  addToHistory: (info) => {
    const id = generateActionId();
    set((state) => {
      state.actionHistory.push({
        id,
        actionName: info.actionName,
        status: "success",
        startTime: Date.now(),
        endTime: Date.now(),
        payload: info.payload
      });
      if (state.actionHistory.length > state.maxHistorySize) {
        state.actionHistory = state.actionHistory.slice(-state.maxHistorySize);
      }
    });
  },
  clearHistory: () => set({ actionHistory: [] })
});

// src/store/slices/validation.ts
var createValidationSlice = (set, get) => ({
  fieldStates: {},
  touchField: (path) => set((state) => {
    const existing = state.fieldStates[path];
    state.fieldStates[path] = {
      path,
      touched: true,
      validated: existing?.validated ?? false,
      validationResult: existing?.validationResult ?? null,
      lastValidatedAt: existing?.lastValidatedAt
    };
  }),
  untouchField: (path) => set((state) => {
    if (state.fieldStates[path]) {
      state.fieldStates[path].touched = false;
    }
  }),
  setFieldValidation: (path, result) => set((state) => {
    const existing = state.fieldStates[path];
    state.fieldStates[path] = {
      path,
      touched: existing?.touched ?? false,
      validated: true,
      validationResult: result,
      lastValidatedAt: Date.now()
    };
  }),
  clearFieldValidation: (path) => set((state) => {
    if (state.fieldStates[path]) {
      state.fieldStates[path].validated = false;
      state.fieldStates[path].validationResult = null;
      state.fieldStates[path].lastValidatedAt = void 0;
    }
  }),
  getFieldState: (path) => {
    return get().fieldStates[path];
  },
  isFieldTouched: (path) => {
    return get().fieldStates[path]?.touched ?? false;
  },
  isFieldValid: (path) => {
    const state = get().fieldStates[path];
    return state?.validationResult?.isValid ?? true;
  },
  getFieldErrors: (path) => {
    return get().fieldStates[path]?.validationResult?.errors ?? [];
  },
  isValidating: false,
  setIsValidating: (validating) => set({ isValidating: validating }),
  getFormState: () => {
    const { fieldStates, isValidating } = get();
    let touchedCount = 0;
    let errorCount = 0;
    let isValid = true;
    let isDirty = false;
    for (const state of Object.values(fieldStates)) {
      if (state.touched) {
        touchedCount++;
        isDirty = true;
      }
      if (state.validationResult && !state.validationResult.isValid) {
        isValid = false;
        errorCount += state.validationResult.errors.length;
      }
    }
    return { isValid, isDirty, isValidating, touchedCount, errorCount };
  },
  touchAllFields: (paths) => set((state) => {
    for (const path of paths) {
      const existing = state.fieldStates[path];
      state.fieldStates[path] = {
        path,
        touched: true,
        validated: existing?.validated ?? false,
        validationResult: existing?.validationResult ?? null,
        lastValidatedAt: existing?.lastValidatedAt
      };
    }
  }),
  clearAllValidation: () => {
    set({ fieldStates: {}, isValidating: false });
  },
  setMultipleFieldValidations: (results) => set((state) => {
    for (const { path, result } of results) {
      const existing = state.fieldStates[path];
      state.fieldStates[path] = {
        path,
        touched: existing?.touched ?? false,
        validated: true,
        validationResult: result,
        lastValidatedAt: Date.now()
      };
    }
  }),
  getFieldsWithErrors: () => {
    const result = [];
    for (const [path, state] of Object.entries(get().fieldStates)) {
      if (state.validationResult && !state.validationResult.isValid) {
        result.push(path);
      }
    }
    return result;
  },
  getTouchedFields: () => {
    const result = [];
    for (const [path, state] of Object.entries(get().fieldStates)) {
      if (state.touched) {
        result.push(path);
      }
    }
    return result;
  }
});

// src/store/slices/tool-progress.ts
var createToolProgressSlice = (set, get) => {
  const addProgressImpl = (event) => set((state) => {
    const timestamp = Date.now();
    const existingIndex = state.progressEvents.findIndex(
      (p) => p.toolCallId === event.toolCallId
    );
    if (existingIndex >= 0) {
      const existing = state.progressEvents[existingIndex];
      const messageHistory = existing?.messageHistory ?? [];
      if (event.message && !messageHistory.some((h) => h.message === event.message)) {
        messageHistory.push({ message: event.message, timestamp });
      }
      const storedEvent = {
        type: "tool-progress",
        ...event,
        timestamp,
        messageHistory
      };
      state.progressEvents[existingIndex] = storedEvent;
    } else {
      const messageHistory = event.message ? [{ message: event.message, timestamp }] : [];
      const storedEvent = {
        type: "tool-progress",
        ...event,
        timestamp,
        messageHistory
      };
      state.progressEvents.push(storedEvent);
      if (state.progressEvents.length > state.maxEvents) {
        state.progressEvents = state.progressEvents.slice(-state.maxEvents);
      }
    }
  });
  const updateProgressImpl = (toolCallId, updates) => set((state) => {
    const idx = state.progressEvents.findIndex(
      (p) => p.toolCallId === toolCallId
    );
    if (idx >= 0) {
      const existing = state.progressEvents[idx];
      if (existing) {
        Object.assign(existing, updates, { timestamp: Date.now() });
      }
    }
  });
  const clearProgressImpl = () => set({ progressEvents: [] });
  const clearCompletedOlderThanImpl = (ms) => {
    const cutoff = Date.now() - ms;
    set((state) => {
      state.progressEvents = state.progressEvents.filter(
        (p) => p.status !== "complete" && p.status !== "error" || p.timestamp > cutoff
      );
    });
  };
  return {
    progressEvents: [],
    maxEvents: 50,
    addProgress: addProgressImpl,
    addProgressEvent: addProgressImpl,
    updateProgress: updateProgressImpl,
    updateProgressEvent: updateProgressImpl,
    clearProgress: clearProgressImpl,
    clearProgressEvents: clearProgressImpl,
    clearCompletedOlderThan: clearCompletedOlderThanImpl,
    clearCompletedProgressOlderThan: clearCompletedOlderThanImpl,
    removeProgress: (toolCallId) => set((state) => {
      state.progressEvents = state.progressEvents.filter(
        (p) => p.toolCallId !== toolCallId
      );
    }),
    getProgress: (toolCallId) => {
      return get().progressEvents.find((p) => p.toolCallId === toolCallId);
    },
    getActiveProgress: () => {
      return get().progressEvents.filter(
        (p) => p.status === "starting" || p.status === "progress"
      );
    },
    getAllProgress: () => {
      return get().progressEvents;
    },
    isToolRunning: () => {
      return get().progressEvents.some(
        (p) => p.status === "starting" || p.status === "progress"
      );
    },
    isSpecificToolRunning: (toolName) => {
      return get().progressEvents.some(
        (p) => p.toolName === toolName && (p.status === "starting" || p.status === "progress")
      );
    },
    getProgressByToolName: (toolName) => {
      return get().progressEvents.filter((p) => p.toolName === toolName);
    }
  };
};

// src/store/slices/plan-execution.ts
var initialPlanState = {
  plan: null,
  isOrchestrating: false,
  parallelLevel: null,
  orchestrationStartTime: null
};
var createPlanExecutionSlice = (set, get) => ({
  planExecution: initialPlanState,
  setPlanCreated: (goal, steps) => {
    set((state) => {
      state.planExecution = {
        plan: {
          goal,
          steps: steps.map((s) => ({
            id: s.id,
            task: s.task,
            agent: s.agent,
            dependencies: s.dependencies ?? [],
            parallel: s.parallel,
            status: "pending",
            subtasks: s.subtasks?.map((st) => ({
              id: st.id,
              task: st.task,
              agent: st.agent,
              status: "pending"
            }))
          }))
        },
        isOrchestrating: true,
        parallelLevel: null,
        orchestrationStartTime: Date.now()
      };
    });
  },
  setStepStarted: (stepId) => {
    set((state) => {
      const step = state.planExecution.plan?.steps.find((s) => s.id === stepId);
      if (step) {
        step.status = "running";
        step.startTime = Date.now();
      }
    });
  },
  setStepDone: (stepId, result) => {
    set((state) => {
      const step = state.planExecution.plan?.steps.find((s) => s.id === stepId);
      if (step) {
        step.status = "complete";
        step.endTime = Date.now();
        step.result = result;
      }
    });
  },
  setStepError: (stepId, error) => {
    set((state) => {
      const step = state.planExecution.plan?.steps.find((s) => s.id === stepId);
      if (step) {
        step.status = "error";
        step.endTime = Date.now();
        step.result = { error };
      }
    });
  },
  setSubtaskStarted: (parentId, subtaskId) => {
    set((state) => {
      const step = state.planExecution.plan?.steps.find(
        (s) => s.id === parentId
      );
      const subtask = step?.subtasks?.find((st) => st.id === subtaskId);
      if (subtask) {
        subtask.status = "running";
        subtask.startTime = Date.now();
      }
    });
  },
  setSubtaskDone: (parentId, subtaskId, result) => {
    set((state) => {
      const step = state.planExecution.plan?.steps.find(
        (s) => s.id === parentId
      );
      const subtask = step?.subtasks?.find((st) => st.id === subtaskId);
      if (subtask) {
        subtask.status = "complete";
        subtask.endTime = Date.now();
      }
    });
  },
  setLevelStarted: (level) => {
    set((state) => {
      state.planExecution.parallelLevel = level;
    });
  },
  setOrchestrationDone: () => {
    set((state) => {
      state.planExecution.isOrchestrating = false;
      state.planExecution.parallelLevel = null;
    });
  },
  resetPlanExecution: () => {
    set((state) => {
      state.planExecution = initialPlanState;
    });
  },
  // Getters
  getActiveStep: () => {
    const plan = get().planExecution.plan;
    return plan?.steps.find((s) => s.status === "running") ?? null;
  },
  getActiveSubtask: () => {
    const plan = get().planExecution.plan;
    for (const step of plan?.steps ?? []) {
      const activeSubtask = step.subtasks?.find(
        (st) => st.status === "running"
      );
      if (activeSubtask) return activeSubtask;
    }
    return null;
  },
  getCompletedStepIds: () => {
    const plan = get().planExecution.plan;
    return plan?.steps.filter((s) => s.status === "complete").map((s) => s.id) ?? [];
  },
  getPlanProgress: () => {
    const plan = get().planExecution.plan;
    if (!plan) return { completed: 0, total: 0, percentage: 0 };
    const completed = plan.steps.filter((s) => s.status === "complete").length;
    const total = plan.steps.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round(completed / total * 100) : 0
    };
  },
  isPlanRunning: () => {
    return get().planExecution.isOrchestrating;
  }
});

// src/store/slices/deep-research.ts
var EFFORT_PRESETS = {
  standard: {
    maxSteps: 50,
    parallelRequests: 10,
    qualityThreshold: 0.75,
    estimatedTimeMs: 3 * 60 * 1e3,
    sourcesTarget: 25
  },
  deep: {
    maxSteps: 100,
    parallelRequests: 15,
    qualityThreshold: 0.8,
    estimatedTimeMs: 10 * 60 * 1e3,
    sourcesTarget: 50
  },
  max: {
    maxSteps: 200,
    parallelRequests: 20,
    qualityThreshold: 0.9,
    estimatedTimeMs: 30 * 60 * 1e3,
    sourcesTarget: 100
  }
};
var RESEARCH_PHASES = [
  { id: "query-decomposition", label: "Query Decomposition" },
  { id: "source-discovery", label: "Source Discovery" },
  { id: "content-extraction", label: "Content Extraction" },
  { id: "analysis", label: "Analysis" },
  { id: "synthesis", label: "Synthesis" },
  { id: "visualization", label: "Visualization" }
];
var createDefaultSettings = () => ({
  enabled: false,
  effortLevel: "standard",
  ...EFFORT_PRESETS.standard,
  autoStopOnQuality: true,
  includeVisualizations: true
});
var MAX_HISTORY_SIZE = 20;
var createDeepResearchSlice = (set) => ({
  // Settings
  deepResearchSettings: createDefaultSettings(),
  setDeepResearchEnabled: (enabled) => set((state) => {
    state.deepResearchSettings.enabled = enabled;
  }),
  setDeepResearchEffortLevel: (level) => set((state) => {
    const preset = EFFORT_PRESETS[level];
    state.deepResearchSettings = {
      ...state.deepResearchSettings,
      effortLevel: level,
      maxSteps: preset.maxSteps,
      parallelRequests: preset.parallelRequests,
      qualityThreshold: preset.qualityThreshold
    };
  }),
  setDeepResearchSettings: (settings) => set((state) => {
    Object.assign(state.deepResearchSettings, settings);
  }),
  resetDeepResearchSettings: () => set((state) => {
    state.deepResearchSettings = createDefaultSettings();
  }),
  // Authenticated sources
  authenticatedSources: [],
  setAuthenticatedSources: (sources) => set((state) => {
    state.authenticatedSources = sources;
  }),
  updateAuthenticatedSource: (platform, updates) => set((state) => {
    const index = state.authenticatedSources.findIndex(
      (s) => s.platform === platform
    );
    if (index >= 0) {
      Object.assign(state.authenticatedSources[index], updates);
    }
  }),
  // Active research
  activeResearch: null,
  startResearch: (query) => set((state) => {
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
      currentPhase: RESEARCH_PHASES[0].label,
      phases: RESEARCH_PHASES.map((p, i) => ({
        ...p,
        status: i === 0 ? "running" : "pending",
        progress: 0
      })),
      sources: [],
      sourcesTarget: preset.sourcesTarget
    };
  }),
  updateResearchProgress: (updates) => set((state) => {
    if (state.activeResearch) {
      Object.assign(state.activeResearch, updates);
    }
  }),
  updateResearchPhase: (phaseId, updates) => set((state) => {
    if (state.activeResearch) {
      const phase = state.activeResearch.phases.find((p) => p.id === phaseId);
      if (phase) {
        Object.assign(phase, updates);
      }
    }
  }),
  addResearchSource: (source) => set((state) => {
    if (state.activeResearch) {
      state.activeResearch.sources.push(source);
    }
  }),
  updateResearchSource: (sourceId, updates) => set((state) => {
    if (state.activeResearch) {
      const source = state.activeResearch.sources.find(
        (s) => s.id === sourceId
      );
      if (source) {
        Object.assign(source, updates);
      }
    }
  }),
  stopResearch: () => set((state) => {
    if (state.activeResearch) {
      state.activeResearch.status = "stopped";
    }
  }),
  completeResearch: (qualityScore) => set((state) => {
    if (state.activeResearch) {
      state.activeResearch.status = "complete";
      state.activeResearch.progress = 100;
      state.researchHistory.unshift({
        id: state.activeResearch.id,
        query: state.activeResearch.query,
        completedAt: Date.now(),
        sourcesUsed: state.activeResearch.sources.filter(
          (s) => s.status === "complete"
        ).length,
        qualityScore,
        hasVisualizations: state.deepResearchSettings.includeVisualizations
      });
      if (state.researchHistory.length > MAX_HISTORY_SIZE) {
        state.researchHistory = state.researchHistory.slice(
          0,
          MAX_HISTORY_SIZE
        );
      }
    }
  }),
  failResearch: (error) => set((state) => {
    if (state.activeResearch) {
      state.activeResearch.status = "error";
      state.activeResearch.error = error;
    }
  }),
  clearActiveResearch: () => set((state) => {
    state.activeResearch = null;
  }),
  // History
  researchHistory: [],
  addToResearchHistory: (result) => set((state) => {
    state.researchHistory.unshift(result);
    if (state.researchHistory.length > MAX_HISTORY_SIZE) {
      state.researchHistory = state.researchHistory.slice(
        0,
        MAX_HISTORY_SIZE
      );
    }
  }),
  clearResearchHistory: () => set((state) => {
    state.researchHistory = [];
  })
});

// src/store/slices/ui-tree.ts
import { loggers } from "@onegenui/utils";
var log = loggers.react;
var initialTree = null;
var createUITreeSlice = (set, get) => ({
  // State
  uiTree: initialTree,
  isTreeStreaming: false,
  treeVersion: 0,
  // Actions
  setUITree: (tree) => set((state) => {
    log.debug("[UITreeSlice] setUITree called", {
      hasTree: !!tree,
      elementsCount: tree?.elements ? Object.keys(tree.elements).length : 0,
      rootKey: tree?.root,
      prevVersion: state.treeVersion
    });
    state.uiTree = tree;
    state.treeVersion += 1;
  }),
  updateUITree: (updater) => set((state) => {
    if (state.uiTree) {
      const updated = updater(state.uiTree);
      state.uiTree = updated;
      state.treeVersion += 1;
    }
  }),
  setElement: (key, element) => set((state) => {
    if (state.uiTree) {
      state.uiTree.elements[key] = element;
      state.treeVersion += 1;
    }
  }),
  removeElement: (key) => set((state) => {
    if (state.uiTree && state.uiTree.elements[key]) {
      delete state.uiTree.elements[key];
      state.treeVersion += 1;
    }
  }),
  applyTreePatch: (patch) => set((state) => {
    if (!state.uiTree) return;
    if ((patch.op === "add" || patch.op === "replace") && patch.path.startsWith("/elements/")) {
      const key = patch.path.replace("/elements/", "").split("/")[0];
      if (key && patch.value) {
        if (patch.path === `/elements/${key}`) {
          state.uiTree.elements[key] = patch.value;
        } else {
          if (!state.uiTree.elements[key]) {
            state.uiTree.elements[key] = {
              type: "unknown",
              props: {}
            };
          }
          applyNestedPatch(
            state.uiTree.elements[key],
            patch.path.replace(`/elements/${key}`, ""),
            patch.value
          );
        }
        state.treeVersion += 1;
      }
    }
    if (patch.path === "/root" && typeof patch.value === "string") {
      state.uiTree.root = patch.value;
      state.treeVersion += 1;
    }
  }),
  setTreeStreaming: (streaming) => set({ isTreeStreaming: streaming }),
  clearUITree: () => set((state) => {
    state.uiTree = null;
    state.treeVersion = 0;
    state.isTreeStreaming = false;
  })
});
function applyNestedPatch(obj, path, value) {
  if (!path || path === "/") {
    return;
  }
  const parts = path.slice(1).split("/");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (!current[key] || typeof current[key] !== "object") {
      const nextKey = parts[i + 1];
      const isNextArray = nextKey === "-" || nextKey !== void 0 && /^\d+$/.test(nextKey);
      current[key] = isNextArray ? [] : {};
    }
    current = current[key];
  }
  const lastKey = parts[parts.length - 1];
  if (lastKey === "-" && Array.isArray(current)) {
    current.push(value);
  } else {
    current[lastKey] = value;
  }
}

// src/store/slices/workspace.ts
var createWorkspaceSlice = (set, get) => ({
  // Initial state
  documents: [],
  activeDocumentId: null,
  workspaceLayout: "chat-only",
  yoloMode: false,
  pendingEdits: [],
  isWorkspaceOpen: false,
  // Document actions
  createDocument: (title) => {
    const doc = {
      id: crypto.randomUUID(),
      title: title || `Document ${get().documents.length + 1}`,
      content: null,
      savedAt: null,
      modifiedAt: Date.now(),
      isDirty: false,
      format: "tiptap"
    };
    set((state) => ({
      documents: [...state.documents, doc],
      activeDocumentId: doc.id,
      isWorkspaceOpen: true,
      workspaceLayout: state.workspaceLayout === "chat-only" ? "split" : state.workspaceLayout
    }));
    return doc;
  },
  openDocument: (doc) => {
    set((state) => {
      const exists = state.documents.some((d) => d.id === doc.id);
      return {
        documents: exists ? state.documents : [...state.documents, doc],
        activeDocumentId: doc.id,
        isWorkspaceOpen: true,
        workspaceLayout: state.workspaceLayout === "chat-only" ? "split" : state.workspaceLayout
      };
    });
  },
  closeDocument: (id) => {
    set((state) => {
      const newDocs = state.documents.filter((d) => d.id !== id);
      const wasActive = state.activeDocumentId === id;
      return {
        documents: newDocs,
        activeDocumentId: wasActive ? newDocs[newDocs.length - 1]?.id || null : state.activeDocumentId,
        isWorkspaceOpen: newDocs.length > 0,
        workspaceLayout: newDocs.length === 0 ? "chat-only" : state.workspaceLayout
      };
    });
  },
  setActiveDocument: (id) => {
    set({ activeDocumentId: id });
  },
  updateDocumentContent: (id, content) => {
    set((state) => ({
      documents: state.documents.map(
        (doc) => doc.id === id ? { ...doc, content, modifiedAt: Date.now(), isDirty: true } : doc
      )
    }));
  },
  renameDocument: (id, title) => {
    set((state) => ({
      documents: state.documents.map(
        (doc) => doc.id === id ? { ...doc, title, isDirty: true } : doc
      )
    }));
  },
  markDocumentSaved: (id) => {
    set((state) => ({
      documents: state.documents.map(
        (doc) => doc.id === id ? { ...doc, savedAt: Date.now(), isDirty: false } : doc
      )
    }));
  },
  // Layout actions
  setWorkspaceLayout: (layout) => {
    set({
      workspaceLayout: layout,
      isWorkspaceOpen: layout !== "chat-only"
    });
  },
  toggleWorkspace: () => {
    set((state) => ({
      isWorkspaceOpen: !state.isWorkspaceOpen,
      workspaceLayout: state.isWorkspaceOpen ? "chat-only" : "split"
    }));
  },
  // AI edit actions
  setYoloMode: (enabled) => {
    set({ yoloMode: enabled });
  },
  addPendingEdit: (edit) => {
    const pendingEdit = {
      ...edit,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    const { yoloMode } = get();
    if (yoloMode) {
      get().updateDocumentContent(edit.documentId, edit.newContent);
    } else {
      set((state) => ({
        pendingEdits: [...state.pendingEdits, pendingEdit]
      }));
    }
  },
  approvePendingEdit: (editId) => {
    const edit = get().pendingEdits.find((e) => e.id === editId);
    if (edit) {
      get().updateDocumentContent(edit.documentId, edit.newContent);
    }
    set((state) => ({
      pendingEdits: state.pendingEdits.filter((e) => e.id !== editId)
    }));
  },
  rejectPendingEdit: (editId) => {
    set((state) => ({
      pendingEdits: state.pendingEdits.filter((e) => e.id !== editId)
    }));
  },
  clearPendingEdits: () => {
    set({ pendingEdits: [] });
  },
  // Helpers
  getActiveDocument: () => {
    const { documents, activeDocumentId } = get();
    return documents.find((d) => d.id === activeDocumentId) || null;
  },
  isDocumentOpen: (id) => {
    return get().documents.some((d) => d.id === id);
  }
});

// src/store/slices/canvas.ts
var createCanvasSlice = (set, get) => ({
  // Initial state
  canvasInstances: /* @__PURE__ */ new Map(),
  canvasPendingUpdates: [],
  // Instance management
  initCanvas: (canvasId, initialContent = null, options = {}) => {
    const existing = get().canvasInstances.get(canvasId);
    if (existing) {
      return existing;
    }
    const instance = {
      id: canvasId,
      content: initialContent,
      isStreaming: false,
      version: 0,
      updatedAt: Date.now(),
      isDirty: false,
      title: options.title,
      documentId: options.documentId
    };
    set((state) => {
      state.canvasInstances.set(canvasId, instance);
    });
    return instance;
  },
  removeCanvas: (canvasId) => {
    set((state) => {
      state.canvasInstances.delete(canvasId);
      state.canvasPendingUpdates = state.canvasPendingUpdates.filter(
        (u) => u.canvasId !== canvasId
      );
    });
  },
  hasCanvas: (canvasId) => {
    return get().canvasInstances.has(canvasId);
  },
  getCanvas: (canvasId) => {
    return get().canvasInstances.get(canvasId);
  },
  // Content updates
  updateCanvasContent: (canvasId, content) => {
    set((state) => {
      const instance = state.canvasInstances.get(canvasId);
      if (instance) {
        instance.content = content;
        instance.version += 1;
        instance.updatedAt = Date.now();
        instance.isDirty = true;
      }
    });
  },
  setCanvasStreaming: (canvasId, isStreaming) => {
    set((state) => {
      const instance = state.canvasInstances.get(canvasId);
      if (instance) {
        instance.isStreaming = isStreaming;
        if (!isStreaming) {
          const pendingForCanvas = state.canvasPendingUpdates.filter(
            (u) => u.canvasId === canvasId
          );
          if (pendingForCanvas.length > 0) {
            const latest = pendingForCanvas[pendingForCanvas.length - 1];
            if (latest) {
              instance.content = latest.content;
              instance.version += 1;
              instance.updatedAt = Date.now();
            }
            state.canvasPendingUpdates = state.canvasPendingUpdates.filter(
              (u) => u.canvasId !== canvasId
            );
          }
        }
      }
    });
  },
  setCanvasDirty: (canvasId, isDirty) => {
    set((state) => {
      const instance = state.canvasInstances.get(canvasId);
      if (instance) {
        instance.isDirty = isDirty;
      }
    });
  },
  // Batch updates
  queueCanvasUpdate: (canvasId, content) => {
    set((state) => {
      state.canvasPendingUpdates.push({
        canvasId,
        content,
        timestamp: Date.now()
      });
    });
  },
  flushCanvasUpdates: (canvasId) => {
    set((state) => {
      const pendingForCanvas = state.canvasPendingUpdates.filter(
        (u) => u.canvasId === canvasId
      );
      if (pendingForCanvas.length > 0) {
        const instance = state.canvasInstances.get(canvasId);
        if (instance) {
          const latest = pendingForCanvas[pendingForCanvas.length - 1];
          if (latest) {
            instance.content = latest.content;
            instance.version += 1;
            instance.updatedAt = Date.now();
          }
        }
        state.canvasPendingUpdates = state.canvasPendingUpdates.filter(
          (u) => u.canvasId !== canvasId
        );
      }
    });
  },
  clearCanvasPendingUpdates: (canvasId) => {
    set((state) => {
      state.canvasPendingUpdates = state.canvasPendingUpdates.filter(
        (u) => u.canvasId !== canvasId
      );
    });
  },
  // Selectors
  getCanvasIds: () => {
    return Array.from(get().canvasInstances.keys());
  },
  getStreamingCanvases: () => {
    return Array.from(get().canvasInstances.values()).filter(
      (c) => c.isStreaming
    );
  }
});

// src/store/slices/component-state.ts
var createComponentStateSlice = (set, get) => ({
  componentState: {},
  setComponentState: (elementKey, state) => set((s) => {
    s.componentState[elementKey] = state;
  }),
  updateComponentState: (elementKey, updates) => set((s) => {
    if (!s.componentState[elementKey]) {
      s.componentState[elementKey] = {};
    }
    Object.assign(s.componentState[elementKey], updates);
  }),
  mergeComponentState: (elementKey, updates) => set((s) => {
    s.componentState[elementKey] = {
      ...s.componentState[elementKey] ?? {},
      ...updates
    };
  }),
  clearComponentState: (elementKey) => set((s) => {
    delete s.componentState[elementKey];
  }),
  clearAllComponentState: () => set({ componentState: {} }),
  getElementState: (elementKey) => get().componentState[elementKey] ?? {}
});

// src/store/slices/mcp.ts
var MCP_API_BASE = "/api/mcp/servers";
async function apiFetch(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? res.statusText);
  }
  return res.json();
}
var createMcpSlice = (set) => ({
  // State
  servers: [],
  isLoadingServers: false,
  mcpError: null,
  // Synchronous setters (used by async actions)
  setServers: (servers) => set((state) => {
    state.servers = servers;
  }),
  setLoadingServers: (loading) => set((state) => {
    state.isLoadingServers = loading;
  }),
  setMcpError: (error) => set((state) => {
    state.mcpError = error;
  }),
  // Async actions
  fetchServers: async () => {
    set((state) => {
      state.isLoadingServers = true;
      state.mcpError = null;
    });
    try {
      const data = await apiFetch(MCP_API_BASE);
      set((state) => {
        state.servers = data.servers;
        state.isLoadingServers = false;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch servers";
      set((state) => {
        state.mcpError = message;
        state.isLoadingServers = false;
      });
    }
  },
  addServer: async (config) => {
    set((state) => {
      state.mcpError = null;
    });
    try {
      const data = await apiFetch(MCP_API_BASE, {
        method: "POST",
        body: JSON.stringify(config)
      });
      set((state) => {
        state.servers = data.servers;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add server";
      set((state) => {
        state.mcpError = message;
      });
      throw err;
    }
  },
  removeServer: async (serverId) => {
    set((state) => {
      state.mcpError = null;
    });
    try {
      await apiFetch(`${MCP_API_BASE}/${serverId}`, { method: "DELETE" });
      set((state) => {
        state.servers = state.servers.filter((s) => s.id !== serverId);
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove server";
      set((state) => {
        state.mcpError = message;
      });
    }
  },
  toggleServer: async (serverId) => {
    set((state) => {
      state.mcpError = null;
    });
    try {
      const data = await apiFetch(
        `${MCP_API_BASE}/${serverId}`,
        { method: "PATCH" }
      );
      set((state) => {
        const idx = state.servers.findIndex((s) => s.id === serverId);
        if (idx >= 0) {
          state.servers[idx] = data.server;
        }
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to toggle server";
      set((state) => {
        state.mcpError = message;
      });
    }
  }
});

// src/store/index.ts
enableMapSet();
var useStore = create()(
  devtools(
    subscribeWithSelector(
      immer((...args) => ({
        ...createDomainSlice(...args),
        ...createUISlice(...args),
        ...createSelectionSlice(...args),
        ...createSettingsSlice(...args),
        ...createAnalyticsSlice(...args),
        ...createActionsSlice(...args),
        ...createValidationSlice(...args),
        ...createToolProgressSlice(...args),
        ...createPlanExecutionSlice(...args),
        ...createDeepResearchSlice(...args),
        ...createUITreeSlice(...args),
        ...createWorkspaceSlice(...args),
        ...createCanvasSlice(...args),
        ...createComponentStateSlice(...args),
        ...createMcpSlice(...args)
      }))
    ),
    {
      name: "onegenui-store",
      enabled: process.env.NODE_ENV !== "production"
    }
  )
);
var useUIStore = useStore;
var useDeepSelections = () => useStore(useShallow((s) => s.deepSelections));
var useDeepSelectionActive = () => useStore((s) => s.deepSelectionActive);
var useGranularSelection = () => useStore(
  useShallow((s) => {
    const result = {};
    for (const sel of s.deepSelections) {
      if (sel.itemId) {
        if (!result[sel.elementKey]) {
          result[sel.elementKey] = /* @__PURE__ */ new Set();
        }
        result[sel.elementKey].add(sel.itemId);
      }
    }
    return result;
  })
);
var useLoadingActions = () => useStore(useShallow((s) => s.loadingActions));
var usePendingConfirmations = () => useStore(useShallow((s) => s.pendingConfirmations));
var useActionHistory = () => useStore(useShallow((s) => s.actionHistory));
var useFieldStates = () => useStore(useShallow((s) => s.fieldStates));
var useIsValidating = () => useStore((s) => s.isValidating);
var useFormState = () => useStore(
  useShallow((s) => {
    const states = Object.values(s.fieldStates);
    let touchedCount = 0;
    let errorCount = 0;
    let isValid = true;
    let isDirty = false;
    for (const state of states) {
      if (state.touched) {
        touchedCount++;
        isDirty = true;
      }
      if (state.validationResult && !state.validationResult.isValid) {
        isValid = false;
        errorCount += state.validationResult.errors.length;
      }
    }
    return {
      isValid,
      isDirty,
      isValidating: s.isValidating,
      touchedCount,
      errorCount
    };
  })
);
var useProgressEvents = () => useStore((s) => s.progressEvents);
var useActiveToolProgress = () => useStore(
  useShallow(
    (s) => s.progressEvents.filter(
      (e) => e.status === "starting" || e.status === "progress"
    )
  )
);
var useIsAnyToolRunning = () => useStore(
  (s) => s.progressEvents.some(
    (p) => p.status === "starting" || p.status === "progress"
  )
);
var selectPlanExecution = (s) => s.planExecution;
var usePlanExecution = () => useStore(selectPlanExecution);
var useIsPlanRunning = () => useStore((s) => s.planExecution.isOrchestrating);
var usePlanProgress = () => useStore(
  useShallow((s) => {
    const plan = s.planExecution.plan;
    if (!plan) return { completed: 0, total: 0, percentage: 0 };
    const completed = plan.steps.filter(
      (st) => st.status === "complete"
    ).length;
    const total = plan.steps.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round(completed / total * 100) : 0
    };
  })
);
var useActiveStep = () => useStore(
  (s) => s.planExecution.plan?.steps.find((st) => st.status === "running") ?? null
);
var useDeepResearchSettings = () => useStore((s) => s.deepResearchSettings);
var useDeepResearchEnabled = () => useStore((s) => s.deepResearchSettings.enabled);
var useDeepResearchEffortLevel = () => useStore((s) => s.deepResearchSettings.effortLevel);
var useActiveResearch = () => useStore((s) => s.activeResearch);
var useAuthenticatedSources = () => useStore((s) => s.authenticatedSources);
var useResearchHistory = () => useStore((s) => s.researchHistory);
var useIsResearchActive = () => useStore(
  (s) => s.activeResearch !== null && s.activeResearch.status !== "complete" && s.activeResearch.status !== "error" && s.activeResearch.status !== "stopped"
);
var useResearchProgress = () => useStore(
  useShallow((s) => {
    const research = s.activeResearch;
    if (!research)
      return { progress: 0, phase: "", sourcesFound: 0, sourcesTarget: 0 };
    return {
      progress: research.progress,
      phase: research.currentPhase,
      sourcesFound: research.sources.length,
      sourcesTarget: research.sourcesTarget
    };
  })
);
var useWorkspaceDocuments = () => useStore((s) => s.documents);
var useActiveDocumentId = () => useStore((s) => s.activeDocumentId);
var useWorkspaceLayout = () => useStore((s) => s.workspaceLayout);
var useYoloMode = () => useStore((s) => s.yoloMode);
var usePendingAIEdits = () => useStore((s) => s.pendingEdits);
var useIsWorkspaceOpen = () => useStore((s) => s.isWorkspaceOpen);
var useActiveDocument = () => useStore((s) => s.getActiveDocument());
var useWorkspaceActions = () => useStore(
  useShallow((s) => ({
    createDocument: s.createDocument,
    openDocument: s.openDocument,
    closeDocument: s.closeDocument,
    setActiveDocument: s.setActiveDocument,
    updateDocumentContent: s.updateDocumentContent,
    renameDocument: s.renameDocument,
    markDocumentSaved: s.markDocumentSaved,
    setWorkspaceLayout: s.setWorkspaceLayout,
    toggleWorkspace: s.toggleWorkspace,
    setYoloMode: s.setYoloMode,
    addPendingEdit: s.addPendingEdit,
    approvePendingEdit: s.approvePendingEdit,
    rejectPendingEdit: s.rejectPendingEdit,
    clearPendingEdits: s.clearPendingEdits
  }))
);
var useCanvasInstances = () => useStore(useShallow((s) => Array.from(s.canvasInstances.values())));
var useCanvasInstance = (canvasId) => useStore((s) => s.canvasInstances.get(canvasId));
var useCanvasContent = (canvasId) => useStore((s) => s.canvasInstances.get(canvasId)?.content ?? null);
var useCanvasVersion = (canvasId) => useStore((s) => s.canvasInstances.get(canvasId)?.version ?? 0);
var useCanvasIsStreaming = (canvasId) => useStore((s) => s.canvasInstances.get(canvasId)?.isStreaming ?? false);
var useCanvasActions = () => useStore(
  useShallow((s) => ({
    initCanvas: s.initCanvas,
    removeCanvas: s.removeCanvas,
    updateCanvasContent: s.updateCanvasContent,
    setCanvasStreaming: s.setCanvasStreaming,
    setCanvasDirty: s.setCanvasDirty,
    queueCanvasUpdate: s.queueCanvasUpdate,
    flushCanvasUpdates: s.flushCanvasUpdates,
    clearCanvasPendingUpdates: s.clearCanvasPendingUpdates
  }))
);
var useComponentState = (elementKey) => useStore((s) => s.componentState[elementKey] ?? {});
var useAllComponentState = () => useStore(useShallow((s) => s.componentState));
var useComponentStateActions = () => useStore(
  useShallow((s) => ({
    setComponentState: s.setComponentState,
    updateComponentState: s.updateComponentState,
    mergeComponentState: s.mergeComponentState,
    clearComponentState: s.clearComponentState,
    clearAllComponentState: s.clearAllComponentState,
    getElementState: s.getElementState
  }))
);
var useMcpServers = () => useStore(useShallow((s) => s.servers));
var useMcpLoadingServers = () => useStore((s) => s.isLoadingServers);
var useMcpError = () => useStore((s) => s.mcpError);
var useMcpActions = () => useStore(
  useShallow((s) => ({
    fetchServers: s.fetchServers,
    addServer: s.addServer,
    removeServer: s.removeServer,
    toggleServer: s.toggleServer
  }))
);

// src/contexts/data.tsx
import { jsx } from "react/jsx-runtime";
var DataContext = createContext(null);
function DataProvider({
  initialData = {},
  authState,
  onDataChange,
  children
}) {
  const data = useStore((s) => s.dataModel);
  const storeAuth = useStore((s) => s.auth);
  const setDataModel = useStore((s) => s.setDataModel);
  const updateDataModel = useStore((s) => s.updateDataModel);
  const setAuth = useStore((s) => s.setAuth);
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setDataModel(initialData);
    }
  }, []);
  useEffect(() => {
    if (authState) {
      setAuth(authState);
    }
  }, [authState, setAuth]);
  const get = useCallback((path) => getByPath(data, path), [data]);
  const set = useCallback(
    (path, value2) => {
      updateDataModel(path, value2);
      onDataChange?.(path, value2);
    },
    [updateDataModel, onDataChange]
  );
  const update = useCallback(
    (updates) => {
      for (const [path, value2] of Object.entries(updates)) {
        updateDataModel(path, value2);
        onDataChange?.(path, value2);
      }
    },
    [updateDataModel, onDataChange]
  );
  const effectiveAuth = authState ?? storeAuth;
  const value = useMemo(
    () => ({
      data,
      authState: effectiveAuth,
      get,
      set,
      update
    }),
    [data, effectiveAuth, get, set, update]
  );
  return /* @__PURE__ */ jsx(DataContext.Provider, { value, children });
}
function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within a DataProvider");
  }
  return ctx;
}
function useDataValue(path) {
  const value = useStore((s) => getByPath(s.dataModel, path));
  return value;
}
function useDataBinding(path) {
  const value = useDataValue(path);
  const updateDataModel = useStore((s) => s.updateDataModel);
  const setValue = useCallback(
    (newValue) => updateDataModel(path, newValue),
    [path, updateDataModel]
  );
  return [value, setValue];
}

// src/contexts/visibility.tsx
import {
  createContext as createContext2,
  useContext as useContext2,
  useMemo as useMemo2
} from "react";
import {
  evaluateVisibility
} from "@onegenui/core";
import { jsx as jsx2 } from "react/jsx-runtime";
var VisibilityContext = createContext2(null);
function VisibilityProvider({ children }) {
  const { data, authState } = useData();
  const ctx = useMemo2(
    () => ({
      dataModel: data,
      authState
    }),
    [data, authState]
  );
  const isVisible = useMemo2(
    () => (condition) => evaluateVisibility(condition, ctx),
    [ctx]
  );
  const value = useMemo2(
    () => ({ isVisible, ctx }),
    [isVisible, ctx]
  );
  return /* @__PURE__ */ jsx2(VisibilityContext.Provider, { value, children });
}
function useVisibility() {
  const ctx = useContext2(VisibilityContext);
  if (!ctx) {
    throw new Error("useVisibility must be used within a VisibilityProvider");
  }
  return ctx;
}
function useIsVisible(condition) {
  const { isVisible } = useVisibility();
  return isVisible(condition);
}

// src/contexts/actions.tsx
import React3, {
  createContext as createContext3,
  useContext as useContext3,
  useCallback as useCallback2,
  useMemo as useMemo3
} from "react";
import {
  resolveAction,
  executeAction
} from "@onegenui/core";

// src/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/contexts/actions.tsx
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var ActionContext = createContext3(null);
function ActionProvider({
  handlers: initialHandlers = {},
  navigate,
  onActionExecuted,
  children
}) {
  const { data, set } = useData();
  const loadingActions = useStore((s) => s.loadingActions);
  const setActionLoading = useStore((s) => s.setActionLoading);
  const clearActionLoading = useStore((s) => s.clearActionLoading);
  const pendingConfirmations = useStore((s) => s.pendingConfirmations);
  const addConfirmation = useStore((s) => s.addConfirmation);
  const removeConfirmation = useStore((s) => s.removeConfirmation);
  const addToHistory = useStore((s) => s.addToHistory);
  const [handlers, setHandlers] = React3.useState(initialHandlers);
  const [localPendingConfirmation, setLocalPendingConfirmation] = React3.useState(null);
  const registerHandler = useCallback2(
    (name, handler) => {
      setHandlers((prev) => ({ ...prev, [name]: handler }));
    },
    []
  );
  const execute = useCallback2(
    async (action) => {
      const resolved = resolveAction(action, data);
      const handler = handlers[resolved.name];
      if (!handler) {
        console.warn(`No handler registered for action: ${resolved.name}`);
        return;
      }
      const trackExecution = () => {
        addToHistory({
          actionName: resolved.name,
          payload: resolved.params
        });
        onActionExecuted?.({
          actionName: resolved.name,
          params: resolved.params
        });
      };
      if (resolved.confirm) {
        const confirmId = addConfirmation({
          actionName: resolved.name,
          title: resolved.confirm.title,
          message: resolved.confirm.message,
          confirmText: resolved.confirm.confirmLabel,
          cancelText: resolved.confirm.cancelLabel,
          payload: resolved.params
        });
        return new Promise((resolve, reject) => {
          setLocalPendingConfirmation({
            action: resolved,
            handler,
            resolve: () => {
              removeConfirmation(confirmId);
              setLocalPendingConfirmation(null);
              resolve();
            },
            reject: () => {
              removeConfirmation(confirmId);
              setLocalPendingConfirmation(null);
              reject(new Error("Action cancelled"));
            }
          });
        }).then(async () => {
          setActionLoading(resolved.name, true);
          try {
            await executeAction({
              action: resolved,
              handler,
              setData: set,
              navigate,
              executeAction: async (name) => {
                const subAction = { name };
                await execute(subAction);
              }
            });
            trackExecution();
          } finally {
            clearActionLoading(resolved.name);
          }
        });
      }
      setActionLoading(resolved.name, true);
      try {
        await executeAction({
          action: resolved,
          handler,
          setData: set,
          navigate,
          executeAction: async (name) => {
            const subAction = { name };
            await execute(subAction);
          }
        });
        trackExecution();
      } finally {
        clearActionLoading(resolved.name);
      }
    },
    [
      data,
      handlers,
      set,
      navigate,
      onActionExecuted,
      setActionLoading,
      clearActionLoading,
      addConfirmation,
      removeConfirmation,
      addToHistory
    ]
  );
  const confirm = useCallback2(() => {
    localPendingConfirmation?.resolve();
  }, [localPendingConfirmation]);
  const cancel = useCallback2(() => {
    localPendingConfirmation?.reject();
  }, [localPendingConfirmation]);
  const value = useMemo3(
    () => ({
      handlers,
      loadingActions,
      pendingConfirmation: localPendingConfirmation,
      execute,
      confirm,
      cancel,
      registerHandler
    }),
    [
      handlers,
      loadingActions,
      localPendingConfirmation,
      execute,
      confirm,
      cancel,
      registerHandler
    ]
  );
  return /* @__PURE__ */ jsx3(ActionContext.Provider, { value, children });
}
function useActions() {
  const ctx = useContext3(ActionContext);
  if (!ctx) {
    throw new Error("useActions must be used within an ActionProvider");
  }
  return ctx;
}
function useAction(action) {
  const { execute, loadingActions } = useActions();
  const isLoading = loadingActions.has(action.name);
  const executeAction2 = useCallback2(() => execute(action), [execute, action]);
  return { execute: executeAction2, isLoading };
}
function ConfirmDialog({
  confirm,
  onConfirm,
  onCancel
}) {
  const isDanger = confirm.variant === "danger";
  return /* @__PURE__ */ jsx3(
    "div",
    {
      className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
      onClick: onCancel,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white rounded-lg p-6 max-w-[400px] w-full shadow-2xl",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsx3("h3", { className: "m-0 mb-2 text-lg font-semibold", children: confirm.title }),
            /* @__PURE__ */ jsx3("p", { className: "m-0 mb-6 text-gray-500", children: confirm.message }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 justify-end", children: [
              /* @__PURE__ */ jsx3(
                "button",
                {
                  onClick: onCancel,
                  className: "px-4 py-2 rounded-md border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 transition-colors",
                  children: confirm.cancelLabel ?? "Cancel"
                }
              ),
              /* @__PURE__ */ jsx3(
                "button",
                {
                  onClick: onConfirm,
                  className: cn(
                    "px-4 py-2 rounded-md border-none text-white cursor-pointer transition-colors",
                    isDanger ? "bg-red-600 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-600"
                  ),
                  children: confirm.confirmLabel ?? "Confirm"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}

// src/contexts/validation.tsx
import React4, {
  createContext as createContext4,
  useContext as useContext4,
  useCallback as useCallback3,
  useMemo as useMemo4
} from "react";
import {
  runValidation
} from "@onegenui/core";
import { jsx as jsx4 } from "react/jsx-runtime";
var ValidationContext = createContext4(null);
function ValidationProvider({
  customFunctions = {},
  children
}) {
  const { data, authState } = useData();
  const fieldStates = useStore((s) => s.fieldStates);
  const touchField = useStore((s) => s.touchField);
  const setFieldValidation = useStore((s) => s.setFieldValidation);
  const clearFieldValidation = useStore((s) => s.clearFieldValidation);
  const [fieldConfigs, setFieldConfigs] = React4.useState({});
  const registerField = useCallback3(
    (path, config) => {
      setFieldConfigs((prev) => ({ ...prev, [path]: config }));
    },
    []
  );
  const validate = useCallback3(
    (path, config) => {
      const value2 = data[path.split("/").filter(Boolean).join(".")];
      const result = runValidation(config, {
        value: value2,
        dataModel: data,
        customFunctions,
        authState
      });
      setFieldValidation(path, {
        isValid: result.valid,
        errors: result.errors,
        // ValidationResult from core doesn't have warnings, use empty array
        warnings: []
      });
      return result;
    },
    [data, customFunctions, authState, setFieldValidation]
  );
  const touch = useCallback3(
    (path) => {
      touchField(path);
    },
    [touchField]
  );
  const clear = useCallback3(
    (path) => {
      clearFieldValidation(path);
    },
    [clearFieldValidation]
  );
  const validateAll = useCallback3(() => {
    let allValid = true;
    for (const [path, config] of Object.entries(fieldConfigs)) {
      const result = validate(path, config);
      if (!result.valid) {
        allValid = false;
      }
    }
    return allValid;
  }, [fieldConfigs, validate]);
  const contextFieldStates = useMemo4(() => {
    const result = {};
    for (const [path, state] of Object.entries(fieldStates)) {
      result[path] = {
        touched: state.touched,
        validated: state.validationResult !== null,
        result: state.validationResult ? {
          valid: state.validationResult.isValid,
          errors: state.validationResult.errors,
          checks: []
          // ValidationResult requires checks
        } : null
      };
    }
    return result;
  }, [fieldStates]);
  const value = useMemo4(
    () => ({
      customFunctions,
      fieldStates: contextFieldStates,
      validate,
      touch,
      clear,
      validateAll,
      registerField
    }),
    [
      customFunctions,
      contextFieldStates,
      validate,
      touch,
      clear,
      validateAll,
      registerField
    ]
  );
  return /* @__PURE__ */ jsx4(ValidationContext.Provider, { value, children });
}
function useValidation() {
  const ctx = useContext4(ValidationContext);
  if (!ctx) {
    throw new Error("useValidation must be used within a ValidationProvider");
  }
  return ctx;
}
function useFieldValidation(path, config) {
  const {
    fieldStates,
    validate: validateField,
    touch: touchField,
    clear: clearField,
    registerField
  } = useValidation();
  const configJson = config ? JSON.stringify(config) : null;
  React4.useEffect(() => {
    if (config && configJson) {
      registerField(path, config);
    }
  }, [path, configJson, registerField]);
  const state = fieldStates[path] ?? {
    touched: false,
    validated: false,
    result: null
  };
  const validate = useCallback3(
    () => validateField(path, config ?? { checks: [] }),
    [path, config, validateField]
  );
  const touch = useCallback3(() => touchField(path), [path, touchField]);
  const clear = useCallback3(() => clearField(path), [path, clearField]);
  return {
    state,
    validate,
    touch,
    clear,
    errors: state.result?.errors ?? [],
    isValid: state.result?.valid ?? true
  };
}

// src/contexts/selection/context.ts
import { createContext as createContext5 } from "react";
var SelectionContext = createContext5(void 0);

// src/contexts/selection/provider.tsx
import { useMemo as useMemo7, useEffect as useEffect4, useCallback as useCallback7 } from "react";

// src/contexts/selection/styles.ts
var SELECTION_STYLE_ID = "jsonui-selection-styles";
var SELECTION_CSS = `
@keyframes selection-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes selection-pulse {
  0%, 100% {
    box-shadow: inset 0 0 0 2px var(--primary, #3b82f6), 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: inset 0 0 0 2px var(--primary, #3b82f6), 0 0 12px 2px rgba(59, 130, 246, 0.2);
  }
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   TEXT SELECTION: Enable native text selection for copy/paste
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

/* Enable text selection on all JSON-UI components by default */
[data-jsonui-element-key] {
  user-select: text;
  -webkit-user-select: text;
}

/* Prevent text selection from being cleared when clicking in chat sidebar */
[data-chat-sidebar] {
  user-select: none;
  -webkit-user-select: none;
}

/* But allow selection in chat input fields */
[data-chat-sidebar] input,
[data-chat-sidebar] textarea {
  user-select: text;
  -webkit-user-select: text;
}

/* Disable text selection on interactive elements to prevent accidental selection */
[data-interactive],
[data-jsonui-element-key] button,
[data-jsonui-element-key] [role="button"],
[data-jsonui-element-key] input,
[data-jsonui-element-key] select,
[data-jsonui-element-key] textarea,
[data-jsonui-element-key] label,
[data-jsonui-element-key] [draggable="true"] {
  user-select: none;
  -webkit-user-select: none;
}

/* But allow selection on text content within labels */
[data-jsonui-element-key] label span,
[data-jsonui-element-key] label p {
  user-select: text;
  -webkit-user-select: text;
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ITEM SELECTION: Click on data-selectable-item elements
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

[data-selectable-item] {
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  position: relative;
}

[data-selectable-item]:hover:not([data-selected="true"]):not(.jsonui-item-selected) {
  background-color: rgba(255, 255, 255, 0.03);
  transform: translateY(-1px);
}

/* Data attribute based selection */
[data-selectable-item][data-selected="true"] {
  background: linear-gradient(
    110deg,
    #8b5cf6 0%,
    rgba(139, 92, 246, 0.15) 20%,
    rgba(196, 181, 253, 0.25) 40%,
    rgba(139, 92, 246, 0.15) 60%,
    #8b5cf6 100%
  ) !important;
  background-size: 200% 100% !important;
  animation: selection-shimmer 2.5s ease-in-out infinite !important;
  box-shadow: 
    inset 0 0 0 2px #8b5cf6,
    0 0 16px 4px rgba(139, 92, 246, 0.5),
    0 0 4px 1px rgba(139, 92, 246, 0.8) !important;
  z-index: 10 !important;
}

[data-selectable-item][data-selected="true"]::before {
  content: "";
  position: absolute;
  inset: 2px;
  background: #1a1a2e;
  border-radius: 6px;
  z-index: 0;
  opacity: 0.95;
}

[data-selectable-item][data-selected="true"] > * {
  position: relative;
  z-index: 1;
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   DEEP/GRANULAR SELECTION: Long-press on any element - BLUE shimmer
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.jsonui-deep-selected {
  position: relative !important;
  border-radius: 8px !important;
  z-index: 50 !important;
  padding: 4px 8px !important;
  margin: -4px -8px !important;
  /* Shimmer background - blue for granular */
  background: linear-gradient(
    110deg,
    #3b82f6 0%,
    rgba(59, 130, 246, 0.15) 20%,
    rgba(147, 197, 253, 0.25) 40%,
    rgba(59, 130, 246, 0.15) 60%,
    #3b82f6 100%
  ) !important;
  background-size: 200% 100% !important;
  animation: selection-shimmer 2.5s ease-in-out infinite !important;
  /* Bold inner border + outer glow */
  box-shadow: 
    inset 0 0 0 2px #3b82f6,
    0 0 20px 4px rgba(59, 130, 246, 0.6),
    0 0 6px 2px rgba(59, 130, 246, 0.8) !important;
  /* Ensure text stays visible */
  color: #fff !important;
}

/* Inner content layer for deep selection */
.jsonui-deep-selected::before {
  content: "" !important;
  position: absolute !important;
  inset: 2px !important;
  background: #0f172a !important;
  border-radius: 6px !important;
  z-index: 0 !important;
  opacity: 0.92 !important;
}

/* Text inside deep selection stays visible */
.jsonui-deep-selected > * {
  position: relative !important;
  z-index: 1 !important;
}

/* Item Selection via click - PURPLE shimmer (overrides deep-selected blue) */
.jsonui-item-selected {
  background: linear-gradient(
    110deg,
    #8b5cf6 0%,
    rgba(139, 92, 246, 0.15) 20%,
    rgba(196, 181, 253, 0.25) 40%,
    rgba(139, 92, 246, 0.15) 60%,
    #8b5cf6 100%
  ) !important;
  box-shadow: 
    inset 0 0 0 2px #8b5cf6,
    0 0 20px 4px rgba(139, 92, 246, 0.6),
    0 0 6px 2px rgba(139, 92, 246, 0.8) !important;
}

.jsonui-item-selected::before {
  background: #1a1a2e !important;
}

@keyframes selection-pulse {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.15);
  }
}
`;

// src/contexts/selection/utils.ts
var cssPathCache = /* @__PURE__ */ new WeakMap();
function getUniqueCSSPath(element, root) {
  let elementCache = cssPathCache.get(element);
  if (elementCache) {
    const cached = elementCache.get(root);
    if (cached !== void 0) {
      return cached;
    }
  }
  const parts = [];
  let current = element;
  while (current && current !== root && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (child) => child.tagName === current.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }
    parts.unshift(selector);
    current = current.parentElement;
  }
  const path = parts.join(" > ");
  if (!elementCache) {
    elementCache = /* @__PURE__ */ new Map();
    cssPathCache.set(element, elementCache);
  }
  elementCache.set(root, path);
  return path;
}
function selectableItemProps(elementKey, itemId, isSelected) {
  return {
    "data-selectable-item": "true",
    "data-element-key": elementKey,
    "data-item-id": itemId,
    "data-selected": isSelected ? "true" : void 0
  };
}

// src/contexts/selection/use-selection-state.ts
import { useCallback as useCallback4, useMemo as useMemo5, useRef } from "react";
var elementToCssPath = /* @__PURE__ */ new WeakMap();
var elementToElementKey = /* @__PURE__ */ new WeakMap();
function useSelectionState() {
  const storeSelections = useDeepSelections();
  const isDeepActive = useDeepSelectionActive();
  const addDeepSelection = useStore((s) => s.addDeepSelection);
  const removeDeepSelectionByElement = useStore(
    (s) => s.removeDeepSelectionByElement
  );
  const clearDeepSelections = useStore((s) => s.clearDeepSelections);
  const clearDeepSelectionsForElement = useStore(
    (s) => s.clearDeepSelectionsForElement
  );
  const setDeepSelectionActiveStore = useStore((s) => s.setDeepSelectionActive);
  const selectedElementsRef = useRef(/* @__PURE__ */ new Set());
  const deepSelectionActiveRef = useRef(false);
  deepSelectionActiveRef.current = isDeepActive;
  const deepSelections = useMemo5(() => {
    return storeSelections.map((sel) => ({
      ...sel,
      element: findElementByCssPath(sel.elementKey, sel.cssPath)
    }));
  }, [storeSelections]);
  const granularSelection = useMemo5(() => {
    const result = {};
    for (const sel of storeSelections) {
      if (sel.itemId) {
        if (!result[sel.elementKey]) {
          result[sel.elementKey] = /* @__PURE__ */ new Set();
        }
        result[sel.elementKey].add(sel.itemId);
      }
    }
    return result;
  }, [storeSelections]);
  const addSelection = useCallback4(
    (selection) => {
      if (selection.element) {
        elementToCssPath.set(selection.element, selection.cssPath);
        elementToElementKey.set(selection.element, selection.elementKey);
        selectedElementsRef.current.add(selection.element);
      }
      addDeepSelection({
        elementKey: selection.elementKey,
        cssPath: selection.cssPath,
        tagName: selection.tagName,
        textContent: selection.textContent,
        itemId: selection.itemId,
        selectionType: selection.selectionType
      });
    },
    [addDeepSelection]
  );
  const removeSelectionByElement = useCallback4(
    (element) => {
      const cssPath = elementToCssPath.get(element);
      const elementKey = elementToElementKey.get(element);
      if (!cssPath || !elementKey) return void 0;
      const removed = deepSelections.find(
        (s) => s.elementKey === elementKey && s.cssPath === cssPath
      );
      removeDeepSelectionByElement(elementKey, cssPath);
      selectedElementsRef.current.delete(element);
      return removed;
    },
    [deepSelections, removeDeepSelectionByElement]
  );
  const toggleSelection = useCallback4(
    (elementKey, itemId) => {
      const existing = storeSelections.find(
        (s) => s.elementKey === elementKey && s.itemId === itemId
      );
      if (existing) {
        const el = findElementByCssPath(elementKey, existing.cssPath);
        if (el) {
          el.classList.remove("jsonui-deep-selected", "jsonui-item-selected");
          el.removeAttribute("aria-selected");
          selectedElementsRef.current.delete(el);
        }
        removeDeepSelectionByElement(elementKey, existing.cssPath);
      } else {
        addDeepSelection({
          elementKey,
          cssPath: "",
          tagName: "div",
          textContent: "",
          itemId,
          selectionType: "item"
        });
      }
    },
    [storeSelections, removeDeepSelectionByElement, addDeepSelection]
  );
  const clearSelection = useCallback4(
    (elementKey) => {
      const removed = elementKey ? deepSelections.filter((s) => s.elementKey === elementKey) : deepSelections;
      for (const sel of removed) {
        if (sel.element) {
          sel.element.classList.remove(
            "jsonui-deep-selected",
            "jsonui-item-selected"
          );
          sel.element.removeAttribute("aria-selected");
          selectedElementsRef.current.delete(sel.element);
        }
      }
      if (elementKey) {
        clearDeepSelectionsForElement(elementKey);
      } else {
        clearDeepSelections();
      }
      return removed;
    },
    [deepSelections, clearDeepSelections, clearDeepSelectionsForElement]
  );
  const isSelected = useCallback4(
    (elementKey, itemId) => {
      return granularSelection[elementKey]?.has(itemId) ?? false;
    },
    [granularSelection]
  );
  const getSelectedItems = useCallback4(
    (elementKey) => {
      return Array.from(granularSelection[elementKey] ?? []);
    },
    [granularSelection]
  );
  const setDeepSelectionActive = useCallback4(() => {
    setDeepSelectionActiveStore(true);
  }, [setDeepSelectionActiveStore]);
  return {
    deepSelections,
    granularSelection,
    addSelection,
    removeSelectionByElement,
    toggleSelection,
    clearSelection,
    isSelected,
    getSelectedItems,
    selectedElementsRef,
    deepSelectionActiveRef,
    setDeepSelectionActive
  };
}
function findElementByCssPath(elementKey, cssPath) {
  if (typeof document === "undefined" || !cssPath) {
    return null;
  }
  const wrapper = document.querySelector(
    `[data-jsonui-element-key="${elementKey}"]`
  );
  if (!wrapper) return null;
  try {
    const el = wrapper.querySelector(cssPath);
    return el;
  } catch {
    return null;
  }
}

// src/contexts/selection/use-long-press.ts
import { useRef as useRef2, useCallback as useCallback5, useEffect as useEffect2 } from "react";
import { createLogger } from "@onegenui/utils";

// src/utils/dom.ts
var NATIVE_INTERACTIVE_TAGS = /* @__PURE__ */ new Set([
  "input",
  "button",
  "select",
  "textarea",
  "a",
  "label",
  "details",
  "summary",
  "dialog",
  "menu",
  "optgroup",
  "option",
  "datalist",
  "fieldset",
  "legend",
  "progress",
  "meter",
  "output"
]);
var INTERACTIVE_ARIA_ROLES = /* @__PURE__ */ new Set([
  "button",
  "checkbox",
  "radio",
  "switch",
  "link",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "tab",
  "slider",
  "spinbutton",
  "combobox",
  "listbox",
  "searchbox",
  "textbox",
  "scrollbar",
  "grid",
  "gridcell",
  "row",
  "rowheader",
  "columnheader",
  "tree",
  "treeitem",
  "treegrid",
  "tabpanel",
  "toolbar",
  "tooltip",
  "progressbar",
  "alertdialog"
]);
var INTERACTIVE_SELECTOR = [
  // Native elements
  "button",
  "input",
  "select",
  "textarea",
  "a[href]",
  "label",
  "details",
  "summary",
  // ARIA roles (most common)
  "[role='button']",
  "[role='checkbox']",
  "[role='radio']",
  "[role='switch']",
  "[role='link']",
  "[role='tab']",
  "[role='slider']",
  "[role='combobox']",
  "[role='listbox']",
  "[role='textbox']",
  "[role='menuitem']",
  "[role='option']",
  // Custom markers
  "[data-interactive]",
  "[data-interactive-wrapper]",
  "[data-checkbox]",
  "[data-no-select]",
  // Elements that look interactive
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
  // Clickable elements
  "[onclick]",
  "[draggable='true']"
].join(", ");
function isInteractiveElement(target) {
  const tagName = target.tagName.toLowerCase();
  if (NATIVE_INTERACTIVE_TAGS.has(tagName)) {
    return true;
  }
  const role = target.getAttribute("role")?.toLowerCase();
  if (role && INTERACTIVE_ARIA_ROLES.has(role)) {
    return true;
  }
  if (target.isContentEditable) {
    return true;
  }
  if (target.hasAttribute("data-interactive") || target.hasAttribute("data-interactive-wrapper") || target.hasAttribute("data-checkbox") || target.hasAttribute("data-no-select")) {
    return true;
  }
  if (target.hasAttribute("onclick")) {
    return true;
  }
  if (target.getAttribute("draggable") === "true") {
    return true;
  }
  const tabindex = target.getAttribute("tabindex");
  if (tabindex !== null && tabindex !== "-1") {
    const computedStyle = window.getComputedStyle(target);
    if (computedStyle.cursor === "pointer") {
      return true;
    }
  }
  const interactiveParent = target.closest(INTERACTIVE_SELECTOR);
  return interactiveParent !== null;
}
function shouldNeverSelect(target) {
  if (target.hasAttribute("data-resize-handle") || target.closest("[data-resize-handle]")) {
    return true;
  }
  if (target.hasAttribute("data-no-select") || target.closest("[data-no-select]")) {
    return true;
  }
  if (target.tagName === "CANVAS" || target.closest("canvas")) {
    return true;
  }
  return false;
}
function isSelectionInteraction(target, isDeepSelectionActive) {
  if (isDeepSelectionActive?.()) {
    return true;
  }
  if (isInteractiveElement(target)) {
    return false;
  }
  if (target.closest("[data-selectable-item]")) {
    return true;
  }
  if (target.closest(".jsonui-deep-selected, .jsonui-item-selected")) {
    return true;
  }
  if (target.closest("[data-selection-ui]")) {
    return true;
  }
  return false;
}

// src/contexts/selection/use-long-press.ts
var logger = createLogger({ prefix: "use-long-press" });
var DEFAULT_LONG_PRESS_CONFIG = {
  duration: 450,
  movementThreshold: 10,
  debug: false
};
function useLongPress(callbacks, config = {}) {
  const fullConfig = { ...DEFAULT_LONG_PRESS_CONFIG, ...config };
  const { duration, movementThreshold, debug } = fullConfig;
  const pressTimerRef = useRef2(null);
  const pressTargetRef = useRef2(null);
  const longPressCompletedRef = useRef2(false);
  const log4 = useCallback5(
    (message, ...args) => {
      if (debug) {
        logger.debug(`[LongPress] ${message}`, ...args);
      }
    },
    [debug]
  );
  const cancelPress = useCallback5(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    pressTargetRef.current = null;
  }, []);
  useEffect2(() => {
    const handlePointerDown = (e) => {
      if (e.button !== 0) {
        log4("pointerdown SKIPPED - not primary button:", e.button);
        return;
      }
      const target = e.target;
      log4("pointerdown on:", target.tagName, target.className);
      longPressCompletedRef.current = false;
      cancelPress();
      if (isInteractiveElement(target)) {
        log4("pointerdown SKIPPED - interactive element:", target.tagName);
        return;
      }
      if (shouldNeverSelect(target)) {
        log4("pointerdown SKIPPED - shouldNeverSelect:", target.tagName);
        return;
      }
      const componentWrapper = target.closest(
        "[data-jsonui-element-key]"
      );
      if (!componentWrapper) return;
      const skipTags = /* @__PURE__ */ new Set(["SCRIPT", "STYLE", "META", "LINK", "BR", "HR"]);
      if (skipTags.has(target.tagName)) return;
      if (target === componentWrapper) return;
      pressTargetRef.current = target;
      pressTimerRef.current = setTimeout(() => {
        if (!pressTargetRef.current) return;
        log4("Long-press triggered on:", pressTargetRef.current.tagName);
        callbacks.onLongPress(pressTargetRef.current, componentWrapper);
        longPressCompletedRef.current = true;
        pressTargetRef.current = null;
      }, duration);
    };
    const handlePointerUp = () => cancelPress();
    const handlePointerMove = (e) => {
      if (pressTargetRef.current && Math.abs(e.movementX) + Math.abs(e.movementY) > movementThreshold) {
        cancelPress();
      }
    };
    const handlePointerCancel = () => cancelPress();
    const handleClick = (e) => {
      if (e.button !== 0) {
        log4("click SKIPPED - not primary button:", e.button);
        return;
      }
      const target = e.target;
      log4("click on:", target.tagName, target.className);
      if (longPressCompletedRef.current) {
        log4("click SKIPPED - long-press just completed");
        longPressCompletedRef.current = false;
        return;
      }
      const textSelection = window.getSelection();
      if (textSelection && !textSelection.isCollapsed && textSelection.toString().trim()) {
        log4("click SKIPPED - text selection active");
        return;
      }
      if (isInteractiveElement(target)) {
        log4("click SKIPPED - interactive element:", target.tagName);
        return;
      }
      if (shouldNeverSelect(target)) {
        log4("click SKIPPED - shouldNeverSelect:", target.tagName);
        return;
      }
      callbacks.onClick(target, e);
    };
    const handleContextMenu = () => {
      cancelPress();
      callbacks.onContextMenu?.();
    };
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("pointerup", handlePointerUp, true);
    document.addEventListener("pointermove", handlePointerMove, true);
    document.addEventListener("pointercancel", handlePointerCancel, true);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("contextmenu", handleContextMenu, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("pointerup", handlePointerUp, true);
      document.removeEventListener("pointermove", handlePointerMove, true);
      document.removeEventListener("pointercancel", handlePointerCancel, true);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      cancelPress();
    };
  }, [callbacks, duration, movementThreshold, cancelPress, log4]);
  return {
    get longPressJustCompleted() {
      return longPressCompletedRef.current;
    }
  };
}

// src/contexts/edit-mode.tsx
import {
  createContext as createContext6,
  useContext as useContext5,
  useState,
  useCallback as useCallback6,
  useMemo as useMemo6,
  useRef as useRef3,
  useEffect as useEffect3
} from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var EditModeContext = createContext6(null);
function EditModeProvider({
  children,
  initialEditing = false,
  onCommit,
  autoSaveDelay = 1500,
  maxHistoryItems = 50
}) {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [focusedKey, setFocusedKey] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(/* @__PURE__ */ new Map());
  const [previousValues, setPreviousValues] = useState(/* @__PURE__ */ new Map());
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const autoSaveTimerRef = useRef3(null);
  useEffect3(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);
  const enableEditing = useCallback6(() => setIsEditing(true), []);
  const disableEditing = useCallback6(() => {
    setIsEditing(false);
    setFocusedKey(null);
    if (pendingChanges.size > 0) {
    }
  }, [pendingChanges.size]);
  const toggleEditing = useCallback6(() => setIsEditing((prev) => !prev), []);
  const recordChange = useCallback6(
    (elementKey, propName, newValue, previousValue) => {
      setPendingChanges((prev) => {
        const next = new Map(prev);
        const existing = next.get(elementKey) || {};
        next.set(elementKey, { ...existing, [propName]: newValue });
        return next;
      });
      if (previousValue !== void 0) {
        setPreviousValues((prev) => {
          const next = new Map(prev);
          const existing = next.get(elementKey) || {};
          if (!(propName in existing)) {
            next.set(elementKey, { ...existing, [propName]: previousValue });
          }
          return next;
        });
      }
      if (autoSaveDelay > 0) {
        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current);
        }
        autoSaveTimerRef.current = setTimeout(() => {
          commitChangesRef.current?.();
        }, autoSaveDelay);
      }
    },
    [autoSaveDelay]
  );
  const commitChangesRef = useRef3(void 0);
  const commitChanges = useCallback6(() => {
    if (pendingChanges.size === 0) return;
    const propChanges = [];
    const elementChanges = [];
    const now = Date.now();
    pendingChanges.forEach((props, key) => {
      const prevProps = previousValues.get(key) || {};
      for (const [propName, newValue] of Object.entries(props)) {
        propChanges.push({
          elementKey: key,
          propName,
          oldValue: prevProps[propName],
          newValue
        });
      }
      elementChanges.push({
        key,
        props,
        previousProps: prevProps,
        timestamp: now
      });
    });
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ changes: propChanges, timestamp: now });
      if (newHistory.length > maxHistoryItems) {
        return newHistory.slice(-maxHistoryItems);
      }
      return newHistory;
    });
    setHistoryIndex((prev) => prev + 1);
    if (onCommit) {
      onCommit(elementChanges);
    }
    setPendingChanges(/* @__PURE__ */ new Map());
    setPreviousValues(/* @__PURE__ */ new Map());
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, [pendingChanges, previousValues, historyIndex, maxHistoryItems, onCommit]);
  commitChangesRef.current = commitChanges;
  const discardChanges = useCallback6(() => {
    setPendingChanges(/* @__PURE__ */ new Map());
    setPreviousValues(/* @__PURE__ */ new Map());
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, []);
  const undo = useCallback6(() => {
    if (historyIndex < 0) return;
    const item = history[historyIndex];
    if (!item) return;
    const elementMap = /* @__PURE__ */ new Map();
    for (const change of item.changes) {
      const existing = elementMap.get(change.elementKey) || { props: {}, previousProps: {} };
      existing.props[change.propName] = change.oldValue;
      existing.previousProps[change.propName] = change.newValue;
      elementMap.set(change.elementKey, existing);
    }
    const undoChanges = Array.from(elementMap.entries()).map(([key, data]) => ({
      key,
      props: data.props,
      previousProps: data.previousProps,
      timestamp: Date.now()
    }));
    if (onCommit) {
      onCommit(undoChanges);
    }
    setHistoryIndex((prev) => prev - 1);
  }, [history, historyIndex, onCommit]);
  const redo = useCallback6(() => {
    if (historyIndex >= history.length - 1) return;
    const item = history[historyIndex + 1];
    if (!item) return;
    const elementMap = /* @__PURE__ */ new Map();
    for (const change of item.changes) {
      const existing = elementMap.get(change.elementKey) || { props: {}, previousProps: {} };
      existing.props[change.propName] = change.newValue;
      existing.previousProps[change.propName] = change.oldValue;
      elementMap.set(change.elementKey, existing);
    }
    const redoChanges = Array.from(elementMap.entries()).map(([key, data]) => ({
      key,
      props: data.props,
      previousProps: data.previousProps,
      timestamp: Date.now()
    }));
    if (onCommit) {
      onCommit(redoChanges);
    }
    setHistoryIndex((prev) => prev + 1);
  }, [history, historyIndex, onCommit]);
  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;
  const pendingCount = pendingChanges.size;
  const value = useMemo6(
    () => ({
      isEditing,
      enableEditing,
      disableEditing,
      toggleEditing,
      focusedKey,
      setFocusedKey,
      pendingChanges,
      recordChange,
      commitChanges,
      discardChanges,
      undo,
      redo,
      canUndo,
      canRedo,
      history,
      pendingCount,
      onCommit
    }),
    [
      isEditing,
      enableEditing,
      disableEditing,
      toggleEditing,
      focusedKey,
      setFocusedKey,
      pendingChanges,
      recordChange,
      commitChanges,
      discardChanges,
      undo,
      redo,
      canUndo,
      canRedo,
      history,
      pendingCount,
      onCommit
    ]
  );
  return /* @__PURE__ */ jsx5(EditModeContext.Provider, { value, children });
}
function useEditMode() {
  const context = useContext5(EditModeContext);
  if (!context) {
    return {
      isEditing: false,
      enableEditing: () => {
      },
      disableEditing: () => {
      },
      toggleEditing: () => {
      },
      focusedKey: null,
      setFocusedKey: () => {
      },
      pendingChanges: /* @__PURE__ */ new Map(),
      recordChange: () => {
      },
      commitChanges: () => {
      },
      discardChanges: () => {
      },
      undo: () => {
      },
      redo: () => {
      },
      canUndo: false,
      canRedo: false,
      history: [],
      pendingCount: 0
    };
  }
  return context;
}
function useIsElementEditing(elementKey) {
  const { isEditing, focusedKey } = useEditMode();
  return isEditing && focusedKey === elementKey;
}
function useElementEdit(elementKey) {
  const { isEditing, recordChange, focusedKey, setFocusedKey } = useEditMode();
  const handleChange = useCallback6(
    (propName, newValue) => {
      recordChange(elementKey, propName, newValue);
    },
    [elementKey, recordChange]
  );
  const handleFocus = useCallback6(() => {
    setFocusedKey(elementKey);
  }, [elementKey, setFocusedKey]);
  const handleBlur = useCallback6(() => {
  }, []);
  return {
    isEditing,
    isFocused: focusedKey === elementKey,
    handleChange,
    handleFocus,
    handleBlur
  };
}

// src/contexts/selection/provider.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
function SelectionProvider({ children }) {
  const selectionState = useSelectionState();
  const {
    deepSelections,
    granularSelection,
    addSelection,
    removeSelectionByElement,
    toggleSelection,
    clearSelection,
    isSelected,
    getSelectedItems,
    selectedElementsRef,
    deepSelectionActiveRef,
    setDeepSelectionActive
  } = selectionState;
  const { isEditing } = useEditMode();
  const isDeepSelectionActive = useCallback7(
    () => deepSelectionActiveRef.current,
    [deepSelectionActiveRef]
  );
  const clearDeepSelection = () => {
    selectedElementsRef.current.forEach((el) => {
      el.classList.remove("jsonui-deep-selected", "jsonui-item-selected");
      el.removeAttribute("aria-selected");
    });
    selectedElementsRef.current.clear();
    if (typeof document !== "undefined") {
      document.querySelectorAll(".jsonui-deep-selected, .jsonui-item-selected").forEach((el) => {
        el.classList.remove("jsonui-deep-selected", "jsonui-item-selected");
        el.removeAttribute("aria-selected");
      });
    }
    clearSelection();
  };
  const handleLongPress = (target, componentWrapper) => {
    if (isEditing) {
      return;
    }
    const elementKey = componentWrapper.getAttribute("data-jsonui-element-key");
    if (!elementKey) return;
    if (selectedElementsRef.current.has(target)) {
      target.classList.remove("jsonui-deep-selected");
      target.removeAttribute("aria-selected");
      removeSelectionByElement(target);
      return;
    }
    setDeepSelectionActive();
    const cssPath = getUniqueCSSPath(target, componentWrapper);
    const textContent = (target.textContent || "").trim().substring(0, 100);
    target.classList.add("jsonui-deep-selected");
    target.setAttribute("aria-selected", "true");
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    const selectableItem = target.closest(
      "[data-selectable-item]"
    );
    const itemId = selectableItem?.getAttribute("data-item-id") || void 0;
    addSelection({
      elementKey,
      cssPath,
      tagName: target.tagName.toLowerCase(),
      textContent,
      element: target,
      selectionType: "granular",
      itemId
    });
  };
  const handleClick = (target, _event) => {
    if (isEditing) {
      return;
    }
    const interactiveElement = target.closest(
      'button, input, textarea, select, a[href], [role="button"], [data-radix-collection-item], [data-state], [contenteditable="true"]'
    );
    if (interactiveElement) {
      return;
    }
    const selectableItem = target.closest(
      "[data-selectable-item]"
    );
    if (selectableItem) {
      const componentWrapper2 = selectableItem.closest(
        "[data-jsonui-element-key]"
      );
      if (!componentWrapper2) return;
      const elementKey = componentWrapper2.getAttribute(
        "data-jsonui-element-key"
      );
      if (!elementKey) return;
      if (selectedElementsRef.current.has(selectableItem)) {
        selectableItem.classList.remove(
          "jsonui-deep-selected",
          "jsonui-item-selected"
        );
        selectableItem.removeAttribute("aria-selected");
        removeSelectionByElement(selectableItem);
        return;
      }
      const itemId = selectableItem.getAttribute("data-item-id") || void 0;
      const cssPath = getUniqueCSSPath(selectableItem, componentWrapper2);
      const textContent = (selectableItem.textContent || "").trim().substring(0, 200);
      selectableItem.classList.add(
        "jsonui-deep-selected",
        "jsonui-item-selected"
      );
      selectableItem.setAttribute("aria-selected", "true");
      addSelection({
        elementKey,
        cssPath,
        tagName: selectableItem.tagName.toLowerCase(),
        textContent,
        element: selectableItem,
        selectionType: "item",
        itemId
      });
      return;
    }
    const componentWrapper = target.closest("[data-jsonui-element-key]");
    const isInChatArea = target.closest("[data-chat-sidebar]") || target.closest("input") || target.closest("textarea") || target.closest("[data-jsonui-no-clear-selection]");
    if (!componentWrapper && !isInChatArea && selectedElementsRef.current.size > 0) {
      clearDeepSelection();
    }
  };
  useLongPress(
    {
      onLongPress: handleLongPress,
      onClick: handleClick
    },
    { debug: false }
  );
  useEffect4(() => {
    if (typeof document === "undefined") return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && deepSelections.length > 0) {
        e.preventDefault();
        clearDeepSelection();
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && deepSelections.length > 0 && !document.activeElement?.matches("input, textarea, [contenteditable]")) {
        e.preventDefault();
        clearDeepSelection();
        return;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deepSelections, clearDeepSelection]);
  useEffect4(() => {
    return () => {
      selectedElementsRef.current.forEach((el) => {
        el.classList.remove("jsonui-deep-selected");
        el.removeAttribute("aria-selected");
      });
    };
  }, [selectedElementsRef]);
  useEffect4(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(SELECTION_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = SELECTION_STYLE_ID;
    style.textContent = SELECTION_CSS;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(SELECTION_STYLE_ID);
      if (el) el.remove();
    };
  }, []);
  const value = useMemo7(
    () => ({
      granularSelection,
      toggleSelection,
      clearSelection,
      isSelected,
      getSelectedItems,
      deepSelections,
      clearDeepSelection,
      isDeepSelectionActive
    }),
    [
      granularSelection,
      toggleSelection,
      clearSelection,
      isSelected,
      getSelectedItems,
      deepSelections,
      isDeepSelectionActive
    ]
  );
  return /* @__PURE__ */ jsx6(SelectionContext.Provider, { value, children });
}

// src/contexts/selection/hooks.ts
import { useContext as useContext6, useCallback as useCallback8, useMemo as useMemo8 } from "react";
function useSelection() {
  const context = useContext6(SelectionContext);
  if (context === void 0) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}
function useItemSelection(elementKey) {
  const { isSelected, getSelectedItems, granularSelection } = useSelection();
  const isItemSelected2 = useCallback8(
    (itemId) => isSelected(elementKey, itemId),
    [elementKey, isSelected]
  );
  const selectedItems = useMemo8(
    () => getSelectedItems(elementKey),
    [elementKey, getSelectedItems]
  );
  const hasSelection = useMemo8(
    () => (granularSelection[elementKey]?.size ?? 0) > 0,
    [elementKey, granularSelection]
  );
  return {
    isItemSelected: isItemSelected2,
    selectedItems,
    hasSelection
  };
}

// src/contexts/selection/use-dom-tracking.ts
import { useCallback as useCallback9 } from "react";

// src/contexts/selection/SelectableItem.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
function SelectableItem({
  elementKey,
  itemId,
  children,
  as: Component2 = "div",
  className,
  style,
  ...rest
}) {
  const { isSelected } = useSelection();
  const selected = isSelected(elementKey, itemId);
  const {
    elementKey: _ek,
    itemId: _id,
    as: _as,
    ...domProps
  } = rest;
  return /* @__PURE__ */ jsx7(
    Component2,
    {
      "data-selectable-item": "true",
      "data-element-key": elementKey,
      "data-item-id": itemId,
      "data-selected": selected ? "true" : void 0,
      className,
      style,
      ...domProps,
      children
    }
  );
}

// src/contexts/markdown/types.ts
var defaultTheme = {
  codeBlockBg: "rgba(0, 0, 0, 0.3)",
  codeBlockBorder: "rgba(255, 255, 255, 0.08)",
  inlineCodeBg: "rgba(0, 0, 0, 0.25)",
  linkColor: "var(--primary, #3b82f6)",
  blockquoteBorder: "var(--primary, #3b82f6)",
  hrColor: "rgba(255, 255, 255, 0.1)"
};
var createStyles = (theme) => ({
  codeBlock: {
    backgroundColor: theme.codeBlockBg,
    borderRadius: 8,
    padding: "12px 16px",
    overflowX: "auto",
    fontSize: 13,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    border: `1px solid ${theme.codeBlockBorder}`,
    margin: "8px 0"
  },
  inlineCode: {
    backgroundColor: theme.inlineCodeBg,
    borderRadius: 4,
    padding: "2px 6px",
    fontSize: "0.9em",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  },
  link: {
    color: theme.linkColor,
    textDecoration: "underline",
    textUnderlineOffset: 2
  },
  list: {
    margin: "8px 0",
    paddingLeft: 20,
    listStylePosition: "outside"
  },
  listItem: {
    marginBottom: 4
  },
  headingBase: {
    fontWeight: 600,
    marginTop: 12,
    marginBottom: 8
  },
  paragraph: {
    margin: "6px 0",
    lineHeight: 1.6
  },
  blockquote: {
    borderLeft: `3px solid ${theme.blockquoteBorder}`,
    paddingLeft: 12,
    margin: "8px 0",
    opacity: 0.9,
    fontStyle: "italic"
  },
  hr: {
    border: "none",
    borderTop: `1px solid ${theme.hrColor}`,
    margin: "12px 0"
  }
});

// src/contexts/markdown/internal-markdown.tsx
import React7, { useMemo as useMemo10 } from "react";
import ReactMarkdown from "react-markdown";
import { sanitizeUrl as sanitizeUrl2 } from "@onegenui/utils";

// src/contexts/citation/index.ts
import {
  createContext as createContext7,
  useContext as useContext7,
  useMemo as useMemo9,
  useState as useState2,
  useCallback as useCallback10,
  useEffect as useEffect5
} from "react";
import { createElement } from "react";
var CitationContext = createContext7(null);
function CitationProvider({ children }) {
  const [citations, setCitationsState] = useState2([]);
  const setCitations = useCallback10((newCitations) => {
    setCitationsState(newCitations);
  }, []);
  const addCitation = useCallback10((citation) => {
    setCitationsState((prev) => {
      if (prev.some((c) => c.id === citation.id)) return prev;
      return [...prev, citation];
    });
  }, []);
  const clearCitations = useCallback10(() => {
    setCitationsState([]);
  }, []);
  const getCitation = useCallback10(
    (id) => citations.find((c) => c.id === id),
    [citations]
  );
  useEffect5(() => {
    if (typeof window === "undefined") return;
    const handleCitations = (event) => {
      const newCitations = event.detail?.citations;
      if (newCitations && Array.isArray(newCitations)) {
        setCitationsState(newCitations);
      }
    };
    window.addEventListener(
      "onegenui:citations",
      handleCitations
    );
    return () => {
      window.removeEventListener(
        "onegenui:citations",
        handleCitations
      );
    };
  }, []);
  const value = useMemo9(
    () => ({
      citations,
      setCitations,
      addCitation,
      clearCitations,
      getCitation
    }),
    [citations, setCitations, addCitation, clearCitations, getCitation]
  );
  return createElement(CitationContext.Provider, { value }, children);
}
function useCitations() {
  const context = useContext7(CitationContext);
  if (!context) {
    return {
      citations: [],
      setCitations: () => {
      },
      addCitation: () => {
      },
      clearCitations: () => {
      },
      getCitation: () => void 0
    };
  }
  return context;
}

// src/contexts/citation/inline-citation.tsx
import { memo, useState as useState3, useRef as useRef4, useEffect as useEffect6, useCallback as useCallback11 } from "react";
import { isSafeUrl, sanitizeUrl } from "@onegenui/utils";
import { jsx as jsx8, jsxs as jsxs2 } from "react/jsx-runtime";
var InlineCitation = memo(function InlineCitation2({
  id,
  citation
}) {
  const [showPopover, setShowPopover] = useState3(false);
  const [popoverPosition, setPopoverPosition] = useState3(
    "bottom"
  );
  const buttonRef = useRef4(null);
  const popoverRef = useRef4(null);
  const updatePosition = useCallback11(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setPopoverPosition(spaceBelow < 200 ? "top" : "bottom");
  }, []);
  useEffect6(() => {
    if (!showPopover) return;
    const handleClick2 = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target) && buttonRef.current && !buttonRef.current.contains(e.target)) {
        setShowPopover(false);
      }
    };
    document.addEventListener("click", handleClick2);
    return () => document.removeEventListener("click", handleClick2);
  }, [showPopover]);
  if (!citation) {
    return /* @__PURE__ */ jsx8(
      "span",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 16,
          height: 16,
          padding: "0 4px",
          fontSize: 10,
          fontWeight: 500,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          color: "rgb(59, 130, 246)",
          borderRadius: 4,
          marginLeft: 2
        },
        children: id
      }
    );
  }
  const isWebSource = !!citation.url;
  const hasExcerpt = !!(citation.excerpt || citation.snippet);
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWebSource && !hasExcerpt && isSafeUrl(citation.url)) {
      window.open(citation.url, "_blank", "noopener,noreferrer");
    } else {
      updatePosition();
      setShowPopover(!showPopover);
    }
  };
  return /* @__PURE__ */ jsxs2("span", { style: { position: "relative", display: "inline-block" }, children: [
    /* @__PURE__ */ jsx8(
      "button",
      {
        ref: buttonRef,
        onClick: handleClick,
        title: citation.title,
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 16,
          height: 16,
          padding: "0 4px",
          fontSize: 10,
          fontWeight: 500,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          color: "rgb(59, 130, 246)",
          borderRadius: 4,
          marginLeft: 2,
          cursor: "pointer",
          border: "none",
          transition: "background-color 0.15s"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.3)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.2)";
        },
        children: id
      }
    ),
    showPopover && hasExcerpt && /* @__PURE__ */ jsxs2(
      "div",
      {
        ref: popoverRef,
        style: {
          position: "absolute",
          zIndex: 50,
          width: 288,
          maxWidth: "90vw",
          padding: 12,
          borderRadius: 8,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backgroundColor: "rgba(24, 24, 27, 0.95)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
          ...popoverPosition === "top" ? { bottom: "100%", marginBottom: 8 } : { top: "100%", marginTop: 8 },
          left: "50%",
          transform: "translateX(-50%)"
        },
        children: [
          /* @__PURE__ */ jsxs2(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
                paddingBottom: 8,
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
              },
              children: [
                citation.pageNumber && /* @__PURE__ */ jsxs2(
                  "span",
                  {
                    style: {
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 4,
                      backgroundColor: "rgba(59, 130, 246, 0.2)",
                      color: "rgb(59, 130, 246)",
                      flexShrink: 0
                    },
                    children: [
                      "p. ",
                      citation.pageNumber
                    ]
                  }
                ),
                /* @__PURE__ */ jsx8(
                  "span",
                  {
                    style: {
                      fontSize: 12,
                      fontWeight: 500,
                      color: "rgba(255, 255, 255, 0.8)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    },
                    children: citation.title
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs2(
            "p",
            {
              style: {
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 1.5,
                fontStyle: "italic",
                margin: 0
              },
              children: [
                '"',
                citation.excerpt || citation.snippet,
                '"'
              ]
            }
          ),
          isWebSource && /* @__PURE__ */ jsxs2(
            "a",
            {
              href: sanitizeUrl(citation.url),
              target: "_blank",
              rel: "noopener noreferrer",
              style: {
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 8,
                paddingTop: 8,
                borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                fontSize: 10,
                color: "rgb(59, 130, 246)",
                textDecoration: "none"
              },
              children: [
                citation.domain || "Open source",
                " \u2192"
              ]
            }
          )
        ]
      }
    )
  ] });
});

// src/contexts/markdown/internal-markdown.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
function parseCitationMarkers(text2, getCitation) {
  const parts = text2.split(/(\[\d+\])/g);
  return parts.map((part, idx) => {
    const match = part.match(/\[(\d+)\]/);
    if (match) {
      const id = match[1];
      const citation = getCitation(id);
      return /* @__PURE__ */ jsx9(InlineCitation, { id, citation }, `cite-${idx}`);
    }
    return part;
  });
}
function InternalMarkdown({
  content,
  inline,
  theme,
  className,
  style
}) {
  const styles = useMemo10(() => createStyles(theme), [theme]);
  const { getCitation, citations } = useCitations();
  const hasCitations = citations.length > 0;
  const components = useMemo10(
    () => ({
      // Images - responsive with high quality
      img: (props) => /* @__PURE__ */ jsx9(
        "img",
        {
          ...props,
          loading: "lazy",
          style: {
            maxWidth: "100%",
            height: "auto",
            borderRadius: 8,
            marginTop: 8,
            marginBottom: 8,
            objectFit: "contain",
            backgroundColor: "rgba(0,0,0,0.1)"
          }
        }
      ),
      // Videos - native player with controls
      video: (props) => /* @__PURE__ */ jsx9(
        "video",
        {
          ...props,
          controls: true,
          preload: "metadata",
          style: {
            maxWidth: "100%",
            height: "auto",
            borderRadius: 8,
            marginTop: 8,
            marginBottom: 8,
            backgroundColor: "#000"
          }
        }
      ),
      // Code blocks
      pre: ({ children }) => /* @__PURE__ */ jsx9("pre", { style: styles.codeBlock, children }),
      code: ({
        children,
        className: codeClassName
      }) => {
        const isInline = !codeClassName;
        if (isInline) {
          return /* @__PURE__ */ jsx9("code", { style: styles.inlineCode, children });
        }
        return /* @__PURE__ */ jsx9("code", { children });
      },
      // Links
      a: ({ href, children }) => /* @__PURE__ */ jsx9(
        "a",
        {
          href: sanitizeUrl2(href),
          target: "_blank",
          rel: "noopener noreferrer",
          style: styles.link,
          children
        }
      ),
      // Lists
      ul: ({ children }) => /* @__PURE__ */ jsx9("ul", { style: styles.list, children }),
      ol: ({ children }) => /* @__PURE__ */ jsx9(
        "ol",
        {
          style: {
            ...styles.list,
            listStyleType: "decimal",
            paddingLeft: 24
          },
          children
        }
      ),
      li: ({ children }) => /* @__PURE__ */ jsx9("li", { style: styles.listItem, children }),
      // Headings
      h1: ({ children }) => /* @__PURE__ */ jsx9("h1", { style: { ...styles.headingBase, fontSize: 18 }, children }),
      h2: ({ children }) => /* @__PURE__ */ jsx9("h2", { style: { ...styles.headingBase, fontSize: 16 }, children }),
      h3: ({ children }) => /* @__PURE__ */ jsx9("h3", { style: { ...styles.headingBase, fontSize: 15 }, children }),
      h4: ({ children }) => /* @__PURE__ */ jsx9("h4", { style: { ...styles.headingBase, fontSize: 14 }, children }),
      h5: ({ children }) => /* @__PURE__ */ jsx9("h5", { style: { ...styles.headingBase, fontSize: 13 }, children }),
      h6: ({ children }) => /* @__PURE__ */ jsx9("h6", { style: { ...styles.headingBase, fontSize: 12 }, children }),
      // Paragraphs - with citation parsing
      p: ({ children }) => {
        const processedChildren = hasCitations ? React7.Children.map(children, (child) => {
          if (typeof child === "string") {
            return parseCitationMarkers(child, getCitation);
          }
          return child;
        }) : children;
        return inline ? /* @__PURE__ */ jsx9("span", { children: processedChildren }) : /* @__PURE__ */ jsx9("p", { style: styles.paragraph, children: processedChildren });
      },
      // Blockquotes
      blockquote: ({ children }) => /* @__PURE__ */ jsx9("blockquote", { style: styles.blockquote, children }),
      // Horizontal rules
      hr: () => /* @__PURE__ */ jsx9("hr", { style: styles.hr }),
      // Strong/Bold - with citation parsing
      strong: ({ children }) => {
        const processedChildren = hasCitations ? React7.Children.map(children, (child) => {
          if (typeof child === "string") {
            return parseCitationMarkers(child, getCitation);
          }
          return child;
        }) : children;
        return /* @__PURE__ */ jsx9("strong", { style: { fontWeight: 600 }, children: processedChildren });
      },
      // Emphasis/Italic - with citation parsing
      em: ({ children }) => {
        const processedChildren = hasCitations ? React7.Children.map(children, (child) => {
          if (typeof child === "string") {
            return parseCitationMarkers(child, getCitation);
          }
          return child;
        }) : children;
        return /* @__PURE__ */ jsx9("em", { style: { fontStyle: "italic" }, children: processedChildren });
      }
    }),
    [styles, inline, hasCitations, getCitation]
  );
  const Wrapper = inline ? "span" : "div";
  return /* @__PURE__ */ jsx9(Wrapper, { className, style, children: /* @__PURE__ */ jsx9(ReactMarkdown, { components, children: content }) });
}

// src/contexts/markdown/provider.tsx
import {
  createContext as createContext8,
  useContext as useContext8,
  useMemo as useMemo11
} from "react";
import { jsx as jsx10 } from "react/jsx-runtime";
var MarkdownContext = createContext8(null);
function MarkdownProvider({
  children,
  enabled = true,
  theme: themeOverrides
}) {
  const theme = useMemo11(
    () => ({ ...defaultTheme, ...themeOverrides }),
    [themeOverrides]
  );
  const renderText = useMemo11(() => {
    return (content, options = {}) => {
      if (!content) return null;
      if (!enabled) {
        if (options.inline) {
          return /* @__PURE__ */ jsx10("span", { className: options.className, style: options.style, children: content });
        }
        return /* @__PURE__ */ jsx10("div", { className: options.className, style: options.style, children: content });
      }
      return /* @__PURE__ */ jsx10(
        InternalMarkdown,
        {
          content,
          inline: options.inline ?? false,
          theme,
          className: options.className,
          style: options.style
        }
      );
    };
  }, [enabled, theme]);
  const value = useMemo11(
    () => ({
      enabled,
      theme,
      renderText
    }),
    [enabled, theme, renderText]
  );
  return /* @__PURE__ */ jsx10(MarkdownContext.Provider, { value, children });
}
var fallbackRenderText = (content, options = {}) => {
  if (!content) return null;
  if (options.inline) {
    return /* @__PURE__ */ jsx10("span", { className: options.className, style: options.style, children: content });
  }
  return /* @__PURE__ */ jsx10("div", { className: options.className, style: options.style, children: content });
};
var fallbackContextValue = {
  enabled: false,
  theme: defaultTheme,
  renderText: fallbackRenderText
};
function useMarkdown() {
  const context = useContext8(MarkdownContext);
  return context ?? fallbackContextValue;
}
function useRenderText() {
  const { renderText } = useMarkdown();
  return renderText;
}

// src/contexts/ai-settings.tsx
import {
  createContext as createContext9,
  useContext as useContext9,
  useState as useState4,
  useEffect as useEffect7,
  useCallback as useCallback12,
  useRef as useRef5
} from "react";

// src/hooks/types.ts
function isLibraryAttachment(a) {
  return a.type === "library-document" && "documentId" in a;
}
function isFileAttachment(a) {
  return a.type !== "library-document" && "file" in a && a.file instanceof File;
}
function buildConversationMessages(turns) {
  const messages = [];
  for (const turn of turns) {
    if (turn.isProactive || !turn.assistantMessages?.length) continue;
    if (turn.userMessage) {
      messages.push({ role: "user", content: turn.userMessage });
    }
    const assistantContent = turn.assistantMessages.map((m) => m.content).filter(Boolean).join("\n");
    if (assistantContent) {
      messages.push({ role: "assistant", content: assistantContent });
    }
  }
  return messages;
}
var DEFAULT_AI_SETTINGS = {
  proactivity: {
    enabled: true,
    mode: "full",
    debounceMs: 2e3
  },
  suggestions: {
    enabled: true,
    maxChips: 4
  },
  dataCollection: {
    preferForm: true,
    autoAsk: true
  },
  onboarding: {
    showOnFirstUse: true,
    completed: false
  }
};

// src/contexts/ai-settings/types.ts
var STORAGE_KEY = "json-render-ai-settings";
var DEFAULT_EXTENDED_SETTINGS = {
  ...DEFAULT_AI_SETTINGS,
  documents: {
    smartParsingEnabled: false
  }
};

// src/contexts/ai-settings/storage.ts
function loadSettings() {
  if (typeof window === "undefined") return DEFAULT_EXTENDED_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        proactivity: {
          ...DEFAULT_EXTENDED_SETTINGS.proactivity,
          ...parsed.proactivity
        },
        suggestions: {
          ...DEFAULT_EXTENDED_SETTINGS.suggestions,
          ...parsed.suggestions
        },
        dataCollection: {
          ...DEFAULT_EXTENDED_SETTINGS.dataCollection,
          ...parsed.dataCollection
        },
        onboarding: {
          ...DEFAULT_EXTENDED_SETTINGS.onboarding,
          ...parsed.onboarding
        },
        documents: {
          ...DEFAULT_EXTENDED_SETTINGS.documents,
          ...parsed.documents
        }
      };
    }
  } catch {
  }
  return DEFAULT_EXTENDED_SETTINGS;
}
function saveSettings(settings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
  }
}
async function fetchSettingsFromAPI() {
  try {
    const res = await fetch("/api/settings");
    if (!res.ok) return null;
    const data = await res.json();
    return {
      proactivity: data.proactivity ?? DEFAULT_EXTENDED_SETTINGS.proactivity,
      suggestions: data.suggestions ?? DEFAULT_EXTENDED_SETTINGS.suggestions,
      dataCollection: data.dataCollection ?? DEFAULT_EXTENDED_SETTINGS.dataCollection,
      onboarding: {
        showOnFirstUse: DEFAULT_EXTENDED_SETTINGS.onboarding.showOnFirstUse,
        completed: data.onboarding?.completed ?? false
      },
      documents: data.documents ?? DEFAULT_EXTENDED_SETTINGS.documents
    };
  } catch {
    return null;
  }
}
async function saveSettingsToAPI(settings) {
  try {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    return res.ok;
  } catch {
    return false;
  }
}

// src/contexts/ai-settings.tsx
import { jsx as jsx11 } from "react/jsx-runtime";
var AISettingsContext = createContext9(null);
function AISettingsProvider({
  children,
  initialSettings
}) {
  const [settings, setSettings] = useState4(() => {
    const loaded = loadSettings();
    if (initialSettings) {
      return {
        proactivity: { ...loaded.proactivity, ...initialSettings.proactivity },
        suggestions: { ...loaded.suggestions, ...initialSettings.suggestions },
        dataCollection: {
          ...loaded.dataCollection,
          ...initialSettings.dataCollection
        },
        onboarding: { ...loaded.onboarding, ...initialSettings.onboarding },
        documents: { ...loaded.documents, ...initialSettings.documents }
      };
    }
    return loaded;
  });
  const [isLoading, setIsLoading] = useState4(true);
  const [isSyncing, setIsSyncing] = useState4(false);
  const syncTimeoutRef = useRef5(null);
  useEffect7(() => {
    fetchSettingsFromAPI().then((apiSettings) => {
      if (apiSettings) {
        setSettings(apiSettings);
        saveSettings(apiSettings);
      }
      setIsLoading(false);
    });
  }, []);
  const syncToAPI = useCallback12((newSettings) => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = setTimeout(async () => {
      setIsSyncing(true);
      await saveSettingsToAPI(newSettings);
      setIsSyncing(false);
    }, 500);
  }, []);
  const updateAndSync = useCallback12(
    (newSettings, changedPart) => {
      setSettings(newSettings);
      saveSettings(newSettings);
      syncToAPI(changedPart);
    },
    [syncToAPI]
  );
  const updateSettings = useCallback12(
    (partial) => {
      setSettings((prev) => {
        const next = {
          proactivity: { ...prev.proactivity, ...partial.proactivity },
          suggestions: { ...prev.suggestions, ...partial.suggestions },
          dataCollection: { ...prev.dataCollection, ...partial.dataCollection },
          onboarding: { ...prev.onboarding, ...partial.onboarding },
          documents: { ...prev.documents, ...partial.documents }
        };
        saveSettings(next);
        syncToAPI(partial);
        return next;
      });
    },
    [syncToAPI]
  );
  const setProactivityMode = useCallback12(
    (mode) => {
      const change = {
        proactivity: {
          enabled: mode !== "disabled",
          mode,
          debounceMs: settings.proactivity.debounceMs
        }
      };
      updateAndSync(
        {
          ...settings,
          proactivity: { ...settings.proactivity, ...change.proactivity }
        },
        change
      );
    },
    [settings, updateAndSync]
  );
  const setProactivityEnabled = useCallback12(
    (enabled) => {
      const change = {
        proactivity: {
          enabled,
          mode: enabled ? settings.proactivity.mode : "disabled",
          debounceMs: settings.proactivity.debounceMs
        }
      };
      updateAndSync(
        {
          ...settings,
          proactivity: { ...settings.proactivity, ...change.proactivity }
        },
        change
      );
    },
    [settings, updateAndSync]
  );
  const setSuggestionsEnabled = useCallback12(
    (enabled) => {
      const change = { suggestions: { ...settings.suggestions, enabled } };
      updateAndSync({ ...settings, ...change }, change);
    },
    [settings, updateAndSync]
  );
  const setDataCollectionPreferForm = useCallback12(
    (preferForm) => {
      const change = {
        dataCollection: { ...settings.dataCollection, preferForm }
      };
      updateAndSync({ ...settings, ...change }, change);
    },
    [settings, updateAndSync]
  );
  const setSmartParsingEnabled = useCallback12(
    (enabled) => {
      const change = { documents: { smartParsingEnabled: enabled } };
      updateAndSync({ ...settings, ...change }, change);
    },
    [settings, updateAndSync]
  );
  const resetSettings = useCallback12(() => {
    setSettings(DEFAULT_EXTENDED_SETTINGS);
    saveSettings(DEFAULT_EXTENDED_SETTINGS);
    syncToAPI(DEFAULT_EXTENDED_SETTINGS);
  }, [syncToAPI]);
  const completeOnboarding = useCallback12(() => {
    const change = { onboarding: { ...settings.onboarding, completed: true } };
    updateAndSync({ ...settings, ...change }, change);
  }, [settings, updateAndSync]);
  const value = {
    settings,
    updateSettings,
    setProactivityMode,
    setProactivityEnabled,
    setSuggestionsEnabled,
    setDataCollectionPreferForm,
    setSmartParsingEnabled,
    resetSettings,
    completeOnboarding,
    isLoading,
    isSyncing
  };
  return /* @__PURE__ */ jsx11(AISettingsContext.Provider, { value, children });
}
function useAISettings() {
  const context = useContext9(AISettingsContext);
  if (!context) {
    throw new Error("useAISettings must be used within AISettingsProvider");
  }
  return context;
}
function useAISettingsOptional() {
  return useContext9(AISettingsContext);
}
function useIsProactivityEnabled() {
  const context = useContext9(AISettingsContext);
  if (!context) return true;
  return context.settings.proactivity.enabled && context.settings.proactivity.mode !== "disabled";
}
function useAreSuggestionsEnabled() {
  const context = useContext9(AISettingsContext);
  if (!context) return true;
  return context.settings.suggestions.enabled;
}
function useIsSmartParsingEnabled() {
  const context = useContext9(AISettingsContext);
  if (!context) return false;
  return context.settings.documents.smartParsingEnabled;
}

// src/contexts/action-tracking/provider.tsx
import {
  createContext as createContext10,
  useState as useState5,
  useCallback as useCallback13,
  useRef as useRef6,
  useEffect as useEffect8
} from "react";

// src/contexts/action-tracking/types.ts
var DEFAULT_OPTIONS = {
  enabled: true,
  debounceMs: 2500,
  maxActionsInContext: 5
};

// src/contexts/action-tracking/utils.ts
var generateId = () => `action-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
var isUserCurrentlyEditing = () => {
  if (typeof document === "undefined") return false;
  const active = document.activeElement;
  if (!active) return false;
  const tag = active.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || active.isContentEditable;
};
function formatActionsForPrompt(actions) {
  if (actions.length === 0) return "";
  const formatted = actions.map((action) => {
    const parts = [`- ${action.type} on ${action.elementType}`];
    if (action.context?.itemLabel) {
      parts.push(`"${action.context.itemLabel}"`);
    }
    if (action.context?.previousValue !== void 0 && action.context?.newValue !== void 0) {
      parts.push(
        `(${action.context.previousValue} -> ${action.context.newValue})`
      );
    }
    return parts.join(" ");
  });
  return `
RECENT USER ACTIONS:
${formatted.join("\n")}

Based on these actions, you may proactively offer relevant assistance.
`;
}

// src/contexts/action-tracking/provider.tsx
import { jsx as jsx12 } from "react/jsx-runtime";
var ActionContext2 = createContext10(null);
function ActionProvider2({
  children,
  initialOptions
}) {
  const [options, setOptionsState] = useState5(() => ({
    ...DEFAULT_OPTIONS,
    ...initialOptions
  }));
  const [actions, setActions] = useState5([]);
  const [lastAction, setLastAction] = useState5(null);
  const subscribersRef = useRef6(
    /* @__PURE__ */ new Set()
  );
  const pendingActionsRef = useRef6([]);
  const timerRef = useRef6(null);
  const notifySubscribers = useCallback13((batch) => {
    subscribersRef.current.forEach((cb) => {
      try {
        cb(batch);
      } catch (e) {
        console.error("[ActionTracker] Subscriber error:", e);
      }
    });
  }, []);
  const tryFlush = useCallback13(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (pendingActionsRef.current.length === 0) return;
    if (isUserCurrentlyEditing()) {
      timerRef.current = setTimeout(tryFlush, 1e3);
      return;
    }
    const batch = [...pendingActionsRef.current];
    pendingActionsRef.current = [];
    notifySubscribers(batch);
  }, [notifySubscribers]);
  const scheduleFlush = useCallback13(
    (delayMs) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(tryFlush, delayMs);
    },
    [tryFlush]
  );
  const trackAction = useCallback13(
    (actionData) => {
      if (!options.enabled) return;
      const action = {
        ...actionData,
        id: generateId(),
        timestamp: Date.now()
      };
      setActions((prev) => {
        const next = [...prev, action];
        return next.slice(-(options.maxActionsInContext ?? 5));
      });
      setLastAction(action);
      pendingActionsRef.current.push(action);
      scheduleFlush(options.debounceMs ?? 2500);
    },
    [
      options.enabled,
      options.maxActionsInContext,
      options.debounceMs,
      scheduleFlush
    ]
  );
  const clearActions = useCallback13(() => {
    setActions([]);
    setLastAction(null);
    pendingActionsRef.current = [];
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  const getActionsForContext = useCallback13(() => {
    return actions.slice(-(options.maxActionsInContext ?? 5));
  }, [actions, options.maxActionsInContext]);
  const onAction = useCallback13(
    (callback) => {
      subscribersRef.current.add(callback);
      return () => subscribersRef.current.delete(callback);
    },
    []
  );
  const setOptions = useCallback13(
    (newOptions) => {
      setOptionsState((prev) => ({ ...prev, ...newOptions }));
    },
    []
  );
  useEffect8(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  useEffect8(() => {
    if (typeof document === "undefined") return;
    let focusOutTimeout = null;
    const handleFocusOut = (e) => {
      const target = e.target;
      const tag = target?.tagName?.toLowerCase();
      const isEditable = tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable;
      if (!isEditable) return;
      focusOutTimeout = setTimeout(() => {
        if (!isUserCurrentlyEditing() && pendingActionsRef.current.length > 0) {
          scheduleFlush(options.debounceMs ?? 2500);
        }
      }, 100);
    };
    document.addEventListener("focusout", handleFocusOut, true);
    return () => {
      document.removeEventListener("focusout", handleFocusOut, true);
      if (focusOutTimeout) clearTimeout(focusOutTimeout);
    };
  }, [options.debounceMs, scheduleFlush]);
  const value = {
    actions,
    trackAction,
    clearActions,
    getActionsForContext,
    lastAction,
    onAction,
    options,
    setOptions
  };
  return /* @__PURE__ */ jsx12(ActionContext2.Provider, { value, children });
}

// src/contexts/action-tracking/hooks.ts
import { useContext as useContext10, useCallback as useCallback14, useEffect as useEffect9 } from "react";
function useActionContext() {
  const context = useContext10(ActionContext2);
  if (!context) {
    throw new Error("useActionContext must be used within ActionProvider");
  }
  return context;
}
function useElementActionTracker(elementKey, elementType) {
  const { trackAction, options } = useActionContext();
  const track = useCallback14(
    (type, context, payload) => {
      if (!options.enabled) return;
      trackAction({ type, elementKey, elementType, context, payload });
    },
    [trackAction, elementKey, elementType, options.enabled]
  );
  return { track, isEnabled: options.enabled };
}
function useActionSubscriber(callback, deps = []) {
  const { onAction } = useActionContext();
  useEffect9(() => {
    return onAction(callback);
  }, [onAction, ...deps]);
}

// src/contexts/autosave.tsx
import React9, {
  createContext as createContext11,
  useContext as useContext11,
  useCallback as useCallback15,
  useRef as useRef7,
  useMemo as useMemo12
} from "react";
import { jsx as jsx13 } from "react/jsx-runtime";
var AutoSaveContext = createContext11(null);
var DEFAULT_DEBOUNCE_MS = 1500;
function AutoSaveProvider({
  children,
  chatId,
  enabled = true,
  saveEndpoint = "/api/domain/save",
  onSaveComplete,
  onSaveError
}) {
  const debounceTimersRef = useRef7(/* @__PURE__ */ new Map());
  const pendingRef = useRef7(/* @__PURE__ */ new Map());
  const autoSave = useCallback15(
    async (payload) => {
      if (!chatId || !enabled) {
        return {
          success: false,
          error: "Auto-save disabled or no chat context"
        };
      }
      try {
        const fullPayload = {
          ...payload,
          chatId
        };
        const response = await fetch(saveEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullPayload)
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = errorData.error || "Failed to save";
          onSaveError?.(new Error(error));
          return { success: false, error };
        }
        const result = await response.json();
        onSaveComplete?.(result);
        return result;
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        onSaveError?.(error instanceof Error ? error : new Error(msg));
        return { success: false, error: msg };
      }
    },
    [chatId, enabled, saveEndpoint, onSaveComplete, onSaveError]
  );
  const debouncedAutoSave = useCallback15(
    (payload, delayMs = DEFAULT_DEBOUNCE_MS) => {
      if (!chatId || !enabled) return;
      const key = `${payload.type}:${payload.elementKey}`;
      const existingTimer = debounceTimersRef.current.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
      pendingRef.current.set(key, { ...payload, chatId });
      const timer = setTimeout(() => {
        const pendingPayload = pendingRef.current.get(key);
        if (pendingPayload) {
          autoSave(pendingPayload);
          pendingRef.current.delete(key);
        }
        debounceTimersRef.current.delete(key);
      }, delayMs);
      debounceTimersRef.current.set(key, timer);
    },
    [chatId, enabled, autoSave]
  );
  const value = useMemo12(
    () => ({
      chatId,
      autoSave,
      debouncedAutoSave,
      isEnabled: Boolean(chatId && enabled)
    }),
    [chatId, autoSave, debouncedAutoSave, enabled]
  );
  return /* @__PURE__ */ jsx13(AutoSaveContext.Provider, { value, children });
}
function useAutoSave() {
  const context = useContext11(AutoSaveContext);
  if (!context) {
    return {
      chatId: null,
      autoSave: async () => ({ success: false, error: "No AutoSaveProvider" }),
      debouncedAutoSave: () => {
      },
      isEnabled: false
    };
  }
  return context;
}
function useDomainAutoSave(type, elementKey, data, options) {
  const { debouncedAutoSave, isEnabled } = useAutoSave();
  const mountedRef = useRef7(false);
  const lastDataRef = useRef7(null);
  React9.useEffect(() => {
    if (!isEnabled || !data || !elementKey) return;
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (options?.skipMount) return;
    }
    const serialized = JSON.stringify(data);
    if (serialized === lastDataRef.current) return;
    lastDataRef.current = serialized;
    debouncedAutoSave({ type, elementKey, data }, options?.debounceMs);
  }, [
    type,
    elementKey,
    data,
    isEnabled,
    debouncedAutoSave,
    options?.debounceMs,
    options?.skipMount
  ]);
}

// src/hooks/useElementState.ts
import { useCallback as useCallback16, useEffect as useEffect10, useRef as useRef8, useMemo as useMemo13 } from "react";
import { loggers as loggers2 } from "@onegenui/utils";
var log2 = loggers2.react;
function useElementState(elementKey, initialProps, options = {}) {
  const { syncToTree = true, debounceMs = 300 } = options;
  const componentState = useStore((s) => s.componentState[elementKey]);
  const updateComponentState = useStore((s) => s.updateComponentState);
  const updateUITree = useStore((s) => s.updateUITree);
  const mountedRef = useRef8(false);
  const timerRef = useRef8(null);
  const mergedState = useMemo13(
    () => ({
      ...initialProps,
      ...componentState ?? {}
    }),
    [initialProps, componentState]
  );
  useEffect10(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  const updateState = useCallback16(
    (updates) => {
      updateComponentState(elementKey, updates);
      if (syncToTree) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          log2.debug("[useElementState] Syncing to tree", { elementKey });
          updateUITree((tree) => {
            const element = tree.elements[elementKey];
            if (element) {
              return {
                ...tree,
                elements: {
                  ...tree.elements,
                  [elementKey]: {
                    ...element,
                    props: { ...element.props, ...updates }
                  }
                }
              };
            }
            return tree;
          });
          timerRef.current = null;
        }, debounceMs);
      }
    },
    [elementKey, updateComponentState, updateUITree, syncToTree, debounceMs]
  );
  useEffect10(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (Object.keys(initialProps).length > 0) {
        updateComponentState(
          elementKey,
          initialProps
        );
      }
    }
  }, [elementKey, initialProps, updateComponentState]);
  return [mergedState, updateState];
}

// src/contexts/tool-progress.tsx
import {
  createContext as createContext12,
  useContext as useContext12,
  useCallback as useCallback17,
  useMemo as useMemo14,
  useEffect as useEffect11
} from "react";
import { useShallow as useShallow2 } from "zustand/react/shallow";
import { jsx as jsx14 } from "react/jsx-runtime";
var ToolProgressContext = createContext12(
  null
);
function ToolProgressProvider({
  children,
  autoClearCompleteMs = 3e3,
  maxEvents: _maxEvents = 50
}) {
  const progressEvents = useStore((s) => s.progressEvents);
  const addProgressEvent = useStore((s) => s.addProgressEvent);
  const updateProgressEvent = useStore((s) => s.updateProgressEvent);
  const clearProgressEvents = useStore((s) => s.clearProgressEvents);
  const clearCompletedProgressOlderThan = useStore(
    (s) => s.clearCompletedProgressOlderThan
  );
  const getActiveProgress = useStore((s) => s.getActiveProgress);
  const isToolRunning = useStore((s) => s.isToolRunning);
  const addProgress = useCallback17(
    (event) => {
      addProgressEvent({
        toolCallId: event.toolCallId,
        toolName: event.toolName,
        status: event.status,
        message: event.message,
        data: event.data,
        progress: event.progress
      });
    },
    [addProgressEvent]
  );
  const updateProgress = useCallback17(
    (toolCallId, updates) => {
      updateProgressEvent(toolCallId, updates);
    },
    [updateProgressEvent]
  );
  const clearProgress = useCallback17(() => {
    clearProgressEvents();
  }, [clearProgressEvents]);
  const clearCompletedOlderThan = useCallback17(
    (ms) => {
      clearCompletedProgressOlderThan(ms);
    },
    [clearCompletedProgressOlderThan]
  );
  useEffect11(() => {
    if (autoClearCompleteMs <= 0) return;
    const interval = setInterval(() => {
      clearCompletedOlderThan(autoClearCompleteMs);
    }, 1e3);
    return () => clearInterval(interval);
  }, [autoClearCompleteMs, clearCompletedOlderThan]);
  const activeProgress = getActiveProgress();
  const toolRunning = isToolRunning();
  const value = useMemo14(
    () => ({
      activeProgress,
      allProgress: progressEvents,
      isToolRunning: toolRunning,
      addProgress,
      updateProgress,
      clearProgress,
      clearCompletedOlderThan
    }),
    [
      activeProgress,
      progressEvents,
      toolRunning,
      addProgress,
      updateProgress,
      clearProgress,
      clearCompletedOlderThan
    ]
  );
  return /* @__PURE__ */ jsx14(ToolProgressContext.Provider, { value, children });
}
function useToolProgress() {
  const context = useContext12(ToolProgressContext);
  if (!context) {
    throw new Error(
      "useToolProgress must be used within a ToolProgressProvider"
    );
  }
  return context;
}
function useToolProgressOptional() {
  return useContext12(ToolProgressContext);
}
function useIsToolRunning() {
  return useStore(
    (s) => s.progressEvents.some(
      (p) => p.status === "starting" || p.status === "progress"
    )
  );
}
function useActiveToolProgress2() {
  return useStore(
    useShallow2(
      (s) => s.progressEvents.filter(
        (e) => e.status === "starting" || e.status === "progress"
      )
    )
  );
}

// src/contexts/unified-progress.tsx
import {
  createContext as createContext13,
  useContext as useContext13,
  useMemo as useMemo15,
  useCallback as useCallback18
} from "react";
import { useShallow as useShallow3 } from "zustand/react/shallow";
import { jsx as jsx15 } from "react/jsx-runtime";
var UnifiedProgressContext = createContext13(null);
function mapPlanStepStatus(status) {
  switch (status) {
    case "running":
      return "running";
    case "complete":
      return "complete";
    case "error":
      return "error";
    default:
      return "pending";
  }
}
function mapToolStatus(status) {
  switch (status) {
    case "starting":
    case "progress":
      return "running";
    case "complete":
      return "complete";
    case "error":
      return "error";
    default:
      return "pending";
  }
}
function subtaskToUnified(subtask, parentId) {
  return {
    id: `subtask-${subtask.id}`,
    type: "plan-subtask",
    label: subtask.task,
    status: mapPlanStepStatus(subtask.status),
    startTime: subtask.startTime,
    endTime: subtask.endTime,
    parentId
  };
}
function stepToUnified(step) {
  const id = `step-${step.id}`;
  return {
    id,
    type: "plan-step",
    label: step.task,
    status: mapPlanStepStatus(step.status),
    startTime: step.startTime,
    endTime: step.endTime,
    children: step.subtasks?.map((st) => subtaskToUnified(st, id))
  };
}
function toolToUnified(tool) {
  return {
    id: `tool-${tool.toolCallId}`,
    type: "tool",
    label: tool.toolName,
    message: tool.message,
    status: mapToolStatus(tool.status),
    progress: tool.progress,
    startTime: tool.timestamp
  };
}
function UnifiedProgressProvider({
  children
}) {
  const planExecution = useStore((s) => s.planExecution);
  const progressEvents = useStore(useShallow3((s) => s.progressEvents));
  const items = useMemo15(() => {
    const result = [];
    if (planExecution.plan) {
      for (const step of planExecution.plan.steps) {
        result.push(stepToUnified(step));
      }
    }
    if (!planExecution.isOrchestrating) {
      for (const tool of progressEvents) {
        result.push(toolToUnified(tool));
      }
    }
    return result;
  }, [planExecution.plan, planExecution.isOrchestrating, progressEvents]);
  const activeItems = useMemo15(
    () => items.filter((item) => item.status === "running"),
    [items]
  );
  const isGenerating = useMemo15(() => {
    if (planExecution.isOrchestrating) return true;
    return progressEvents.some(
      (p) => p.status === "starting" || p.status === "progress"
    );
  }, [planExecution.isOrchestrating, progressEvents]);
  const goal = planExecution.plan?.goal ?? null;
  const overallProgress = useMemo15(() => {
    if (!planExecution.plan) {
      const activeTools = progressEvents.filter(
        (p) => p.status === "starting" || p.status === "progress"
      );
      if (activeTools.length === 0) return 0;
      const sum = activeTools.reduce((acc, t) => acc + (t.progress ?? 0), 0);
      return Math.round(sum / activeTools.length);
    }
    const steps = planExecution.plan.steps;
    const completed = steps.filter((s) => s.status === "complete").length;
    return steps.length > 0 ? Math.round(completed / steps.length * 100) : 0;
  }, [planExecution.plan, progressEvents]);
  const elapsedTime = useMemo15(() => {
    if (!planExecution.orchestrationStartTime) return null;
    if (!planExecution.isOrchestrating) return null;
    return Date.now() - planExecution.orchestrationStartTime;
  }, [planExecution.orchestrationStartTime, planExecution.isOrchestrating]);
  const getItem = useCallback18(
    (id) => items.find((item) => item.id === id),
    [items]
  );
  const isItemRunning = useCallback18(
    (id) => {
      const item = items.find((i) => i.id === id);
      return item?.status === "running";
    },
    [items]
  );
  const value = useMemo15(
    () => ({
      isGenerating,
      goal,
      items,
      activeItems,
      overallProgress,
      elapsedTime,
      getItem,
      isItemRunning
    }),
    [
      isGenerating,
      goal,
      items,
      activeItems,
      overallProgress,
      elapsedTime,
      getItem,
      isItemRunning
    ]
  );
  return /* @__PURE__ */ jsx15(UnifiedProgressContext.Provider, { value, children });
}
function useUnifiedProgress() {
  const context = useContext13(UnifiedProgressContext);
  if (!context) {
    throw new Error(
      "useUnifiedProgress must be used within a UnifiedProgressProvider"
    );
  }
  return context;
}
function useUnifiedProgressOptional() {
  return useContext13(UnifiedProgressContext);
}
function useIsGenerating() {
  return useStore((s) => {
    if (s.planExecution.isOrchestrating) return true;
    return s.progressEvents.some(
      (p) => p.status === "starting" || p.status === "progress"
    );
  });
}
function useGeneratingGoal() {
  return useStore((s) => s.planExecution.plan?.goal ?? null);
}

// src/components/InteractionTrackingWrapper.tsx
import {
  useEffect as useEffect12,
  useRef as useRef9,
  createContext as createContext14,
  useContext as useContext14
} from "react";

// src/utils/selection.ts
var DEFAULT_SELECTION_DELAY = 350;
var MOVE_TOLERANCE_PX = 10;
var EDGE_ZONE_SIZE = 16;
function triggerHaptic(pattern = 50) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
    }
  }
}
function isIgnoredTarget(target) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.closest("[data-jsonui-ignore-select]")) return true;
  if (target.closest(".editable-text-node") || target.closest("[data-editable='true']") || target.closest("[contenteditable='true']")) {
    return true;
  }
  const tagName = target.tagName.toLowerCase();
  if (tagName === "input" || tagName === "textarea" || tagName === "select" || tagName === "button" || target.closest("button") || target.isContentEditable || target.getAttribute("role") === "button" || target.getAttribute("role") === "slider" || target.getAttribute("role") === "tab" || target.getAttribute("role") === "checkbox" || target.getAttribute("role") === "switch" || target.getAttribute("role") === "menuitem") {
    return true;
  }
  if (target.hasAttribute("draggable") || target.closest("[draggable]") || target.closest(".react-draggable") || target.closest("[data-drag-handle]") || target.closest("[data-interactive]")) {
    return true;
  }
  if (tagName === "a" || target.closest("a")) {
    return true;
  }
  return false;
}
function isInEdgeZone(clientX, clientY, rect, edgeSize = EDGE_ZONE_SIZE) {
  const inLeftEdge = clientX < rect.left + edgeSize;
  const inRightEdge = clientX > rect.right - edgeSize;
  const inTopEdge = clientY < rect.top + edgeSize;
  const inBottomEdge = clientY > rect.bottom - edgeSize;
  return inLeftEdge || inRightEdge || inTopEdge || inBottomEdge;
}
function getActionTypeFromEvent(target, eventType) {
  const tagName = target.tagName.toLowerCase();
  const inputType = target.getAttribute("type")?.toLowerCase();
  const role = target.getAttribute("role")?.toLowerCase();
  if (tagName === "input" && inputType === "checkbox" || role === "checkbox" || target.hasAttribute("data-checkbox")) {
    return "toggle";
  }
  if (tagName === "select" || tagName === "input" && inputType === "radio" || role === "listbox" || role === "option") {
    return "select";
  }
  if (tagName === "input" || tagName === "textarea" || role === "textbox" || target.isContentEditable) {
    return eventType === "change" ? "input" : null;
  }
  if (tagName === "button" || role === "button" || target.hasAttribute("data-interactive")) {
    return "click";
  }
  if (eventType === "click") {
    if (isInteractiveElement(target)) {
      return "click";
    }
  }
  return null;
}
function extractInteractionContext(target, _elementKey) {
  const context = {};
  const selectableItem = target.closest("[data-selectable-item]");
  if (selectableItem instanceof HTMLElement) {
    const itemId = selectableItem.getAttribute("data-item-id");
    if (itemId) {
      context.itemId = itemId;
    }
  }
  const textContent = target.textContent?.trim().substring(0, 100) || target.getAttribute("aria-label") || target.getAttribute("title");
  if (textContent) {
    context.itemLabel = textContent;
  }
  if (target instanceof HTMLInputElement) {
    if (target.type === "checkbox") {
      context.newValue = target.checked;
      context.previousValue = !target.checked;
    } else {
      context.newValue = target.value;
    }
  } else if (target instanceof HTMLSelectElement) {
    context.newValue = target.value;
    const selectedOption = target.options[target.selectedIndex];
    if (selectedOption) {
      context.itemLabel = selectedOption.text;
    }
  } else if (target instanceof HTMLTextAreaElement) {
    context.newValue = target.value;
  }
  return context;
}
function findClosestElementKey(target) {
  const elementWrapper = target.closest("[data-jsonui-element-key]");
  if (elementWrapper instanceof HTMLElement) {
    return elementWrapper.getAttribute("data-jsonui-element-key");
  }
  return null;
}

// src/components/InteractionTrackingWrapper.tsx
import { jsx as jsx16 } from "react/jsx-runtime";
var InteractionTrackingContext = createContext14(null);
function isNonProactiveElement(target) {
  const tagName = target.tagName.toLowerCase();
  if (tagName === "a" || target.closest("a[href]")) return true;
  if (tagName === "video" || tagName === "audio" || tagName === "img" || target.closest("video, audio, img")) {
    return true;
  }
  if (target.closest(
    '[class*="video"], [class*="audio"], [class*="player"], [class*="media"]'
  )) {
    return true;
  }
  if (target.getAttribute("role") === "link" || target.closest('[role="link"]') || target.hasAttribute("data-href") || target.hasAttribute("data-navigate")) {
    return true;
  }
  return false;
}
function InteractionTrackingWrapper({
  children,
  tree,
  onInteraction
}) {
  const containerRef = useRef9(null);
  let isDeepSelectionActive;
  try {
    const selectionContext = useSelection();
    isDeepSelectionActive = selectionContext.isDeepSelectionActive;
  } catch {
  }
  useEffect12(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleInteraction = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (isSelectionInteraction(target, isDeepSelectionActive)) return;
      if (isNonProactiveElement(target)) return;
      const elementKey = findClosestElementKey(target);
      if (!elementKey) return;
      const element = tree.elements[elementKey];
      if (!element) return;
      const actionType = getActionTypeFromEvent(target, event.type);
      if (!actionType) return;
      const context = extractInteractionContext(target, elementKey);
      onInteraction({
        type: actionType,
        elementKey,
        elementType: element.type,
        context
      });
    };
    container.addEventListener("click", handleInteraction, true);
    container.addEventListener("change", handleInteraction, true);
    return () => {
      container.removeEventListener("click", handleInteraction, true);
      container.removeEventListener("change", handleInteraction, true);
    };
  }, [tree, onInteraction]);
  return /* @__PURE__ */ jsx16(InteractionTrackingContext.Provider, { value: onInteraction, children: /* @__PURE__ */ jsx16("div", { ref: containerRef, style: { display: "contents" }, children }) });
}

// src/components/ErrorBoundary.tsx
import { Component } from "react";
import { createLogger as createLogger2 } from "@onegenui/utils";
import { jsx as jsx17, jsxs as jsxs3 } from "react/jsx-runtime";
var logger2 = createLogger2({ prefix: "react:error-boundary" });
var ErrorBoundary = class extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    const { onError, name } = this.props;
    logger2.error(
      `Error caught${name ? ` in ${name}` : ""}:`,
      error.message,
      errorInfo.componentStack
    );
    onError?.(error, errorInfo);
  }
  reset = () => {
    this.setState({ hasError: false, error: null });
  };
  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;
    if (hasError && error) {
      if (typeof fallback === "function") {
        return fallback(error, this.reset);
      }
      if (fallback) {
        return fallback;
      }
      return /* @__PURE__ */ jsxs3(
        "div",
        {
          role: "alert",
          className: "p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive",
          children: [
            /* @__PURE__ */ jsx17("h3", { className: "font-semibold mb-2", children: "Something went wrong" }),
            /* @__PURE__ */ jsx17("p", { className: "text-sm text-muted-foreground mb-3", children: error.message }),
            /* @__PURE__ */ jsx17(
              "button",
              {
                onClick: this.reset,
                className: "px-3 py-1.5 text-sm rounded bg-destructive/20 hover:bg-destructive/30 transition-colors",
                children: "Try again"
              }
            )
          ]
        }
      );
    }
    return children;
  }
};

// src/renderer/element-renderer.tsx
import React17, { useMemo as useMemo20 } from "react";

// src/components/ResizableWrapper.tsx
import React12, { useRef as useRef11, useCallback as useCallback20, useMemo as useMemo16 } from "react";

// src/hooks/resizable/types.ts
var MOBILE_BREAKPOINT = 768;

// src/hooks/resizable/utils.ts
function parseSize(value, fallback) {
  if (value === void 0) return fallback;
  if (typeof value === "number") return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}
function normalizeConfig(config) {
  if (config === void 0 || config === false) {
    return { horizontal: false, vertical: false };
  }
  if (config === true) {
    return { horizontal: true, vertical: true };
  }
  return config;
}
function snapToGrid(value, gridSize) {
  if (!gridSize || gridSize <= 0) return value;
  return Math.round(value / gridSize) * gridSize;
}
function findScrollableContainer(element) {
  if (!element) return null;
  let parent = element.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    if (overflowY === "auto" || overflowY === "scroll" || overflowX === "auto" || overflowX === "scroll" || parent.hasAttribute("data-render-container")) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return document.body;
}
function getContainerConstraints(element, container, handle) {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  let maxWidth = Infinity;
  let maxHeight = Infinity;
  if (handle.includes("e")) {
    maxWidth = containerRect.right - elementRect.left - 16;
  }
  if (handle.includes("w")) {
    maxWidth = elementRect.right - containerRect.left - 16;
  }
  if (handle.includes("s")) {
    maxHeight = Math.max(containerRect.height * 2, 1e3);
  }
  if (handle.includes("n")) {
    maxHeight = elementRect.bottom - containerRect.top - 16;
  }
  return { maxWidth, maxHeight };
}
function getCursorForHandle(handle) {
  switch (handle) {
    case "e":
    case "w":
      return "ew-resize";
    case "n":
    case "s":
      return "ns-resize";
    case "se":
    case "nw":
      return "nwse-resize";
    case "sw":
    case "ne":
      return "nesw-resize";
    default:
      return "";
  }
}
function getResizeCursor(handle) {
  return getCursorForHandle(handle);
}

// src/hooks/resizable/hook.ts
import { useState as useState6, useCallback as useCallback19, useRef as useRef10, useEffect as useEffect13 } from "react";
function useResizable({
  initialSize,
  config,
  onResizeStart,
  onResize,
  onResizeEnd,
  elementRef,
  constrainToContainer = true
} = {}) {
  const resizeConfig = normalizeConfig(config);
  const initialWidth = parseSize(initialSize?.width, 0);
  const initialHeight = parseSize(initialSize?.height, 0);
  const hasExplicitSize = initialWidth > 0 || initialHeight > 0;
  const [state, setState] = useState6({
    width: initialWidth,
    height: initialHeight,
    isResizing: false,
    activeHandle: null
  });
  const [hasResized, setHasResized] = useState6(hasExplicitSize);
  const dragStart = useRef10({ x: 0, y: 0, width: 0, height: 0 });
  const containerRef = useRef10(null);
  const lastBreakpointRef = useRef10(null);
  useEffect13(() => {
    if (typeof window === "undefined") return;
    const checkBreakpoint = () => {
      const currentBreakpoint = window.innerWidth <= MOBILE_BREAKPOINT ? "mobile" : "desktop";
      if (lastBreakpointRef.current !== null && lastBreakpointRef.current !== currentBreakpoint) {
        setHasResized(false);
        setState({
          width: initialWidth,
          height: initialHeight,
          isResizing: false,
          activeHandle: null
        });
      }
      lastBreakpointRef.current = currentBreakpoint;
    };
    checkBreakpoint();
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    mediaQuery.addEventListener("change", checkBreakpoint);
    return () => {
      mediaQuery.removeEventListener("change", checkBreakpoint);
    };
  }, [initialWidth, initialHeight]);
  const startResize = useCallback19(
    (handle, e) => {
      e.preventDefault();
      e.stopPropagation();
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      let currentWidth = state.width;
      let currentHeight = state.height;
      if (elementRef?.current) {
        const rect = elementRef.current.getBoundingClientRect();
        currentWidth = rect.width;
        currentHeight = rect.height;
        if (constrainToContainer) {
          containerRef.current = findScrollableContainer(elementRef.current);
        }
      }
      dragStart.current = {
        x: clientX,
        y: clientY,
        width: currentWidth,
        height: currentHeight
      };
      const newState = {
        width: currentWidth,
        height: currentHeight,
        isResizing: true,
        activeHandle: handle
      };
      setState(newState);
      onResizeStart?.(newState);
    },
    [
      state.width,
      state.height,
      elementRef,
      onResizeStart,
      constrainToContainer
    ]
  );
  const stopResize = useCallback19(() => {
    setState((prev) => {
      if (!prev.isResizing) return prev;
      const finalState = {
        ...prev,
        isResizing: false,
        activeHandle: null
      };
      setHasResized(true);
      if (onResizeEnd) {
        queueMicrotask(() => {
          onResizeEnd(finalState);
        });
      }
      return finalState;
    });
    containerRef.current = null;
  }, [onResizeEnd]);
  const reset = useCallback19(() => {
    setState({
      width: initialWidth,
      height: initialHeight,
      isResizing: false,
      activeHandle: null
    });
    setHasResized(hasExplicitSize);
  }, [initialWidth, initialHeight, hasExplicitSize]);
  useEffect13(() => {
    if (!state.isResizing || !state.activeHandle) return;
    const handleMove = (e) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      const deltaX = clientX - dragStart.current.x;
      const deltaY = clientY - dragStart.current.y;
      let newWidth = dragStart.current.width;
      let newHeight = dragStart.current.height;
      const handle = state.activeHandle;
      if (handle.includes("e") && resizeConfig.horizontal) {
        newWidth = dragStart.current.width + deltaX;
      }
      if (handle.includes("w") && resizeConfig.horizontal) {
        newWidth = dragStart.current.width - deltaX;
      }
      if (handle.includes("s") && resizeConfig.vertical) {
        newHeight = dragStart.current.height + deltaY;
      }
      if (handle.includes("n") && resizeConfig.vertical) {
        newHeight = dragStart.current.height - deltaY;
      }
      let minWidth = initialSize?.minWidth ?? 50;
      let maxWidth = initialSize?.maxWidth ?? Infinity;
      let minHeight = initialSize?.minHeight ?? 50;
      let maxHeight = initialSize?.maxHeight ?? Infinity;
      if (constrainToContainer && containerRef.current && elementRef?.current) {
        const containerConstraints = getContainerConstraints(
          elementRef.current,
          containerRef.current,
          handle
        );
        maxWidth = Math.min(maxWidth, containerConstraints.maxWidth);
        maxHeight = Math.min(maxHeight, containerConstraints.maxHeight);
      }
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
      newWidth = snapToGrid(newWidth, resizeConfig.snapToGrid);
      newHeight = snapToGrid(newHeight, resizeConfig.snapToGrid);
      if (resizeConfig.preserveAspectRatio && dragStart.current.width > 0) {
        const aspectRatio = dragStart.current.height / dragStart.current.width;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth * aspectRatio;
        } else {
          newWidth = newHeight / aspectRatio;
        }
      }
      const newState = {
        width: newWidth,
        height: newHeight,
        isResizing: true,
        activeHandle: state.activeHandle
      };
      setState(newState);
      onResize?.(newState);
    };
    const handleEnd = () => {
      stopResize();
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);
    document.body.style.userSelect = "none";
    document.body.style.cursor = getCursorForHandle(state.activeHandle);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [
    state.isResizing,
    state.activeHandle,
    resizeConfig,
    initialSize,
    onResize,
    stopResize,
    constrainToContainer,
    elementRef
  ]);
  const style = {};
  if (hasResized) {
    if (state.width > 0) {
      style.width = "100%";
      style.maxWidth = state.width;
      style.minWidth = Math.min(200, state.width * 0.5);
    }
    if (state.height > 0) {
      style.height = state.height;
      style.minHeight = Math.min(100, state.height * 0.5);
    }
  }
  return {
    state,
    startResize,
    stopResize,
    reset,
    resizeConfig,
    style
  };
}

// src/components/ResizableWrapper.tsx
import { Fragment, jsx as jsx18, jsxs as jsxs4 } from "react/jsx-runtime";
function ResizeHandleComponent({
  position,
  onMouseDown,
  onTouchStart,
  isResizing,
  visible
}) {
  const [isHovered, setIsHovered] = React12.useState(false);
  const [isTouching, setIsTouching] = React12.useState(false);
  const positionClasses = {
    e: "right-[-4px] top-0 bottom-0 w-2 cursor-ew-resize",
    w: "left-[-4px] top-0 bottom-0 w-2 cursor-ew-resize",
    s: "bottom-[-4px] left-0 right-0 h-2 cursor-ns-resize",
    n: "top-[-4px] left-0 right-0 h-2 cursor-ns-resize",
    se: "right-[-6px] bottom-[-6px] w-3 h-3 cursor-nwse-resize rounded-full",
    sw: "left-[-6px] bottom-[-6px] w-3 h-3 cursor-nesw-resize rounded-full",
    ne: "right-[-6px] top-[-6px] w-3 h-3 cursor-nesw-resize rounded-full",
    nw: "left-[-6px] top-[-6px] w-3 h-3 cursor-nwse-resize rounded-full"
  };
  return /* @__PURE__ */ jsx18(
    "div",
    {
      className: cn(
        "absolute z-10 opacity-0 transition-opacity duration-150 bg-transparent",
        positionClasses[position],
        (visible || isResizing || isTouching) && "opacity-100",
        (isHovered || isResizing) && "bg-primary"
      ),
      onMouseDown,
      onTouchStart: (e) => {
        setIsTouching(true);
        onTouchStart(e);
      },
      onTouchEnd: () => setIsTouching(false),
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      role: "separator",
      "aria-orientation": position === "e" || position === "w" ? "vertical" : "horizontal",
      "aria-label": `Resize ${position}`,
      "data-resize-handle": position
    }
  );
}
function ResizableWrapper({
  element,
  children,
  layout: overrideLayout,
  onResize,
  className,
  enabled: overrideEnabled,
  showHandles = false
}) {
  const wrapperRef = useRef11(null);
  const [isHovered, setIsHovered] = React12.useState(false);
  const layout = overrideLayout ?? element.layout;
  const resizableConfig = layout?.resizable;
  const isEnabled = overrideEnabled !== void 0 ? overrideEnabled : resizableConfig !== false;
  const normalizedConfig = resizableConfig === void 0 ? true : resizableConfig;
  const handleResizeEnd = useCallback20(
    (state2) => {
      if (!onResize) return;
      onResize(element.key, { width: state2.width, height: state2.height });
    },
    [element.key, onResize]
  );
  const {
    state,
    startResize,
    resizeConfig,
    style: resizeStyle
  } = useResizable({
    initialSize: layout?.size,
    config: normalizedConfig,
    onResizeEnd: handleResizeEnd,
    elementRef: wrapperRef
  });
  if (!isEnabled) {
    return /* @__PURE__ */ jsx18(Fragment, { children });
  }
  const handles = useMemo16(() => {
    const result = [];
    if (resizeConfig.horizontal) {
      result.push("e", "w");
    }
    if (resizeConfig.vertical) {
      result.push("s", "n");
    }
    if (resizeConfig.horizontal && resizeConfig.vertical) {
      result.push("se", "sw", "ne", "nw");
    }
    return result;
  }, [resizeConfig.horizontal, resizeConfig.vertical]);
  const gridColumnStyle = (() => {
    const col = layout?.grid?.column;
    const span = layout?.grid?.columnSpan;
    if (col && span && span > 1) {
      return `${col} / span ${span}`;
    }
    if (span && span > 1) {
      return `span ${span}`;
    }
    if (col) {
      return col;
    }
    return void 0;
  })();
  const gridRowStyle = (() => {
    const row = layout?.grid?.row;
    const span = layout?.grid?.rowSpan;
    if (row && span && span > 1) {
      return `${row} / span ${span}`;
    }
    if (span && span > 1) {
      return `span ${span}`;
    }
    if (row) {
      return row;
    }
    return void 0;
  })();
  const combinedStyle = {
    ...resizeStyle,
    // Apply grid layout if configured (properly merged)
    ...gridColumnStyle && { gridColumn: gridColumnStyle },
    ...gridRowStyle && { gridRow: gridRowStyle }
  };
  const shouldShowHandles = showHandles || isHovered || state.isResizing;
  return /* @__PURE__ */ jsxs4(
    "div",
    {
      ref: wrapperRef,
      style: combinedStyle,
      className: cn(
        "relative box-border",
        state.isResizing && "outline-[2px] outline-primary outline-offset-2",
        className
      ),
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      "data-resizable": "true",
      "data-element-key": element.key,
      children: [
        children,
        handles.map((handle) => /* @__PURE__ */ jsx18(
          ResizeHandleComponent,
          {
            position: handle,
            onMouseDown: (e) => startResize(handle, e),
            onTouchStart: (e) => startResize(handle, e),
            isResizing: state.isResizing && state.activeHandle === handle,
            visible: shouldShowHandles
          },
          handle
        )),
        state.isResizing && /* @__PURE__ */ jsxs4("div", { className: "absolute bottom-2 right-2 px-2 py-1 bg-primary text-white text-[11px] font-medium rounded pointer-events-none z-11", children: [
          Math.round(state.width),
          " x ",
          Math.round(state.height)
        ] })
      ]
    }
  );
}

// src/components/SelectionWrapper.tsx
import {
  useCallback as useCallback21,
  useState as useState8,
  useRef as useRef13,
  useEffect as useEffect15
} from "react";

// src/components/LongPressIndicator.tsx
import { useState as useState7, useRef as useRef12, useEffect as useEffect14 } from "react";
import { createPortal } from "react-dom";
import { jsx as jsx19, jsxs as jsxs5 } from "react/jsx-runtime";
var RING_SIZE = 48;
var STROKE_WIDTH = 3;
var RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
var CIRCUMFERENCE = 2 * Math.PI * RADIUS;
function LongPressIndicator({
  x,
  y,
  durationMs,
  onComplete
}) {
  const [mounted, setMounted] = useState7(false);
  const timerRef = useRef12(null);
  const startTimeRef = useRef12(0);
  const animationFrameRef = useRef12(null);
  const circleRef = useRef12(null);
  useEffect14(() => {
    setMounted(true);
    startTimeRef.current = performance.now();
    const animate = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      if (circleRef.current) {
        const offset = CIRCUMFERENCE * (1 - progress);
        circleRef.current.style.strokeDashoffset = `${offset}`;
      }
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    timerRef.current = window.setTimeout(() => {
      onComplete();
    }, durationMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [durationMs, onComplete]);
  if (!mounted || typeof document === "undefined") return null;
  return createPortal(
    /* @__PURE__ */ jsx19(
      "div",
      {
        style: {
          position: "fixed",
          left: x - RING_SIZE / 2,
          top: y - RING_SIZE / 2,
          width: RING_SIZE,
          height: RING_SIZE,
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 1,
          transition: "opacity 150ms ease-out"
        },
        "data-long-press-indicator": true,
        children: /* @__PURE__ */ jsxs5(
          "svg",
          {
            width: RING_SIZE,
            height: RING_SIZE,
            style: { transform: "rotate(-90deg)" },
            children: [
              /* @__PURE__ */ jsx19(
                "circle",
                {
                  cx: RING_SIZE / 2,
                  cy: RING_SIZE / 2,
                  r: RADIUS,
                  fill: "none",
                  stroke: "rgba(255, 255, 255, 0.15)",
                  strokeWidth: STROKE_WIDTH
                }
              ),
              /* @__PURE__ */ jsx19(
                "circle",
                {
                  ref: circleRef,
                  cx: RING_SIZE / 2,
                  cy: RING_SIZE / 2,
                  r: RADIUS,
                  fill: "none",
                  stroke: "var(--foreground, #fff)",
                  strokeWidth: STROKE_WIDTH,
                  strokeLinecap: "round",
                  strokeDasharray: CIRCUMFERENCE,
                  strokeDashoffset: CIRCUMFERENCE,
                  style: {
                    filter: "drop-shadow(0 0 6px rgba(255, 255, 255, 0.5))"
                  }
                }
              )
            ]
          }
        )
      }
    ),
    document.body
  );
}

// src/components/SelectionWrapper.tsx
import { jsx as jsx20, jsxs as jsxs6 } from "react/jsx-runtime";
function SelectionWrapper({
  element,
  enabled,
  onSelect,
  delayMs,
  isSelected,
  children
}) {
  const [pressing, setPressing] = useState8(false);
  const [pressPosition, setPressPosition] = useState8(null);
  const startPositionRef = useRef13(null);
  const longPressCompletedRef = useRef13(false);
  const onSelectableItemRef = useRef13(false);
  const wrapperRef = useRef13(null);
  const { isEditing } = useEditMode();
  let isDeepSelectionActive;
  try {
    const selectionContext = useSelection();
    isDeepSelectionActive = selectionContext.isDeepSelectionActive;
  } catch {
    isDeepSelectionActive = () => typeof document !== "undefined" && document.__jsonuiDeepSelectionActive === true;
  }
  const handleComplete = useCallback21(() => {
    if (isDeepSelectionActive()) {
      setPressing(false);
      setPressPosition(null);
      return;
    }
    if (onSelect && enabled) {
      triggerHaptic(50);
      onSelect(element);
    }
    longPressCompletedRef.current = true;
    setPressing(false);
    setPressPosition(null);
  }, [element, enabled, onSelect, isDeepSelectionActive]);
  const handleCancel = useCallback21(() => {
    setPressing(false);
    setPressPosition(null);
    startPositionRef.current = null;
  }, []);
  const handlePointerDown = useCallback21(
    (event) => {
      if (!enabled || !onSelect) return;
      if (isIgnoredTarget(event.target)) return;
      if (isEditing) {
        const target2 = event.target;
        const isEditableTarget = target2.closest(".editable-text-node") || target2.closest("[data-editable='true']") || target2.hasAttribute("contenteditable");
        if (isEditableTarget) {
          return;
        }
      }
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const firstChild = wrapper.querySelector(":scope > *");
      const targetElement = firstChild || wrapper;
      const rect = targetElement.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      const isOnEdge = isInEdgeZone(event.clientX, event.clientY, rect);
      if (!isOnEdge && !isSelected) {
        return;
      }
      const target = event.target;
      onSelectableItemRef.current = !!target.closest("[data-selectable-item]");
      longPressCompletedRef.current = false;
      startPositionRef.current = { x: event.clientX, y: event.clientY };
      setPressPosition({ x: event.clientX, y: event.clientY });
      setPressing(true);
      if (typeof document !== "undefined") {
        document.body.classList.add("select-none");
      }
    },
    [enabled, onSelect, isSelected, isEditing]
  );
  const handlePointerUp = useCallback21(
    (_event) => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("select-none");
      }
      handleCancel();
    },
    [handleCancel]
  );
  const handlePointerMove = useCallback21(
    (event) => {
      if (!pressing || !startPositionRef.current) return;
      const dx = event.clientX - startPositionRef.current.x;
      const dy = event.clientY - startPositionRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > MOVE_TOLERANCE_PX) {
        handleCancel();
      }
    },
    [pressing, handleCancel]
  );
  const handleClickCapture = useCallback21(
    (event) => {
      if (longPressCompletedRef.current) {
        longPressCompletedRef.current = false;
        event.preventDefault();
        event.stopPropagation();
      }
    },
    []
  );
  useEffect15(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.userSelect = "";
        document.body.style.webkitUserSelect = "";
      }
      setPressing(false);
      setPressPosition(null);
    };
  }, []);
  return /* @__PURE__ */ jsxs6(
    "div",
    {
      ref: wrapperRef,
      style: { display: "contents" },
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
      onPointerLeave: handlePointerUp,
      onPointerMove: handlePointerMove,
      onClickCapture: handleClickCapture,
      "data-jsonui-selected": isSelected ? "true" : void 0,
      "data-jsonui-element-key": element.key,
      children: [
        children,
        pressing && pressPosition && /* @__PURE__ */ jsx20(
          LongPressIndicator,
          {
            x: pressPosition.x,
            y: pressPosition.y,
            durationMs: delayMs,
            onComplete: handleComplete
          }
        )
      ]
    }
  );
}

// src/components/editable-wrapper/component.tsx
import React16, {
  memo as memo4,
  useCallback as useCallback37,
  useRef as useRef24,
  useState as useState16
} from "react";

// src/hooks/useUIStream.ts
import { useCallback as useCallback28, useEffect as useEffect19, useMemo as useMemo18 } from "react";
import { useShallow as useShallow5 } from "zustand/shallow";
import { loggers as loggers3 } from "@onegenui/utils";

// src/hooks/patch-utils.ts
import {
  NormalizedUiPatchSchema
} from "@onegenui/core";

// src/hooks/patches/structural-sharing.ts
function setByPathWithStructuralSharing(obj, path, value) {
  const segments = path.startsWith("/") ? path.slice(1).split("/") : path.split("/");
  if (segments.length === 0 || segments.length === 1 && segments[0] === "") {
    return value;
  }
  const result = { ...obj };
  let current = result;
  let parent = null;
  let parentKey = null;
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    const nextValue = current[segment];
    if (Array.isArray(nextValue)) {
      current[segment] = [...nextValue];
    } else if (nextValue && typeof nextValue === "object") {
      current[segment] = { ...nextValue };
    } else {
      const nextSeg = segments[i + 1];
      const isNextArray = nextSeg === "-" || nextSeg !== void 0 && /^\d+$/.test(nextSeg);
      current[segment] = isNextArray ? [] : {};
    }
    parent = current;
    parentKey = segment;
    current = current[segment];
  }
  const lastSegment = segments[segments.length - 1];
  if (lastSegment === "-" && Array.isArray(current)) {
    if (parent && parentKey) {
      parent[parentKey] = [...current, value];
    }
  } else if (Array.isArray(current)) {
    const index = parseInt(lastSegment, 10);
    if (!isNaN(index)) {
      current[index] = value;
    }
  } else if (lastSegment === "-") {
    if (segments.length >= 2) {
      const arrayPropertyName = segments[segments.length - 2];
      const arrayProperty = current[arrayPropertyName];
      if (Array.isArray(arrayProperty)) {
        current[arrayPropertyName] = [...arrayProperty, value];
      } else if (!arrayProperty) {
        current[arrayPropertyName] = [value];
      }
    }
  } else {
    current[lastSegment] = value;
  }
  return result;
}
function removeByPath(target, path) {
  const segments = path.startsWith("/") ? path.slice(1).split("/") : path.split("/");
  if (segments.length === 0) return;
  let current = target;
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index) || index < 0 || index >= current.length)
        return;
      const nextValue = current[index];
      if (Array.isArray(nextValue)) {
        current[index] = [...nextValue];
        current = current[index];
      } else if (nextValue && typeof nextValue === "object") {
        current[index] = { ...nextValue };
        current = current[index];
      } else {
        return;
      }
    } else {
      const nextValue = current[segment];
      if (Array.isArray(nextValue)) {
        current[segment] = [...nextValue];
        current = current[segment];
      } else if (nextValue && typeof nextValue === "object") {
        current[segment] = { ...nextValue };
        current = current[segment];
      } else {
        return;
      }
    }
  }
  const lastSegment = segments[segments.length - 1];
  if (Array.isArray(current)) {
    const index = Number(lastSegment);
    if (!Number.isInteger(index) || index < 0 || index >= current.length)
      return;
    current.splice(index, 1);
    return;
  }
  delete current[lastSegment];
}

// src/hooks/patches/tree-utils.ts
function removeNodeFromTree(tree, key) {
  const element = tree.elements[key];
  if (!element) return;
  if (element.parentKey) {
    const parent = tree.elements[element.parentKey];
    if (parent && Array.isArray(parent.children)) {
      parent.children = parent.children.filter((k) => k !== key);
    }
  } else if (tree.root === key) {
    tree.root = "";
  }
  const stack = [key];
  while (stack.length > 0) {
    const currentKey = stack.pop();
    const current = tree.elements[currentKey];
    delete tree.elements[currentKey];
    if (current && Array.isArray(current.children)) {
      stack.push(...current.children);
    }
  }
}
function ensureChildrenExist(elements, children, createPlaceholder2, turnId) {
  if (!children) return;
  for (const childKey of children) {
    if (!elements[childKey]) {
      elements[childKey] = createPlaceholder2(childKey, turnId);
    }
  }
}

// src/hooks/patches/types.ts
var PLACEHOLDER_TYPE = "__placeholder__";
function createPlaceholder(key, turnId) {
  return {
    key,
    type: PLACEHOLDER_TYPE,
    props: {},
    children: [],
    _meta: {
      turnId,
      createdTurnId: turnId,
      lastModifiedTurnId: turnId,
      createdAt: Date.now(),
      isPlaceholder: true
    }
  };
}
function getPatchDepth(patch) {
  if (!patch.path.startsWith("/elements/")) return 0;
  const parts = patch.path.slice("/elements/".length).split("/");
  return parts.length;
}

// src/hooks/patch-utils.ts
function buildCreatedMeta(existingMeta, turnId) {
  if (!turnId && !existingMeta) return void 0;
  const now = Date.now();
  const createdTurnId = existingMeta?.createdTurnId ?? existingMeta?.turnId ?? turnId;
  const lastModifiedTurnId = turnId ?? existingMeta?.lastModifiedTurnId ?? existingMeta?.turnId;
  return {
    ...existingMeta,
    turnId: createdTurnId,
    createdTurnId,
    lastModifiedTurnId,
    createdAt: existingMeta?.createdAt ?? now,
    lastModifiedAt: existingMeta?.lastModifiedAt ?? now
  };
}
function buildUpdatedMeta(existingMeta, turnId) {
  if (!turnId && !existingMeta) return void 0;
  const now = Date.now();
  const createdTurnId = existingMeta?.createdTurnId ?? existingMeta?.turnId ?? turnId;
  const resolvedLastModifiedAt = turnId ? now : existingMeta?.lastModifiedAt ?? now;
  const lastModifiedTurnId = turnId ?? existingMeta?.lastModifiedTurnId ?? existingMeta?.turnId;
  return {
    ...existingMeta,
    turnId: createdTurnId,
    createdTurnId,
    lastModifiedTurnId,
    createdAt: existingMeta?.createdAt ?? now,
    lastModifiedAt: resolvedLastModifiedAt
  };
}
function mergeElementForAdd(existing, incoming) {
  const existingChildren = Array.isArray(existing.children) ? existing.children : [];
  const incomingChildren = Array.isArray(incoming.children) ? incoming.children : [];
  const mergedChildren = incoming.children === void 0 || incomingChildren.length === 0 ? existingChildren : [.../* @__PURE__ */ new Set([...existingChildren, ...incomingChildren])];
  return {
    ...existing,
    ...incoming,
    props: {
      ...existing.props ?? {},
      ...incoming.props ?? {}
    },
    children: mergedChildren
  };
}
function applyPatch(tree, patch, options = {}) {
  const { turnId, protectedTypes = [] } = options;
  const parsedPatch = NormalizedUiPatchSchema.safeParse(patch);
  if (!parsedPatch.success) {
    const reason = parsedPatch.error.issues.map((issue) => issue.message).join("; ");
    throw new Error(`Invalid UI patch: ${reason}`);
  }
  const normalizedPatch = parsedPatch.data;
  const patchPath = normalizedPatch.path;
  if (typeof patchPath !== "string") {
    throw new Error("Invalid UI patch: path is required.");
  }
  const newTree = { ...tree, elements: { ...tree.elements } };
  switch (normalizedPatch.op) {
    case "set":
    case "add":
    case "replace": {
      if (patchPath === "/root") {
        newTree.root = normalizedPatch.value;
        return newTree;
      }
      if (patchPath.startsWith("/elements/")) {
        const pathParts = patchPath.slice("/elements/".length).split("/");
        const elementKey = pathParts[0];
        if (!elementKey) return newTree;
        if (pathParts.length === 1) {
          const element = normalizedPatch.value;
          const existingElement = newTree.elements[elementKey];
          const mergedElement = (normalizedPatch.op === "add" || normalizedPatch.op === "replace") && existingElement ? mergeElementForAdd(existingElement, element) : element;
          const meta = existingElement ? buildUpdatedMeta(mergedElement._meta ?? existingElement._meta, turnId) : buildCreatedMeta(mergedElement._meta, turnId);
          const newElement = meta ? { ...mergedElement, _meta: meta } : mergedElement;
          ensureChildrenExist(
            newTree.elements,
            newElement.children,
            createPlaceholder,
            turnId
          );
          newTree.elements[elementKey] = newElement;
        } else {
          let element = newTree.elements[elementKey];
          if (!element) {
            const isChildrenOperation = pathParts.some((p) => p === "children");
            if (isChildrenOperation) {
              element = {
                key: elementKey,
                type: "Stack",
                props: { gap: "md" },
                children: [],
                _meta: buildCreatedMeta({ autoCreated: true }, turnId)
              };
            } else {
              element = createPlaceholder(elementKey, turnId);
            }
            newTree.elements[elementKey] = element;
          }
          const propPath = "/" + pathParts.slice(1).join("/");
          const newElement = setByPathWithStructuralSharing(
            element,
            propPath,
            normalizedPatch.value
          );
          if (propPath.startsWith("/children") && typeof normalizedPatch.value === "string") {
            const childKey = normalizedPatch.value;
            if (!newTree.elements[childKey]) {
              newTree.elements[childKey] = createPlaceholder(childKey, turnId);
            }
            const childElement = newTree.elements[childKey];
            if (childElement && childElement.parentKey !== elementKey) {
              newTree.elements[childKey] = {
                ...childElement,
                parentKey: elementKey
              };
            }
          }
          const updatedMeta = buildUpdatedMeta(
            newElement._meta ?? element._meta,
            turnId
          );
          const updatedElement = updatedMeta ? { ...newElement, _meta: updatedMeta } : newElement;
          newTree.elements[elementKey] = updatedElement;
        }
      }
      break;
    }
    case "remove": {
      if (patchPath === "/root") {
        newTree.root = "";
        return newTree;
      }
      if (patchPath.startsWith("/elements/")) {
        const pathParts = patchPath.slice("/elements/".length).split("/");
        const elementKey = pathParts[0];
        if (!elementKey) return newTree;
        if (pathParts.length === 1) {
          const element = newTree.elements[elementKey];
          if (element && protectedTypes.includes(element.type)) {
            console.debug(
              `[applyPatch] Blocked removal of protected element: ${element.type}`
            );
            return newTree;
          }
          const { [elementKey]: _, ...rest } = newTree.elements;
          newTree.elements = rest;
        } else {
          const element = newTree.elements[elementKey];
          if (element) {
            const propPath = "/" + pathParts.slice(1).join("/");
            const newElement = { ...element };
            removeByPath(
              newElement,
              propPath
            );
            newTree.elements[elementKey] = newElement;
          }
        }
      }
      break;
    }
    case "ensure": {
      if (patchPath.startsWith("/elements/")) {
        const pathParts = patchPath.slice("/elements/".length).split("/");
        const elementKey = pathParts[0];
        if (!elementKey) return newTree;
        if (pathParts.length === 1 && !newTree.elements[elementKey]) {
          const newElement = normalizedPatch.value;
          const meta = buildCreatedMeta(newElement._meta, turnId);
          const ensuredElement = meta ? { ...newElement, _meta: meta } : newElement;
          ensureChildrenExist(
            newTree.elements,
            ensuredElement.children,
            createPlaceholder,
            turnId
          );
          newTree.elements[elementKey] = ensuredElement;
        }
      }
      break;
    }
  }
  return newTree;
}
function applyPatchesBatch(tree, patches, options = {}) {
  if (patches.length === 0) return tree;
  const rootPatches = [];
  const elementPatches = [];
  const propPatches = [];
  const otherPatches = [];
  for (const patch of patches) {
    if (patch.path === "/root") {
      rootPatches.push(patch);
    } else if (patch.path.startsWith("/elements/")) {
      const depth = getPatchDepth(patch);
      if (depth === 1) {
        elementPatches.push(patch);
      } else {
        propPatches.push(patch);
      }
    } else {
      otherPatches.push(patch);
    }
  }
  elementPatches.sort((a, b) => a.path.localeCompare(b.path));
  propPatches.sort((a, b) => a.path.localeCompare(b.path));
  let newTree = { ...tree, elements: { ...tree.elements } };
  const applyGroup = (group) => {
    for (const patch of group) {
      try {
        newTree = applyPatch(newTree, patch, options);
      } catch (e) {
        if (typeof console !== "undefined") {
          console.warn("[applyPatchesBatch] Skipping invalid patch:", patch.path, e);
        }
      }
    }
  };
  applyGroup(rootPatches);
  applyGroup(elementPatches);
  applyGroup(propPatches);
  applyGroup(otherPatches);
  return newTree;
}

// src/hooks/ui-stream/tree-store-bridge.ts
function createTreeStoreBridge() {
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
    }
  };
}

// src/hooks/ui-stream/tree-mutations.ts
var ARRAY_PROP_NAMES = [
  "items",
  "rows",
  "entries",
  "cards",
  "events",
  "steps",
  "tasks",
  "options",
  "data",
  "children",
  "nodes",
  "sections",
  "flights",
  "exercises",
  "meals",
  "messages",
  "emails",
  "columns"
];
function removeElementFromTree(tree, key) {
  const newTree = JSON.parse(JSON.stringify(tree));
  removeNodeFromTree(newTree, key);
  return newTree;
}
function findIndicesFromIdentifiers(prop, identifiers) {
  const indices = [];
  for (const id of identifiers) {
    if (typeof id === "number") {
      if (id >= 0 && id < prop.length) {
        indices.push(id);
      }
    } else {
      let idx = prop.findIndex(
        (item) => item?.id === id || item?.key === id
      );
      if (idx === -1) {
        const depthMatch = id.match(/^item-(\d+)-(\d+)$/);
        if (depthMatch?.[2]) {
          const parsedIndex = parseInt(depthMatch[2], 10);
          if (parsedIndex >= 0 && parsedIndex < prop.length) {
            idx = parsedIndex;
          }
        }
      }
      if (idx === -1) {
        const simpleMatch = id.match(/^[a-z]+-(\d+)$/i);
        if (simpleMatch?.[1]) {
          const parsedIndex = parseInt(simpleMatch[1], 10);
          if (parsedIndex >= 0 && parsedIndex < prop.length) {
            idx = parsedIndex;
          }
        }
      }
      if (idx !== -1) {
        indices.push(idx);
      }
    }
  }
  return indices;
}
function removeSubItemsFromTree(tree, elementKey, identifiers) {
  if (identifiers.length === 0) return tree;
  const element = tree.elements[elementKey];
  if (!element) return tree;
  const newTree = JSON.parse(JSON.stringify(tree));
  const newElement = newTree.elements[elementKey];
  for (const propName of ARRAY_PROP_NAMES) {
    const prop = newElement.props?.[propName];
    if (Array.isArray(prop) && prop.length > 0) {
      const indicesToRemove = findIndicesFromIdentifiers(prop, identifiers);
      const uniqueSorted = [...new Set(indicesToRemove)].sort((a, b) => b - a);
      for (const idx of uniqueSorted) {
        if (idx >= 0 && idx < prop.length) {
          prop.splice(idx, 1);
        }
      }
      break;
    }
  }
  return newTree;
}
function updateElementInTree(tree, elementKey, updates) {
  const newTree = JSON.parse(JSON.stringify(tree));
  const element = newTree.elements[elementKey];
  if (element) {
    element.props = { ...element.props, ...updates };
  }
  return newTree;
}
function updateElementLayoutInTree(tree, elementKey, layoutUpdates) {
  const element = tree.elements[elementKey];
  if (!element) return tree;
  const newTree = JSON.parse(JSON.stringify(tree));
  const newElement = newTree.elements[elementKey];
  if (!newElement.layout) {
    newElement.layout = {};
  }
  if (layoutUpdates.width !== void 0 || layoutUpdates.height !== void 0) {
    if (!newElement.layout.size) {
      newElement.layout.size = {};
    }
    if (layoutUpdates.width !== void 0) {
      newElement.layout.size.width = layoutUpdates.width;
    }
    if (layoutUpdates.height !== void 0) {
      newElement.layout.size.height = layoutUpdates.height;
    }
  }
  if (layoutUpdates.column !== void 0 || layoutUpdates.row !== void 0 || layoutUpdates.columnSpan !== void 0 || layoutUpdates.rowSpan !== void 0) {
    if (!newElement.layout.grid) {
      newElement.layout.grid = {};
    }
    if (layoutUpdates.column !== void 0) {
      newElement.layout.grid.column = layoutUpdates.column;
    }
    if (layoutUpdates.row !== void 0) {
      newElement.layout.grid.row = layoutUpdates.row;
    }
    if (layoutUpdates.columnSpan !== void 0) {
      newElement.layout.grid.columnSpan = layoutUpdates.columnSpan;
    }
    if (layoutUpdates.rowSpan !== void 0) {
      newElement.layout.grid.rowSpan = layoutUpdates.rowSpan;
    }
  }
  if (layoutUpdates.resizable !== void 0) {
    newElement.layout.resizable = layoutUpdates.resizable;
  }
  return newTree;
}

// src/hooks/ui-stream/use-history.ts
import { useState as useState9, useCallback as useCallback22 } from "react";
function useHistory(tree, conversation, setTree, setConversation) {
  const [history, setHistory] = useState9([]);
  const [historyIndex, setHistoryIndex] = useState9(-1);
  const pushHistory = useCallback22(() => {
    const snapshot = {
      tree: tree ? JSON.parse(JSON.stringify(tree)) : null,
      conversation: JSON.parse(JSON.stringify(conversation))
    };
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, snapshot];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [tree, conversation, historyIndex]);
  const undo = useCallback22(() => {
    if (historyIndex < 0) return;
    const snapshot = history[historyIndex];
    if (snapshot) {
      setTree(snapshot.tree);
      setConversation(snapshot.conversation);
      setHistoryIndex((prev) => prev - 1);
    }
  }, [history, historyIndex, setTree, setConversation]);
  const redo = useCallback22(() => {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    const snapshot = history[nextIndex];
    if (!snapshot) return;
    setTree(snapshot.tree);
    setConversation(snapshot.conversation);
    setHistoryIndex(nextIndex);
  }, [history, historyIndex, setTree, setConversation]);
  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;
  return {
    history,
    historyIndex,
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    setHistory,
    setHistoryIndex
  };
}

// src/hooks/ui-stream/logger.ts
var DEBUG = typeof window !== "undefined" && process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_DEBUG === "true";
function formatLog(level, message, data) {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const dataStr = data ? `
  DATA: ${JSON.stringify(data, null, 2).replace(/\n/g, "\n  ")}` : "";
  return `[${timestamp}] [${level}] [useUIStream] ${message}${dataStr}`;
}
var streamLog = {
  debug: (msg, data) => {
    if (!DEBUG) return;
    console.debug(formatLog("DEBUG", msg, data));
  },
  info: (msg, data) => {
    if (!DEBUG) return;
    console.info(formatLog("INFO", msg, data));
  },
  warn: (msg, data) => {
    if (!DEBUG) return;
    console.warn(formatLog("WARN", msg, data));
  },
  error: (msg, data) => {
    if (!DEBUG) return;
    console.error(formatLog("ERROR", msg, data));
  }
};

// src/hooks/ui-stream/request-builder.ts
function generateIdempotencyKey() {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
function isFileAttachment2(a) {
  return a.type !== "library-document" && "file" in a && a.file instanceof File;
}
function isLibraryAttachment2(a) {
  return a.type === "library-document" && "documentId" in a;
}
function buildConversationMessages2(conversation) {
  const messages = [];
  for (const turn of conversation) {
    if (turn.isLoading) continue;
    if (turn.userMessage) {
      messages.push({ role: "user", content: turn.userMessage });
    }
    const assistantContent = turn.assistantMessages.map((m) => {
      if (typeof m.content === "string") return m.content;
      const fallback = m.text;
      return typeof fallback === "string" ? fallback : "";
    }).filter(Boolean).join("\n");
    if (assistantContent) {
      messages.push({ role: "assistant", content: assistantContent });
    }
  }
  return messages;
}
function buildRequest(input) {
  const { prompt, context, currentTree, conversation, attachments, componentState } = input;
  const headers = {};
  const idempotencyKey = generateIdempotencyKey();
  headers["X-Idempotency-Key"] = idempotencyKey;
  const hasTreeContext = context && typeof context === "object" && "tree" in context;
  const conversationMessages = buildConversationMessages2(conversation);
  const fileAttachments = attachments?.filter(isFileAttachment2) ?? [];
  const libraryAttachments = attachments?.filter(isLibraryAttachment2) ?? [];
  if (fileAttachments.length > 0) {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("idempotencyKey", idempotencyKey);
    if (context) {
      formData.append("context", JSON.stringify(context));
    }
    if (!hasTreeContext) {
      formData.append("currentTree", JSON.stringify(currentTree));
    }
    if (conversationMessages.length > 0) {
      formData.append("messages", JSON.stringify(conversationMessages));
    }
    if (componentState && Object.keys(componentState).length > 0) {
      formData.append("componentState", JSON.stringify(componentState));
    }
    fileAttachments.forEach((att) => {
      formData.append("files", att.file);
    });
    if (libraryAttachments.length > 0) {
      formData.append(
        "libraryDocumentIds",
        JSON.stringify(libraryAttachments.map((a) => a.documentId))
      );
    }
    return { body: formData, headers };
  }
  if (libraryAttachments.length > 0) {
    const bodyPayload2 = {
      prompt,
      context,
      idempotencyKey,
      libraryDocumentIds: libraryAttachments.map((a) => a.documentId)
    };
    if (!hasTreeContext) {
      bodyPayload2.currentTree = currentTree;
    }
    if (conversationMessages.length > 0) {
      bodyPayload2.messages = conversationMessages;
    }
    if (componentState && Object.keys(componentState).length > 0) {
      bodyPayload2.componentState = componentState;
    }
    headers["Content-Type"] = "application/json";
    return { body: JSON.stringify(bodyPayload2), headers };
  }
  const bodyPayload = { prompt, context, idempotencyKey };
  if (!hasTreeContext) {
    bodyPayload.currentTree = currentTree;
  }
  if (conversationMessages.length > 0) {
    bodyPayload.messages = conversationMessages;
  }
  if (componentState && Object.keys(componentState).length > 0) {
    bodyPayload.componentState = componentState;
  }
  headers["Content-Type"] = "application/json";
  return { body: JSON.stringify(bodyPayload), headers };
}

// src/hooks/ui-stream/plan-handler.ts
function handlePlanCreated(payload, store) {
  const { plan } = payload;
  store.setPlanCreated(
    plan.goal,
    plan.steps.map((s) => ({
      id: s.id,
      task: s.task,
      agent: s.agent,
      dependencies: s.dependencies ?? [],
      parallel: s.parallel,
      subtasks: s.subtasks?.map((st) => ({
        id: st.id,
        task: st.task,
        agent: st.agent
      }))
    }))
  );
}
function handleStepStarted(payload, store) {
  store.setStepStarted(payload.stepId);
}
function handleStepDone(payload, store) {
  store.setStepDone(payload.stepId, payload.result);
}
function handleSubtaskStarted(payload, store) {
  store.setSubtaskStarted(payload.parentId, payload.stepId);
}
function handleSubtaskDone(payload, store) {
  store.setSubtaskDone(payload.parentId, payload.stepId, payload.result);
}
function handleLevelStarted(payload, store) {
  store.setLevelStarted(payload.level);
}
function handleOrchestrationDone(payload, store) {
  store.setOrchestrationDone(payload.finalResult);
}
function processPlanEvent(payload, store) {
  const type = payload.type;
  switch (type) {
    case "plan-created":
      handlePlanCreated(payload, store);
      return true;
    case "step-started":
      handleStepStarted(payload, store);
      return true;
    case "step-done":
      handleStepDone(payload, store);
      return true;
    case "subtask-started":
      handleSubtaskStarted(
        payload,
        store
      );
      return true;
    case "subtask-done":
      handleSubtaskDone(
        payload,
        store
      );
      return true;
    case "level-started":
      handleLevelStarted(payload, store);
      return true;
    case "orchestration-done":
      handleOrchestrationDone(payload, store);
      return true;
    default:
      return false;
  }
}

// src/hooks/ui-stream/document-index-handler.ts
function processDocumentIndex(uiComponent, currentIndex) {
  if (!uiComponent?.props) return currentIndex;
  if (!currentIndex) {
    return uiComponent.props;
  }
  const newDoc = uiComponent.props;
  return {
    title: `${currentIndex.title} + ${newDoc.title}`,
    description: [currentIndex.description, newDoc.description].filter(Boolean).join("\n\n---\n\n"),
    pageCount: currentIndex.pageCount + newDoc.pageCount,
    nodes: [
      ...currentIndex.nodes,
      // Add separator node for clarity
      {
        title: `\u{1F4C4} ${newDoc.title}`,
        nodeId: `doc-${Date.now()}`,
        startPage: 1,
        endPage: newDoc.pageCount,
        summary: newDoc.description,
        children: newDoc.nodes
      }
    ]
  };
}

// src/hooks/ui-stream/use-store-refs.ts
import { useRef as useRef15, useEffect as useEffect16 } from "react";
function useStoreRefs() {
  const storeSetUITree = useStore((s) => s.setUITree);
  const storeClearUITree = useStore((s) => s.clearUITree);
  const storeSetTreeStreaming = useStore((s) => s.setTreeStreaming);
  const addProgressEvent = useStore((s) => s.addProgressEvent);
  const setPlanCreated = useStore((s) => s.setPlanCreated);
  const setStepStarted = useStore((s) => s.setStepStarted);
  const setStepDone = useStore((s) => s.setStepDone);
  const setSubtaskStarted = useStore((s) => s.setSubtaskStarted);
  const setSubtaskDone = useStore((s) => s.setSubtaskDone);
  const setLevelStarted = useStore((s) => s.setLevelStarted);
  const setOrchestrationDone = useStore((s) => s.setOrchestrationDone);
  const resetPlanExecution = useStore((s) => s.resetPlanExecution);
  const addProgressRef = useRef15(addProgressEvent);
  useEffect16(() => {
    addProgressRef.current = addProgressEvent;
  }, [addProgressEvent]);
  const storeRef = useRef15({
    setUITree: storeSetUITree,
    setTreeStreaming: storeSetTreeStreaming,
    clearUITree: storeClearUITree
  });
  useEffect16(() => {
    storeRef.current = {
      setUITree: storeSetUITree,
      setTreeStreaming: storeSetTreeStreaming,
      clearUITree: storeClearUITree
    };
  }, [storeSetUITree, storeSetTreeStreaming, storeClearUITree]);
  const planStoreRef = useRef15({
    setPlanCreated,
    setStepStarted,
    setStepDone,
    setSubtaskStarted,
    setSubtaskDone,
    setLevelStarted,
    setOrchestrationDone
  });
  useEffect16(() => {
    planStoreRef.current = {
      setPlanCreated,
      setStepStarted,
      setStepDone,
      setSubtaskStarted,
      setSubtaskDone,
      setLevelStarted,
      setOrchestrationDone
    };
  }, [
    setPlanCreated,
    setStepStarted,
    setStepDone,
    setSubtaskStarted,
    setSubtaskDone,
    setLevelStarted,
    setOrchestrationDone
  ]);
  return {
    storeRef,
    planStoreRef,
    addProgressRef,
    resetPlanExecution
  };
}

// src/hooks/ui-stream/turn-manager.ts
function createTurnId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `turn-${crypto.randomUUID()}`;
  }
  return `turn-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
function createPendingTurn(prompt, options = {}) {
  const { isProactive = false, attachments } = options;
  return {
    id: createTurnId(),
    userMessage: prompt,
    assistantMessages: [],
    treeSnapshot: null,
    timestamp: Date.now(),
    isProactive,
    attachments,
    isLoading: true,
    status: "streaming"
  };
}
function finalizeTurn(turns, turnId, finalData) {
  return turns.map(
    (t) => t.id === turnId ? {
      ...t,
      assistantMessages: [...finalData.messages],
      questions: [...finalData.questions],
      suggestions: [...finalData.suggestions],
      treeSnapshot: JSON.parse(JSON.stringify(finalData.treeSnapshot)),
      documentIndex: finalData.documentIndex ?? t.documentIndex,
      isLoading: false,
      status: "complete"
    } : t
  );
}
function markTurnFailed(turns, turnId, errorMessage) {
  return turns.map(
    (t) => t.id === turnId ? {
      ...t,
      error: errorMessage,
      isLoading: false,
      status: "failed"
    } : t
  );
}
function removeTurn(turns, turnId) {
  return turns.filter((t) => t.id !== turnId);
}
function rollbackToTurn(turns, turnId) {
  const turnIndex = turns.findIndex((t) => t.id === turnId);
  if (turnIndex === -1) return null;
  const newConversation = turns.slice(0, turnIndex);
  const previousTurn = newConversation[newConversation.length - 1];
  const restoredTree = previousTurn?.treeSnapshot ?? null;
  return { newConversation, restoredTree };
}

// src/hooks/ui-stream/question-handler.ts
function collectPreviousAnswers(conversation, currentTurnId) {
  const allPreviousAnswers = {};
  for (const t of conversation) {
    if (t.questionAnswers) {
      for (const qAnswers of Object.values(t.questionAnswers)) {
        if (typeof qAnswers === "object" && qAnswers !== null) {
          Object.assign(allPreviousAnswers, qAnswers);
        }
      }
    }
  }
  if (currentTurnId) {
    const currentTurn = conversation.find((t) => t.id === currentTurnId);
    if (currentTurn?.questionAnswers) {
      for (const qAnswers of Object.values(currentTurn.questionAnswers)) {
        if (typeof qAnswers === "object" && qAnswers !== null) {
          Object.assign(
            allPreviousAnswers,
            qAnswers
          );
        }
      }
    }
  }
  return allPreviousAnswers;
}
function formatAnswerSummary(answers) {
  return Object.entries(answers).map(([key, value]) => `${key}: ${value}`).join(", ");
}
function buildQuestionResponsePrompt(questionText, answers) {
  const answerSummary = formatAnswerSummary(answers);
  return `[User Response] ${questionText}
Answer: ${answerSummary}`;
}
function buildQuestionResponseContext(question, turnId, answers, previousAnswers) {
  return {
    isQuestionResponse: true,
    questionId: question.id,
    turnId,
    originalQuestion: question.text,
    answers,
    previousAnswers,
    allCollectedData: { ...previousAnswers, ...answers },
    hideUserMessage: true
  };
}
function addQuestionAnswer(turns, turnId, questionId, answers) {
  return turns.map((t) => {
    if (t.id !== turnId) return t;
    const existing = t.questionAnswers ?? {};
    return {
      ...t,
      questionAnswers: {
        ...existing,
        [questionId]: answers
      }
    };
  });
}

// src/hooks/ui-stream/use-stream-session.ts
import { useState as useState10, useCallback as useCallback23, useRef as useRef16, useEffect as useEffect17 } from "react";
function useStreamSession(bridge, resetPlanExecution) {
  const [conversation, setConversation] = useState10([]);
  const conversationRef = useRef16([]);
  const [isStreaming, setIsStreaming] = useState10(false);
  const [error, setError] = useState10(null);
  const sendingRef = useRef16(false);
  useEffect17(() => {
    conversationRef.current = conversation;
  }, [conversation]);
  const clear = useCallback23(() => {
    bridge.clear();
    setConversation([]);
    conversationRef.current = [];
    setError(null);
    resetPlanExecution();
  }, [bridge, resetPlanExecution]);
  return {
    conversation,
    isStreaming,
    error,
    conversationRef,
    sendingRef,
    setConversation,
    setIsStreaming,
    setError,
    clear
  };
}

// src/hooks/ui-stream/use-stream-connection.ts
import { useRef as useRef17, useCallback as useCallback24, useMemo as useMemo17 } from "react";

// src/hooks/ui-stream/reconnection-manager.ts
var DEFAULT_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1e3,
  maxDelayMs: 8e3
};
function createReconnectionManager(config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  let lastSequence = -1;
  let retryCount = 0;
  return {
    recordSequence(sequence) {
      if (sequence > lastSequence) {
        lastSequence = sequence;
      }
    },
    getLastSequence() {
      return lastSequence;
    },
    shouldRetry() {
      return retryCount < cfg.maxRetries;
    },
    getRetryDelay() {
      const exponential = cfg.baseDelayMs * Math.pow(2, retryCount);
      const capped = Math.min(exponential, cfg.maxDelayMs);
      const jitter = capped * (0.1 + Math.random() * 0.2);
      retryCount++;
      return Math.round(capped + jitter);
    },
    getResumeHeaders() {
      if (lastSequence < 0) return {};
      return { "X-Resume-After-Sequence": String(lastSequence) };
    },
    reset() {
      lastSequence = -1;
      retryCount = 0;
    },
    getState() {
      return {
        lastSequence,
        retryCount,
        isReconnecting: retryCount > 0
      };
    }
  };
}

// src/hooks/ui-stream/use-stream-connection.ts
async function performFetch(params, extraHeaders = {}) {
  const dynamicHeaders = params.getHeaders ? await params.getHeaders() : {};
  const mergedHeaders = { ...params.headers, ...dynamicHeaders, ...extraHeaders };
  const response = await fetch(params.api, {
    method: "POST",
    headers: mergedHeaders,
    body: params.body,
    signal: params.signal
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Stream request failed (${response.status}): ${errorText}`);
  }
  if (!response.body) {
    throw new Error("Response body is null \u2014 streaming not supported");
  }
  return response.body.getReader();
}
function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}
function useStreamConnection() {
  const controllersRef = useRef17(/* @__PURE__ */ new Map());
  const reconnection = useMemo17(() => createReconnectionManager(), []);
  const setupAbort = useCallback24((chatId) => {
    for (const controller2 of controllersRef.current.values()) {
      controller2.abort();
    }
    controllersRef.current.clear();
    reconnection.reset();
    const controller = new AbortController();
    const abortKey = chatId ?? "default";
    controllersRef.current.set(abortKey, controller);
    return { signal: controller.signal, abortKey };
  }, [reconnection]);
  const connect = useCallback24(
    (params) => performFetch(params),
    []
  );
  const connectWithRetry = useCallback24(
    async (params) => {
      try {
        const resumeHeaders = reconnection.getResumeHeaders();
        return await performFetch(params, resumeHeaders);
      } catch (err) {
        if (err.name === "AbortError") throw err;
        if (!reconnection.shouldRetry()) throw err;
        const retryDelay = reconnection.getRetryDelay();
        const state = reconnection.getState();
        streamLog.warn("Stream connection failed, retrying", {
          attempt: state.retryCount,
          delayMs: retryDelay,
          lastSequence: state.lastSequence,
          error: err.message
        });
        await delay(retryDelay, params.signal);
        return connectWithRetry(params);
      }
    },
    [reconnection]
  );
  const abort = useCallback24(() => {
    for (const controller of controllersRef.current.values()) {
      controller.abort();
    }
    controllersRef.current.clear();
  }, []);
  const clearControllers = useCallback24(() => {
    controllersRef.current.clear();
  }, []);
  return { setupAbort, connect, connectWithRetry, abort, clearControllers, reconnection };
}

// src/hooks/ui-stream/use-stream-event-loop.ts
import { useCallback as useCallback25 } from "react";

// src/hooks/ui-stream/stream-parser.ts
import { WireFrameSchema } from "@onegenui/core";
function parsePatchOperation(patch) {
  if (patch.op === "message") {
    const content = patch.content ?? patch.value;
    if (!content) return null;
    return {
      type: "message",
      message: {
        role: patch.role ?? "assistant",
        content: String(content)
      }
    };
  }
  if (patch.op === "question") {
    const question = patch.question ?? patch.value;
    return question ? { type: "question", question } : null;
  }
  if (patch.op === "suggestion") {
    const suggestions = patch.suggestions ?? patch.value;
    return Array.isArray(suggestions) ? { type: "suggestion", suggestions } : null;
  }
  if (patch.path) {
    return { type: "patch", patches: [patch] };
  }
  return null;
}
function parsePatchEvent(event) {
  const rawPatches = event.patch ? [event.patch] : Array.isArray(event.patches) ? event.patches : [];
  if (rawPatches.length === 0) {
    return null;
  }
  const atomic = event.atomic;
  const parsedEvents = rawPatches.map((patch) => parsePatchOperation(patch)).filter((candidate) => candidate !== null);
  if (parsedEvents.length === 0) {
    return null;
  }
  if (parsedEvents.length === 1) {
    const first = parsedEvents[0];
    if (first.type === "patch" && atomic) {
      return { ...first, atomic };
    }
    return first;
  }
  const patchEvents = parsedEvents.filter((candidate) => candidate.type === "patch");
  if (patchEvents.length === parsedEvents.length) {
    const mergedPatches = patchEvents.flatMap((candidate) => candidate.patches);
    return { type: "patch", patches: mergedPatches, atomic };
  }
  const firstNonPatch = parsedEvents.find((candidate) => candidate.type !== "patch");
  if (firstNonPatch) {
    streamLog.warn(
      "Mixed patch payload: non-patch operations cannot be split per frame",
      { operations: rawPatches.length }
    );
    return firstNonPatch;
  }
  return null;
}
function parseControlEvent(control) {
  const data = control.data ?? {};
  switch (control.action) {
    case "start":
      return {
        type: "streaming-started",
        timestamp: Date.now()
      };
    case "persisted-attachments":
      return {
        type: "persisted-attachments",
        attachments: data.attachments ?? []
      };
    case "plan-created":
      return { type: "plan-created", plan: data.plan };
    case "step-started":
      return { type: "step-started", stepId: Number(data.stepId ?? 0) };
    case "step-done":
      return {
        type: "step-done",
        stepId: Number(data.stepId ?? 0),
        result: data.result
      };
    case "subtask-started":
      return {
        type: "subtask-started",
        parentId: Number(data.parentId ?? 0),
        stepId: Number(data.stepId ?? 0)
      };
    case "subtask-done":
      return {
        type: "subtask-done",
        parentId: Number(data.parentId ?? 0),
        stepId: Number(data.stepId ?? 0),
        result: data.result
      };
    case "level-started":
      return { type: "level-started", level: Number(data.level ?? 0) };
    case "level-completed":
      return { type: "level-completed", level: Number(data.level ?? 0) };
    case "orchestration-done":
      return { type: "orchestration-done", finalResult: data.finalResult };
    case "document-index-ui":
      return { type: "document-index-ui", uiComponent: data.uiComponent };
    case "citations":
      return { type: "citations", citations: data.citations ?? [] };
    default:
      return { type: "unknown", payload: { control } };
  }
}
function parseSSELine(line) {
  if (!line) return null;
  const separatorIndex = line.indexOf(":");
  if (separatorIndex === -1) return null;
  const lineType = line.slice(0, separatorIndex);
  if (lineType !== "d" && lineType !== "data") {
    return null;
  }
  const content = line.slice(separatorIndex + 1).trim();
  if (!content) return null;
  try {
    const payload = JSON.parse(content);
    const frame = WireFrameSchema.safeParse(payload);
    if (!frame.success) {
      const issues = frame.error.issues.map((issue) => issue.message);
      streamLog.warn("Invalid wire frame", {
        issues
      });
      return {
        type: "error",
        error: {
          code: "STREAM_PROTOCOL_ERROR",
          message: `Invalid wire frame: ${issues.join("; ") || "unknown validation error"}`,
          recoverable: false
        }
      };
    }
    const event = frame.data.event;
    switch (event.kind) {
      case "control":
        return parseControlEvent(event);
      case "progress":
        return {
          type: "tool-progress",
          progress: {
            toolName: event.toolName ?? "system",
            toolCallId: event.toolCallId ?? `progress-${frame.data.sequence}`,
            status: event.status ?? "progress",
            message: event.message,
            data: event.data,
            progress: event.progress
          }
        };
      case "message":
        return {
          type: "message",
          message: {
            id: event.id,
            mode: event.mode,
            role: event.role,
            content: event.content
          }
        };
      case "patch":
        return parsePatchEvent(event);
      case "error":
        return {
          type: "error",
          error: {
            code: event.code,
            message: event.message,
            recoverable: event.recoverable
          }
        };
      case "done":
        return { type: "done" };
      default:
        return { type: "unknown", payload: event };
    }
  } catch {
    streamLog.warn("Failed to parse SSE line", {
      content: content.slice(0, 100)
    });
    return null;
  }
}

// src/hooks/ui-stream/stream-reader.ts
var IDLE_TIMEOUT_MS = 3e5;
async function* readStreamWithTimeout(reader) {
  const decoder = new TextDecoder();
  let buffer = "";
  let lastActivityTime = Date.now();
  const resetIdleTimer = () => {
    lastActivityTime = Date.now();
  };
  while (true) {
    const readPromise = reader.read();
    const timeoutPromise = new Promise((_, reject) => {
      const checkInterval = setInterval(() => {
        if (Date.now() - lastActivityTime > IDLE_TIMEOUT_MS) {
          clearInterval(checkInterval);
          reject(new Error(`Stream idle timeout: no activity for ${IDLE_TIMEOUT_MS / 1e3}s`));
        }
      }, 5e3);
      readPromise.finally(() => clearInterval(checkInterval));
    });
    const { done, value } = await Promise.race([readPromise, timeoutPromise]);
    if (done) break;
    resetIdleTimer();
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line) continue;
      const event = parseSSELine(line);
      if (event) {
        yield event;
      }
    }
  }
}

// src/hooks/ui-stream/use-stream-event-loop.ts
var PLAN_EVENT_TYPES = /* @__PURE__ */ new Set([
  "plan-created",
  "step-started",
  "step-done",
  "subtask-started",
  "subtask-done",
  "level-started",
  "level-completed",
  "orchestration-done"
]);
var CRITICAL_EVENT_TYPES = /* @__PURE__ */ new Set([
  "message",
  "patch",
  "question",
  "suggestion",
  "persisted-attachments"
]);
function applyMessageEvent(messages, message) {
  const mode = message.mode ?? "final";
  const messageId = message.id;
  if (!messageId || mode === "final") {
    messages.push({ ...message, mode: "final" });
    return;
  }
  const existingIndex = messages.findIndex((item) => item.id === messageId);
  if (existingIndex === -1) {
    messages.push({ ...message, mode: "final" });
    return;
  }
  const existing = messages[existingIndex];
  if (!existing) return;
  const nextContent = mode === "append" ? `${existing.content}${message.content}` : message.content;
  messages[existingIndex] = { ...existing, ...message, mode: "final", content: nextContent };
}
function useStreamEventLoop() {
  const processStream = useCallback25(
    async (params) => {
      const { reader, turnId, setConversation, handlers } = params;
      const msgs = [];
      const questions = [];
      const suggestions = [];
      const toolProgress = [];
      const attachments = [];
      let docIndex;
      let patchCount = 0;
      let messageCount = 0;
      const updateTurnData = () => {
        setConversation(
          (prev) => prev.map(
            (t) => t.id === turnId ? {
              ...t,
              assistantMessages: [...msgs],
              questions: [...questions],
              suggestions: [...suggestions],
              toolProgress: [...toolProgress],
              persistedAttachments: attachments.length > 0 ? [...attachments] : t.persistedAttachments,
              documentIndex: docIndex ?? t.documentIndex
            } : t
          )
        );
      };
      setConversation(
        (prev) => prev.map((t) => t.id === turnId ? { ...t, status: "streaming" } : t)
      );
      streamLog.debug("Starting stream processing");
      for await (const event of readStreamWithTimeout(reader)) {
        try {
          if (event.type === "done" || event.type === "text-delta") continue;
          if (event.type === "error") throw new Error(`[${event.error.code}] ${event.error.message}`);
          if (event.type === "message") {
            messageCount++;
            streamLog.debug("Message received", { messageCount, contentLength: event.message.content?.length ?? 0 });
            applyMessageEvent(msgs, event.message);
            updateTurnData();
          } else if (event.type === "question") {
            questions.push(event.question);
            updateTurnData();
          } else if (event.type === "suggestion") {
            suggestions.push(...event.suggestions);
            updateTurnData();
          } else if (event.type === "tool-progress") {
            toolProgress.push(event.progress);
            updateTurnData();
            handlers.onToolProgress(event.progress);
          } else if (event.type === "patch") {
            patchCount += event.patches.length;
            handlers.onPatch(event.patches, event.atomic);
          } else if (PLAN_EVENT_TYPES.has(event.type)) {
            handlers.onPlanEvent(event);
          } else if (event.type === "persisted-attachments") {
            attachments.push(...event.attachments);
            updateTurnData();
          } else if (event.type === "document-index-ui") {
            const ui = event.uiComponent;
            const updated = handlers.onDocumentIndex(ui, docIndex);
            if (updated) {
              docIndex = updated;
              updateTurnData();
            }
          } else if (event.type === "citations" && Array.isArray(event.citations)) {
            handlers.onCitations(event.citations);
          }
        } catch (e) {
          if (CRITICAL_EVENT_TYPES.has(event.type)) throw e;
          streamLog.warn("Event processing error", {
            error: e instanceof Error ? e.message : String(e),
            eventType: event.type
          });
        }
      }
      return { messages: msgs, questions, suggestions, persistedAttachments: attachments, documentIndex: docIndex, patchCount, messageCount };
    },
    []
  );
  return { processStream };
}

// src/hooks/ui-stream/use-patch-pipeline-hook.ts
import { useRef as useRef18, useCallback as useCallback26 } from "react";

// src/hooks/ui-stream/patch-pipeline.ts
function getNodePath(node) {
  const path = [];
  let current = node;
  while (current?.parentNode) {
    const parent = current.parentNode;
    const index = Array.from(parent.childNodes).indexOf(current);
    path.unshift(index);
    current = parent;
  }
  return path;
}
function resolveNodePath(path, root) {
  let node = root.body;
  for (const idx of path) {
    if (!node.childNodes[idx]) return null;
    node = node.childNodes[idx];
  }
  return node;
}
function saveSelection() {
  if (typeof window === "undefined") return null;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
  return {
    anchorNodePath: getNodePath(sel.anchorNode),
    anchorOffset: sel.anchorOffset,
    focusNodePath: getNodePath(sel.focusNode),
    focusOffset: sel.focusOffset
  };
}
function restoreSelection(saved) {
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
  }
}
function createPatchPipeline(bridge, options = {}) {
  const maxBuffer = options.maxBufferSize ?? 50;
  const patchOpts = options.patchOptions ?? {};
  let buffer = [];
  let totalPatches = 0;
  let rafId = null;
  function applyBuffer() {
    if (buffer.length === 0) return;
    const toApply = buffer;
    const count = totalPatches;
    buffer = [];
    totalPatches = 0;
    rafId = null;
    const savedSel = saveSelection();
    const allPatches = [];
    for (const group of toApply) {
      if (group.atomic) {
        if (allPatches.length > 0) {
          try {
            bridge.applyPatches([...allPatches], patchOpts);
          } catch (e) {
            streamLog.error("Patch application failed", { error: e, patchCount: allPatches.length });
          }
          allPatches.length = 0;
        }
        try {
          bridge.applyPatches(group.patches, patchOpts);
        } catch (e) {
          streamLog.error("Atomic patch application failed", { error: e, patchCount: group.patches.length });
        }
      } else {
        allPatches.push(...group.patches);
      }
    }
    if (allPatches.length > 0) {
      try {
        bridge.applyPatches(allPatches, patchOpts);
      } catch (e) {
        streamLog.error("Patch application failed", { error: e, patchCount: allPatches.length });
      }
    }
    streamLog.debug("Pipeline flushed", { groups: toApply.length, totalPatches: count });
    if (savedSel) {
      requestAnimationFrame(() => restoreSelection(savedSel));
    }
  }
  function scheduleFlush() {
    if (rafId !== null) return;
    if (typeof requestAnimationFrame !== "undefined") {
      rafId = requestAnimationFrame(applyBuffer);
    } else {
      setTimeout(applyBuffer, 0);
    }
  }
  return {
    push(patches, atomic = false) {
      if (patches.length === 0) return;
      buffer.push({ patches, atomic });
      totalPatches += patches.length;
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
    }
  };
}

// src/hooks/ui-stream/use-patch-pipeline-hook.ts
function usePatchPipelineHook(bridge) {
  const pipelineRef = useRef18(null);
  const create3 = useCallback26(
    (options) => {
      pipelineRef.current?.reset();
      const pipeline = createPatchPipeline(bridge, {
        patchOptions: {
          turnId: options.turnId,
          protectedTypes: options.protectedTypes ?? []
        }
      });
      pipelineRef.current = pipeline;
      return pipeline;
    },
    [bridge]
  );
  const cleanup = useCallback26(() => {
    pipelineRef.current?.reset();
    pipelineRef.current = null;
  }, []);
  return { create: create3, cleanup };
}

// src/hooks/ui-stream/use-deep-research-tracker.ts
import { useRef as useRef19, useEffect as useEffect18, useCallback as useCallback27 } from "react";
import { useShallow as useShallow4 } from "zustand/shallow";
var DEEP_RESEARCH_PHASES = [
  { id: "decomposing", label: "Decomposing", status: "pending", progress: 0 },
  { id: "searching", label: "Searching", status: "pending", progress: 0 },
  { id: "ranking", label: "Ranking", status: "pending", progress: 0 },
  { id: "extracting", label: "Extracting", status: "pending", progress: 0 },
  { id: "analyzing", label: "Analyzing", status: "pending", progress: 0 },
  { id: "synthesizing", label: "Synthesizing", status: "pending", progress: 0 },
  { id: "visualizing", label: "Visualizing", status: "pending", progress: 0 }
];
var PHASE_KEYWORDS = [
  ["decompos", 0],
  ["search", 1],
  ["rank", 2],
  ["extract", 3],
  ["analyz", 4],
  ["synth", 5],
  ["visual", 6]
];
function mapDeepResearchPhase(message) {
  const normalized = message.toLowerCase();
  for (const [keyword, index] of PHASE_KEYWORDS) {
    if (normalized.includes(keyword)) return DEEP_RESEARCH_PHASES[index] ?? null;
  }
  return null;
}
function normalizeDeepResearchProgress(progress) {
  if (typeof progress !== "number") return void 0;
  return Math.round(progress <= 1 ? progress * 100 : progress);
}
function useDeepResearchTracker() {
  const { updateResearchProgress, updateResearchPhase, addResearchSource, completeResearch, failResearch } = useStore(
    useShallow4((s) => ({
      updateResearchProgress: s.updateResearchProgress,
      updateResearchPhase: s.updateResearchPhase,
      addResearchSource: s.addResearchSource,
      completeResearch: s.completeResearch,
      failResearch: s.failResearch
    }))
  );
  const deepResearchSettings = useStore((s) => s.deepResearchSettings);
  const deepResearchActiveRef = useRef19(false);
  useEffect18(() => {
    deepResearchActiveRef.current = deepResearchSettings.enabled;
  }, [deepResearchSettings.enabled]);
  const updateProgressRef = useRef19(updateResearchProgress);
  const updatePhaseRef = useRef19(updateResearchPhase);
  const addSourceRef = useRef19(addResearchSource);
  const completeRef = useRef19(completeResearch);
  const failRef = useRef19(failResearch);
  useEffect18(() => {
    updateProgressRef.current = updateResearchProgress;
    updatePhaseRef.current = updateResearchPhase;
    addSourceRef.current = addResearchSource;
    completeRef.current = completeResearch;
    failRef.current = failResearch;
  }, [updateResearchProgress, updateResearchPhase, addResearchSource, completeResearch, failResearch]);
  const deepResearchToolCallIdRef = useRef19(null);
  const initializeResearch = useCallback27((context, prompt) => {
    deepResearchToolCallIdRef.current = null;
    if (!context?.deepResearch || !deepResearchActiveRef.current) return;
    const effort = context.deepResearch.effort ?? "standard";
    useStore.getState().setDeepResearchEffortLevel(effort);
    useStore.getState().startResearch(prompt);
    updateProgressRef.current({
      effortLevel: effort,
      status: "searching",
      currentPhase: "Decomposing",
      phases: DEEP_RESEARCH_PHASES.map((phase, i) => ({
        ...phase,
        status: i === 0 ? "running" : "pending",
        progress: 0,
        startTime: i === 0 ? Date.now() : void 0
      }))
    });
  }, []);
  const handleDeepResearchToolProgress = useCallback27((progress) => {
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
            id: `src-${Date.now()}`,
            url: sourceMatch[0],
            title: urlObj.hostname,
            domain: urlObj.hostname.replace("www.", ""),
            credibility: 0.5,
            status: "analyzing"
          });
        } catch {
        }
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
  const handleCompletion = useCallback27(() => {
    if (deepResearchToolCallIdRef.current) updateProgressRef.current({ status: "complete", progress: 100 });
  }, []);
  const handleAbort = useCallback27(() => {
    if (deepResearchToolCallIdRef.current) updateProgressRef.current({ status: "stopped" });
  }, []);
  const handleError = useCallback27((errorMessage) => {
    if (deepResearchToolCallIdRef.current) failRef.current(errorMessage);
  }, []);
  return {
    deepResearchActiveRef,
    deepResearchToolCallIdRef,
    initializeResearch,
    handleDeepResearchToolProgress,
    handleCompletion,
    handleAbort,
    handleError
  };
}

// src/hooks/useUIStream.ts
var log3 = loggers3.react;
function useUIStream({
  api,
  onComplete,
  onError,
  getHeaders,
  getChatId,
  onBackgroundComplete
}) {
  const { storeTree, treeVersion } = useStore(
    useShallow5((s) => ({ storeTree: s.uiTree, treeVersion: s.treeVersion }))
  );
  const { planStoreRef, addProgressRef, resetPlanExecution } = useStoreRefs();
  const bridge = useMemo18(() => createTreeStoreBridge(), []);
  const tree = useMemo18(() => {
    if (!storeTree) return null;
    return { ...storeTree, elements: { ...storeTree.elements } };
  }, [storeTree, treeVersion]);
  const setTree = useCallback28(
    (newTree) => {
      const finalTree = typeof newTree === "function" ? newTree(bridge.getTree()) : newTree;
      log3.debug("[useUIStream] setTree", {
        hasTree: !!finalTree,
        elementsCount: finalTree?.elements ? Object.keys(finalTree.elements).length : 0
      });
      bridge.setTree(finalTree);
    },
    [bridge]
  );
  const session = useStreamSession(bridge, resetPlanExecution);
  const connection = useStreamConnection();
  const { processStream } = useStreamEventLoop();
  const pipelineHook = usePatchPipelineHook(bridge);
  const deepResearch = useDeepResearchTracker();
  const { pushHistory, undo, redo, canUndo, canRedo, setHistory, setHistoryIndex } = useHistory(tree, session.conversation, setTree, session.setConversation);
  const removeElement = useCallback28(
    (key) => {
      pushHistory();
      setTree((prev) => prev ? removeElementFromTree(prev, key) : null);
    },
    [pushHistory, setTree]
  );
  const removeSubItems = useCallback28(
    (elementKey, identifiers) => {
      if (identifiers.length === 0) return;
      pushHistory();
      setTree((prev) => prev ? removeSubItemsFromTree(prev, elementKey, identifiers) : null);
    },
    [pushHistory, setTree]
  );
  const updateElement = useCallback28(
    (elementKey, updates) => {
      setTree((prev) => prev ? updateElementInTree(prev, elementKey, updates) : null);
    },
    [setTree]
  );
  const updateElementLayout = useCallback28(
    (elementKey, layoutUpdates) => {
      pushHistory();
      setTree((prev) => prev ? updateElementLayoutInTree(prev, elementKey, layoutUpdates) : null);
    },
    [pushHistory, setTree]
  );
  const send = useCallback28(
    async (prompt, context, attachments) => {
      const chatId = context?.chatId ?? getChatId?.();
      if (session.sendingRef.current) {
        streamLog.warn("Ignoring concurrent send", { prompt: prompt.slice(0, 100) });
        return;
      }
      session.sendingRef.current = true;
      streamLog.info("Starting send", { promptLength: prompt.length, hasContext: !!context, attachmentCount: attachments?.length ?? 0, chatId });
      const { signal } = connection.setupAbort(chatId);
      session.setIsStreaming(true);
      session.setError(null);
      bridge.setStreaming(true);
      if (!bridge.getTree()) {
        streamLog.debug("Initializing empty tree");
        bridge.setTree({ root: "", elements: {} });
      }
      const isProactive = context?.hideUserMessage === true;
      const pendingTurn = createPendingTurn(prompt, { isProactive, attachments });
      const turnId = pendingTurn.id;
      streamLog.debug("Creating turn", { turnId, isProactive, userMessage: prompt.slice(0, 50) });
      deepResearch.initializeResearch(context, prompt);
      session.setConversation((prev) => {
        const updated = [...prev, pendingTurn];
        streamLog.debug("Conversation updated", { prevLength: prev.length, newLength: updated.length, pendingTurnId: pendingTurn.id, userMessage: pendingTurn.userMessage?.slice(0, 50) });
        return updated;
      });
      const protectedTypes = context?.forceCanvasMode === true ? ["Canvas"] : [];
      const pipeline = pipelineHook.create({ turnId, protectedTypes });
      try {
        const fileAtts = attachments?.filter(isFileAttachment2) ?? [];
        if (fileAtts.length > 0) {
          streamLog.debug("Uploading attachments", { count: fileAtts.length, files: fileAtts.map((a) => ({ name: a.file.name, type: a.file.type, size: a.file.size })) });
        }
        const { body, headers } = buildRequest({ prompt, context, currentTree: bridge.getTree() ?? { root: "", elements: {} }, conversation: session.conversationRef.current, attachments, componentState: useStore.getState().componentState });
        streamLog.info("Sending request to API", { api, hasAuth: !!getHeaders });
        const reader = await connection.connect({ api, body, headers, signal, getHeaders });
        const result = await processStream({
          reader,
          turnId,
          setConversation: session.setConversation,
          handlers: {
            onPatch: (patches, atomic) => pipeline.push(patches, atomic),
            onToolProgress: (progress) => {
              addProgressRef.current({ toolCallId: progress.toolCallId, toolName: progress.toolName, status: progress.status, message: progress.message, data: progress.data, progress: normalizeDeepResearchProgress(progress.progress) });
              deepResearch.handleDeepResearchToolProgress(progress);
            },
            onPlanEvent: (event) => processPlanEvent(event, planStoreRef.current),
            onDocumentIndex: (uiComponent, current) => processDocumentIndex(uiComponent, current),
            onCitations: (citations) => {
              if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("onegenui:citations", { detail: { citations } }));
            }
          }
        });
        pipeline.flush();
        const finalTree = bridge.getTree() ?? { root: "", elements: {} };
        streamLog.info("Stream completed", { totalPatches: result.patchCount, totalMessages: result.messageCount, treeElementCount: Object.keys(finalTree.elements).length });
        if (signal.aborted) {
          streamLog.warn("Request aborted before finalization");
          return;
        }
        streamLog.debug("Finalizing turn", { turnId });
        session.setConversation((prev) => finalizeTurn(prev, turnId, { messages: result.messages, questions: result.questions, suggestions: result.suggestions, treeSnapshot: finalTree, documentIndex: result.documentIndex }));
        deepResearch.handleCompletion();
        onComplete?.(finalTree);
      } catch (err) {
        pipeline.reset();
        if (err.name === "AbortError") {
          streamLog.info("Request aborted", { turnId });
          deepResearch.handleAbort();
          session.setConversation((prev) => removeTurn(prev, turnId));
          return;
        }
        const error = err instanceof Error ? err : new Error(String(err));
        streamLog.error("Stream error", { error: error.message, turnId });
        session.setError(error);
        onError?.(error);
        deepResearch.handleError(error.message);
        session.setConversation((prev) => markTurnFailed(prev, turnId, error.message));
      } finally {
        session.sendingRef.current = false;
        connection.clearControllers();
        session.setIsStreaming(false);
        bridge.setStreaming(false);
        streamLog.debug("Send completed");
      }
    },
    [api, onComplete, onError, setTree, getChatId, getHeaders, bridge, connection, session, processStream, pipelineHook, deepResearch]
  );
  const answerQuestion = useCallback28(
    (turnId, questionId, answers) => {
      const turn = session.conversation.find((t) => t.id === turnId);
      const question = turn?.questions?.find((q) => q.id === questionId);
      const allPrev = collectPreviousAnswers(session.conversation, turnId);
      session.setConversation((prev) => addQuestionAnswer(prev, turnId, questionId, answers));
      if (question) send(buildQuestionResponsePrompt(question.text, answers), buildQuestionResponseContext(question, turnId, answers, allPrev));
    },
    [session.conversation, send]
  );
  const loadSession = useCallback28(
    (sess) => {
      const rootEl = sess.tree?.elements?.[sess.tree?.root];
      log3.debug("[useUIStream] loadSession called", { hasTree: !!sess.tree, rootKey: sess.tree?.root, rootChildrenCount: rootEl?.children?.length, elementsCount: sess.tree?.elements ? Object.keys(sess.tree.elements).length : 0, conversationLength: sess.conversation?.length });
      setTree(sess.tree);
      session.setConversation(sess.conversation);
      session.conversationRef.current = sess.conversation;
      setHistory([]);
      setHistoryIndex(-1);
      log3.debug("[useUIStream] loadSession complete, tree set");
    },
    [setTree, setHistory, setHistoryIndex]
  );
  const deleteTurn = useCallback28(
    (turnId) => {
      pushHistory();
      const result = rollbackToTurn(session.conversation, turnId);
      if (!result) return;
      setTree(result.restoredTree ?? { root: "", elements: {} });
      session.setConversation(result.newConversation);
    },
    [session.conversation, pushHistory, setTree]
  );
  const editTurn = useCallback28(
    async (turnId, newMessage) => {
      pushHistory();
      const result = rollbackToTurn(session.conversation, turnId);
      if (!result) return;
      setTree(result.restoredTree);
      session.setConversation(result.newConversation);
      await send(newMessage, result.restoredTree ? { tree: result.restoredTree } : void 0);
    },
    [session.conversation, send, pushHistory, setTree]
  );
  const abort = useCallback28(() => {
    connection.abort();
    session.sendingRef.current = false;
    session.setIsStreaming(false);
  }, []);
  useEffect19(() => () => {
    pipelineHook.cleanup();
    connection.abort();
  }, []);
  return {
    tree,
    conversation: session.conversation,
    isStreaming: session.isStreaming,
    error: session.error,
    send,
    clear: session.clear,
    loadSession,
    removeElement,
    removeSubItems,
    updateElement,
    updateElementLayout,
    deleteTurn,
    editTurn,
    undo,
    redo,
    canUndo,
    canRedo,
    answerQuestion,
    abort
  };
}

// src/hooks/useTextSelection.ts
import { useCallback as useCallback29 } from "react";
function useTextSelection() {
  const getTextSelection = useCallback29(() => {
    if (typeof window === "undefined") return null;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return null;
    const text2 = selection.toString().trim();
    if (!text2) return null;
    const anchorNode = selection.anchorNode;
    const parentElement = anchorNode?.parentElement;
    const componentWrapper = parentElement?.closest(
      "[data-jsonui-element-key]"
    );
    const elementKey = componentWrapper?.getAttribute("data-jsonui-element-key") ?? void 0;
    const elementType = componentWrapper?.getAttribute("data-jsonui-element-type") ?? void 0;
    return {
      text: text2,
      elementKey,
      elementType
    };
  }, []);
  const restoreTextSelection = useCallback29((range) => {
    if (typeof window === "undefined") return;
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);
  const clearTextSelection = useCallback29(() => {
    if (typeof window === "undefined") return;
    window.getSelection()?.removeAllRanges();
    document.dispatchEvent(new CustomEvent("jsonui-text-selection-cleared"));
  }, []);
  const hasTextSelection = useCallback29(() => {
    if (typeof window === "undefined") return false;
    const selection = window.getSelection();
    return !!(selection && !selection.isCollapsed && selection.toString().trim());
  }, []);
  return {
    getTextSelection,
    restoreTextSelection,
    clearTextSelection,
    hasTextSelection
  };
}

// src/hooks/useIsMobile.ts
import { useState as useState11, useEffect as useEffect20 } from "react";
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState11(false);
  useEffect20(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [breakpoint]);
  return isMobile;
}

// src/hooks/usePreservedSelection.ts
import { useState as useState12, useCallback as useCallback30, useRef as useRef20, useEffect as useEffect21 } from "react";
function usePreservedSelection() {
  const [preserved, setPreserved] = useState12(
    null
  );
  const rangeRef = useRef20(null);
  const preserve = useCallback30(async () => {
    if (typeof window === "undefined") return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const text2 = selection.toString().trim();
    if (!text2) return;
    let clonedRange = null;
    try {
      clonedRange = selection.getRangeAt(0).cloneRange();
      rangeRef.current = clonedRange;
    } catch {
      rangeRef.current = null;
    }
    const anchorNode = selection.anchorNode;
    const parentElement = anchorNode?.parentElement;
    const componentWrapper = parentElement?.closest(
      "[data-jsonui-element-key]"
    );
    const elementKey = componentWrapper?.getAttribute("data-jsonui-element-key") ?? void 0;
    const elementType = componentWrapper?.getAttribute("data-jsonui-element-type") ?? void 0;
    let copiedToClipboard = false;
    try {
      await navigator.clipboard.writeText(text2);
      copiedToClipboard = true;
    } catch {
      copiedToClipboard = false;
    }
    setPreserved({
      text: text2,
      range: clonedRange,
      elementKey,
      elementType,
      timestamp: Date.now(),
      copiedToClipboard
    });
  }, []);
  const restore = useCallback30(() => {
    if (typeof window === "undefined") return false;
    if (!rangeRef.current) return false;
    const selection = window.getSelection();
    if (!selection) return false;
    try {
      selection.removeAllRanges();
      selection.addRange(rangeRef.current);
      return true;
    } catch {
      return false;
    }
  }, []);
  const clear = useCallback30(() => {
    setPreserved(null);
    rangeRef.current = null;
  }, []);
  const copyToClipboard = useCallback30(async () => {
    if (!preserved?.text) return false;
    try {
      await navigator.clipboard.writeText(preserved.text);
      setPreserved(
        (prev) => prev ? { ...prev, copiedToClipboard: true } : null
      );
      return true;
    } catch {
      return false;
    }
  }, [preserved]);
  useEffect21(() => {
    if (!preserved) return;
    const timeout = setTimeout(
      () => {
        clear();
      },
      5 * 60 * 1e3
    );
    return () => clearTimeout(timeout);
  }, [preserved, clear]);
  return {
    preserved,
    preserve,
    restore,
    clear,
    copyToClipboard,
    hasPreserved: preserved !== null
  };
}

// src/hooks/useLayoutManager.ts
import { useCallback as useCallback31, useMemo as useMemo19 } from "react";
function useLayoutManager({
  tree,
  onTreeUpdate,
  onLayoutChange
}) {
  const updateLayout = useCallback31(
    (elementKey, layoutUpdate) => {
      if (!tree || !onTreeUpdate) return;
      onTreeUpdate((currentTree) => {
        const element = currentTree.elements[elementKey];
        if (!element) return currentTree;
        const currentLayout = element.layout ?? {};
        const newLayout = {
          ...currentLayout,
          ...layoutUpdate,
          // Deep merge size and grid
          size: layoutUpdate.size ? { ...currentLayout.size, ...layoutUpdate.size } : currentLayout.size,
          grid: layoutUpdate.grid ? { ...currentLayout.grid, ...layoutUpdate.grid } : currentLayout.grid
        };
        const updatedElement = {
          ...element,
          layout: newLayout
        };
        onLayoutChange?.(elementKey, newLayout);
        return {
          ...currentTree,
          elements: {
            ...currentTree.elements,
            [elementKey]: updatedElement
          }
        };
      });
    },
    [tree, onTreeUpdate, onLayoutChange]
  );
  const updateSize = useCallback31(
    (elementKey, width, height) => {
      updateLayout(elementKey, {
        size: { width, height }
      });
    },
    [updateLayout]
  );
  const updateGridPosition = useCallback31(
    (elementKey, position) => {
      updateLayout(elementKey, {
        grid: position
      });
    },
    [updateLayout]
  );
  const setResizable = useCallback31(
    (elementKey, resizable) => {
      updateLayout(elementKey, { resizable });
    },
    [updateLayout]
  );
  const getLayout = useCallback31(
    (elementKey) => {
      if (!tree) return void 0;
      return tree.elements[elementKey]?.layout;
    },
    [tree]
  );
  const getLayoutElements = useMemo19(() => {
    return () => {
      if (!tree) return [];
      return Object.entries(tree.elements).filter(([, element]) => element.layout !== void 0).map(([key, element]) => ({
        key,
        layout: element.layout
      }));
    };
  }, [tree]);
  return {
    updateLayout,
    updateSize,
    updateGridPosition,
    setResizable,
    getLayout,
    getLayoutElements
  };
}

// src/hooks/useHistory.ts
import { useState as useState13, useCallback as useCallback32 } from "react";

// src/hooks/useDeepResearch.ts
import { useCallback as useCallback33, useRef as useRef21 } from "react";

// src/hooks/useRenderEditableText.tsx
import React14, { useCallback as useCallback35 } from "react";

// src/components/EditableText.tsx
import {
  useRef as useRef22,
  useCallback as useCallback34,
  useEffect as useEffect22,
  useState as useState14,
  memo as memo2
} from "react";
import { jsx as jsx21 } from "react/jsx-runtime";
var EditableText = memo2(function EditableText2({
  elementKey,
  propName,
  value,
  className = "",
  as: Tag = "span",
  placeholder = "Click to edit...",
  disabled = false,
  multiline = false,
  style,
  onValueChange
}) {
  const ref = useRef22(null);
  const [localValue, setLocalValue] = useState14(value);
  const { isEditing, isFocused, handleChange, handleFocus } = useElementEdit(elementKey);
  useEffect22(() => {
    setLocalValue(value);
    if (ref.current && !isFocused) {
      ref.current.textContent = value || "";
    }
  }, [value, isFocused]);
  const handleInput = useCallback34(() => {
    if (ref.current) {
      const newValue = ref.current.textContent || "";
      setLocalValue(newValue);
      handleChange(propName, newValue);
      onValueChange?.(newValue);
    }
  }, [handleChange, propName, onValueChange]);
  const handleKeyDown = useCallback34(
    (e) => {
      if (!multiline && e.key === "Enter") {
        e.preventDefault();
        ref.current?.blur();
      }
      if (e.key === "Escape") {
        if (ref.current) {
          ref.current.textContent = value;
          setLocalValue(value);
        }
        ref.current?.blur();
      }
    },
    [multiline, value]
  );
  const handleBlur = useCallback34(
    (e) => {
      if (ref.current) {
        const finalValue = ref.current.textContent || "";
        if (finalValue !== value) {
          handleChange(propName, finalValue);
          onValueChange?.(finalValue);
        }
      }
    },
    [handleChange, propName, value, onValueChange]
  );
  const handleFocusEvent = useCallback34(() => {
    handleFocus();
    if (ref.current && document.activeElement === ref.current) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [handleFocus]);
  const canEdit = isEditing && !disabled;
  const isEmpty = !localValue || localValue.trim() === "";
  const ActualTag = multiline ? "div" : Tag;
  return /* @__PURE__ */ jsx21(
    ActualTag,
    {
      ref,
      className: `editable-text ${className} ${canEdit ? "editable-text--active" : ""} ${isFocused ? "editable-text--focused" : ""} ${isEmpty ? "editable-text--empty" : ""}`,
      contentEditable: canEdit,
      suppressContentEditableWarning: true,
      onInput: handleInput,
      onKeyDown: handleKeyDown,
      onFocus: handleFocusEvent,
      onBlur: handleBlur,
      "data-placeholder": placeholder,
      "data-element-key": elementKey,
      "data-prop-name": propName,
      style: {
        ...style,
        outline: canEdit ? void 0 : "none",
        cursor: canEdit ? "text" : "inherit",
        minWidth: canEdit ? "1ch" : void 0
      },
      children: localValue || (canEdit ? "" : value)
    }
  );
});

// src/hooks/useRenderEditableText.tsx
import { jsx as jsx22 } from "react/jsx-runtime";
function createRenderEditableText(element, isEditing) {
  const canEdit = isEditing && element.editable !== false && !element.locked;
  return (propName, value, options) => {
    if (value === null || value === void 0 || value === "") {
      if (canEdit && options?.placeholder) {
        return React14.createElement(EditableText, {
          elementKey: element.key,
          propName,
          value: "",
          placeholder: options.placeholder,
          as: options.as,
          multiline: options.multiline,
          className: options.className
        });
      }
      return null;
    }
    if (!canEdit) {
      const Tag = options?.as || "span";
      return React14.createElement(Tag, { className: options?.className }, value);
    }
    return React14.createElement(EditableText, {
      elementKey: element.key,
      propName,
      value,
      placeholder: options?.placeholder,
      as: options?.as,
      multiline: options?.multiline,
      className: options?.className
    });
  };
}

// src/hooks/flat-to-tree.ts
function flatToTree(elements) {
  const elementMap = {};
  let root = "";
  for (const element of elements) {
    elementMap[element.key] = {
      key: element.key,
      type: element.type,
      props: element.props,
      children: [],
      visible: element.visible,
      parentKey: element.parentKey
    };
  }
  for (const element of elements) {
    if (element.parentKey) {
      const parent = elementMap[element.parentKey];
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(element.key);
      }
    } else {
      root = element.key;
    }
  }
  return { root, elements: elementMap };
}

// src/components/editable-wrapper/EditableTextNode.tsx
import {
  memo as memo3,
  useCallback as useCallback36,
  useRef as useRef23,
  useState as useState15,
  useEffect as useEffect23
} from "react";
import { jsx as jsx23 } from "react/jsx-runtime";
var EditableTextNode = memo3(function EditableTextNode2({
  elementKey,
  propName,
  value,
  isMobile,
  onTextChange
}) {
  const ref = useRef23(null);
  const { isEditing, recordChange, focusedKey, setFocusedKey } = useEditMode();
  const [localValue, setLocalValue] = useState15(value);
  const [isActive, setIsActive] = useState15(false);
  const canEdit = isEditing && (isMobile ? focusedKey === elementKey : true);
  useEffect23(() => {
    setLocalValue(value);
  }, [value]);
  const handleClick = useCallback36(
    (e) => {
      if (!isEditing) return;
      e.stopPropagation();
      if (isMobile) {
        setFocusedKey(elementKey);
      } else {
        setIsActive(true);
        setFocusedKey(elementKey);
        setTimeout(() => {
          if (ref.current) {
            ref.current.focus();
            const range = document.createRange();
            range.selectNodeContents(ref.current);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }, 0);
      }
    },
    [isEditing, isMobile, elementKey, setFocusedKey]
  );
  const handleDoubleClick = useCallback36(
    (e) => {
      if (!isEditing || !isMobile) return;
      e.stopPropagation();
      setIsActive(true);
      setTimeout(() => {
        if (ref.current) {
          ref.current.focus();
        }
      }, 0);
    },
    [isEditing, isMobile]
  );
  const handleInput = useCallback36(() => {
    if (ref.current) {
      const newValue = ref.current.textContent || "";
      setLocalValue(newValue);
      recordChange(elementKey, propName, newValue);
      onTextChange?.(propName, newValue);
    }
  }, [elementKey, propName, recordChange, onTextChange]);
  const handleBlur = useCallback36(() => {
    setIsActive(false);
    if (!isMobile) {
      setFocusedKey(null);
    }
  }, [isMobile, setFocusedKey]);
  const handleKeyDown = useCallback36(
    (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setLocalValue(value);
        if (ref.current) {
          ref.current.textContent = value;
        }
        ref.current?.blur();
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        ref.current?.blur();
      }
    },
    [value]
  );
  const isFocused = focusedKey === elementKey;
  return /* @__PURE__ */ jsx23(
    "span",
    {
      ref,
      contentEditable: canEdit && isActive,
      suppressContentEditableWarning: true,
      onClick: handleClick,
      onDoubleClick: handleDoubleClick,
      onInput: handleInput,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      "data-editable": isEditing,
      "data-active": isActive,
      "data-focused": isFocused,
      "data-prop": propName,
      className: `
        editable-text-node
        ${isEditing ? "editable-text-node--edit-mode" : ""}
        ${isActive ? "editable-text-node--active" : ""}
        ${isFocused ? "editable-text-node--focused" : ""}
      `,
      style: {
        cursor: isEditing ? "text" : "inherit",
        outline: "none",
        position: "relative",
        display: "inline",
        borderRadius: "2px",
        transition: "background-color 0.15s, box-shadow 0.15s"
      },
      children: localValue
    }
  );
});

// src/components/editable-wrapper/component.tsx
import { Fragment as Fragment2, jsx as jsx24, jsxs as jsxs7 } from "react/jsx-runtime";
var EditableWrapper = memo4(function EditableWrapper2({
  element,
  children,
  onTextChange,
  forceEditable,
  className = ""
}) {
  const isMobile = useIsMobile();
  const { isEditing, focusedKey, setFocusedKey, recordChange } = useEditMode();
  const containerRef = useRef24(null);
  const [isActiveEditing, setIsActiveEditing] = useState16(false);
  const isElementEditable = forceEditable !== void 0 ? forceEditable : element.editable !== false;
  if (!isEditing || !isElementEditable || element.locked) {
    return /* @__PURE__ */ jsx24(Fragment2, { children });
  }
  const isFocused = focusedKey === element.key;
  const handleContainerClick = useCallback37(
    (e) => {
      e.stopPropagation();
      setFocusedKey(element.key);
      if (!isMobile) {
        setIsActiveEditing(true);
      }
    },
    [isMobile, element.key, setFocusedKey]
  );
  const handleDoubleClick = useCallback37(
    (e) => {
      e.stopPropagation();
      if (isMobile) {
        setIsActiveEditing(true);
      }
    },
    [isMobile]
  );
  const handleBlur = useCallback37(() => {
    setIsActiveEditing(false);
    if (containerRef.current) {
      const textContent = containerRef.current.textContent || "";
      const propName = element.props?.title ? "title" : element.props?.text ? "text" : element.props?.label ? "label" : element.props?.description ? "description" : "content";
      recordChange(element.key, propName, textContent);
      onTextChange?.(propName, textContent);
    }
  }, [element.key, element.props, recordChange, onTextChange]);
  const handleKeyDown = useCallback37((e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsActiveEditing(false);
      containerRef.current?.blur();
    }
  }, []);
  return /* @__PURE__ */ jsxs7(
    "div",
    {
      ref: containerRef,
      className: `editable-wrapper ${isFocused ? "editable-wrapper--focused" : ""} ${isActiveEditing ? "editable-wrapper--active" : ""} ${className}`,
      onClick: handleContainerClick,
      onDoubleClick: handleDoubleClick,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      contentEditable: isActiveEditing,
      suppressContentEditableWarning: true,
      "data-element-key": element.key,
      "data-editable": "true",
      style: {
        position: "relative",
        outline: isActiveEditing ? "none" : void 0,
        cursor: isEditing ? "text" : void 0
      },
      children: [
        isMobile && isFocused && !isActiveEditing && /* @__PURE__ */ jsx24(
          "div",
          {
            className: "editable-indicator",
            style: {
              position: "absolute",
              top: -4,
              right: -4,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              boxShadow: "0 2px 8px rgba(14, 165, 233, 0.3)"
            },
            children: /* @__PURE__ */ jsx24(
              "svg",
              {
                width: "12",
                height: "12",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "white",
                strokeWidth: "2",
                children: /* @__PURE__ */ jsx24("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" })
              }
            )
          }
        ),
        children
      ]
    }
  );
});

// src/renderer/element-renderer.tsx
import { jsx as jsx25 } from "react/jsx-runtime";
function hasDescendantChanged(elementKey, prevTree, nextTree, visited = /* @__PURE__ */ new Set()) {
  if (visited.has(elementKey)) return false;
  visited.add(elementKey);
  const prevElement = prevTree.elements[elementKey];
  const nextElement = nextTree.elements[elementKey];
  if (prevElement !== nextElement) {
    return true;
  }
  const children = prevElement?.children;
  if (Array.isArray(children)) {
    for (const childKey of children) {
      if (hasDescendantChanged(childKey, prevTree, nextTree, visited)) {
        return true;
      }
    }
  }
  return false;
}
function elementRendererPropsAreEqual(prevProps, nextProps) {
  if (prevProps.element !== nextProps.element) {
    return false;
  }
  const wasSelected = prevProps.selectedKey === prevProps.element.key;
  const isSelected = nextProps.selectedKey === nextProps.element.key;
  if (wasSelected !== isSelected) {
    return false;
  }
  if (prevProps.loading !== nextProps.loading) {
    return false;
  }
  if (prevProps.tree !== nextProps.tree) {
    if (hasDescendantChanged(
      prevProps.element.key,
      prevProps.tree,
      nextProps.tree
    )) {
      return false;
    }
  }
  return true;
}
var ElementRenderer = React17.memo(function ElementRenderer2({
  element,
  tree,
  registry,
  loading,
  fallback,
  selectable,
  onElementSelect,
  selectionDelayMs,
  selectedKey,
  onResize
}) {
  const isVisible = useIsVisible(element.visible);
  const { execute } = useActions();
  const { renderText } = useMarkdown();
  const { isEditing } = useEditMode();
  const renderEditableText = useMemo20(
    () => createRenderEditableText(element, isEditing),
    [element, isEditing]
  );
  if (!isVisible) {
    return null;
  }
  if (element.type === "__placeholder__" || element._meta?.isPlaceholder) {
    return /* @__PURE__ */ jsx25(
      "div",
      {
        className: "w-full h-16 bg-muted/10 animate-pulse rounded-lg my-2 border border-border/20",
        "data-placeholder-for": element.key
      },
      element.key
    );
  }
  const Component2 = registry[element.type] ?? fallback;
  if (!Component2) {
    console.warn(`No renderer for component type: ${element.type}`);
    return null;
  }
  const children = Array.isArray(element.children) ? element.children.map((childKey, index) => {
    const childElement = tree.elements[childKey];
    if (!childElement) {
      if (loading) {
        return /* @__PURE__ */ jsx25(
          "div",
          {
            className: "w-full h-12 bg-muted/10 animate-pulse rounded-md my-1"
          },
          `${childKey}-skeleton`
        );
      }
      return null;
    }
    return /* @__PURE__ */ jsx25(
      ElementRenderer2,
      {
        element: childElement,
        tree,
        registry,
        loading,
        fallback,
        selectable,
        onElementSelect,
        selectionDelayMs,
        selectedKey,
        onResize
      },
      `${childKey}-${index}`
    );
  }) : null;
  const isResizable = element.layout?.resizable !== false;
  const isEditable = isEditing && element.editable !== false && !element.locked;
  const content = /* @__PURE__ */ jsx25(
    Component2,
    {
      element,
      onAction: execute,
      loading,
      renderText,
      renderEditableText,
      children
    }
  );
  const editableContent = isEditable ? /* @__PURE__ */ jsx25(EditableWrapper, { element, children: content }) : content;
  if (selectable && onElementSelect) {
    const selectionContent = /* @__PURE__ */ jsx25(
      SelectionWrapper,
      {
        element,
        enabled: selectable,
        onSelect: onElementSelect,
        delayMs: selectionDelayMs,
        isSelected: selectedKey === element.key,
        children: editableContent
      }
    );
    if (isResizable) {
      return /* @__PURE__ */ jsx25(
        ResizableWrapper,
        {
          element,
          onResize,
          showHandles: selectedKey === element.key,
          children: selectionContent
        }
      );
    }
    return selectionContent;
  }
  if (isResizable) {
    return /* @__PURE__ */ jsx25(ResizableWrapper, { element, onResize, children: editableContent });
  }
  return editableContent;
}, elementRendererPropsAreEqual);

// src/renderer/provider.tsx
import { jsx as jsx26, jsxs as jsxs8 } from "react/jsx-runtime";
function ConfirmationDialogManager() {
  const { pendingConfirmation, confirm, cancel } = useActions();
  if (!pendingConfirmation?.action.confirm) {
    return null;
  }
  return /* @__PURE__ */ jsx26(
    ConfirmDialog,
    {
      confirm: pendingConfirmation.action.confirm,
      onConfirm: confirm,
      onCancel: cancel
    }
  );
}
function JSONUIProvider({
  registry,
  initialData,
  authState,
  actionHandlers,
  navigate,
  validationFunctions,
  onDataChange,
  children
}) {
  return /* @__PURE__ */ jsx26(MarkdownProvider, { children: /* @__PURE__ */ jsx26(
    DataProvider,
    {
      initialData,
      authState,
      onDataChange,
      children: /* @__PURE__ */ jsx26(VisibilityProvider, { children: /* @__PURE__ */ jsx26(ActionProvider, { handlers: actionHandlers, navigate, children: /* @__PURE__ */ jsxs8(ValidationProvider, { customFunctions: validationFunctions, children: [
        children,
        /* @__PURE__ */ jsx26(ConfirmationDialogManager, {})
      ] }) }) })
    }
  ) });
}

// src/renderer.tsx
import { jsx as jsx27, jsxs as jsxs9 } from "react/jsx-runtime";
function RendererErrorFallback(error, reset) {
  return /* @__PURE__ */ jsxs9(
    "div",
    {
      role: "alert",
      className: "p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive",
      children: [
        /* @__PURE__ */ jsx27("h3", { className: "font-semibold mb-2", children: "Render Error" }),
        /* @__PURE__ */ jsx27("p", { className: "text-sm text-muted-foreground mb-3", children: error.message }),
        /* @__PURE__ */ jsx27(
          "button",
          {
            onClick: reset,
            className: "px-3 py-1.5 text-sm rounded bg-destructive/20 hover:bg-destructive/30 transition-colors",
            children: "Retry"
          }
        )
      ]
    }
  );
}
function Renderer({
  tree,
  registry,
  loading,
  fallback,
  selectable = false,
  onElementSelect,
  selectionDelayMs = DEFAULT_SELECTION_DELAY,
  selectedKey,
  trackInteractions = false,
  onInteraction,
  onResize,
  autoGrid = true,
  onError
}) {
  if (!tree || !tree.root) return null;
  const rootElement = tree.elements[tree.root];
  if (!rootElement) return null;
  const content = /* @__PURE__ */ jsx27(
    ErrorBoundary,
    {
      name: "ElementRenderer",
      fallback: RendererErrorFallback,
      onError: (error) => onError?.(error),
      children: /* @__PURE__ */ jsx27(
        ElementRenderer,
        {
          element: rootElement,
          tree,
          registry,
          loading,
          fallback,
          selectable,
          onElementSelect,
          selectionDelayMs,
          selectedKey,
          onResize
        }
      )
    }
  );
  const gridContent = autoGrid ? /* @__PURE__ */ jsx27(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))",
        gap: 24,
        width: "100%",
        alignItems: "stretch"
      },
      "data-renderer-auto-grid": true,
      children: content
    }
  ) : content;
  if (trackInteractions && onInteraction) {
    return /* @__PURE__ */ jsx27(InteractionTrackingWrapper, { tree, onInteraction, children: gridContent });
  }
  return gridContent;
}
function createRendererFromCatalog(_catalog, registry) {
  return function CatalogRenderer(props) {
    return /* @__PURE__ */ jsx27(Renderer, { ...props, registry });
  };
}

// src/renderer/memo-utils.ts
function elementRendererPropsAreEqual2(prevProps, nextProps) {
  if (prevProps.element !== nextProps.element) {
    return false;
  }
  const wasSelected = prevProps.selectedKey === prevProps.element.key;
  const isSelected = nextProps.selectedKey === nextProps.element.key;
  if (wasSelected !== isSelected) {
    return false;
  }
  if (prevProps.loading !== nextProps.loading) {
    return false;
  }
  if (prevProps.tree !== nextProps.tree) {
    const children = prevProps.element.children;
    if (Array.isArray(children)) {
      for (const childKey of children) {
        if (prevProps.tree.elements[childKey] !== nextProps.tree.elements[childKey]) {
          return false;
        }
      }
    }
  }
  return true;
}

// src/renderer/skeleton-loader.tsx
import { jsx as jsx28 } from "react/jsx-runtime";
function PlaceholderSkeleton({ elementKey }) {
  return /* @__PURE__ */ jsx28(
    "div",
    {
      className: "w-full h-16 bg-muted/10 animate-pulse rounded-lg my-2 border border-border/20",
      "data-placeholder-for": elementKey
    },
    elementKey
  );
}
function ChildSkeleton({ elementKey }) {
  return /* @__PURE__ */ jsx28(
    "div",
    {
      className: "w-full h-12 bg-muted/10 animate-pulse rounded-md my-1"
    },
    `${elementKey}-skeleton`
  );
}
function isPlaceholderElement(element) {
  return element.type === "__placeholder__" || element._meta?.isPlaceholder === true;
}

// src/editable.tsx
import React18, {
  createContext as createContext15,
  useContext as useContext15,
  useState as useState17,
  useCallback as useCallback38
} from "react";
import { jsx as jsx29 } from "react/jsx-runtime";
var EditableContext = createContext15(null);
function EditableProvider({
  children,
  onValueChange
}) {
  const [editingPath, setEditingPath] = useState17(null);
  const [editingValue, setEditingValue] = useState17(null);
  const startEdit = useCallback38((path, currentValue) => {
    setEditingPath(path);
    setEditingValue(currentValue);
  }, []);
  const commitEdit = useCallback38(
    (path, newValue) => {
      onValueChange?.(path, newValue);
      setEditingPath(null);
      setEditingValue(null);
    },
    [onValueChange]
  );
  const cancelEdit = useCallback38(() => {
    setEditingPath(null);
    setEditingValue(null);
  }, []);
  return /* @__PURE__ */ jsx29(
    EditableContext.Provider,
    {
      value: {
        editingPath,
        editingValue,
        startEdit,
        commitEdit,
        cancelEdit,
        onValueChange
      },
      children
    }
  );
}
function useEditableContext() {
  return useContext15(EditableContext);
}
function useEditable(path, currentValue, locked = false) {
  const ctx = useEditableContext();
  const isEditing = ctx?.editingPath === path;
  const value = isEditing ? ctx?.editingValue : currentValue;
  const onStartEdit = useCallback38(() => {
    if (locked || !ctx) return;
    ctx.startEdit(path, currentValue);
  }, [ctx, path, currentValue, locked]);
  const onCommit = useCallback38(
    (newValue) => {
      if (!ctx) return;
      ctx.commitEdit(path, newValue);
    },
    [ctx, path]
  );
  const onCancel = useCallback38(() => {
    ctx?.cancelEdit();
  }, [ctx]);
  const editableClassName = locked ? "" : "cursor-text rounded transition-[background-color,box-shadow] duration-150 hover:bg-black/5";
  return {
    isEditing,
    value,
    onStartEdit,
    onCommit,
    onCancel,
    editableClassName
  };
}
function EditableText3({
  path,
  value,
  locked = false,
  as: Component2 = "span",
  className
}) {
  const { isEditing, onStartEdit, onCommit, onCancel, editableClassName } = useEditable(path, value, locked);
  const [localValue, setLocalValue] = useState17(value);
  React18.useEffect(() => {
    if (!isEditing) {
      setLocalValue(value);
    }
  }, [value, isEditing]);
  if (isEditing) {
    return /* @__PURE__ */ jsx29(
      "input",
      {
        type: "text",
        value: localValue,
        onChange: (e) => setLocalValue(e.target.value),
        onBlur: () => onCommit(localValue),
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onCommit(localValue);
          }
          if (e.key === "Escape") {
            onCancel();
          }
        },
        autoFocus: true,
        className: cn(
          "w-full box-border -m-0.5 rounded px-1.5 py-0.5 font-inherit text-inherit outline-none",
          "bg-background text-foreground border border-border",
          className
        )
      }
    );
  }
  return /* @__PURE__ */ jsx29(
    Component2,
    {
      className: cn(editableClassName, className),
      onDoubleClick: onStartEdit,
      title: locked ? void 0 : "Double-click to edit",
      children: value
    }
  );
}
function EditableNumber({
  path,
  value,
  locked = false,
  className
}) {
  const { isEditing, onStartEdit, onCommit, onCancel, editableClassName } = useEditable(path, value, locked);
  const [localValue, setLocalValue] = useState17(String(value));
  React18.useEffect(() => {
    if (!isEditing) {
      setLocalValue(String(value));
    }
  }, [value, isEditing]);
  if (isEditing) {
    return /* @__PURE__ */ jsx29(
      "input",
      {
        type: "number",
        value: localValue,
        onChange: (e) => setLocalValue(e.target.value),
        onBlur: () => onCommit(parseFloat(localValue) || 0),
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onCommit(parseFloat(localValue) || 0);
          }
          if (e.key === "Escape") {
            onCancel();
          }
        },
        autoFocus: true,
        className: cn(
          "w-20 box-border -m-0.5 rounded px-1.5 py-0.5 font-inherit text-inherit outline-none",
          "bg-background text-foreground border border-border",
          className
        )
      }
    );
  }
  return /* @__PURE__ */ jsx29(
    "span",
    {
      className: cn(editableClassName, className),
      onDoubleClick: onStartEdit,
      title: locked ? void 0 : "Double-click to edit",
      children: value
    }
  );
}

// src/components/MarkdownText.tsx
import { memo as memo5 } from "react";
import ReactMarkdown2 from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { sanitizeUrl as sanitizeUrl3 } from "@onegenui/utils";
import { jsx as jsx30 } from "react/jsx-runtime";
var defaultTheme2 = {
  codeBlockBg: "rgba(0, 0, 0, 0.3)",
  codeBlockBorder: "rgba(255, 255, 255, 0.08)",
  inlineCodeBg: "rgba(0, 0, 0, 0.25)",
  linkColor: "var(--primary, #3b82f6)",
  blockquoteBorder: "var(--primary, #3b82f6)",
  hrColor: "rgba(255, 255, 255, 0.1)"
};
var MarkdownText = memo5(function MarkdownText2({
  content,
  className,
  style,
  inline = false,
  theme: themeOverrides,
  enableMath = true
}) {
  const theme = { ...defaultTheme2, ...themeOverrides };
  const wrapperStyle = {
    "--markdown-code-bg": theme.codeBlockBg,
    "--markdown-code-border": theme.codeBlockBorder,
    "--markdown-inline-code-bg": theme.inlineCodeBg,
    "--markdown-link-color": theme.linkColor,
    "--markdown-quote-border": theme.blockquoteBorder,
    "--markdown-hr-color": theme.hrColor,
    ...style
  };
  const components = {
    pre: ({ children }) => /* @__PURE__ */ jsx30("pre", { className: "bg-[var(--markdown-code-bg)] rounded-lg p-3 overflow-x-auto text-[13px] font-mono border border-[var(--markdown-code-border)] my-2", children }),
    code: ({
      children,
      className: codeClassName
    }) => {
      const isInline = !codeClassName;
      if (isInline) {
        return /* @__PURE__ */ jsx30("code", { className: "bg-[var(--markdown-inline-code-bg)] rounded px-1.5 py-0.5 text-[0.9em] font-mono", children });
      }
      return /* @__PURE__ */ jsx30("code", { children });
    },
    a: ({ href, children }) => /* @__PURE__ */ jsx30(
      "a",
      {
        href: sanitizeUrl3(href),
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-[var(--markdown-link-color)] underline underline-offset-2 hover:opacity-80 transition-opacity",
        children
      }
    ),
    ul: ({ children }) => /* @__PURE__ */ jsx30("ul", { className: "my-2 pl-5 list-disc", children }),
    ol: ({ children }) => /* @__PURE__ */ jsx30("ol", { className: "my-2 pl-5 list-decimal", children }),
    li: ({ children }) => /* @__PURE__ */ jsx30("li", { className: "mb-1", children }),
    h1: ({ children }) => /* @__PURE__ */ jsx30("h1", { className: "font-semibold mt-3 mb-2 text-lg", children }),
    h2: ({ children }) => /* @__PURE__ */ jsx30("h2", { className: "font-semibold mt-3 mb-2 text-base", children }),
    h3: ({ children }) => /* @__PURE__ */ jsx30("h3", { className: "font-semibold mt-3 mb-2 text-[15px]", children }),
    h4: ({ children }) => /* @__PURE__ */ jsx30("h4", { className: "font-semibold mt-3 mb-2 text-sm", children }),
    h5: ({ children }) => /* @__PURE__ */ jsx30("h5", { className: "font-semibold mt-3 mb-2 text-[13px]", children }),
    h6: ({ children }) => /* @__PURE__ */ jsx30("h6", { className: "font-semibold mt-3 mb-2 text-xs", children }),
    p: ({ children }) => inline ? /* @__PURE__ */ jsx30("span", { children }) : /* @__PURE__ */ jsx30("p", { className: "my-1.5 leading-relaxed", children }),
    blockquote: ({ children }) => /* @__PURE__ */ jsx30("blockquote", { className: "border-l-[3px] border-[var(--markdown-quote-border)] pl-3 my-2 opacity-90 italic", children }),
    hr: () => /* @__PURE__ */ jsx30("hr", { className: "border-none border-t border-[var(--markdown-hr-color)] my-3" }),
    strong: ({ children }) => /* @__PURE__ */ jsx30("strong", { className: "font-semibold", children }),
    em: ({ children }) => /* @__PURE__ */ jsx30("em", { className: "italic", children })
  };
  const Wrapper = inline ? "span" : "div";
  const remarkPlugins = enableMath ? [remarkMath] : [];
  const rehypePlugins = enableMath ? [rehypeKatex] : [];
  return /* @__PURE__ */ jsx30(Wrapper, { className: cn("markdown-content", className), style: wrapperStyle, children: /* @__PURE__ */ jsx30(
    ReactMarkdown2,
    {
      components,
      remarkPlugins,
      rehypePlugins,
      children: content
    }
  ) });
});

// src/components/TextSelectionBadge.tsx
import { jsx as jsx31, jsxs as jsxs10 } from "react/jsx-runtime";
function TextSelectionBadge({
  selection,
  onClear,
  onRestore,
  maxLength = 50,
  className
}) {
  const truncatedText = selection.text.length > maxLength ? `${selection.text.substring(0, maxLength)}...` : selection.text;
  return /* @__PURE__ */ jsxs10(
    "div",
    {
      className: cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-foreground",
        "bg-primary/10 border border-primary/20",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs10(
          "svg",
          {
            width: "14",
            height: "14",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: "shrink-0 text-primary",
            children: [
              /* @__PURE__ */ jsx31("path", { d: "M17 6.1H3" }),
              /* @__PURE__ */ jsx31("path", { d: "M21 12.1H3" }),
              /* @__PURE__ */ jsx31("path", { d: "M15.1 18H3" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs10(
          "span",
          {
            className: "flex-1 overflow-hidden text-ellipsis whitespace-nowrap italic text-muted-foreground",
            title: selection.text,
            children: [
              '"',
              truncatedText,
              '"'
            ]
          }
        ),
        selection.copiedToClipboard && /* @__PURE__ */ jsx31("span", { className: "text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded font-medium", children: "Copied" }),
        selection.elementType && /* @__PURE__ */ jsx31("span", { className: "text-[10px] px-1.5 py-0.5 bg-violet-500/20 text-violet-500 rounded", children: selection.elementType }),
        onRestore && /* @__PURE__ */ jsx31(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              onRestore();
            },
            title: "Restore selection",
            className: "flex items-center justify-center p-1 border-none rounded bg-transparent text-muted-foreground cursor-pointer transition-all hover:bg-primary/20 hover:text-primary",
            children: /* @__PURE__ */ jsxs10(
              "svg",
              {
                width: "12",
                height: "12",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                  /* @__PURE__ */ jsx31("path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }),
                  /* @__PURE__ */ jsx31("path", { d: "M3 3v5h5" })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsx31(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              onClear();
            },
            title: "Clear",
            className: "flex items-center justify-center p-1 border-none rounded bg-transparent text-muted-foreground cursor-pointer transition-all hover:bg-destructive/20 hover:text-destructive",
            children: /* @__PURE__ */ jsxs10(
              "svg",
              {
                width: "12",
                height: "12",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                  /* @__PURE__ */ jsx31("path", { d: "M18 6 6 18" }),
                  /* @__PURE__ */ jsx31("path", { d: "m6 6 12 12" })
                ]
              }
            )
          }
        )
      ]
    }
  );
}

// src/components/free-grid/canvas.tsx
import { useMemo as useMemo22 } from "react";

// src/components/free-grid/styles.ts
var gridContainerBaseStyle = {
  display: "grid",
  position: "relative",
  width: "100%",
  minHeight: "100%",
  boxSizing: "border-box"
};
var gridLinesOverlayStyle = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 0
};
var gridCellBaseStyle = {
  position: "relative",
  zIndex: 1,
  minWidth: 0,
  minHeight: 0
};

// src/components/free-grid/grid-lines.tsx
import { useMemo as useMemo21 } from "react";
import { jsx as jsx32, jsxs as jsxs11 } from "react/jsx-runtime";
function GridLines({ columns, rows, color }) {
  const patternId = useMemo21(
    () => `grid-pattern-${Math.random().toString(36).substr(2, 9)}`,
    []
  );
  return /* @__PURE__ */ jsxs11("svg", { style: gridLinesOverlayStyle, "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx32("defs", { children: /* @__PURE__ */ jsx32(
      "pattern",
      {
        id: patternId,
        width: `${100 / columns}%`,
        height: `${100 / Math.max(rows, 1)}%`,
        patternUnits: "objectBoundingBox",
        children: /* @__PURE__ */ jsx32(
          "rect",
          {
            width: "100%",
            height: "100%",
            fill: "none",
            stroke: color,
            strokeWidth: "1",
            strokeDasharray: "4 2"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx32("rect", { width: "100%", height: "100%", fill: `url(#${patternId})` })
  ] });
}

// src/components/free-grid/canvas.tsx
import { jsx as jsx33, jsxs as jsxs12 } from "react/jsx-runtime";
function FreeGridCanvas({
  columns = 12,
  rows,
  cellSize,
  gap = 16,
  minRowHeight = 100,
  showGrid = false,
  gridLineColor = "rgba(255, 255, 255, 0.03)",
  backgroundColor,
  children,
  onLayoutChange: _onLayoutChange,
  className,
  style
}) {
  const gridTemplateColumns = useMemo22(() => {
    if (cellSize) {
      return `repeat(${columns}, ${cellSize}px)`;
    }
    return `repeat(${columns}, 1fr)`;
  }, [columns, cellSize]);
  const gridTemplateRows = useMemo22(() => {
    if (rows) {
      if (cellSize) {
        return `repeat(${rows}, ${cellSize}px)`;
      }
      return `repeat(${rows}, minmax(${minRowHeight}px, auto))`;
    }
    return `repeat(auto-fill, minmax(${minRowHeight}px, auto))`;
  }, [rows, cellSize, minRowHeight]);
  const containerStyle = {
    ...gridContainerBaseStyle,
    gridTemplateColumns,
    gridTemplateRows,
    gap,
    backgroundColor,
    ...style
  };
  return /* @__PURE__ */ jsxs12(
    "div",
    {
      style: containerStyle,
      className,
      "data-free-grid-canvas": true,
      "data-columns": columns,
      "data-rows": rows,
      children: [
        showGrid && /* @__PURE__ */ jsx33(GridLines, { columns, rows: rows ?? 4, color: gridLineColor }),
        children
      ]
    }
  );
}

// src/components/free-grid/grid-cell.tsx
import { jsx as jsx34 } from "react/jsx-runtime";
function GridCell({
  column,
  row,
  columnSpan = 1,
  rowSpan = 1,
  children,
  className,
  style
}) {
  const cellStyle = {
    ...gridCellBaseStyle,
    ...column && { gridColumnStart: column },
    ...row && { gridRowStart: row },
    gridColumnEnd: columnSpan > 1 ? `span ${columnSpan}` : void 0,
    gridRowEnd: rowSpan > 1 ? `span ${rowSpan}` : void 0,
    ...style
  };
  return /* @__PURE__ */ jsx34("div", { style: cellStyle, className, "data-grid-cell": true, children });
}

// src/components/free-grid/layout-utils.ts
function getLayoutStyles(layout) {
  if (!layout) return {};
  const styles = {};
  if (layout.size) {
    if (layout.size.width !== void 0) styles.width = layout.size.width;
    if (layout.size.height !== void 0) styles.height = layout.size.height;
    if (layout.size.minWidth !== void 0)
      styles.minWidth = layout.size.minWidth;
    if (layout.size.maxWidth !== void 0)
      styles.maxWidth = layout.size.maxWidth;
    if (layout.size.minHeight !== void 0)
      styles.minHeight = layout.size.minHeight;
    if (layout.size.maxHeight !== void 0)
      styles.maxHeight = layout.size.maxHeight;
  }
  if (layout.grid) {
    if (layout.grid.column !== void 0) {
      styles.gridColumnStart = layout.grid.column;
    }
    if (layout.grid.row !== void 0) {
      styles.gridRowStart = layout.grid.row;
    }
    if (layout.grid.columnSpan !== void 0 && layout.grid.columnSpan > 1) {
      styles.gridColumnEnd = `span ${layout.grid.columnSpan}`;
    }
    if (layout.grid.rowSpan !== void 0 && layout.grid.rowSpan > 1) {
      styles.gridRowEnd = `span ${layout.grid.rowSpan}`;
    }
  }
  return styles;
}
function createLayout(options = {}) {
  return {
    grid: {
      column: options.column,
      row: options.row,
      columnSpan: options.columnSpan,
      rowSpan: options.rowSpan
    },
    size: {
      width: options.width,
      height: options.height
    },
    resizable: options.resizable
  };
}

// src/components/ToolProgressOverlay.tsx
import { memo as memo7, useEffect as useEffect24, useState as useState18 } from "react";

// src/components/tool-progress/icons.tsx
import { jsx as jsx35, jsxs as jsxs13 } from "react/jsx-runtime";
var toolIcons = {
  "web-search": /* @__PURE__ */ jsxs13(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx35("circle", { cx: "11", cy: "11", r: "8" }),
        /* @__PURE__ */ jsx35("path", { d: "m21 21-4.3-4.3" })
      ]
    }
  ),
  "web-scrape": /* @__PURE__ */ jsxs13(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx35("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
        /* @__PURE__ */ jsx35("polyline", { points: "14,2 14,8 20,8" }),
        /* @__PURE__ */ jsx35("line", { x1: "16", y1: "13", x2: "8", y2: "13" }),
        /* @__PURE__ */ jsx35("line", { x1: "16", y1: "17", x2: "8", y2: "17" })
      ]
    }
  ),
  "search-flight": /* @__PURE__ */ jsx35(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ jsx35("path", { d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" })
    }
  ),
  "search-hotel": /* @__PURE__ */ jsxs13(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx35("path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" }),
        /* @__PURE__ */ jsx35("path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" }),
        /* @__PURE__ */ jsx35("path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" }),
        /* @__PURE__ */ jsx35("path", { d: "M10 6h4" }),
        /* @__PURE__ */ jsx35("path", { d: "M10 10h4" }),
        /* @__PURE__ */ jsx35("path", { d: "M10 14h4" }),
        /* @__PURE__ */ jsx35("path", { d: "M10 18h4" })
      ]
    }
  ),
  "document-index": /* @__PURE__ */ jsxs13(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx35("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
        /* @__PURE__ */ jsx35("polyline", { points: "14,2 14,8 20,8" }),
        /* @__PURE__ */ jsx35("path", { d: "M12 18v-6" }),
        /* @__PURE__ */ jsx35("path", { d: "M9 15l3 3 3-3" })
      ]
    }
  ),
  "document-index-cache": /* @__PURE__ */ jsxs13(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx35("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
        /* @__PURE__ */ jsx35("polyline", { points: "14,2 14,8 20,8" }),
        /* @__PURE__ */ jsx35("path", { d: "M9 15l2 2 4-4" })
      ]
    }
  ),
  "document-search": /* @__PURE__ */ jsxs13(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx35("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
        /* @__PURE__ */ jsx35("polyline", { points: "14,2 14,8 20,8" }),
        /* @__PURE__ */ jsx35("circle", { cx: "11.5", cy: "14.5", r: "2.5" }),
        /* @__PURE__ */ jsx35("path", { d: "M13.3 16.3 15 18" })
      ]
    }
  ),
  default: /* @__PURE__ */ jsx35(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ jsx35("polygon", { points: "13,2 3,14 12,14 11,22 21,10 12,10 13,2" })
    }
  )
};
var toolLabels = {
  "web-search": "Web Search",
  "web-scrape": "Reading Page",
  "search-flight": "Flight Search",
  "search-hotel": "Hotel Search",
  search_custom: "Custom Search",
  gmail_list_messages: "Gmail",
  gmail_get_message: "Gmail",
  gmail_get_thread: "Gmail",
  calendar_list_events: "Calendar",
  drive_list_files: "Drive",
  "document-index": "Indexing Document",
  "document-index-cache": "Document Cached",
  "document-search": "Searching Document"
};
var positionStyles = {
  "top-right": { top: 16, right: 16 },
  "top-left": { top: 16, left: 16 },
  "bottom-right": { bottom: 16, right: 16 },
  "bottom-left": { bottom: 16, left: 16 },
  "top-center": { top: 16, left: "50%", transform: "translateX(-50%)" }
};
var progressAnimations = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
  }
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }
`;

// src/components/tool-progress/progress-item.tsx
import { memo as memo6 } from "react";
import { jsx as jsx36, jsxs as jsxs14 } from "react/jsx-runtime";
var DefaultProgressItem = memo6(function DefaultProgressItem2({
  progress
}) {
  const label = toolLabels[progress.toolName] || progress.toolName;
  const icon = toolIcons[progress.toolName] || toolIcons.default;
  const isActive = progress.status === "starting" || progress.status === "progress";
  return /* @__PURE__ */ jsxs14(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 12,
        background: "rgba(24, 24, 27, 0.95)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
        minWidth: 200,
        animation: "slideIn 0.3s ease-out"
      },
      children: [
        /* @__PURE__ */ jsxs14("div", { style: { position: "relative" }, children: [
          /* @__PURE__ */ jsx36(
            "div",
            {
              style: {
                width: 32,
                height: 32,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(59, 130, 246, 0.2)",
                color: "#60a5fa"
              },
              children: icon
            }
          ),
          isActive && /* @__PURE__ */ jsx36(
            "span",
            {
              style: {
                position: "absolute",
                top: -2,
                right: -2,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#3b82f6",
                animation: "pulse 1.5s ease-in-out infinite"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs14("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs14(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 6
              },
              children: [
                /* @__PURE__ */ jsx36(
                  "span",
                  {
                    style: {
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#fafafa"
                    },
                    children: label
                  }
                ),
                isActive && /* @__PURE__ */ jsx36("span", { style: { display: "flex", gap: 2 }, children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx36(
                  "span",
                  {
                    style: {
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: "rgba(96, 165, 250, 0.6)",
                      animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`
                    }
                  },
                  i
                )) })
              ]
            }
          ),
          progress.message && /* @__PURE__ */ jsx36(
            "p",
            {
              style: {
                margin: 0,
                marginTop: 2,
                fontSize: 11,
                color: "#a1a1aa",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              },
              children: progress.message
            }
          )
        ] })
      ]
    }
  );
});

// src/components/ToolProgressOverlay.tsx
import { Fragment as Fragment3, jsx as jsx37, jsxs as jsxs15 } from "react/jsx-runtime";
var ToolProgressOverlay = memo7(function ToolProgressOverlay2({
  position = "top-right",
  className,
  show,
  maxItems = 5,
  renderItem
}) {
  const activeProgress = useActiveToolProgress2();
  const isRunning = useIsToolRunning();
  const [mounted, setMounted] = useState18(false);
  useEffect24(() => {
    setMounted(true);
  }, []);
  const shouldShow = show ?? isRunning;
  if (!mounted || !shouldShow || activeProgress.length === 0) {
    return null;
  }
  const visibleProgress = activeProgress.slice(0, maxItems);
  return /* @__PURE__ */ jsxs15(Fragment3, { children: [
    /* @__PURE__ */ jsx37("style", { children: progressAnimations }),
    /* @__PURE__ */ jsx37(
      "div",
      {
        className,
        style: {
          position: "fixed",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "none",
          ...positionStyles[position]
        },
        children: visibleProgress.map(
          (progress) => renderItem ? /* @__PURE__ */ jsx37("div", { style: { pointerEvents: "auto" }, children: renderItem(progress) }, progress.toolCallId) : /* @__PURE__ */ jsx37(
            DefaultProgressItem,
            {
              progress
            },
            progress.toolCallId
          )
        )
      }
    )
  ] });
});

// src/components/Canvas/CanvasBlock.tsx
import { memo as memo8, useCallback as useCallback39, useState as useState19, useEffect as useEffect25, useMemo as useMemo23 } from "react";
import { jsx as jsx38, jsxs as jsxs16 } from "react/jsx-runtime";
function CanvasBlockSkeleton() {
  return /* @__PURE__ */ jsx38("div", { className: "w-full min-h-[200px] bg-zinc-900/50 rounded-xl border border-white/5 flex items-center justify-center", children: /* @__PURE__ */ jsx38("div", { className: "text-zinc-500 text-sm", children: "Loading editor..." }) });
}
var CanvasBlock = memo8(function CanvasBlock2({
  element,
  onAction,
  loading,
  EditorComponent
}) {
  const {
    documentId,
    initialContent,
    markdown,
    images,
    mode = "edit",
    width = "100%",
    height = "300px",
    showToolbar = true,
    placeholder = "Start typing... Use '/' for commands",
    title
  } = element.props;
  const [content, setContent] = useState19(initialContent || null);
  const [editorKey, setEditorKey] = useState19(0);
  const processedContent = useMemo23(() => {
    if (initialContent) return initialContent;
    if (markdown) {
      return { markdown, images };
    }
    if (images && images.length > 0) {
      return { images };
    }
    return null;
  }, [initialContent, markdown, images]);
  useEffect25(() => {
    if (processedContent !== void 0 && processedContent !== null) {
      setContent(processedContent);
      setEditorKey((k) => k + 1);
    }
  }, [processedContent]);
  const handleChange = useCallback39(
    (_state, serialized) => {
      setContent(serialized);
      onAction?.({
        type: "canvas:change",
        payload: {
          documentId,
          content: serialized
        }
      });
    },
    [documentId, onAction]
  );
  const handleSave = useCallback39(() => {
    if (content) {
      onAction?.({
        type: "canvas:save",
        payload: {
          documentId,
          content
        }
      });
    }
  }, [documentId, content, onAction]);
  const handleOpenInCanvas = useCallback39(() => {
    onAction?.({
      type: "canvas:open",
      payload: {
        documentId,
        title,
        content: initialContent
      }
    });
  }, [documentId, title, initialContent, onAction]);
  if (loading) {
    return /* @__PURE__ */ jsx38(CanvasBlockSkeleton, {});
  }
  if (!EditorComponent) {
    return /* @__PURE__ */ jsxs16(
      "div",
      {
        className: "canvas-block w-full bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden",
        style: { minHeight: height },
        "data-document-id": documentId,
        children: [
          title && /* @__PURE__ */ jsx38("div", { className: "px-4 py-3 border-b border-white/5", children: /* @__PURE__ */ jsx38("h3", { className: "text-lg font-semibold text-white", children: title }) }),
          /* @__PURE__ */ jsxs16(
            "div",
            {
              className: "flex flex-col items-center justify-center gap-4 p-8",
              style: { minHeight: "200px" },
              children: [
                /* @__PURE__ */ jsx38("p", { className: "text-zinc-400 text-sm", children: initialContent ? "Document content available" : "Empty document" }),
                /* @__PURE__ */ jsxs16(
                  "button",
                  {
                    onClick: handleOpenInCanvas,
                    className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors border-none cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsxs16(
                        "svg",
                        {
                          width: "16",
                          height: "16",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          strokeWidth: "2",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          children: [
                            /* @__PURE__ */ jsx38("path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                            /* @__PURE__ */ jsx38("path", { d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" })
                          ]
                        }
                      ),
                      "Open in Canvas"
                    ]
                  }
                )
              ]
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs16(
    "div",
    {
      className: "canvas-block",
      style: { width, minHeight: height },
      "data-document-id": documentId,
      children: [
        title && /* @__PURE__ */ jsx38("h3", { className: "text-lg font-semibold text-white mb-3", children: title }),
        /* @__PURE__ */ jsx38("div", { className: "bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden", children: /* @__PURE__ */ jsx38(
          EditorComponent,
          {
            initialState: content,
            onChange: handleChange,
            placeholder,
            editable: mode !== "view",
            enableFloatingToolbar: showToolbar && mode === "edit",
            enableDragDrop: mode === "edit",
            enableAI: mode === "edit",
            enableProactiveSuggestions: mode === "edit",
            className: "prose prose-invert max-w-none p-4"
          },
          editorKey
        ) }),
        mode === "edit" && /* @__PURE__ */ jsx38("div", { className: "flex justify-end mt-2", children: /* @__PURE__ */ jsx38(
          "button",
          {
            onClick: handleSave,
            className: "px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors border-none cursor-pointer",
            children: "Save"
          }
        ) })
      ]
    }
  );
});

// ../../node_modules/.pnpm/dompurify@3.3.1/node_modules/dompurify/dist/purify.es.mjs
var {
  entries,
  setPrototypeOf,
  isFrozen,
  getPrototypeOf,
  getOwnPropertyDescriptor
} = Object;
var {
  freeze,
  seal,
  create: create2
} = Object;
var {
  apply,
  construct
} = typeof Reflect !== "undefined" && Reflect;
if (!freeze) {
  freeze = function freeze2(x) {
    return x;
  };
}
if (!seal) {
  seal = function seal2(x) {
    return x;
  };
}
if (!apply) {
  apply = function apply2(func, thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    return func.apply(thisArg, args);
  };
}
if (!construct) {
  construct = function construct2(Func) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return new Func(...args);
  };
}
var arrayForEach = unapply(Array.prototype.forEach);
var arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
var arrayPop = unapply(Array.prototype.pop);
var arrayPush = unapply(Array.prototype.push);
var arraySplice = unapply(Array.prototype.splice);
var stringToLowerCase = unapply(String.prototype.toLowerCase);
var stringToString = unapply(String.prototype.toString);
var stringMatch = unapply(String.prototype.match);
var stringReplace = unapply(String.prototype.replace);
var stringIndexOf = unapply(String.prototype.indexOf);
var stringTrim = unapply(String.prototype.trim);
var objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
var regExpTest = unapply(RegExp.prototype.test);
var typeErrorCreate = unconstruct(TypeError);
function unapply(func) {
  return function(thisArg) {
    if (thisArg instanceof RegExp) {
      thisArg.lastIndex = 0;
    }
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return apply(func, thisArg, args);
  };
}
function unconstruct(Func) {
  return function() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return construct(Func, args);
  };
}
function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    setPrototypeOf(set, null);
  }
  let l = array.length;
  while (l--) {
    let element = array[l];
    if (typeof element === "string") {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        if (!isFrozen(array)) {
          array[l] = lcElement;
        }
        element = lcElement;
      }
    }
    set[element] = true;
  }
  return set;
}
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
function clone(object) {
  const newObject = create2(null);
  for (const [property, value] of entries(object)) {
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (Array.isArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === "object" && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === "function") {
        return unapply(desc.value);
      }
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}
var html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
var svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
var svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
var svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
var mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
var mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
var text = freeze(["#text"]);
var html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]);
var svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
var mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
var xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
var MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
var ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
var TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm);
var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
var IS_ALLOWED_URI = seal(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
);
var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
var ATTR_WHITESPACE = seal(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
);
var DOCTYPE_NAME = seal(/^html$/i);
var CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
var EXPRESSIONS = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR,
  ATTR_WHITESPACE,
  CUSTOM_ELEMENT,
  DATA_ATTR,
  DOCTYPE_NAME,
  ERB_EXPR,
  IS_ALLOWED_URI,
  IS_SCRIPT_OR_DATA,
  MUSTACHE_EXPR,
  TMPLIT_EXPR
});
var NODE_TYPE = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
  // Deprecated
};
var getGlobal = function getGlobal2() {
  return typeof window === "undefined" ? null : window;
};
var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
    return null;
  }
  let suffix = null;
  const ATTR_NAME = "data-tt-policy-suffix";
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }
  const policyName = "dompurify" + (suffix ? "#" + suffix : "");
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html2) {
        return html2;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_) {
    console.warn("TrustedTypes policy " + policyName + " could not be created.");
    return null;
  }
};
var _createHooksMap = function _createHooksMap2() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function createDOMPurify() {
  let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
  const DOMPurify = (root) => createDOMPurify(root);
  DOMPurify.version = "3.3.1";
  DOMPurify.removed = [];
  if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let {
    document: document2
  } = window2;
  const originalDocument = document2;
  const currentScript = originalDocument.currentScript;
  const {
    DocumentFragment,
    HTMLTemplateElement,
    Node,
    Element,
    NodeFilter,
    NamedNodeMap = window2.NamedNodeMap || window2.MozNamedAttrMap,
    HTMLFormElement,
    DOMParser,
    trustedTypes
  } = window2;
  const ElementPrototype = Element.prototype;
  const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
  const remove = lookupGetter(ElementPrototype, "remove");
  const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
  const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
  const getParentNode = lookupGetter(ElementPrototype, "parentNode");
  if (typeof HTMLTemplateElement === "function") {
    const template = document2.createElement("template");
    if (template.content && template.content.ownerDocument) {
      document2 = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = "";
  const {
    implementation,
    createNodeIterator,
    createDocumentFragment,
    getElementsByTagName
  } = document2;
  const {
    importNode
  } = originalDocument;
  let hooks = _createHooksMap();
  DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: MUSTACHE_EXPR2,
    ERB_EXPR: ERB_EXPR2,
    TMPLIT_EXPR: TMPLIT_EXPR2,
    DATA_ATTR: DATA_ATTR2,
    ARIA_ATTR: ARIA_ATTR2,
    IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA2,
    ATTR_WHITESPACE: ATTR_WHITESPACE2,
    CUSTOM_ELEMENT: CUSTOM_ELEMENT2
  } = EXPRESSIONS;
  let {
    IS_ALLOWED_URI: IS_ALLOWED_URI$1
  } = EXPRESSIONS;
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  let CUSTOM_ELEMENT_HANDLING = Object.seal(create2(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  let FORBID_TAGS = null;
  let FORBID_ATTR = null;
  const EXTRA_ELEMENT_HANDLING = Object.seal(create2(null, {
    tagCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    }
  }));
  let ALLOW_ARIA_ATTR = true;
  let ALLOW_DATA_ATTR = true;
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  let SAFE_FOR_TEMPLATES = false;
  let SAFE_FOR_XML = true;
  let WHOLE_DOCUMENT = false;
  let SET_CONFIG = false;
  let FORCE_BODY = false;
  let RETURN_DOM = false;
  let RETURN_DOM_FRAGMENT = false;
  let RETURN_TRUSTED_TYPE = false;
  let SANITIZE_DOM = true;
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
  let KEEP_CONTENT = true;
  let IN_PLACE = false;
  let USE_PROFILES = {};
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
  const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
  let HTML_INTEGRATION_POINTS = addToSet({}, ["annotation-xml"]);
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
  const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
  let transformCaseFunc = null;
  let CONFIG = null;
  const formElement = document2.createElement("form");
  const isRegexOrFunction = function isRegexOrFunction2(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  const _parseConfig = function _parseConfig2() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    if (!cfg || typeof cfg !== "object") {
      cfg = {};
    }
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
    ALLOWED_TAGS = objectHasOwnProperty(cfg, "ALLOWED_TAGS") ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR = objectHasOwnProperty(cfg, "ALLOWED_ATTR") ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
    ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, "ALLOWED_NAMESPACES") ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
    URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS = objectHasOwnProperty(cfg, "ADD_DATA_URI_TAGS") ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS = objectHasOwnProperty(cfg, "FORBID_CONTENTS") ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS = objectHasOwnProperty(cfg, "FORBID_TAGS") ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
    FORBID_ATTR = objectHasOwnProperty(cfg, "FORBID_ATTR") ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
    USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
    RETURN_DOM = cfg.RETURN_DOM || false;
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
    FORCE_BODY = cfg.FORCE_BODY || false;
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
    IN_PLACE = cfg.IN_PLACE || false;
    IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
    NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
    HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
    CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
    }
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, text);
      ALLOWED_ATTR = [];
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    if (cfg.ADD_TAGS) {
      if (typeof cfg.ADD_TAGS === "function") {
        EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
      } else {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
    }
    if (cfg.ADD_ATTR) {
      if (typeof cfg.ADD_ATTR === "function") {
        EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
      } else {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
    }
    if (cfg.ADD_URI_SAFE_ATTR) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (cfg.FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    if (cfg.ADD_FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
    }
    if (KEEP_CONTENT) {
      ALLOWED_TAGS["#text"] = true;
    }
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
    }
    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ["tbody"]);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      emptyHTML = trustedTypesPolicy.createHTML("");
    } else {
      if (trustedTypesPolicy === void 0) {
        trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      }
      if (trustedTypesPolicy !== null && typeof emptyHTML === "string") {
        emptyHTML = trustedTypesPolicy.createHTML("");
      }
    }
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  const _checkValidNamespace = function _checkValidNamespace2(element) {
    let parent = getParentNode(element);
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: "template"
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "svg";
      }
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      return Boolean(ALL_SVG_TAGS[tagName]);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "math";
      }
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
      }
      return Boolean(ALL_MATHML_TAGS[tagName]);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    return false;
  };
  const _forceRemove = function _forceRemove2(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });
    try {
      getParentNode(node).removeChild(node);
    } catch (_) {
      remove(node);
    }
  };
  const _removeAttribute = function _removeAttribute2(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    if (name === "is") {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_) {
        }
      } else {
        try {
          element.setAttribute(name, "");
        } catch (_) {
        }
      }
    }
  };
  const _initDocument = function _initDocument2(dirty) {
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = "<remove></remove>" + dirty;
    } else {
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
    }
    const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_) {
      }
    }
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, "template", null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_) {
      }
    }
    const body = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) {
      body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
    }
    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  const _createNodeIterator = function _createNodeIterator2(root) {
    return createNodeIterator.call(
      root.ownerDocument || root,
      root,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION,
      null
    );
  };
  const _isClobbered = function _isClobbered2(element) {
    return element instanceof HTMLFormElement && (typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function");
  };
  const _isNode = function _isNode2(value) {
    return typeof Node === "function" && value instanceof Node;
  };
  function _executeHooks(hooks2, currentNode, data) {
    arrayForEach(hooks2, (hook) => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  const _sanitizeElements = function _sanitizeElements2(currentNode) {
    let content = null;
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    const tagName = transformCaseFunc(currentNode.nodeName);
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
      _forceRemove(currentNode);
      return true;
    }
    if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
      _forceRemove(currentNode);
      return true;
    }
    if (!(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName])) {
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode) || currentNode.parentNode;
        const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const childClone = cloneNode(childNodes[i], true);
            childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
            parentNode.insertBefore(childClone, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    }
    if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      content = currentNode.textContent;
      arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
        content = stringReplace(content, expr, " ");
      });
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
    if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
      return false;
    }
    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR2, lcName)) ;
    else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR2, lcName)) ;
    else if (EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag)) ;
    else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
      if (
        // First condition does a very basic check if a) it's basically a valid custom element tagname AND
        // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
        _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || // Alternative, second condition checks if it's an `is`-attribute, AND
        // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
      ) ;
      else {
        return false;
      }
    } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
    else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
    else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
    else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA2, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
    else if (value) {
      return false;
    } else ;
    return true;
  };
  const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
    return tagName !== "annotation-xml" && stringMatch(tagName, CUSTOM_ELEMENT2);
  };
  const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const {
      attributes
    } = currentNode;
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    const hookEvent = {
      attrName: "",
      attrValue: "",
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: void 0
    };
    let l = attributes.length;
    while (l--) {
      const attr = attributes[l];
      const {
        name,
        namespaceURI,
        value: attrValue
      } = attr;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === "value" ? initValue : stringTrim(initValue);
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = void 0;
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
        _removeAttribute(name, currentNode);
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title|textarea)/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (lcName === "attributename" && stringMatch(value, "href")) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          value = stringReplace(value, expr, " ");
        });
      }
      const lcTag = transformCaseFunc(currentNode.nodeName);
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") {
        if (namespaceURI) ;
        else {
          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
            case "TrustedHTML": {
              value = trustedTypesPolicy.createHTML(value);
              break;
            }
            case "TrustedScriptURL": {
              value = trustedTypesPolicy.createScriptURL(value);
              break;
            }
          }
        }
      }
      if (value !== initValue) {
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            currentNode.setAttribute(name, value);
          }
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
          } else {
            arrayPop(DOMPurify.removed);
          }
        } catch (_) {
          _removeAttribute(name, currentNode);
        }
      }
    }
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  const _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      _sanitizeElements(shadowNode);
      _sanitizeAttributes(shadowNode);
      if (shadowNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM2(shadowNode.content);
      }
    }
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  DOMPurify.sanitize = function(dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = "<!-->";
    }
    if (typeof dirty !== "string" && !_isNode(dirty)) {
      if (typeof dirty.toString === "function") {
        dirty = dirty.toString();
        if (typeof dirty !== "string") {
          throw typeErrorCreate("dirty is not a string, aborting");
        }
      } else {
        throw typeErrorCreate("toString is not a function");
      }
    }
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    DOMPurify.removed = [];
    if (typeof dirty === "string") {
      IN_PLACE = false;
    }
    if (IN_PLACE) {
      if (dirty.nodeName) {
        const tagName = transformCaseFunc(dirty.nodeName);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
        }
      }
    } else if (dirty instanceof Node) {
      body = _initDocument("<!---->");
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
        body = importedNode;
      } else if (importedNode.nodeName === "HTML") {
        body = importedNode;
      } else {
        body.appendChild(importedNode);
      }
    } else {
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf("<") === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      body = _initDocument(dirty);
      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
      }
    }
    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
    while (currentNode = nodeIterator.nextNode()) {
      _sanitizeElements(currentNode);
      _sanitizeAttributes(currentNode);
      if (currentNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(currentNode.content);
      }
    }
    if (IN_PLACE) {
      return dirty;
    }
    if (RETURN_DOM) {
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) {
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
    }
    if (SAFE_FOR_TEMPLATES) {
      arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
        serializedHTML = stringReplace(serializedHTML, expr, " ");
      });
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
  };
  DOMPurify.clearConfig = function() {
    CONFIG = null;
    SET_CONFIG = false;
  };
  DOMPurify.isValidAttribute = function(tag, attr, value) {
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function(entryPoint, hookFunction) {
    if (typeof hookFunction !== "function") {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function(entryPoint, hookFunction) {
    if (hookFunction !== void 0) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function(entryPoint) {
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function() {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify = createDOMPurify();

// src/components/Document/DocumentBlock.tsx
import { memo as memo9, useMemo as useMemo24 } from "react";
import { jsx as jsx39, jsxs as jsxs17 } from "react/jsx-runtime";
var DocumentBlock = memo9(function DocumentBlock2({
  element,
  onAction,
  renderText,
  loading
}) {
  const {
    title,
    content,
    format = "markdown",
    editable = false,
    documentId,
    showOpenInCanvas = true
  } = element.props;
  const renderedContent = useMemo24(() => {
    if (format === "html") {
      return /* @__PURE__ */ jsx39(
        "div",
        {
          className: "prose prose-invert max-w-none",
          dangerouslySetInnerHTML: { __html: purify.sanitize(content) }
        }
      );
    }
    if (format === "markdown" && renderText) {
      return renderText(content, { markdown: true });
    }
    return /* @__PURE__ */ jsx39("pre", { className: "whitespace-pre-wrap text-sm", children: content });
  }, [content, format, renderText]);
  const handleOpenInCanvas = () => {
    onAction?.({
      type: "canvas:open",
      payload: {
        documentId,
        title,
        content,
        format
      }
    });
  };
  if (loading) {
    return /* @__PURE__ */ jsxs17("div", { className: "w-full p-6 bg-zinc-900/50 rounded-xl border border-white/5 animate-pulse", children: [
      /* @__PURE__ */ jsx39("div", { className: "h-6 w-1/3 bg-zinc-800 rounded mb-4" }),
      /* @__PURE__ */ jsxs17("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx39("div", { className: "h-4 bg-zinc-800 rounded w-full" }),
        /* @__PURE__ */ jsx39("div", { className: "h-4 bg-zinc-800 rounded w-5/6" }),
        /* @__PURE__ */ jsx39("div", { className: "h-4 bg-zinc-800 rounded w-4/6" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs17("div", { className: "document-block w-full bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden", children: [
    /* @__PURE__ */ jsxs17("div", { className: "flex items-center justify-between px-4 py-3 border-b border-white/5 bg-zinc-900/30", children: [
      /* @__PURE__ */ jsxs17("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs17(
          "svg",
          {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: "text-zinc-400",
            children: [
              /* @__PURE__ */ jsx39("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
              /* @__PURE__ */ jsx39("polyline", { points: "14 2 14 8 20 8" }),
              /* @__PURE__ */ jsx39("line", { x1: "16", x2: "8", y1: "13", y2: "13" }),
              /* @__PURE__ */ jsx39("line", { x1: "16", x2: "8", y1: "17", y2: "17" }),
              /* @__PURE__ */ jsx39("line", { x1: "10", x2: "8", y1: "9", y2: "9" })
            ]
          }
        ),
        /* @__PURE__ */ jsx39("h3", { className: "text-sm font-medium text-white", children: title })
      ] }),
      showOpenInCanvas && /* @__PURE__ */ jsxs17(
        "button",
        {
          onClick: handleOpenInCanvas,
          className: "flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors border-none cursor-pointer",
          children: [
            /* @__PURE__ */ jsxs17(
              "svg",
              {
                width: "12",
                height: "12",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                  /* @__PURE__ */ jsx39("path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                  /* @__PURE__ */ jsx39("path", { d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" })
                ]
              }
            ),
            "Open in Canvas"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx39("div", { className: "p-4", children: renderedContent })
  ] });
});

// src/use-cases/selection.use-case.ts
function computeToggleSelection(currentSelection, item) {
  const isCurrentlySelected = currentSelection.some(
    (s) => s.itemId === item.itemId && s.elementKey === item.elementKey
  );
  if (isCurrentlySelected) {
    return currentSelection.filter(
      (s) => !(s.itemId === item.itemId && s.elementKey === item.elementKey)
    );
  }
  return [...currentSelection, item];
}
function computeAddSelection(currentSelection, item) {
  const isCurrentlySelected = currentSelection.some(
    (s) => s.itemId === item.itemId && s.elementKey === item.elementKey
  );
  if (isCurrentlySelected) {
    return currentSelection;
  }
  return [...currentSelection, item];
}
function computeRemoveSelection(currentSelection, itemId, elementKey) {
  return currentSelection.filter((s) => {
    if (elementKey) {
      return !(s.itemId === itemId && s.elementKey === elementKey);
    }
    return s.itemId !== itemId;
  });
}
function computeReplaceSelection(_currentSelection, newItems) {
  return [...newItems];
}
function isItemSelected(selection, itemId, elementKey) {
  return selection.some((s) => {
    if (elementKey) {
      return s.itemId === itemId && s.elementKey === elementKey;
    }
    return s.itemId === itemId;
  });
}
function getSelectionCountByElement(selection, elementKey) {
  return selection.filter((s) => s.elementKey === elementKey).length;
}
function getSelectionForElement(selection, elementKey) {
  return selection.filter((s) => s.elementKey === elementKey);
}
function computeRangeSelection(allItems, currentSelection, newItem, elementKey) {
  const itemsForElement = allItems.filter((i) => i.elementKey === elementKey);
  const lastSelected = currentSelection.filter((s) => s.elementKey === elementKey).pop();
  if (!lastSelected) {
    return computeAddSelection(currentSelection, {
      itemId: newItem.itemId,
      elementKey: newItem.elementKey,
      data: newItem.data
    });
  }
  const lastIndex = itemsForElement.findIndex(
    (i) => i.itemId === lastSelected.itemId
  );
  const newIndex = itemsForElement.findIndex(
    (i) => i.itemId === newItem.itemId
  );
  if (lastIndex === -1 || newIndex === -1) {
    return computeAddSelection(currentSelection, {
      itemId: newItem.itemId,
      elementKey: newItem.elementKey,
      data: newItem.data
    });
  }
  const start = Math.min(lastIndex, newIndex);
  const end = Math.max(lastIndex, newIndex);
  const rangeItems = itemsForElement.slice(start, end + 1).map((item) => ({
    itemId: item.itemId,
    elementKey: item.elementKey,
    data: item.data
  }));
  const merged = [...currentSelection];
  for (const item of rangeItems) {
    if (!isItemSelected(merged, item.itemId, item.elementKey)) {
      merged.push(item);
    }
  }
  return merged;
}
function generateSelectionSummary(selection) {
  if (selection.length === 0) {
    return "No items selected";
  }
  if (selection.length === 1) {
    const item = selection[0];
    return `1 item selected (${item.elementKey})`;
  }
  const groups = /* @__PURE__ */ new Map();
  for (const item of selection) {
    groups.set(item.elementKey, (groups.get(item.elementKey) || 0) + 1);
  }
  const parts = Array.from(groups.entries()).map(
    ([key, count]) => `${count} from ${key}`
  );
  return `${selection.length} items selected: ${parts.join(", ")}`;
}
function exportSelectionForAI(selection) {
  return {
    summary: generateSelectionSummary(selection),
    items: selection.map((item) => ({
      type: "selected-item",
      id: item.itemId,
      elementKey: item.elementKey,
      data: item.data
    }))
  };
}
function generateDeepSelectionSummary(selections) {
  if (selections.length === 0) {
    return "No elements selected";
  }
  if (selections.length === 1) {
    const sel = selections[0];
    const preview = sel.textContent.length > 30 ? sel.textContent.slice(0, 30) + "..." : sel.textContent;
    return `1 ${sel.tagName} selected: "${preview}"`;
  }
  const groups = /* @__PURE__ */ new Map();
  for (const sel of selections) {
    groups.set(sel.elementKey, (groups.get(sel.elementKey) || 0) + 1);
  }
  const parts = Array.from(groups.entries()).map(
    ([key, count]) => `${count} from ${key}`
  );
  return `${selections.length} elements selected: ${parts.join(", ")}`;
}
function exportDeepSelectionForAI(selections) {
  return {
    summary: generateDeepSelectionSummary(selections),
    selections: selections.map((sel) => ({
      type: sel.selectionType,
      elementKey: sel.elementKey,
      cssPath: sel.cssPath,
      tagName: sel.tagName,
      textContent: sel.textContent,
      itemId: sel.itemId
    }))
  };
}
function exportDeepSelectionAsText(selections) {
  if (selections.length === 0) return "";
  return selections.map((sel) => sel.textContent).join("\n");
}
function exportDeepSelectionAsJSON(selections) {
  return JSON.stringify(
    selections.map((sel) => ({
      elementKey: sel.elementKey,
      cssPath: sel.cssPath,
      tagName: sel.tagName,
      textContent: sel.textContent,
      itemId: sel.itemId,
      selectionType: sel.selectionType
    })),
    null,
    2
  );
}
function isDeepSelectionSelected(selections, elementKey, cssPath) {
  return selections.some(
    (s) => s.elementKey === elementKey && s.cssPath === cssPath
  );
}
function groupDeepSelectionsByElement(selections) {
  const groups = /* @__PURE__ */ new Map();
  for (const sel of selections) {
    const existing = groups.get(sel.elementKey) || [];
    existing.push(sel);
    groups.set(sel.elementKey, existing);
  }
  return groups;
}
export {
  AISettingsProvider,
  ActionProvider,
  ActionProvider2 as ActionTrackingProvider,
  AutoSaveProvider,
  CanvasBlock,
  ChildSkeleton,
  CitationProvider,
  ConfirmDialog,
  DEFAULT_AI_SETTINGS,
  DEFAULT_EXTENDED_SETTINGS,
  DataProvider,
  DocumentBlock,
  EditModeProvider,
  EditableNumber,
  EditableProvider,
  EditableText3 as EditableText,
  ElementRenderer,
  FreeGridCanvas,
  GridCell,
  JSONUIProvider,
  MarkdownProvider,
  MarkdownText,
  PlaceholderSkeleton,
  Renderer,
  ResizableWrapper,
  SelectableItem,
  SelectionProvider,
  TextSelectionBadge,
  ToolProgressOverlay,
  ToolProgressProvider,
  UnifiedProgressProvider,
  ValidationProvider,
  VisibilityProvider,
  buildConversationMessages,
  computeAddSelection,
  computeRangeSelection,
  computeRemoveSelection,
  computeReplaceSelection,
  computeToggleSelection,
  createLayout,
  createRendererFromCatalog,
  elementRendererPropsAreEqual2 as elementRendererPropsAreEqual,
  exportDeepSelectionAsJSON,
  exportDeepSelectionAsText,
  exportDeepSelectionForAI,
  exportSelectionForAI,
  flatToTree,
  formatActionsForPrompt,
  generateDeepSelectionSummary,
  generateSelectionSummary,
  getLayoutStyles,
  getResizeCursor,
  getSelectionCountByElement,
  getSelectionForElement,
  groupDeepSelectionsByElement,
  isDeepSelectionSelected,
  isFileAttachment,
  isItemSelected,
  isLibraryAttachment,
  isPlaceholderElement,
  selectPlanExecution,
  selectableItemProps,
  useAISettings,
  useAISettingsOptional,
  useAction,
  useActionContext,
  useActionHistory,
  useActionSubscriber,
  useActions,
  useActiveDocument,
  useActiveDocumentId,
  useActiveResearch,
  useActiveStep,
  useActiveToolProgress2 as useActiveToolProgress,
  useActiveToolProgress as useActiveToolProgressStore,
  useAllComponentState,
  useAreSuggestionsEnabled,
  useAuthenticatedSources,
  useAutoSave,
  useCanvasActions,
  useCanvasContent,
  useCanvasInstance,
  useCanvasInstances,
  useCanvasIsStreaming,
  useCanvasVersion,
  useCitations,
  useComponentState,
  useComponentStateActions,
  useData,
  useDataBinding,
  useDataValue,
  useDeepResearchEffortLevel,
  useDeepResearchEnabled,
  useDeepResearchSettings,
  useDeepSelectionActive,
  useDeepSelections,
  useDomainAutoSave,
  useEditMode,
  useEditable,
  useEditableContext,
  useElementActionTracker,
  useElementEdit,
  useElementState,
  useFieldStates,
  useFieldValidation,
  useFormState,
  useGeneratingGoal,
  useGranularSelection,
  useIsAnyToolRunning,
  useIsElementEditing,
  useIsGenerating,
  useIsMobile,
  useIsPlanRunning,
  useIsProactivityEnabled,
  useIsResearchActive,
  useIsSmartParsingEnabled,
  useIsToolRunning,
  useIsValidating,
  useIsVisible,
  useIsWorkspaceOpen,
  useItemSelection,
  useLayoutManager,
  useLoadingActions,
  useMarkdown,
  useMcpActions,
  useMcpError,
  useMcpLoadingServers,
  useMcpServers,
  usePendingAIEdits,
  usePendingConfirmations,
  usePlanExecution,
  usePlanProgress,
  usePreservedSelection,
  useProgressEvents,
  useRenderText,
  useResearchHistory,
  useResearchProgress,
  useResizable,
  useSelection,
  useStore,
  useTextSelection,
  useToolProgress,
  useToolProgressOptional,
  useUIStore,
  useUIStream,
  useUnifiedProgress,
  useUnifiedProgressOptional,
  useValidation,
  useVisibility,
  useWorkspaceActions,
  useWorkspaceDocuments,
  useWorkspaceLayout,
  useYoloMode
};
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.3.1 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.1/LICENSE *)
*/
//# sourceMappingURL=index.mjs.map