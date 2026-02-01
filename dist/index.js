"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AISettingsProvider: () => AISettingsProvider,
  ActionProvider: () => ActionProvider,
  ActionTrackingProvider: () => ActionProvider2,
  AutoSaveProvider: () => AutoSaveProvider,
  CanvasBlock: () => CanvasBlock,
  ChildSkeleton: () => ChildSkeleton,
  CitationProvider: () => CitationProvider,
  ConfirmDialog: () => ConfirmDialog,
  DEFAULT_AI_SETTINGS: () => DEFAULT_AI_SETTINGS,
  DEFAULT_EXTENDED_SETTINGS: () => DEFAULT_EXTENDED_SETTINGS,
  DataProvider: () => DataProvider,
  DocumentBlock: () => DocumentBlock,
  EditModeProvider: () => EditModeProvider,
  EditableNumber: () => EditableNumber,
  EditableProvider: () => EditableProvider,
  EditableText: () => EditableText3,
  ElementRenderer: () => ElementRenderer,
  FreeGridCanvas: () => FreeGridCanvas,
  GridCell: () => GridCell,
  JSONUIProvider: () => JSONUIProvider,
  MarkdownProvider: () => MarkdownProvider,
  MarkdownText: () => MarkdownText,
  PlaceholderSkeleton: () => PlaceholderSkeleton,
  Renderer: () => Renderer,
  ResizableWrapper: () => ResizableWrapper,
  SelectableItem: () => SelectableItem,
  SelectionProvider: () => SelectionProvider,
  TextSelectionBadge: () => TextSelectionBadge,
  ToolProgressOverlay: () => ToolProgressOverlay,
  ToolProgressProvider: () => ToolProgressProvider,
  UnifiedProgressProvider: () => UnifiedProgressProvider,
  ValidationProvider: () => ValidationProvider,
  VisibilityProvider: () => VisibilityProvider,
  buildConversationMessages: () => buildConversationMessages,
  computeAddSelection: () => computeAddSelection,
  computeRangeSelection: () => computeRangeSelection,
  computeRemoveSelection: () => computeRemoveSelection,
  computeReplaceSelection: () => computeReplaceSelection,
  computeToggleSelection: () => computeToggleSelection,
  createLayout: () => createLayout,
  createRendererFromCatalog: () => createRendererFromCatalog,
  elementRendererPropsAreEqual: () => elementRendererPropsAreEqual2,
  exportDeepSelectionAsJSON: () => exportDeepSelectionAsJSON,
  exportDeepSelectionAsText: () => exportDeepSelectionAsText,
  exportDeepSelectionForAI: () => exportDeepSelectionForAI,
  exportSelectionForAI: () => exportSelectionForAI,
  flatToTree: () => flatToTree,
  formatActionsForPrompt: () => formatActionsForPrompt,
  generateDeepSelectionSummary: () => generateDeepSelectionSummary,
  generateSelectionSummary: () => generateSelectionSummary,
  getLayoutStyles: () => getLayoutStyles,
  getResizeCursor: () => getResizeCursor,
  getSelectionCountByElement: () => getSelectionCountByElement,
  getSelectionForElement: () => getSelectionForElement,
  groupDeepSelectionsByElement: () => groupDeepSelectionsByElement,
  isDeepSelectionSelected: () => isDeepSelectionSelected,
  isFileAttachment: () => isFileAttachment,
  isItemSelected: () => isItemSelected,
  isLibraryAttachment: () => isLibraryAttachment,
  isPlaceholderElement: () => isPlaceholderElement,
  selectPlanExecution: () => selectPlanExecution,
  selectableItemProps: () => selectableItemProps,
  useAISettings: () => useAISettings,
  useAISettingsOptional: () => useAISettingsOptional,
  useAction: () => useAction,
  useActionContext: () => useActionContext,
  useActionHistory: () => useActionHistory,
  useActionSubscriber: () => useActionSubscriber,
  useActions: () => useActions,
  useActiveDocument: () => useActiveDocument,
  useActiveDocumentId: () => useActiveDocumentId,
  useActiveResearch: () => useActiveResearch,
  useActiveStep: () => useActiveStep,
  useActiveToolProgress: () => useActiveToolProgress2,
  useActiveToolProgressStore: () => useActiveToolProgress,
  useAreSuggestionsEnabled: () => useAreSuggestionsEnabled,
  useAuthenticatedSources: () => useAuthenticatedSources,
  useAutoSave: () => useAutoSave,
  useCanvasActions: () => useCanvasActions,
  useCanvasContent: () => useCanvasContent,
  useCanvasInstance: () => useCanvasInstance,
  useCanvasInstances: () => useCanvasInstances,
  useCanvasIsStreaming: () => useCanvasIsStreaming,
  useCanvasVersion: () => useCanvasVersion,
  useCitations: () => useCitations,
  useData: () => useData,
  useDataBinding: () => useDataBinding,
  useDataValue: () => useDataValue,
  useDeepResearchEffortLevel: () => useDeepResearchEffortLevel,
  useDeepResearchEnabled: () => useDeepResearchEnabled,
  useDeepResearchSettings: () => useDeepResearchSettings,
  useDeepSelectionActive: () => useDeepSelectionActive,
  useDeepSelections: () => useDeepSelections,
  useDomainAutoSave: () => useDomainAutoSave,
  useEditMode: () => useEditMode,
  useEditable: () => useEditable,
  useEditableContext: () => useEditableContext,
  useElementActionTracker: () => useElementActionTracker,
  useElementEdit: () => useElementEdit,
  useFieldStates: () => useFieldStates,
  useFieldValidation: () => useFieldValidation,
  useFormState: () => useFormState,
  useGeneratingGoal: () => useGeneratingGoal,
  useGranularSelection: () => useGranularSelection,
  useIsAnyToolRunning: () => useIsAnyToolRunning,
  useIsElementEditing: () => useIsElementEditing,
  useIsGenerating: () => useIsGenerating,
  useIsMobile: () => useIsMobile,
  useIsPlanRunning: () => useIsPlanRunning,
  useIsProactivityEnabled: () => useIsProactivityEnabled,
  useIsResearchActive: () => useIsResearchActive,
  useIsSmartParsingEnabled: () => useIsSmartParsingEnabled,
  useIsToolRunning: () => useIsToolRunning,
  useIsValidating: () => useIsValidating,
  useIsVisible: () => useIsVisible,
  useIsWorkspaceOpen: () => useIsWorkspaceOpen,
  useItemSelection: () => useItemSelection,
  useLayoutManager: () => useLayoutManager,
  useLoadingActions: () => useLoadingActions,
  useMarkdown: () => useMarkdown,
  usePendingAIEdits: () => usePendingAIEdits,
  usePendingConfirmations: () => usePendingConfirmations,
  usePlanExecution: () => usePlanExecution,
  usePlanProgress: () => usePlanProgress,
  usePreservedSelection: () => usePreservedSelection,
  useProgressEvents: () => useProgressEvents,
  useRenderText: () => useRenderText,
  useResearchHistory: () => useResearchHistory,
  useResearchProgress: () => useResearchProgress,
  useResizable: () => useResizable,
  useSelection: () => useSelection,
  useStore: () => useStore,
  useTextSelection: () => useTextSelection,
  useToolProgress: () => useToolProgress,
  useToolProgressOptional: () => useToolProgressOptional,
  useUIStore: () => useUIStore,
  useUIStream: () => useUIStream,
  useUnifiedProgress: () => useUnifiedProgress,
  useUnifiedProgressOptional: () => useUnifiedProgressOptional,
  useValidation: () => useValidation,
  useVisibility: () => useVisibility,
  useWorkspaceActions: () => useWorkspaceActions,
  useWorkspaceDocuments: () => useWorkspaceDocuments,
  useWorkspaceLayout: () => useWorkspaceLayout,
  useYoloMode: () => useYoloMode
});
module.exports = __toCommonJS(index_exports);

// src/contexts/data.tsx
var import_react = require("react");
var import_core = require("@onegenui/core");

// src/store/index.ts
var import_zustand = require("zustand");
var import_middleware = require("zustand/middleware");
var import_immer = require("zustand/middleware/immer");
var import_immer2 = require("immer");
var import_shallow = require("zustand/react/shallow");

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
var initialTree = null;
var createUITreeSlice = (set, get) => ({
  // State
  uiTree: initialTree,
  isTreeStreaming: false,
  treeVersion: 0,
  // Actions
  setUITree: (tree) => set((state) => {
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
  }),
  bumpTreeVersion: () => set((state) => {
    state.treeVersion += 1;
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
      current[key] = {};
    }
    current = current[key];
  }
  const lastKey = parts[parts.length - 1];
  current[lastKey] = value;
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

// src/store/index.ts
(0, import_immer2.enableMapSet)();
var useStore = (0, import_zustand.create)()(
  (0, import_middleware.devtools)(
    (0, import_middleware.subscribeWithSelector)(
      (0, import_immer.immer)((...args) => ({
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
        ...createCanvasSlice(...args)
      }))
    ),
    {
      name: "onegenui-store",
      enabled: process.env.NODE_ENV !== "production"
    }
  )
);
var useUIStore = useStore;
var useDeepSelections = () => useStore((0, import_shallow.useShallow)((s) => s.deepSelections));
var useDeepSelectionActive = () => useStore((s) => s.deepSelectionActive);
var useGranularSelection = () => useStore(
  (0, import_shallow.useShallow)((s) => {
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
var useLoadingActions = () => useStore((0, import_shallow.useShallow)((s) => s.loadingActions));
var usePendingConfirmations = () => useStore((0, import_shallow.useShallow)((s) => s.pendingConfirmations));
var useActionHistory = () => useStore((0, import_shallow.useShallow)((s) => s.actionHistory));
var useFieldStates = () => useStore((0, import_shallow.useShallow)((s) => s.fieldStates));
var useIsValidating = () => useStore((s) => s.isValidating);
var useFormState = () => useStore(
  (0, import_shallow.useShallow)((s) => {
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
  (0, import_shallow.useShallow)(
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
  (0, import_shallow.useShallow)((s) => {
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
  (0, import_shallow.useShallow)((s) => {
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
  (0, import_shallow.useShallow)((s) => ({
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
var useCanvasInstances = () => useStore((0, import_shallow.useShallow)((s) => Array.from(s.canvasInstances.values())));
var useCanvasInstance = (canvasId) => useStore((s) => s.canvasInstances.get(canvasId));
var useCanvasContent = (canvasId) => useStore((s) => s.canvasInstances.get(canvasId)?.content ?? null);
var useCanvasVersion = (canvasId) => useStore((s) => s.canvasInstances.get(canvasId)?.version ?? 0);
var useCanvasIsStreaming = (canvasId) => useStore((s) => s.canvasInstances.get(canvasId)?.isStreaming ?? false);
var useCanvasActions = () => useStore(
  (0, import_shallow.useShallow)((s) => ({
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

// src/contexts/data.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var DataContext = (0, import_react.createContext)(null);
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
  (0, import_react.useEffect)(() => {
    if (Object.keys(initialData).length > 0) {
      setDataModel(initialData);
    }
  }, []);
  (0, import_react.useEffect)(() => {
    if (authState) {
      setAuth(authState);
    }
  }, [authState, setAuth]);
  const get = (0, import_react.useCallback)((path) => (0, import_core.getByPath)(data, path), [data]);
  const set = (0, import_react.useCallback)(
    (path, value2) => {
      updateDataModel(path, value2);
      onDataChange?.(path, value2);
    },
    [updateDataModel, onDataChange]
  );
  const update = (0, import_react.useCallback)(
    (updates) => {
      for (const [path, value2] of Object.entries(updates)) {
        updateDataModel(path, value2);
        onDataChange?.(path, value2);
      }
    },
    [updateDataModel, onDataChange]
  );
  const effectiveAuth = authState ?? storeAuth;
  const value = (0, import_react.useMemo)(
    () => ({
      data,
      authState: effectiveAuth,
      get,
      set,
      update
    }),
    [data, effectiveAuth, get, set, update]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataContext.Provider, { value, children });
}
function useData() {
  const ctx = (0, import_react.useContext)(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within a DataProvider");
  }
  return ctx;
}
function useDataValue(path) {
  const value = useStore((s) => (0, import_core.getByPath)(s.dataModel, path));
  return value;
}
function useDataBinding(path) {
  const value = useDataValue(path);
  const updateDataModel = useStore((s) => s.updateDataModel);
  const setValue = (0, import_react.useCallback)(
    (newValue) => updateDataModel(path, newValue),
    [path, updateDataModel]
  );
  return [value, setValue];
}

// src/contexts/visibility.tsx
var import_react2 = require("react");
var import_core2 = require("@onegenui/core");
var import_jsx_runtime2 = require("react/jsx-runtime");
var VisibilityContext = (0, import_react2.createContext)(null);
function VisibilityProvider({ children }) {
  const { data, authState } = useData();
  const ctx = (0, import_react2.useMemo)(
    () => ({
      dataModel: data,
      authState
    }),
    [data, authState]
  );
  const isVisible = (0, import_react2.useMemo)(
    () => (condition) => (0, import_core2.evaluateVisibility)(condition, ctx),
    [ctx]
  );
  const value = (0, import_react2.useMemo)(
    () => ({ isVisible, ctx }),
    [isVisible, ctx]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(VisibilityContext.Provider, { value, children });
}
function useVisibility() {
  const ctx = (0, import_react2.useContext)(VisibilityContext);
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
var import_react3 = __toESM(require("react"));
var import_core3 = require("@onegenui/core");

// src/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/contexts/actions.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var ActionContext = (0, import_react3.createContext)(null);
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
  const [handlers, setHandlers] = import_react3.default.useState(initialHandlers);
  const [localPendingConfirmation, setLocalPendingConfirmation] = import_react3.default.useState(null);
  const registerHandler = (0, import_react3.useCallback)(
    (name, handler) => {
      setHandlers((prev) => ({ ...prev, [name]: handler }));
    },
    []
  );
  const execute = (0, import_react3.useCallback)(
    async (action) => {
      const resolved = (0, import_core3.resolveAction)(action, data);
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
            await (0, import_core3.executeAction)({
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
        await (0, import_core3.executeAction)({
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
  const confirm = (0, import_react3.useCallback)(() => {
    localPendingConfirmation?.resolve();
  }, [localPendingConfirmation]);
  const cancel = (0, import_react3.useCallback)(() => {
    localPendingConfirmation?.reject();
  }, [localPendingConfirmation]);
  const value = (0, import_react3.useMemo)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ActionContext.Provider, { value, children });
}
function useActions() {
  const ctx = (0, import_react3.useContext)(ActionContext);
  if (!ctx) {
    throw new Error("useActions must be used within an ActionProvider");
  }
  return ctx;
}
function useAction(action) {
  const { execute, loadingActions } = useActions();
  const isLoading = loadingActions.has(action.name);
  const executeAction2 = (0, import_react3.useCallback)(() => execute(action), [execute, action]);
  return { execute: executeAction2, isLoading };
}
function ConfirmDialog({
  confirm,
  onConfirm,
  onCancel
}) {
  const isDanger = confirm.variant === "danger";
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "div",
    {
      className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
      onClick: onCancel,
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
        "div",
        {
          className: "bg-white rounded-lg p-6 max-w-[400px] w-full shadow-2xl",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { className: "m-0 mb-2 text-lg font-semibold", children: confirm.title }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "m-0 mb-6 text-gray-500", children: confirm.message }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex gap-3 justify-end", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "button",
                {
                  onClick: onCancel,
                  className: "px-4 py-2 rounded-md border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 transition-colors",
                  children: confirm.cancelLabel ?? "Cancel"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
var import_react4 = __toESM(require("react"));
var import_core4 = require("@onegenui/core");
var import_jsx_runtime4 = require("react/jsx-runtime");
var ValidationContext = (0, import_react4.createContext)(null);
function ValidationProvider({
  customFunctions = {},
  children
}) {
  const { data, authState } = useData();
  const fieldStates = useStore((s) => s.fieldStates);
  const touchField = useStore((s) => s.touchField);
  const setFieldValidation = useStore((s) => s.setFieldValidation);
  const clearFieldValidation = useStore((s) => s.clearFieldValidation);
  const [fieldConfigs, setFieldConfigs] = import_react4.default.useState({});
  const registerField = (0, import_react4.useCallback)(
    (path, config) => {
      setFieldConfigs((prev) => ({ ...prev, [path]: config }));
    },
    []
  );
  const validate = (0, import_react4.useCallback)(
    (path, config) => {
      const value2 = data[path.split("/").filter(Boolean).join(".")];
      const result = (0, import_core4.runValidation)(config, {
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
  const touch = (0, import_react4.useCallback)(
    (path) => {
      touchField(path);
    },
    [touchField]
  );
  const clear = (0, import_react4.useCallback)(
    (path) => {
      clearFieldValidation(path);
    },
    [clearFieldValidation]
  );
  const validateAll = (0, import_react4.useCallback)(() => {
    let allValid = true;
    for (const [path, config] of Object.entries(fieldConfigs)) {
      const result = validate(path, config);
      if (!result.valid) {
        allValid = false;
      }
    }
    return allValid;
  }, [fieldConfigs, validate]);
  const contextFieldStates = (0, import_react4.useMemo)(() => {
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
  const value = (0, import_react4.useMemo)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ValidationContext.Provider, { value, children });
}
function useValidation() {
  const ctx = (0, import_react4.useContext)(ValidationContext);
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
  import_react4.default.useEffect(() => {
    if (config && configJson) {
      registerField(path, config);
    }
  }, [path, configJson, registerField]);
  const state = fieldStates[path] ?? {
    touched: false,
    validated: false,
    result: null
  };
  const validate = (0, import_react4.useCallback)(
    () => validateField(path, config ?? { checks: [] }),
    [path, config, validateField]
  );
  const touch = (0, import_react4.useCallback)(() => touchField(path), [path, touchField]);
  const clear = (0, import_react4.useCallback)(() => clearField(path), [path, clearField]);
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
var import_react5 = require("react");
var SelectionContext = (0, import_react5.createContext)(void 0);

// src/contexts/selection/provider.tsx
var import_react9 = require("react");

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
var import_react6 = require("react");
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
  const selectedElementsRef = (0, import_react6.useRef)(/* @__PURE__ */ new Set());
  const deepSelectionActiveRef = (0, import_react6.useRef)(false);
  deepSelectionActiveRef.current = isDeepActive;
  const deepSelections = (0, import_react6.useMemo)(() => {
    return storeSelections.map((sel) => ({
      ...sel,
      element: findElementByCssPath(sel.elementKey, sel.cssPath)
    }));
  }, [storeSelections]);
  const granularSelection = (0, import_react6.useMemo)(() => {
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
  const addSelection = (0, import_react6.useCallback)(
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
  const removeSelectionByElement = (0, import_react6.useCallback)(
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
  const toggleSelection = (0, import_react6.useCallback)(
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
  const clearSelection = (0, import_react6.useCallback)(
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
  const isSelected = (0, import_react6.useCallback)(
    (elementKey, itemId) => {
      return granularSelection[elementKey]?.has(itemId) ?? false;
    },
    [granularSelection]
  );
  const getSelectedItems = (0, import_react6.useCallback)(
    (elementKey) => {
      return Array.from(granularSelection[elementKey] ?? []);
    },
    [granularSelection]
  );
  const setDeepSelectionActive = (0, import_react6.useCallback)(() => {
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
var import_react7 = require("react");

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
var DEFAULT_LONG_PRESS_CONFIG = {
  duration: 450,
  movementThreshold: 10,
  debug: false
};
function useLongPress(callbacks, config = {}) {
  const fullConfig = { ...DEFAULT_LONG_PRESS_CONFIG, ...config };
  const { duration, movementThreshold, debug } = fullConfig;
  const pressTimerRef = (0, import_react7.useRef)(null);
  const pressTargetRef = (0, import_react7.useRef)(null);
  const longPressCompletedRef = (0, import_react7.useRef)(false);
  const log = (0, import_react7.useCallback)(
    (message, ...args) => {
      if (debug) {
        console.log(`[LongPress] ${message}`, ...args);
      }
    },
    [debug]
  );
  const cancelPress = (0, import_react7.useCallback)(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    pressTargetRef.current = null;
  }, []);
  (0, import_react7.useEffect)(() => {
    const handlePointerDown = (e) => {
      if (e.button !== 0) {
        log("pointerdown SKIPPED - not primary button:", e.button);
        return;
      }
      const target = e.target;
      log("pointerdown on:", target.tagName, target.className);
      longPressCompletedRef.current = false;
      cancelPress();
      if (isInteractiveElement(target)) {
        log("pointerdown SKIPPED - interactive element:", target.tagName);
        return;
      }
      if (shouldNeverSelect(target)) {
        log("pointerdown SKIPPED - shouldNeverSelect:", target.tagName);
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
        log("Long-press triggered on:", pressTargetRef.current.tagName);
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
        log("click SKIPPED - not primary button:", e.button);
        return;
      }
      const target = e.target;
      log("click on:", target.tagName, target.className);
      if (longPressCompletedRef.current) {
        log("click SKIPPED - long-press just completed");
        longPressCompletedRef.current = false;
        return;
      }
      const textSelection = window.getSelection();
      if (textSelection && !textSelection.isCollapsed && textSelection.toString().trim()) {
        log("click SKIPPED - text selection active");
        return;
      }
      if (isInteractiveElement(target)) {
        log("click SKIPPED - interactive element:", target.tagName);
        return;
      }
      if (shouldNeverSelect(target)) {
        log("click SKIPPED - shouldNeverSelect:", target.tagName);
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
  }, [callbacks, duration, movementThreshold, cancelPress, log]);
  return {
    get longPressJustCompleted() {
      return longPressCompletedRef.current;
    }
  };
}

// src/contexts/edit-mode.tsx
var import_react8 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var EditModeContext = (0, import_react8.createContext)(null);
function EditModeProvider({
  children,
  initialEditing = false,
  onCommit,
  autoSaveDelay = 1500,
  maxHistoryItems = 50
}) {
  const [isEditing, setIsEditing] = (0, import_react8.useState)(initialEditing);
  const [focusedKey, setFocusedKey] = (0, import_react8.useState)(null);
  const [pendingChanges, setPendingChanges] = (0, import_react8.useState)(/* @__PURE__ */ new Map());
  const [previousValues, setPreviousValues] = (0, import_react8.useState)(/* @__PURE__ */ new Map());
  const [history, setHistory] = (0, import_react8.useState)([]);
  const [historyIndex, setHistoryIndex] = (0, import_react8.useState)(-1);
  const autoSaveTimerRef = (0, import_react8.useRef)(null);
  (0, import_react8.useEffect)(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);
  const enableEditing = (0, import_react8.useCallback)(() => setIsEditing(true), []);
  const disableEditing = (0, import_react8.useCallback)(() => {
    setIsEditing(false);
    setFocusedKey(null);
    if (pendingChanges.size > 0) {
    }
  }, [pendingChanges.size]);
  const toggleEditing = (0, import_react8.useCallback)(() => setIsEditing((prev) => !prev), []);
  const recordChange = (0, import_react8.useCallback)(
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
  const commitChangesRef = (0, import_react8.useRef)(void 0);
  const commitChanges = (0, import_react8.useCallback)(() => {
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
  const discardChanges = (0, import_react8.useCallback)(() => {
    setPendingChanges(/* @__PURE__ */ new Map());
    setPreviousValues(/* @__PURE__ */ new Map());
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, []);
  const undo = (0, import_react8.useCallback)(() => {
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
  const redo = (0, import_react8.useCallback)(() => {
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
  const value = (0, import_react8.useMemo)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(EditModeContext.Provider, { value, children });
}
function useEditMode() {
  const context = (0, import_react8.useContext)(EditModeContext);
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
  const handleChange = (0, import_react8.useCallback)(
    (propName, newValue) => {
      recordChange(elementKey, propName, newValue);
    },
    [elementKey, recordChange]
  );
  const handleFocus = (0, import_react8.useCallback)(() => {
    setFocusedKey(elementKey);
  }, [elementKey, setFocusedKey]);
  const handleBlur = (0, import_react8.useCallback)(() => {
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
var import_jsx_runtime6 = require("react/jsx-runtime");
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
  const isDeepSelectionActive = (0, import_react9.useCallback)(
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
  (0, import_react9.useEffect)(() => {
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
  (0, import_react9.useEffect)(() => {
    return () => {
      selectedElementsRef.current.forEach((el) => {
        el.classList.remove("jsonui-deep-selected");
        el.removeAttribute("aria-selected");
      });
    };
  }, [selectedElementsRef]);
  (0, import_react9.useEffect)(() => {
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
  const value = (0, import_react9.useMemo)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(SelectionContext.Provider, { value, children });
}

// src/contexts/selection/hooks.ts
var import_react10 = require("react");
function useSelection() {
  const context = (0, import_react10.useContext)(SelectionContext);
  if (context === void 0) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}
function useItemSelection(elementKey) {
  const { isSelected, getSelectedItems, granularSelection } = useSelection();
  const isItemSelected2 = (0, import_react10.useCallback)(
    (itemId) => isSelected(elementKey, itemId),
    [elementKey, isSelected]
  );
  const selectedItems = (0, import_react10.useMemo)(
    () => getSelectedItems(elementKey),
    [elementKey, getSelectedItems]
  );
  const hasSelection = (0, import_react10.useMemo)(
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
var import_react11 = require("react");

// src/contexts/selection/SelectableItem.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function SelectableItem({
  elementKey,
  itemId,
  children,
  as: Component = "div",
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
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    Component,
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
var import_react15 = __toESM(require("react"));
var import_react_markdown = __toESM(require("react-markdown"));

// src/contexts/citation/index.ts
var import_react12 = require("react");
var import_react13 = require("react");
var CitationContext = (0, import_react12.createContext)(null);
function CitationProvider({ children }) {
  const [citations, setCitationsState] = (0, import_react12.useState)([]);
  const setCitations = (0, import_react12.useCallback)((newCitations) => {
    setCitationsState(newCitations);
  }, []);
  const addCitation = (0, import_react12.useCallback)((citation) => {
    setCitationsState((prev) => {
      if (prev.some((c) => c.id === citation.id)) return prev;
      return [...prev, citation];
    });
  }, []);
  const clearCitations = (0, import_react12.useCallback)(() => {
    setCitationsState([]);
  }, []);
  const getCitation = (0, import_react12.useCallback)(
    (id) => citations.find((c) => c.id === id),
    [citations]
  );
  (0, import_react12.useEffect)(() => {
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
  const value = (0, import_react12.useMemo)(
    () => ({
      citations,
      setCitations,
      addCitation,
      clearCitations,
      getCitation
    }),
    [citations, setCitations, addCitation, clearCitations, getCitation]
  );
  return (0, import_react13.createElement)(CitationContext.Provider, { value }, children);
}
function useCitations() {
  const context = (0, import_react12.useContext)(CitationContext);
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
var import_react14 = require("react");
var import_jsx_runtime8 = require("react/jsx-runtime");
var InlineCitation = (0, import_react14.memo)(function InlineCitation2({
  id,
  citation
}) {
  const [showPopover, setShowPopover] = (0, import_react14.useState)(false);
  const [popoverPosition, setPopoverPosition] = (0, import_react14.useState)(
    "bottom"
  );
  const buttonRef = (0, import_react14.useRef)(null);
  const popoverRef = (0, import_react14.useRef)(null);
  const updatePosition = (0, import_react14.useCallback)(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setPopoverPosition(spaceBelow < 200 ? "top" : "bottom");
  }, []);
  (0, import_react14.useEffect)(() => {
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
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
    if (isWebSource && !hasExcerpt) {
      window.open(citation.url, "_blank", "noopener,noreferrer");
    } else {
      updatePosition();
      setShowPopover(!showPopover);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { style: { position: "relative", display: "inline-block" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
    showPopover && hasExcerpt && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
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
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
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
                citation.pageNumber && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
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
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
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
          isWebSource && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
            "a",
            {
              href: citation.url,
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
var import_jsx_runtime9 = require("react/jsx-runtime");
function parseCitationMarkers(text2, getCitation) {
  const parts = text2.split(/(\[\d+\])/g);
  return parts.map((part, idx) => {
    const match = part.match(/\[(\d+)\]/);
    if (match) {
      const id = match[1];
      const citation = getCitation(id);
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(InlineCitation, { id, citation }, `cite-${idx}`);
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
  const styles = (0, import_react15.useMemo)(() => createStyles(theme), [theme]);
  const { getCitation, citations } = useCitations();
  const hasCitations = citations.length > 0;
  const components = (0, import_react15.useMemo)(
    () => ({
      // Images - responsive with high quality
      img: (props) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
      video: (props) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
      pre: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("pre", { style: styles.codeBlock, children }),
      code: ({
        children,
        className: codeClassName
      }) => {
        const isInline = !codeClassName;
        if (isInline) {
          return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("code", { style: styles.inlineCode, children });
        }
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("code", { children });
      },
      // Links
      a: ({ href, children }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "a",
        {
          href,
          target: "_blank",
          rel: "noopener noreferrer",
          style: styles.link,
          children
        }
      ),
      // Lists
      ul: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("ul", { style: styles.list, children }),
      ol: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
      li: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { style: styles.listItem, children }),
      // Headings
      h1: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h1", { style: { ...styles.headingBase, fontSize: 18 }, children }),
      h2: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h2", { style: { ...styles.headingBase, fontSize: 16 }, children }),
      h3: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { style: { ...styles.headingBase, fontSize: 15 }, children }),
      h4: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h4", { style: { ...styles.headingBase, fontSize: 14 }, children }),
      h5: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h5", { style: { ...styles.headingBase, fontSize: 13 }, children }),
      h6: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h6", { style: { ...styles.headingBase, fontSize: 12 }, children }),
      // Paragraphs - with citation parsing
      p: ({ children }) => {
        const processedChildren = hasCitations ? import_react15.default.Children.map(children, (child) => {
          if (typeof child === "string") {
            return parseCitationMarkers(child, getCitation);
          }
          return child;
        }) : children;
        return inline ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: processedChildren }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { style: styles.paragraph, children: processedChildren });
      },
      // Blockquotes
      blockquote: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("blockquote", { style: styles.blockquote, children }),
      // Horizontal rules
      hr: () => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("hr", { style: styles.hr }),
      // Strong/Bold - with citation parsing
      strong: ({ children }) => {
        const processedChildren = hasCitations ? import_react15.default.Children.map(children, (child) => {
          if (typeof child === "string") {
            return parseCitationMarkers(child, getCitation);
          }
          return child;
        }) : children;
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("strong", { style: { fontWeight: 600 }, children: processedChildren });
      },
      // Emphasis/Italic - with citation parsing
      em: ({ children }) => {
        const processedChildren = hasCitations ? import_react15.default.Children.map(children, (child) => {
          if (typeof child === "string") {
            return parseCitationMarkers(child, getCitation);
          }
          return child;
        }) : children;
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("em", { style: { fontStyle: "italic" }, children: processedChildren });
      }
    }),
    [styles, inline, hasCitations, getCitation]
  );
  const Wrapper = inline ? "span" : "div";
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Wrapper, { className, style, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_react_markdown.default, { components, children: content }) });
}

// src/contexts/markdown/provider.tsx
var import_react16 = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
var MarkdownContext = (0, import_react16.createContext)(null);
function MarkdownProvider({
  children,
  enabled = true,
  theme: themeOverrides
}) {
  const theme = (0, import_react16.useMemo)(
    () => ({ ...defaultTheme, ...themeOverrides }),
    [themeOverrides]
  );
  const renderText = (0, import_react16.useMemo)(() => {
    return (content, options = {}) => {
      if (!content) return null;
      if (!enabled) {
        if (options.inline) {
          return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: options.className, style: options.style, children: content });
        }
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: options.className, style: options.style, children: content });
      }
      return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
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
  const value = (0, import_react16.useMemo)(
    () => ({
      enabled,
      theme,
      renderText
    }),
    [enabled, theme, renderText]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(MarkdownContext.Provider, { value, children });
}
var fallbackRenderText = (content, options = {}) => {
  if (!content) return null;
  if (options.inline) {
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: options.className, style: options.style, children: content });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: options.className, style: options.style, children: content });
};
var fallbackContextValue = {
  enabled: false,
  theme: defaultTheme,
  renderText: fallbackRenderText
};
function useMarkdown() {
  const context = (0, import_react16.useContext)(MarkdownContext);
  return context ?? fallbackContextValue;
}
function useRenderText() {
  const { renderText } = useMarkdown();
  return renderText;
}

// src/contexts/ai-settings.tsx
var import_react17 = require("react");

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
var import_jsx_runtime11 = require("react/jsx-runtime");
var AISettingsContext = (0, import_react17.createContext)(null);
function AISettingsProvider({
  children,
  initialSettings
}) {
  const [settings, setSettings] = (0, import_react17.useState)(() => {
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
  const [isLoading, setIsLoading] = (0, import_react17.useState)(true);
  const [isSyncing, setIsSyncing] = (0, import_react17.useState)(false);
  const syncTimeoutRef = (0, import_react17.useRef)(null);
  (0, import_react17.useEffect)(() => {
    fetchSettingsFromAPI().then((apiSettings) => {
      if (apiSettings) {
        setSettings(apiSettings);
        saveSettings(apiSettings);
      }
      setIsLoading(false);
    });
  }, []);
  const syncToAPI = (0, import_react17.useCallback)((newSettings) => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = setTimeout(async () => {
      setIsSyncing(true);
      await saveSettingsToAPI(newSettings);
      setIsSyncing(false);
    }, 500);
  }, []);
  const updateAndSync = (0, import_react17.useCallback)(
    (newSettings, changedPart) => {
      setSettings(newSettings);
      saveSettings(newSettings);
      syncToAPI(changedPart);
    },
    [syncToAPI]
  );
  const updateSettings = (0, import_react17.useCallback)(
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
  const setProactivityMode = (0, import_react17.useCallback)(
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
  const setProactivityEnabled = (0, import_react17.useCallback)(
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
  const setSuggestionsEnabled = (0, import_react17.useCallback)(
    (enabled) => {
      const change = { suggestions: { ...settings.suggestions, enabled } };
      updateAndSync({ ...settings, ...change }, change);
    },
    [settings, updateAndSync]
  );
  const setDataCollectionPreferForm = (0, import_react17.useCallback)(
    (preferForm) => {
      const change = {
        dataCollection: { ...settings.dataCollection, preferForm }
      };
      updateAndSync({ ...settings, ...change }, change);
    },
    [settings, updateAndSync]
  );
  const setSmartParsingEnabled = (0, import_react17.useCallback)(
    (enabled) => {
      const change = { documents: { smartParsingEnabled: enabled } };
      updateAndSync({ ...settings, ...change }, change);
    },
    [settings, updateAndSync]
  );
  const resetSettings = (0, import_react17.useCallback)(() => {
    setSettings(DEFAULT_EXTENDED_SETTINGS);
    saveSettings(DEFAULT_EXTENDED_SETTINGS);
    syncToAPI(DEFAULT_EXTENDED_SETTINGS);
  }, [syncToAPI]);
  const completeOnboarding = (0, import_react17.useCallback)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(AISettingsContext.Provider, { value, children });
}
function useAISettings() {
  const context = (0, import_react17.useContext)(AISettingsContext);
  if (!context) {
    throw new Error("useAISettings must be used within AISettingsProvider");
  }
  return context;
}
function useAISettingsOptional() {
  return (0, import_react17.useContext)(AISettingsContext);
}
function useIsProactivityEnabled() {
  const context = (0, import_react17.useContext)(AISettingsContext);
  if (!context) return true;
  return context.settings.proactivity.enabled && context.settings.proactivity.mode !== "disabled";
}
function useAreSuggestionsEnabled() {
  const context = (0, import_react17.useContext)(AISettingsContext);
  if (!context) return true;
  return context.settings.suggestions.enabled;
}
function useIsSmartParsingEnabled() {
  const context = (0, import_react17.useContext)(AISettingsContext);
  if (!context) return false;
  return context.settings.documents.smartParsingEnabled;
}

// src/contexts/action-tracking/provider.tsx
var import_react18 = require("react");

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
var import_jsx_runtime12 = require("react/jsx-runtime");
var ActionContext2 = (0, import_react18.createContext)(null);
function ActionProvider2({
  children,
  initialOptions
}) {
  const [options, setOptionsState] = (0, import_react18.useState)(() => ({
    ...DEFAULT_OPTIONS,
    ...initialOptions
  }));
  const [actions, setActions] = (0, import_react18.useState)([]);
  const [lastAction, setLastAction] = (0, import_react18.useState)(null);
  const subscribersRef = (0, import_react18.useRef)(
    /* @__PURE__ */ new Set()
  );
  const pendingActionsRef = (0, import_react18.useRef)([]);
  const timerRef = (0, import_react18.useRef)(null);
  const notifySubscribers = (0, import_react18.useCallback)((batch) => {
    subscribersRef.current.forEach((cb) => {
      try {
        cb(batch);
      } catch (e) {
        console.error("[ActionTracker] Subscriber error:", e);
      }
    });
  }, []);
  const tryFlush = (0, import_react18.useCallback)(() => {
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
  const scheduleFlush2 = (0, import_react18.useCallback)(
    (delayMs) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(tryFlush, delayMs);
    },
    [tryFlush]
  );
  const trackAction = (0, import_react18.useCallback)(
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
      scheduleFlush2(options.debounceMs ?? 2500);
    },
    [
      options.enabled,
      options.maxActionsInContext,
      options.debounceMs,
      scheduleFlush2
    ]
  );
  const clearActions = (0, import_react18.useCallback)(() => {
    setActions([]);
    setLastAction(null);
    pendingActionsRef.current = [];
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  const getActionsForContext = (0, import_react18.useCallback)(() => {
    return actions.slice(-(options.maxActionsInContext ?? 5));
  }, [actions, options.maxActionsInContext]);
  const onAction = (0, import_react18.useCallback)(
    (callback) => {
      subscribersRef.current.add(callback);
      return () => subscribersRef.current.delete(callback);
    },
    []
  );
  const setOptions = (0, import_react18.useCallback)(
    (newOptions) => {
      setOptionsState((prev) => ({ ...prev, ...newOptions }));
    },
    []
  );
  (0, import_react18.useEffect)(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  (0, import_react18.useEffect)(() => {
    if (typeof document === "undefined") return;
    let focusOutTimeout = null;
    const handleFocusOut = (e) => {
      const target = e.target;
      const tag = target?.tagName?.toLowerCase();
      const isEditable = tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable;
      if (!isEditable) return;
      focusOutTimeout = setTimeout(() => {
        if (!isUserCurrentlyEditing() && pendingActionsRef.current.length > 0) {
          scheduleFlush2(options.debounceMs ?? 2500);
        }
      }, 100);
    };
    document.addEventListener("focusout", handleFocusOut, true);
    return () => {
      document.removeEventListener("focusout", handleFocusOut, true);
      if (focusOutTimeout) clearTimeout(focusOutTimeout);
    };
  }, [options.debounceMs, scheduleFlush2]);
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
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ActionContext2.Provider, { value, children });
}

// src/contexts/action-tracking/hooks.ts
var import_react19 = require("react");
function useActionContext() {
  const context = (0, import_react19.useContext)(ActionContext2);
  if (!context) {
    throw new Error("useActionContext must be used within ActionProvider");
  }
  return context;
}
function useElementActionTracker(elementKey, elementType) {
  const { trackAction, options } = useActionContext();
  const track = (0, import_react19.useCallback)(
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
  (0, import_react19.useEffect)(() => {
    return onAction(callback);
  }, [onAction, ...deps]);
}

// src/contexts/autosave.tsx
var import_react20 = __toESM(require("react"));
var import_jsx_runtime13 = require("react/jsx-runtime");
var AutoSaveContext = (0, import_react20.createContext)(null);
var DEFAULT_DEBOUNCE_MS = 1500;
function AutoSaveProvider({
  children,
  chatId,
  enabled = true,
  saveEndpoint = "/api/domain/save",
  onSaveComplete,
  onSaveError
}) {
  const debounceTimersRef = (0, import_react20.useRef)(/* @__PURE__ */ new Map());
  const pendingRef = (0, import_react20.useRef)(/* @__PURE__ */ new Map());
  const autoSave = (0, import_react20.useCallback)(
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
  const debouncedAutoSave = (0, import_react20.useCallback)(
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
  const value = (0, import_react20.useMemo)(
    () => ({
      chatId,
      autoSave,
      debouncedAutoSave,
      isEnabled: Boolean(chatId && enabled)
    }),
    [chatId, autoSave, debouncedAutoSave, enabled]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(AutoSaveContext.Provider, { value, children });
}
function useAutoSave() {
  const context = (0, import_react20.useContext)(AutoSaveContext);
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
  const mountedRef = (0, import_react20.useRef)(false);
  const lastDataRef = (0, import_react20.useRef)(null);
  import_react20.default.useEffect(() => {
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

// src/contexts/tool-progress.tsx
var import_react21 = require("react");
var import_shallow2 = require("zustand/react/shallow");
var import_jsx_runtime14 = require("react/jsx-runtime");
var ToolProgressContext = (0, import_react21.createContext)(
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
  const addProgress = (0, import_react21.useCallback)(
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
  const updateProgress = (0, import_react21.useCallback)(
    (toolCallId, updates) => {
      updateProgressEvent(toolCallId, updates);
    },
    [updateProgressEvent]
  );
  const clearProgress = (0, import_react21.useCallback)(() => {
    clearProgressEvents();
  }, [clearProgressEvents]);
  const clearCompletedOlderThan = (0, import_react21.useCallback)(
    (ms) => {
      clearCompletedProgressOlderThan(ms);
    },
    [clearCompletedProgressOlderThan]
  );
  (0, import_react21.useEffect)(() => {
    if (autoClearCompleteMs <= 0) return;
    const interval = setInterval(() => {
      clearCompletedOlderThan(autoClearCompleteMs);
    }, 1e3);
    return () => clearInterval(interval);
  }, [autoClearCompleteMs, clearCompletedOlderThan]);
  const activeProgress = getActiveProgress();
  const toolRunning = isToolRunning();
  const value = (0, import_react21.useMemo)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(ToolProgressContext.Provider, { value, children });
}
function useToolProgress() {
  const context = (0, import_react21.useContext)(ToolProgressContext);
  if (!context) {
    throw new Error(
      "useToolProgress must be used within a ToolProgressProvider"
    );
  }
  return context;
}
function useToolProgressOptional() {
  return (0, import_react21.useContext)(ToolProgressContext);
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
    (0, import_shallow2.useShallow)(
      (s) => s.progressEvents.filter(
        (e) => e.status === "starting" || e.status === "progress"
      )
    )
  );
}

// src/contexts/unified-progress.tsx
var import_react22 = require("react");
var import_shallow3 = require("zustand/react/shallow");
var import_jsx_runtime15 = require("react/jsx-runtime");
var UnifiedProgressContext = (0, import_react22.createContext)(null);
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
  const progressEvents = useStore((0, import_shallow3.useShallow)((s) => s.progressEvents));
  const items = (0, import_react22.useMemo)(() => {
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
  const activeItems = (0, import_react22.useMemo)(
    () => items.filter((item) => item.status === "running"),
    [items]
  );
  const isGenerating = (0, import_react22.useMemo)(() => {
    if (planExecution.isOrchestrating) return true;
    return progressEvents.some(
      (p) => p.status === "starting" || p.status === "progress"
    );
  }, [planExecution.isOrchestrating, progressEvents]);
  const goal = planExecution.plan?.goal ?? null;
  const overallProgress = (0, import_react22.useMemo)(() => {
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
  const elapsedTime = (0, import_react22.useMemo)(() => {
    if (!planExecution.orchestrationStartTime) return null;
    if (!planExecution.isOrchestrating) return null;
    return Date.now() - planExecution.orchestrationStartTime;
  }, [planExecution.orchestrationStartTime, planExecution.isOrchestrating]);
  const getItem = (0, import_react22.useCallback)(
    (id) => items.find((item) => item.id === id),
    [items]
  );
  const isItemRunning = (0, import_react22.useCallback)(
    (id) => {
      const item = items.find((i) => i.id === id);
      return item?.status === "running";
    },
    [items]
  );
  const value = (0, import_react22.useMemo)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(UnifiedProgressContext.Provider, { value, children });
}
function useUnifiedProgress() {
  const context = (0, import_react22.useContext)(UnifiedProgressContext);
  if (!context) {
    throw new Error(
      "useUnifiedProgress must be used within a UnifiedProgressProvider"
    );
  }
  return context;
}
function useUnifiedProgressOptional() {
  return (0, import_react22.useContext)(UnifiedProgressContext);
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
var import_react23 = require("react");

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
var import_jsx_runtime16 = require("react/jsx-runtime");
var InteractionTrackingContext = (0, import_react23.createContext)(null);
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
  const containerRef = (0, import_react23.useRef)(null);
  let isDeepSelectionActive;
  try {
    const selectionContext = useSelection();
    isDeepSelectionActive = selectionContext.isDeepSelectionActive;
  } catch {
  }
  (0, import_react23.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(InteractionTrackingContext.Provider, { value: onInteraction, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { ref: containerRef, style: { display: "contents" }, children }) });
}

// src/renderer/element-renderer.tsx
var import_react40 = __toESM(require("react"));

// src/components/ResizableWrapper.tsx
var import_react25 = __toESM(require("react"));

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
var import_react24 = require("react");
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
  const [state, setState] = (0, import_react24.useState)({
    width: initialWidth,
    height: initialHeight,
    isResizing: false,
    activeHandle: null
  });
  const [hasResized, setHasResized] = (0, import_react24.useState)(hasExplicitSize);
  const dragStart = (0, import_react24.useRef)({ x: 0, y: 0, width: 0, height: 0 });
  const containerRef = (0, import_react24.useRef)(null);
  const lastBreakpointRef = (0, import_react24.useRef)(null);
  (0, import_react24.useEffect)(() => {
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
  const startResize = (0, import_react24.useCallback)(
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
  const stopResize = (0, import_react24.useCallback)(() => {
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
  const reset = (0, import_react24.useCallback)(() => {
    setState({
      width: initialWidth,
      height: initialHeight,
      isResizing: false,
      activeHandle: null
    });
    setHasResized(hasExplicitSize);
  }, [initialWidth, initialHeight, hasExplicitSize]);
  (0, import_react24.useEffect)(() => {
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
var import_jsx_runtime17 = require("react/jsx-runtime");
function ResizeHandleComponent({
  position,
  onMouseDown,
  onTouchStart,
  isResizing,
  visible
}) {
  const [isHovered, setIsHovered] = import_react25.default.useState(false);
  const [isTouching, setIsTouching] = import_react25.default.useState(false);
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
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
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
  const wrapperRef = (0, import_react25.useRef)(null);
  const [isHovered, setIsHovered] = import_react25.default.useState(false);
  const layout = overrideLayout ?? element.layout;
  const resizableConfig = layout?.resizable;
  const isEnabled = overrideEnabled !== void 0 ? overrideEnabled : resizableConfig !== false;
  const normalizedConfig = resizableConfig === void 0 ? true : resizableConfig;
  const handleResizeEnd = (0, import_react25.useCallback)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_jsx_runtime17.Fragment, { children });
  }
  const handles = (0, import_react25.useMemo)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
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
        handles.map((handle) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
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
        state.isResizing && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "absolute bottom-2 right-2 px-2 py-1 bg-primary text-white text-[11px] font-medium rounded pointer-events-none z-11", children: [
          Math.round(state.width),
          " x ",
          Math.round(state.height)
        ] })
      ]
    }
  );
}

// src/components/SelectionWrapper.tsx
var import_react27 = require("react");

// src/components/LongPressIndicator.tsx
var import_react26 = require("react");
var import_react_dom = require("react-dom");
var import_jsx_runtime18 = require("react/jsx-runtime");
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
  const [mounted, setMounted] = (0, import_react26.useState)(false);
  const timerRef = (0, import_react26.useRef)(null);
  const startTimeRef = (0, import_react26.useRef)(0);
  const animationFrameRef = (0, import_react26.useRef)(null);
  const circleRef = (0, import_react26.useRef)(null);
  (0, import_react26.useEffect)(() => {
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
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
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
        children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
          "svg",
          {
            width: RING_SIZE,
            height: RING_SIZE,
            style: { transform: "rotate(-90deg)" },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
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
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
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
var import_jsx_runtime19 = require("react/jsx-runtime");
function SelectionWrapper({
  element,
  enabled,
  onSelect,
  delayMs,
  isSelected,
  children
}) {
  const [pressing, setPressing] = (0, import_react27.useState)(false);
  const [pressPosition, setPressPosition] = (0, import_react27.useState)(null);
  const startPositionRef = (0, import_react27.useRef)(null);
  const longPressCompletedRef = (0, import_react27.useRef)(false);
  const onSelectableItemRef = (0, import_react27.useRef)(false);
  const wrapperRef = (0, import_react27.useRef)(null);
  const { isEditing } = useEditMode();
  let isDeepSelectionActive;
  try {
    const selectionContext = useSelection();
    isDeepSelectionActive = selectionContext.isDeepSelectionActive;
  } catch {
    isDeepSelectionActive = () => typeof document !== "undefined" && document.__jsonuiDeepSelectionActive === true;
  }
  const handleComplete = (0, import_react27.useCallback)(() => {
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
  const handleCancel = (0, import_react27.useCallback)(() => {
    setPressing(false);
    setPressPosition(null);
    startPositionRef.current = null;
  }, []);
  const handlePointerDown = (0, import_react27.useCallback)(
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
  const handlePointerUp = (0, import_react27.useCallback)(
    (_event) => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("select-none");
      }
      handleCancel();
    },
    [handleCancel]
  );
  const handlePointerMove = (0, import_react27.useCallback)(
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
  const handleClickCapture = (0, import_react27.useCallback)(
    (event) => {
      if (longPressCompletedRef.current) {
        longPressCompletedRef.current = false;
        event.preventDefault();
        event.stopPropagation();
      }
    },
    []
  );
  (0, import_react27.useEffect)(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.userSelect = "";
        document.body.style.webkitUserSelect = "";
      }
      setPressing(false);
      setPressPosition(null);
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
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
        pressing && pressPosition && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
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

// src/components/EditableWrapper.tsx
var import_react39 = __toESM(require("react"));

// src/hooks/useUIStream.ts
var import_react30 = require("react");
var import_shallow4 = require("zustand/shallow");

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
      current[segment] = {};
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
    if (parent && parent.children) {
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
    if (current && current.children) {
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
function applyPatch(tree, patch, options = {}) {
  const { turnId, protectedTypes = [] } = options;
  const newTree = { ...tree, elements: { ...tree.elements } };
  switch (patch.op) {
    case "set":
    case "add":
    case "replace": {
      if (patch.path === "/root") {
        newTree.root = patch.value;
        return newTree;
      }
      if (patch.path.startsWith("/elements/")) {
        const pathParts = patch.path.slice("/elements/".length).split("/");
        const elementKey = pathParts[0];
        if (!elementKey) return newTree;
        if (pathParts.length === 1) {
          const element = patch.value;
          const newElement = turnId ? {
            ...element,
            _meta: { ...element._meta, turnId, createdAt: Date.now() }
          } : element;
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
                _meta: { turnId, createdAt: Date.now(), autoCreated: true }
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
            patch.value
          );
          if (propPath.startsWith("/children") && typeof patch.value === "string") {
            const childKey = patch.value;
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
          const updatedElement = turnId ? {
            ...newElement,
            _meta: {
              ...newElement._meta,
              turnId,
              lastModifiedAt: Date.now()
            }
          } : newElement;
          newTree.elements[elementKey] = updatedElement;
        }
      }
      break;
    }
    case "remove": {
      if (patch.path === "/root") {
        newTree.root = "";
        return newTree;
      }
      if (patch.path.startsWith("/elements/")) {
        const pathParts = patch.path.slice("/elements/".length).split("/");
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
      if (patch.path.startsWith("/elements/")) {
        const pathParts = patch.path.slice("/elements/".length).split("/");
        const elementKey = pathParts[0];
        if (!elementKey) return newTree;
        if (pathParts.length === 1 && !newTree.elements[elementKey]) {
          const newElement = patch.value;
          if (turnId && newElement._meta) {
            newElement._meta.turnId = turnId;
          } else if (turnId) {
            newElement._meta = { turnId };
          }
          ensureChildrenExist(
            newTree.elements,
            newElement.children,
            createPlaceholder,
            turnId
          );
          newTree.elements[elementKey] = newElement;
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
  for (const patch of rootPatches) {
    newTree = applyPatch(newTree, patch, options);
  }
  for (const patch of elementPatches) {
    newTree = applyPatch(newTree, patch, options);
  }
  for (const patch of propPatches) {
    newTree = applyPatch(newTree, patch, options);
  }
  for (const patch of otherPatches) {
    newTree = applyPatch(newTree, patch, options);
  }
  return newTree;
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
var import_react28 = require("react");
function useHistory(tree, conversation, setTree, setConversation, treeRef) {
  const [history, setHistory] = (0, import_react28.useState)([]);
  const [historyIndex, setHistoryIndex] = (0, import_react28.useState)(-1);
  const pushHistory = (0, import_react28.useCallback)(() => {
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
  const undo = (0, import_react28.useCallback)(() => {
    if (historyIndex < 0) return;
    const snapshot = history[historyIndex];
    if (snapshot) {
      setTree(snapshot.tree);
      treeRef.current = snapshot.tree;
      setConversation(snapshot.conversation);
      setHistoryIndex((prev) => prev - 1);
    }
  }, [history, historyIndex, setTree, setConversation, treeRef]);
  const redo = (0, import_react28.useCallback)(() => {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    const snapshot = history[nextIndex];
    if (!snapshot) return;
    setTree(snapshot.tree);
    treeRef.current = snapshot.tree;
    setConversation(snapshot.conversation);
    setHistoryIndex(nextIndex);
  }, [history, historyIndex, setTree, setConversation, treeRef]);
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
var LOG_ENDPOINT = "/api/debug-log";
var LOG_BUFFER = [];
var flushTimer = null;
function formatLog(level, message, data) {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const dataStr = data ? `
  DATA: ${JSON.stringify(data, null, 2).replace(/\n/g, "\n  ")}` : "";
  return `[${timestamp}] [${level}] [useUIStream] ${message}${dataStr}`;
}
function flushLogs() {
  if (!DEBUG || LOG_BUFFER.length === 0) return;
  const logs = LOG_BUFFER.splice(0, LOG_BUFFER.length);
  if (typeof window !== "undefined") {
    fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs })
    }).catch(() => {
    });
  }
}
function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushLogs();
  }, 500);
}
var streamLog = {
  debug: (msg, data) => {
    if (!DEBUG) return;
    LOG_BUFFER.push(formatLog("DEBUG", msg, data));
    scheduleFlush();
  },
  info: (msg, data) => {
    if (!DEBUG) return;
    LOG_BUFFER.push(formatLog("INFO", msg, data));
    scheduleFlush();
  },
  warn: (msg, data) => {
    if (!DEBUG) return;
    LOG_BUFFER.push(formatLog("WARN", msg, data));
    scheduleFlush();
  },
  error: (msg, data) => {
    if (!DEBUG) return;
    console.error(`[useUIStream] ${msg}`, data ?? "");
    LOG_BUFFER.push(formatLog("ERROR", msg, data));
    scheduleFlush();
  }
};

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
    const assistantContent = turn.assistantMessages.filter((m) => m.type === "text" && m.text).map((m) => m.text).join("\n");
    if (assistantContent) {
      messages.push({ role: "assistant", content: assistantContent });
    }
  }
  return messages;
}
function buildRequest(input) {
  const { prompt, context, currentTree, conversation, attachments } = input;
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
  headers["Content-Type"] = "application/json";
  return { body: JSON.stringify(bodyPayload), headers };
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
var import_react29 = require("react");
function useStoreRefs() {
  const storeSetUITree = useStore((s) => s.setUITree);
  const storeClearUITree = useStore((s) => s.clearUITree);
  const storeSetTreeStreaming = useStore((s) => s.setTreeStreaming);
  const storeBumpTreeVersion = useStore((s) => s.bumpTreeVersion);
  const addProgressEvent = useStore((s) => s.addProgressEvent);
  const setPlanCreated = useStore((s) => s.setPlanCreated);
  const setStepStarted = useStore((s) => s.setStepStarted);
  const setStepDone = useStore((s) => s.setStepDone);
  const setSubtaskStarted = useStore((s) => s.setSubtaskStarted);
  const setSubtaskDone = useStore((s) => s.setSubtaskDone);
  const setLevelStarted = useStore((s) => s.setLevelStarted);
  const setOrchestrationDone = useStore((s) => s.setOrchestrationDone);
  const resetPlanExecution = useStore((s) => s.resetPlanExecution);
  const addProgressRef = (0, import_react29.useRef)(addProgressEvent);
  (0, import_react29.useEffect)(() => {
    addProgressRef.current = addProgressEvent;
  }, [addProgressEvent]);
  const storeRef = (0, import_react29.useRef)({
    setUITree: storeSetUITree,
    bumpTreeVersion: storeBumpTreeVersion,
    setTreeStreaming: storeSetTreeStreaming,
    clearUITree: storeClearUITree
  });
  (0, import_react29.useEffect)(() => {
    storeRef.current = {
      setUITree: storeSetUITree,
      bumpTreeVersion: storeBumpTreeVersion,
      setTreeStreaming: storeSetTreeStreaming,
      clearUITree: storeClearUITree
    };
  }, [storeSetUITree, storeBumpTreeVersion, storeSetTreeStreaming, storeClearUITree]);
  const planStoreRef = (0, import_react29.useRef)({
    setPlanCreated,
    setStepStarted,
    setStepDone,
    setSubtaskStarted,
    setSubtaskDone,
    setLevelStarted,
    setOrchestrationDone
  });
  (0, import_react29.useEffect)(() => {
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
  const storeSetUITreeRef = (0, import_react29.useRef)(storeSetUITree);
  (0, import_react29.useEffect)(() => {
    storeSetUITreeRef.current = storeSetUITree;
  }, [storeSetUITree]);
  return {
    storeRef,
    planStoreRef,
    addProgressRef,
    storeSetUITreeRef,
    resetPlanExecution
  };
}

// src/hooks/ui-stream/turn-manager.ts
function createPendingTurn(prompt, options = {}) {
  const { isProactive = false, attachments } = options;
  return {
    id: `turn-${Date.now()}`,
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

// src/hooks/ui-stream/stream-parser.ts
function parseSSELine(line) {
  if (!line) return null;
  const colIdx = line.indexOf(":");
  if (colIdx === -1) return null;
  const lineType = line.slice(0, colIdx);
  const content = line.slice(colIdx + 1);
  if (lineType !== "d" && lineType !== "data") {
    return null;
  }
  if (content.trim() === "[DONE]") {
    streamLog.debug("Stream DONE received");
    return { type: "done" };
  }
  try {
    const data = JSON.parse(content);
    const payload = data?.type === "data" ? data.data : data;
    return parsePayload(payload);
  } catch {
    streamLog.warn("Failed to parse SSE line", { content: content.slice(0, 100) });
    return null;
  }
}
function parsePayload(payload) {
  if (!payload) return null;
  if (payload.type === "streaming-started") {
    return { type: "streaming-started", timestamp: payload.timestamp };
  }
  if (payload.type === "text-delta") {
    return { type: "text-delta" };
  }
  if (payload.type === "plan-created") {
    return { type: "plan-created", plan: payload.plan };
  }
  if (payload.type === "persisted-attachments") {
    return { type: "persisted-attachments", attachments: payload.attachments };
  }
  if (payload.type === "tool-progress") {
    return {
      type: "tool-progress",
      progress: {
        toolName: payload.toolName,
        toolCallId: payload.toolCallId,
        status: payload.status,
        message: payload.message,
        data: payload.data
      }
    };
  }
  if (payload.type === "document-index-ui") {
    return { type: "document-index-ui", uiComponent: payload.uiComponent };
  }
  if (payload.type === "level-started") {
    return { type: "level-started", level: payload.level };
  }
  if (payload.type === "step-started") {
    return { type: "step-started", stepId: payload.stepId };
  }
  if (payload.type === "subtask-started") {
    return {
      type: "subtask-started",
      parentId: payload.parentId,
      stepId: payload.stepId
    };
  }
  if (payload.type === "subtask-done") {
    return {
      type: "subtask-done",
      parentId: payload.parentId,
      stepId: payload.stepId,
      result: payload.result
    };
  }
  if (payload.type === "step-done") {
    return {
      type: "step-done",
      stepId: payload.stepId,
      result: payload.result
    };
  }
  if (payload.type === "level-completed") {
    return { type: "level-completed", level: payload.level };
  }
  if (payload.type === "orchestration-done") {
    return { type: "orchestration-done", finalResult: payload.finalResult };
  }
  if (payload.type === "citations") {
    return { type: "citations", citations: payload.citations };
  }
  if (payload.op) {
    const { op, path, value } = payload;
    if (op === "message") {
      const content = payload.content || value;
      if (content) {
        return {
          type: "message",
          message: {
            role: payload.role || "assistant",
            content
          }
        };
      }
    }
    if (op === "question") {
      const question = value || payload.question;
      if (question) {
        return { type: "question", question };
      }
    }
    if (op === "suggestion") {
      const suggestions = value || payload.suggestions;
      if (Array.isArray(suggestions)) {
        return { type: "suggestion", suggestions };
      }
    }
    if (op === "tool-progress") {
      return {
        type: "tool-progress",
        progress: {
          toolName: payload.toolName,
          toolCallId: payload.toolCallId,
          status: payload.status,
          message: payload.message,
          data: payload.data
        }
      };
    }
    if (path) {
      return {
        type: "patch",
        patch: { op, path, value }
      };
    }
  }
  return { type: "unknown", payload };
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

// src/hooks/ui-stream/patch-processor.ts
var PATCH_FLUSH_INTERVAL_MS = 100;
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
  for (const index of path) {
    if (!node.childNodes[index]) return null;
    node = node.childNodes[index];
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
  }
}

// src/hooks/useUIStream.ts
function useUIStream({
  api,
  onComplete,
  onError,
  getHeaders,
  getChatId,
  onBackgroundComplete
}) {
  const { storeTree, treeVersion } = useStore(
    (0, import_shallow4.useShallow)((s) => ({
      storeTree: s.uiTree,
      treeVersion: s.treeVersion
    }))
  );
  const { storeRef, planStoreRef, addProgressRef, storeSetUITreeRef, resetPlanExecution } = useStoreRefs();
  const tree = (0, import_react30.useMemo)(() => {
    if (!storeTree) return null;
    return { ...storeTree, elements: { ...storeTree.elements } };
  }, [storeTree, treeVersion]);
  const [conversation, setConversation] = (0, import_react30.useState)([]);
  const treeRef = (0, import_react30.useRef)(null);
  (0, import_react30.useEffect)(() => {
    treeRef.current = tree;
  }, [tree, treeVersion]);
  const setTree = (0, import_react30.useCallback)((newTree) => {
    if (typeof newTree === "function") {
      const updatedTree = newTree(treeRef.current);
      treeRef.current = updatedTree;
      storeSetUITreeRef.current(updatedTree);
    } else {
      treeRef.current = newTree;
      storeSetUITreeRef.current(newTree);
    }
  }, [storeSetUITreeRef]);
  const {
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    setHistory,
    setHistoryIndex
  } = useHistory(tree, conversation, setTree, setConversation, treeRef);
  (0, import_react30.useEffect)(() => {
    treeRef.current = tree;
  }, [tree]);
  const [isStreaming, setIsStreaming] = (0, import_react30.useState)(false);
  const [error, setError] = (0, import_react30.useState)(null);
  const abortControllersRef = (0, import_react30.useRef)(/* @__PURE__ */ new Map());
  const sendingRef = (0, import_react30.useRef)(false);
  const clear = (0, import_react30.useCallback)(() => {
    setTree(null);
    setConversation([]);
    treeRef.current = null;
    setError(null);
    resetPlanExecution();
    storeRef.current.clearUITree();
  }, [resetPlanExecution, setTree, storeRef]);
  const loadSession = (0, import_react30.useCallback)(
    (session) => {
      setTree(session.tree);
      treeRef.current = session.tree;
      setConversation(session.conversation);
      setHistory([]);
      setHistoryIndex(-1);
    },
    [setTree, setHistory, setHistoryIndex]
  );
  const removeElement = (0, import_react30.useCallback)(
    (key) => {
      pushHistory();
      setTree((prev) => prev ? removeElementFromTree(prev, key) : null);
    },
    [pushHistory, setTree]
  );
  const removeSubItems = (0, import_react30.useCallback)(
    (elementKey, identifiers) => {
      if (identifiers.length === 0) return;
      pushHistory();
      setTree(
        (prev) => prev ? removeSubItemsFromTree(prev, elementKey, identifiers) : null
      );
    },
    [pushHistory, setTree]
  );
  const updateElement = (0, import_react30.useCallback)(
    (elementKey, updates) => {
      setTree(
        (prev) => prev ? updateElementInTree(prev, elementKey, updates) : null
      );
    },
    [setTree]
  );
  const updateElementLayout = (0, import_react30.useCallback)(
    (elementKey, layoutUpdates) => {
      pushHistory();
      setTree(
        (prev) => prev ? updateElementLayoutInTree(prev, elementKey, layoutUpdates) : null
      );
    },
    [pushHistory, setTree]
  );
  const send = (0, import_react30.useCallback)(
    async (prompt, context, attachments) => {
      const chatId = context?.chatId ?? getChatId?.();
      if (sendingRef.current) {
        streamLog.warn("Ignoring concurrent send", {
          prompt: prompt.slice(0, 100)
        });
        return;
      }
      sendingRef.current = true;
      streamLog.info("Starting send", {
        promptLength: prompt.length,
        hasContext: !!context,
        attachmentCount: attachments?.length ?? 0,
        chatId
      });
      if (abortControllersRef.current.size > 0) {
        abortControllersRef.current.forEach((controller) => controller.abort());
        abortControllersRef.current.clear();
      }
      const abortController = new AbortController();
      const abortKey = chatId ?? "default";
      abortControllersRef.current.set(abortKey, abortController);
      const signal = abortController.signal;
      setIsStreaming(true);
      setError(null);
      let currentTree = treeRef.current ? JSON.parse(JSON.stringify(treeRef.current)) : { root: "", elements: {} };
      if (!treeRef.current) {
        streamLog.debug("Initializing empty tree");
        setTree(currentTree);
        treeRef.current = currentTree;
      }
      const isProactive = context?.hideUserMessage === true;
      const pendingTurn = createPendingTurn(prompt, { isProactive, attachments });
      const turnId = pendingTurn.id;
      streamLog.debug("Creating turn", { turnId, isProactive, userMessage: prompt.slice(0, 50) });
      setConversation((prev) => {
        const updated = [...prev, pendingTurn];
        streamLog.debug("Conversation updated", {
          prevLength: prev.length,
          newLength: updated.length,
          pendingTurnId: pendingTurn.id,
          userMessage: pendingTurn.userMessage?.slice(0, 50)
        });
        return updated;
      });
      let patchBuffer = [];
      let patchFlushTimer = null;
      try {
        const fileAttachments = attachments?.filter(isFileAttachment2) ?? [];
        if (fileAttachments.length > 0) {
          streamLog.debug("Uploading attachments", {
            count: fileAttachments.length,
            files: fileAttachments.map((att) => ({
              name: att.file.name,
              type: att.file.type,
              size: att.file.size
            }))
          });
        }
        const { body, headers } = buildRequest({
          prompt,
          context,
          currentTree,
          conversation,
          attachments
        });
        if (getHeaders) {
          const dynamicHeaders = await getHeaders();
          Object.assign(headers, dynamicHeaders);
        }
        streamLog.info("Sending request to API", { api, hasAuth: !!getHeaders });
        const response = await fetch(api, {
          method: "POST",
          headers,
          body,
          signal
        });
        streamLog.debug("Response received", { status: response.status, ok: response.ok });
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        if (!response.body) {
          throw new Error("No response body");
        }
        const reader = response.body.getReader();
        const currentMessages = [];
        const currentQuestions = [];
        const currentSuggestions = [];
        const currentToolProgress = [];
        const currentPersistedAttachments = [];
        let currentDocumentIndex = void 0;
        let patchCount = 0;
        let messageCount = 0;
        setConversation(
          (prev) => prev.map(
            (t) => t.id === turnId ? { ...t, status: "streaming" } : t
          )
        );
        const updateTurnData = () => {
          setConversation(
            (prev) => prev.map(
              (t) => t.id === turnId ? {
                ...t,
                assistantMessages: [...currentMessages],
                questions: [...currentQuestions],
                suggestions: [...currentSuggestions],
                toolProgress: [...currentToolProgress],
                persistedAttachments: currentPersistedAttachments.length > 0 ? [...currentPersistedAttachments] : t.persistedAttachments,
                documentIndex: currentDocumentIndex ?? t.documentIndex
              } : t
            )
          );
        };
        streamLog.debug("Starting stream processing");
        for await (const event of readStreamWithTimeout(reader)) {
          try {
            if (event.type === "done" || event.type === "text-delta") {
              continue;
            }
            if (event.type === "message") {
              messageCount++;
              streamLog.debug("Message received", { messageCount, contentLength: event.message.content?.length ?? 0 });
              currentMessages.push(event.message);
              updateTurnData();
            } else if (event.type === "question") {
              currentQuestions.push(event.question);
              updateTurnData();
            } else if (event.type === "suggestion") {
              currentSuggestions.push(...event.suggestions);
              updateTurnData();
            } else if (event.type === "tool-progress") {
              currentToolProgress.push(event.progress);
              updateTurnData();
              addProgressRef.current({
                toolCallId: event.progress.toolCallId,
                toolName: event.progress.toolName,
                status: event.progress.status,
                message: event.progress.message,
                data: event.progress.data
              });
            } else if (event.type === "patch") {
              patchCount++;
              patchBuffer.push(event.patch);
              if (!patchFlushTimer) {
                patchFlushTimer = setTimeout(() => {
                  patchFlushTimer = null;
                  if (patchBuffer.length > 0) {
                    streamLog.debug("Flushing patches", { count: patchBuffer.length });
                    const baseTree = treeRef.current ?? currentTree;
                    const protectedTypes = context?.forceCanvasMode === true ? ["Canvas"] : [];
                    const updatedTree = applyPatchesBatch(
                      baseTree,
                      patchBuffer,
                      { turnId, protectedTypes }
                    );
                    patchBuffer = [];
                    treeRef.current = updatedTree;
                    currentTree = updatedTree;
                    const savedSel = saveSelection();
                    const store = storeRef.current;
                    store.setUITree({
                      root: updatedTree.root,
                      elements: { ...updatedTree.elements }
                    });
                    store.bumpTreeVersion();
                    if (savedSel) {
                      requestAnimationFrame(() => restoreSelection(savedSel));
                    }
                    streamLog.debug("Tree updated", {
                      elementCount: Object.keys(updatedTree.elements).length
                    });
                  }
                }, PATCH_FLUSH_INTERVAL_MS);
              }
            } else if (event.type === "plan-created" || event.type === "step-started" || event.type === "step-done" || event.type === "subtask-started" || event.type === "subtask-done" || event.type === "level-started" || event.type === "level-completed" || event.type === "orchestration-done") {
              processPlanEvent(event, planStoreRef.current);
            } else if (event.type === "persisted-attachments") {
              currentPersistedAttachments.push(...event.attachments);
              updateTurnData();
            } else if (event.type === "document-index-ui") {
              const uiComponent = event.uiComponent;
              const updated = processDocumentIndex(uiComponent, currentDocumentIndex);
              if (updated) {
                currentDocumentIndex = updated;
                updateTurnData();
              }
            } else if (event.type === "citations") {
              if (Array.isArray(event.citations) && typeof window !== "undefined") {
                window.dispatchEvent(
                  new CustomEvent("onegenui:citations", {
                    detail: { citations: event.citations }
                  })
                );
              }
            }
          } catch (e) {
            streamLog.warn("Event processing error", {
              error: e instanceof Error ? e.message : String(e),
              eventType: event.type
            });
          }
        }
        streamLog.info("Stream completed", {
          totalPatches: patchCount,
          totalMessages: messageCount,
          treeElementCount: Object.keys(currentTree.elements).length
        });
        treeRef.current = currentTree;
        setTree({
          root: currentTree.root,
          elements: { ...currentTree.elements }
        });
        if (patchFlushTimer) {
          clearTimeout(patchFlushTimer);
          patchFlushTimer = null;
        }
        if (patchBuffer.length > 0) {
          streamLog.debug("Final patch flush", { count: patchBuffer.length });
          const baseTree = treeRef.current ?? currentTree;
          const protectedTypes = context?.forceCanvasMode === true ? ["Canvas"] : [];
          currentTree = applyPatchesBatch(baseTree, patchBuffer, { turnId, protectedTypes });
          patchBuffer = [];
          treeRef.current = currentTree;
          const store = storeRef.current;
          store.setUITree({
            root: currentTree.root,
            elements: { ...currentTree.elements }
          });
          store.bumpTreeVersion();
          streamLog.debug("Final tree state", {
            elementCount: Object.keys(currentTree.elements).length
          });
        }
        if (signal.aborted) {
          streamLog.warn("Request aborted before finalization");
          return;
        }
        streamLog.debug("Finalizing turn", { turnId });
        setConversation(
          (prev) => finalizeTurn(prev, turnId, {
            messages: currentMessages,
            questions: currentQuestions,
            suggestions: currentSuggestions,
            treeSnapshot: currentTree,
            documentIndex: currentDocumentIndex
          })
        );
        onComplete?.(currentTree);
      } catch (err) {
        if (patchFlushTimer) {
          clearTimeout(patchFlushTimer);
          patchFlushTimer = null;
        }
        patchBuffer = [];
        if (err.name === "AbortError") {
          streamLog.info("Request aborted", { turnId });
          setConversation((prev) => removeTurn(prev, turnId));
          return;
        }
        const error2 = err instanceof Error ? err : new Error(String(err));
        streamLog.error("Stream error", { error: error2.message, turnId });
        setError(error2);
        onError?.(error2);
        setConversation((prev) => markTurnFailed(prev, turnId, error2.message));
      } finally {
        sendingRef.current = false;
        abortControllersRef.current.clear();
        setIsStreaming(false);
        streamLog.debug("Send completed");
      }
    },
    [api, onComplete, onError, setTree, getChatId]
  );
  const answerQuestion = (0, import_react30.useCallback)(
    (turnId, questionId, answers) => {
      const turn = conversation.find((t) => t.id === turnId);
      const question = turn?.questions?.find((q) => q.id === questionId);
      const allPreviousAnswers = collectPreviousAnswers(conversation, turnId);
      setConversation((prev) => addQuestionAnswer(prev, turnId, questionId, answers));
      if (question) {
        const prompt = buildQuestionResponsePrompt(question.text, answers);
        const context = buildQuestionResponseContext(
          question,
          turnId,
          answers,
          allPreviousAnswers
        );
        send(prompt, context);
      }
    },
    [conversation, send]
  );
  (0, import_react30.useEffect)(() => {
    return () => {
      for (const controller of abortControllersRef.current.values()) {
        controller.abort();
      }
      abortControllersRef.current.clear();
    };
  }, []);
  const deleteTurn = (0, import_react30.useCallback)(
    (turnId) => {
      pushHistory();
      const result = rollbackToTurn(conversation, turnId);
      if (!result) return;
      const treeToRestore = result.restoredTree ?? { root: "", elements: {} };
      setTree(treeToRestore);
      treeRef.current = treeToRestore;
      setConversation(result.newConversation);
    },
    [conversation, pushHistory, setTree]
  );
  const editTurn = (0, import_react30.useCallback)(
    async (turnId, newMessage) => {
      pushHistory();
      const result = rollbackToTurn(conversation, turnId);
      if (!result) return;
      setTree(result.restoredTree);
      treeRef.current = result.restoredTree;
      setConversation(result.newConversation);
      await send(newMessage, result.restoredTree ? { tree: result.restoredTree } : void 0);
    },
    [conversation, send, pushHistory, setTree]
  );
  const abort = (0, import_react30.useCallback)(() => {
    abortControllersRef.current.forEach((controller) => controller.abort());
    abortControllersRef.current.clear();
    sendingRef.current = false;
    setIsStreaming(false);
  }, []);
  return {
    tree,
    conversation,
    isStreaming,
    error,
    send,
    clear,
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
var import_react31 = require("react");
function useTextSelection() {
  const getTextSelection = (0, import_react31.useCallback)(() => {
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
  const restoreTextSelection = (0, import_react31.useCallback)((range) => {
    if (typeof window === "undefined") return;
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);
  const clearTextSelection = (0, import_react31.useCallback)(() => {
    if (typeof window === "undefined") return;
    window.getSelection()?.removeAllRanges();
    document.dispatchEvent(new CustomEvent("jsonui-text-selection-cleared"));
  }, []);
  const hasTextSelection = (0, import_react31.useCallback)(() => {
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
var import_react32 = require("react");
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = (0, import_react32.useState)(false);
  (0, import_react32.useEffect)(() => {
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
var import_react33 = require("react");
function usePreservedSelection() {
  const [preserved, setPreserved] = (0, import_react33.useState)(
    null
  );
  const rangeRef = (0, import_react33.useRef)(null);
  const preserve = (0, import_react33.useCallback)(async () => {
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
  const restore = (0, import_react33.useCallback)(() => {
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
  const clear = (0, import_react33.useCallback)(() => {
    setPreserved(null);
    rangeRef.current = null;
  }, []);
  const copyToClipboard = (0, import_react33.useCallback)(async () => {
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
  (0, import_react33.useEffect)(() => {
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
var import_react34 = require("react");
function useLayoutManager({
  tree,
  onTreeUpdate,
  onLayoutChange
}) {
  const updateLayout = (0, import_react34.useCallback)(
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
  const updateSize = (0, import_react34.useCallback)(
    (elementKey, width, height) => {
      updateLayout(elementKey, {
        size: { width, height }
      });
    },
    [updateLayout]
  );
  const updateGridPosition = (0, import_react34.useCallback)(
    (elementKey, position) => {
      updateLayout(elementKey, {
        grid: position
      });
    },
    [updateLayout]
  );
  const setResizable = (0, import_react34.useCallback)(
    (elementKey, resizable) => {
      updateLayout(elementKey, { resizable });
    },
    [updateLayout]
  );
  const getLayout = (0, import_react34.useCallback)(
    (elementKey) => {
      if (!tree) return void 0;
      return tree.elements[elementKey]?.layout;
    },
    [tree]
  );
  const getLayoutElements = (0, import_react34.useMemo)(() => {
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
var import_react35 = require("react");

// src/hooks/useDeepResearch.ts
var import_react36 = require("react");

// src/hooks/useRenderEditableText.tsx
var import_react38 = __toESM(require("react"));

// src/components/EditableText.tsx
var import_react37 = require("react");
var import_jsx_runtime20 = require("react/jsx-runtime");
var EditableText = (0, import_react37.memo)(function EditableText2({
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
  const ref = (0, import_react37.useRef)(null);
  const [localValue, setLocalValue] = (0, import_react37.useState)(value);
  const { isEditing, isFocused, handleChange, handleFocus } = useElementEdit(elementKey);
  (0, import_react37.useEffect)(() => {
    setLocalValue(value);
    if (ref.current && !isFocused) {
      ref.current.textContent = value || "";
    }
  }, [value, isFocused]);
  const handleInput = (0, import_react37.useCallback)(() => {
    if (ref.current) {
      const newValue = ref.current.textContent || "";
      setLocalValue(newValue);
      handleChange(propName, newValue);
      onValueChange?.(newValue);
    }
  }, [handleChange, propName, onValueChange]);
  const handleKeyDown = (0, import_react37.useCallback)(
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
  const handleBlur = (0, import_react37.useCallback)(
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
  const handleFocusEvent = (0, import_react37.useCallback)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
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
var import_jsx_runtime21 = require("react/jsx-runtime");
function createRenderEditableText(element, isEditing) {
  const canEdit = isEditing && element.editable !== false && !element.locked;
  return (propName, value, options) => {
    if (value === null || value === void 0 || value === "") {
      if (canEdit && options?.placeholder) {
        return import_react38.default.createElement(EditableText, {
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
      return import_react38.default.createElement(Tag, { className: options?.className }, value);
    }
    return import_react38.default.createElement(EditableText, {
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

// src/components/EditableWrapper.tsx
var import_jsx_runtime22 = require("react/jsx-runtime");
var EditableTextNode = (0, import_react39.memo)(function EditableTextNode2({
  elementKey,
  propName,
  value,
  isMobile,
  onTextChange
}) {
  const ref = (0, import_react39.useRef)(null);
  const { isEditing, recordChange, focusedKey, setFocusedKey } = useEditMode();
  const [localValue, setLocalValue] = (0, import_react39.useState)(value);
  const [isActive, setIsActive] = (0, import_react39.useState)(false);
  const canEdit = isEditing && (isMobile ? focusedKey === elementKey : true);
  (0, import_react39.useEffect)(() => {
    setLocalValue(value);
  }, [value]);
  const handleClick = (0, import_react39.useCallback)(
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
  const handleDoubleClick = (0, import_react39.useCallback)(
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
  const handleInput = (0, import_react39.useCallback)(() => {
    if (ref.current) {
      const newValue = ref.current.textContent || "";
      setLocalValue(newValue);
      recordChange(elementKey, propName, newValue);
      onTextChange?.(propName, newValue);
    }
  }, [elementKey, propName, recordChange, onTextChange]);
  const handleBlur = (0, import_react39.useCallback)(() => {
    setIsActive(false);
    if (!isMobile) {
      setFocusedKey(null);
    }
  }, [isMobile, setFocusedKey]);
  const handleKeyDown = (0, import_react39.useCallback)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
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
var EditableWrapper = (0, import_react39.memo)(function EditableWrapper2({
  element,
  children,
  onTextChange,
  forceEditable,
  className = ""
}) {
  const isMobile = useIsMobile();
  const { isEditing, focusedKey, setFocusedKey, recordChange } = useEditMode();
  const containerRef = (0, import_react39.useRef)(null);
  const [isActiveEditing, setIsActiveEditing] = (0, import_react39.useState)(false);
  const isElementEditable = forceEditable !== void 0 ? forceEditable : element.editable !== false;
  if (!isEditing || !isElementEditable || element.locked) {
    return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_jsx_runtime22.Fragment, { children });
  }
  const isFocused = focusedKey === element.key;
  const handleContainerClick = (0, import_react39.useCallback)(
    (e) => {
      e.stopPropagation();
      setFocusedKey(element.key);
      if (!isMobile) {
        setIsActiveEditing(true);
      }
    },
    [isMobile, element.key, setFocusedKey]
  );
  const handleDoubleClick = (0, import_react39.useCallback)(
    (e) => {
      e.stopPropagation();
      if (isMobile) {
        setIsActiveEditing(true);
      }
    },
    [isMobile]
  );
  const handleBlur = (0, import_react39.useCallback)(() => {
    setIsActiveEditing(false);
    if (containerRef.current) {
      const textContent = containerRef.current.textContent || "";
      const propName = element.props?.title ? "title" : element.props?.text ? "text" : element.props?.label ? "label" : element.props?.description ? "description" : "content";
      recordChange(element.key, propName, textContent);
      onTextChange?.(propName, textContent);
    }
  }, [element.key, element.props, recordChange, onTextChange]);
  const handleKeyDown = (0, import_react39.useCallback)(
    (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsActiveEditing(false);
        containerRef.current?.blur();
      }
    },
    []
  );
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
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
        isMobile && isFocused && !isActiveEditing && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
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
            children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
              "svg",
              {
                width: "12",
                height: "12",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "white",
                strokeWidth: "2",
                children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" })
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
var import_jsx_runtime23 = require("react/jsx-runtime");
function hasDescendantChanged(elementKey, prevTree, nextTree, visited = /* @__PURE__ */ new Set()) {
  if (visited.has(elementKey)) return false;
  visited.add(elementKey);
  const prevElement = prevTree.elements[elementKey];
  const nextElement = nextTree.elements[elementKey];
  if (prevElement !== nextElement) {
    return true;
  }
  const children = prevElement?.children;
  if (children) {
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
var ElementRenderer = import_react40.default.memo(function ElementRenderer2({
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
  const renderEditableText = (0, import_react40.useMemo)(
    () => createRenderEditableText(element, isEditing),
    [element, isEditing]
  );
  if (!isVisible) {
    return null;
  }
  if (element.type === "__placeholder__" || element._meta?.isPlaceholder) {
    return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
      "div",
      {
        className: "w-full h-16 bg-muted/10 animate-pulse rounded-lg my-2 border border-border/20",
        "data-placeholder-for": element.key
      },
      element.key
    );
  }
  const Component = registry[element.type] ?? fallback;
  if (!Component) {
    console.warn(`No renderer for component type: ${element.type}`);
    return null;
  }
  const children = element.children?.map((childKey, index) => {
    const childElement = tree.elements[childKey];
    if (!childElement) {
      if (loading) {
        return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
          "div",
          {
            className: "w-full h-12 bg-muted/10 animate-pulse rounded-md my-1"
          },
          `${childKey}-skeleton`
        );
      }
      return null;
    }
    return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
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
  });
  const isResizable = element.layout?.resizable !== false;
  const isEditable = isEditing && element.editable !== false && !element.locked;
  const content = /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
    Component,
    {
      element,
      onAction: execute,
      loading,
      renderText,
      renderEditableText,
      children
    }
  );
  const editableContent = isEditable ? /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(EditableWrapper, { element, children: content }) : content;
  if (selectable && onElementSelect) {
    const selectionContent = /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
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
      return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(ResizableWrapper, { element, onResize, children: editableContent });
  }
  return editableContent;
}, elementRendererPropsAreEqual);

// src/renderer/provider.tsx
var import_jsx_runtime24 = require("react/jsx-runtime");
function ConfirmationDialogManager() {
  const { pendingConfirmation, confirm, cancel } = useActions();
  if (!pendingConfirmation?.action.confirm) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(MarkdownProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
    DataProvider,
    {
      initialData,
      authState,
      onDataChange,
      children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(VisibilityProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(ActionProvider, { handlers: actionHandlers, navigate, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(ValidationProvider, { customFunctions: validationFunctions, children: [
        children,
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(ConfirmationDialogManager, {})
      ] }) }) })
    }
  ) });
}

// src/renderer.tsx
var import_jsx_runtime25 = require("react/jsx-runtime");
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
  autoGrid = true
}) {
  if (!tree || !tree.root) return null;
  const rootElement = tree.elements[tree.root];
  if (!rootElement) return null;
  const content = /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
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
  );
  const gridContent = autoGrid ? /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(InteractionTrackingWrapper, { tree, onInteraction, children: gridContent });
  }
  return gridContent;
}
function createRendererFromCatalog(_catalog, registry) {
  return function CatalogRenderer(props) {
    return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Renderer, { ...props, registry });
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
    if (children) {
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
var import_jsx_runtime26 = require("react/jsx-runtime");
function PlaceholderSkeleton({ elementKey }) {
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
    "div",
    {
      className: "w-full h-16 bg-muted/10 animate-pulse rounded-lg my-2 border border-border/20",
      "data-placeholder-for": elementKey
    },
    elementKey
  );
}
function ChildSkeleton({ elementKey }) {
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
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
var import_react41 = __toESM(require("react"));
var import_jsx_runtime27 = require("react/jsx-runtime");
var EditableContext = (0, import_react41.createContext)(null);
function EditableProvider({
  children,
  onValueChange
}) {
  const [editingPath, setEditingPath] = (0, import_react41.useState)(null);
  const [editingValue, setEditingValue] = (0, import_react41.useState)(null);
  const startEdit = (0, import_react41.useCallback)((path, currentValue) => {
    setEditingPath(path);
    setEditingValue(currentValue);
  }, []);
  const commitEdit = (0, import_react41.useCallback)(
    (path, newValue) => {
      onValueChange?.(path, newValue);
      setEditingPath(null);
      setEditingValue(null);
    },
    [onValueChange]
  );
  const cancelEdit = (0, import_react41.useCallback)(() => {
    setEditingPath(null);
    setEditingValue(null);
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
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
  return (0, import_react41.useContext)(EditableContext);
}
function useEditable(path, currentValue, locked = false) {
  const ctx = useEditableContext();
  const isEditing = ctx?.editingPath === path;
  const value = isEditing ? ctx?.editingValue : currentValue;
  const onStartEdit = (0, import_react41.useCallback)(() => {
    if (locked || !ctx) return;
    ctx.startEdit(path, currentValue);
  }, [ctx, path, currentValue, locked]);
  const onCommit = (0, import_react41.useCallback)(
    (newValue) => {
      if (!ctx) return;
      ctx.commitEdit(path, newValue);
    },
    [ctx, path]
  );
  const onCancel = (0, import_react41.useCallback)(() => {
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
  as: Component = "span",
  className
}) {
  const { isEditing, onStartEdit, onCommit, onCancel, editableClassName } = useEditable(path, value, locked);
  const [localValue, setLocalValue] = (0, import_react41.useState)(value);
  import_react41.default.useEffect(() => {
    if (!isEditing) {
      setLocalValue(value);
    }
  }, [value, isEditing]);
  if (isEditing) {
    return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
    Component,
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
  const [localValue, setLocalValue] = (0, import_react41.useState)(String(value));
  import_react41.default.useEffect(() => {
    if (!isEditing) {
      setLocalValue(String(value));
    }
  }, [value, isEditing]);
  if (isEditing) {
    return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
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
var import_react42 = require("react");
var import_react_markdown2 = __toESM(require("react-markdown"));
var import_remark_math = __toESM(require("remark-math"));
var import_rehype_katex = __toESM(require("rehype-katex"));
var import_jsx_runtime28 = require("react/jsx-runtime");
var defaultTheme2 = {
  codeBlockBg: "rgba(0, 0, 0, 0.3)",
  codeBlockBorder: "rgba(255, 255, 255, 0.08)",
  inlineCodeBg: "rgba(0, 0, 0, 0.25)",
  linkColor: "var(--primary, #3b82f6)",
  blockquoteBorder: "var(--primary, #3b82f6)",
  hrColor: "rgba(255, 255, 255, 0.1)"
};
var MarkdownText = (0, import_react42.memo)(function MarkdownText2({
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
    pre: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("pre", { className: "bg-[var(--markdown-code-bg)] rounded-lg p-3 overflow-x-auto text-[13px] font-mono border border-[var(--markdown-code-border)] my-2", children }),
    code: ({
      children,
      className: codeClassName
    }) => {
      const isInline = !codeClassName;
      if (isInline) {
        return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("code", { className: "bg-[var(--markdown-inline-code-bg)] rounded px-1.5 py-0.5 text-[0.9em] font-mono", children });
      }
      return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("code", { children });
    },
    a: ({ href, children }) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
      "a",
      {
        href,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-[var(--markdown-link-color)] underline underline-offset-2 hover:opacity-80 transition-opacity",
        children
      }
    ),
    ul: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("ul", { className: "my-2 pl-5 list-disc", children }),
    ol: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("ol", { className: "my-2 pl-5 list-decimal", children }),
    li: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("li", { className: "mb-1", children }),
    h1: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h1", { className: "font-semibold mt-3 mb-2 text-lg", children }),
    h2: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h2", { className: "font-semibold mt-3 mb-2 text-base", children }),
    h3: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h3", { className: "font-semibold mt-3 mb-2 text-[15px]", children }),
    h4: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h4", { className: "font-semibold mt-3 mb-2 text-sm", children }),
    h5: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h5", { className: "font-semibold mt-3 mb-2 text-[13px]", children }),
    h6: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("h6", { className: "font-semibold mt-3 mb-2 text-xs", children }),
    p: ({ children }) => inline ? /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { children }) : /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { className: "my-1.5 leading-relaxed", children }),
    blockquote: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("blockquote", { className: "border-l-[3px] border-[var(--markdown-quote-border)] pl-3 my-2 opacity-90 italic", children }),
    hr: () => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("hr", { className: "border-none border-t border-[var(--markdown-hr-color)] my-3" }),
    strong: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("strong", { className: "font-semibold", children }),
    em: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("em", { className: "italic", children })
  };
  const Wrapper = inline ? "span" : "div";
  const remarkPlugins = enableMath ? [import_remark_math.default] : [];
  const rehypePlugins = enableMath ? [import_rehype_katex.default] : [];
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(Wrapper, { className: cn("markdown-content", className), style: wrapperStyle, children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
    import_react_markdown2.default,
    {
      components,
      remarkPlugins,
      rehypePlugins,
      children: content
    }
  ) });
});

// src/components/TextSelectionBadge.tsx
var import_jsx_runtime29 = require("react/jsx-runtime");
function TextSelectionBadge({
  selection,
  onClear,
  onRestore,
  maxLength = 50,
  className
}) {
  const truncatedText = selection.text.length > maxLength ? `${selection.text.substring(0, maxLength)}...` : selection.text;
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
    "div",
    {
      className: cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-foreground",
        "bg-primary/10 border border-primary/20",
        className
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
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
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("path", { d: "M17 6.1H3" }),
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("path", { d: "M21 12.1H3" }),
              /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("path", { d: "M15.1 18H3" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
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
        selection.copiedToClipboard && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded font-medium", children: "Copied" }),
        selection.elementType && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: "text-[10px] px-1.5 py-0.5 bg-violet-500/20 text-violet-500 rounded", children: selection.elementType }),
        onRestore && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
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
            children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
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
                  /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }),
                  /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("path", { d: "M3 3v5h5" })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
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
            children: /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
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
                  /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("path", { d: "M18 6 6 18" }),
                  /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("path", { d: "m6 6 12 12" })
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
var import_react44 = require("react");

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
var import_react43 = require("react");
var import_jsx_runtime30 = require("react/jsx-runtime");
function GridLines({ columns, rows, color }) {
  const patternId = (0, import_react43.useMemo)(
    () => `grid-pattern-${Math.random().toString(36).substr(2, 9)}`,
    []
  );
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("svg", { style: gridLinesOverlayStyle, "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
      "pattern",
      {
        id: patternId,
        width: `${100 / columns}%`,
        height: `${100 / Math.max(rows, 1)}%`,
        patternUnits: "objectBoundingBox",
        children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("rect", { width: "100%", height: "100%", fill: `url(#${patternId})` })
  ] });
}

// src/components/free-grid/canvas.tsx
var import_jsx_runtime31 = require("react/jsx-runtime");
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
  const gridTemplateColumns = (0, import_react44.useMemo)(() => {
    if (cellSize) {
      return `repeat(${columns}, ${cellSize}px)`;
    }
    return `repeat(${columns}, 1fr)`;
  }, [columns, cellSize]);
  const gridTemplateRows = (0, import_react44.useMemo)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(
    "div",
    {
      style: containerStyle,
      className,
      "data-free-grid-canvas": true,
      "data-columns": columns,
      "data-rows": rows,
      children: [
        showGrid && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(GridLines, { columns, rows: rows ?? 4, color: gridLineColor }),
        children
      ]
    }
  );
}

// src/components/free-grid/grid-cell.tsx
var import_jsx_runtime32 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { style: cellStyle, className, "data-grid-cell": true, children });
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
var import_react46 = require("react");

// src/components/tool-progress/icons.tsx
var import_jsx_runtime33 = require("react/jsx-runtime");
var toolIcons = {
  "web-search": /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("circle", { cx: "11", cy: "11", r: "8" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "m21 21-4.3-4.3" })
      ]
    }
  ),
  "web-scrape": /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("polyline", { points: "14,2 14,8 20,8" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("line", { x1: "16", y1: "13", x2: "8", y2: "13" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("line", { x1: "16", y1: "17", x2: "8", y2: "17" })
      ]
    }
  ),
  "search-flight": /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
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
      children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" })
    }
  ),
  "search-hotel": /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M10 6h4" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M10 10h4" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M10 14h4" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M10 18h4" })
      ]
    }
  ),
  "document-index": /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("polyline", { points: "14,2 14,8 20,8" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M12 18v-6" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M9 15l3 3 3-3" })
      ]
    }
  ),
  "document-index-cache": /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("polyline", { points: "14,2 14,8 20,8" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M9 15l2 2 4-4" })
      ]
    }
  ),
  "document-search": /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("polyline", { points: "14,2 14,8 20,8" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("circle", { cx: "11.5", cy: "14.5", r: "2.5" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M13.3 16.3 15 18" })
      ]
    }
  ),
  default: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
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
      children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("polygon", { points: "13,2 3,14 12,14 11,22 21,10 12,10 13,2" })
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
var import_react45 = require("react");
var import_jsx_runtime34 = require("react/jsx-runtime");
var DefaultProgressItem = (0, import_react45.memo)(function DefaultProgressItem2({
  progress
}) {
  const label = toolLabels[progress.toolName] || progress.toolName;
  const icon = toolIcons[progress.toolName] || toolIcons.default;
  const isActive = progress.status === "starting" || progress.status === "progress";
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { style: { position: "relative" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
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
          isActive && /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 6
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
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
                isActive && /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { style: { display: "flex", gap: 2 }, children: [0, 1, 2].map((i) => /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
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
          progress.message && /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
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
var import_jsx_runtime35 = require("react/jsx-runtime");
var ToolProgressOverlay = (0, import_react46.memo)(function ToolProgressOverlay2({
  position = "top-right",
  className,
  show,
  maxItems = 5,
  renderItem
}) {
  const activeProgress = useActiveToolProgress2();
  const isRunning = useIsToolRunning();
  const [mounted, setMounted] = (0, import_react46.useState)(false);
  (0, import_react46.useEffect)(() => {
    setMounted(true);
  }, []);
  const shouldShow = show ?? isRunning;
  if (!mounted || !shouldShow || activeProgress.length === 0) {
    return null;
  }
  const visibleProgress = activeProgress.slice(0, maxItems);
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("style", { children: progressAnimations }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
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
          (progress) => renderItem ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { style: { pointerEvents: "auto" }, children: renderItem(progress) }, progress.toolCallId) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
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
var import_react47 = require("react");
var import_jsx_runtime36 = require("react/jsx-runtime");
function CanvasBlockSkeleton() {
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-full min-h-[200px] bg-zinc-900/50 rounded-xl border border-white/5 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "text-zinc-500 text-sm", children: "Loading editor..." }) });
}
var CanvasBlock = (0, import_react47.memo)(function CanvasBlock2({
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
  const [content, setContent] = (0, import_react47.useState)(initialContent || null);
  const [editorKey, setEditorKey] = (0, import_react47.useState)(0);
  const processedContent = (0, import_react47.useMemo)(() => {
    if (initialContent) return initialContent;
    if (markdown) {
      return { markdown, images };
    }
    if (images && images.length > 0) {
      return { images };
    }
    return null;
  }, [initialContent, markdown, images]);
  (0, import_react47.useEffect)(() => {
    if (processedContent !== void 0 && processedContent !== null) {
      setContent(processedContent);
      setEditorKey((k) => k + 1);
    }
  }, [processedContent]);
  const handleChange = (0, import_react47.useCallback)(
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
  const handleSave = (0, import_react47.useCallback)(() => {
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
  const handleOpenInCanvas = (0, import_react47.useCallback)(() => {
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
    return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(CanvasBlockSkeleton, {});
  }
  if (!EditorComponent) {
    return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
      "div",
      {
        className: "canvas-block w-full bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden",
        style: { minHeight: height },
        "data-document-id": documentId,
        children: [
          title && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "px-4 py-3 border-b border-white/5", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h3", { className: "text-lg font-semibold text-white", children: title }) }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
            "div",
            {
              className: "flex flex-col items-center justify-center gap-4 p-8",
              style: { minHeight: "200px" },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-zinc-400 text-sm", children: initialContent ? "Document content available" : "Empty document" }),
                /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
                  "button",
                  {
                    onClick: handleOpenInCanvas,
                    className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors border-none cursor-pointer",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
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
                            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" })
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
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
    "div",
    {
      className: "canvas-block",
      style: { width, minHeight: height },
      "data-document-id": documentId,
      children: [
        title && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h3", { className: "text-lg font-semibold text-white mb-3", children: title }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
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
        mode === "edit" && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "flex justify-end mt-2", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
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
var import_react48 = require("react");
var import_jsx_runtime37 = require("react/jsx-runtime");
var DocumentBlock = (0, import_react48.memo)(function DocumentBlock2({
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
  const renderedContent = (0, import_react48.useMemo)(() => {
    if (format === "html") {
      return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("pre", { className: "whitespace-pre-wrap text-sm", children: content });
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
    return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "w-full p-6 bg-zinc-900/50 rounded-xl border border-white/5 animate-pulse", children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "h-6 w-1/3 bg-zinc-800 rounded mb-4" }),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "space-y-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "h-4 bg-zinc-800 rounded w-full" }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "h-4 bg-zinc-800 rounded w-5/6" }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "h-4 bg-zinc-800 rounded w-4/6" })
      ] })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "document-block w-full bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "flex items-center justify-between px-4 py-3 border-b border-white/5 bg-zinc-900/30", children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
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
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("polyline", { points: "14 2 14 8 20 8" }),
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("line", { x1: "16", x2: "8", y1: "13", y2: "13" }),
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("line", { x1: "16", x2: "8", y1: "17", y2: "17" }),
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("line", { x1: "10", x2: "8", y1: "9", y2: "9" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("h3", { className: "text-sm font-medium text-white", children: title })
      ] }),
      showOpenInCanvas && /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
        "button",
        {
          onClick: handleOpenInCanvas,
          className: "flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors border-none cursor-pointer",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
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
                  /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                  /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("path", { d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" })
                ]
              }
            ),
            "Open in Canvas"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "p-4", children: renderedContent })
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AISettingsProvider,
  ActionProvider,
  ActionTrackingProvider,
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
  EditableText,
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
  elementRendererPropsAreEqual,
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
  useActiveToolProgress,
  useActiveToolProgressStore,
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
});
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.3.1 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.1/LICENSE *)
*/
//# sourceMappingURL=index.js.map