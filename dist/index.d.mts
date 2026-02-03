import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React$1 from 'react';
import React__default, { ReactNode, CSSProperties, ComponentType } from 'react';
import { DataModel, AuthState, VisibilityCondition, VisibilityContext, ActionHandler, ResolvedAction, Action, ActionConfirm, ValidationFunction, ValidationResult, ValidationConfig, ToolProgressEvent, UITree, UIElement, JsonPatch, DocumentIndex, Catalog, ComponentDefinition, ElementSize, ElementResizeConfig, ElementLayout } from '@onegenui/core';
export { DocumentIndex, DocumentIndexNode, ToolProgressEvent, ToolProgressStatus } from '@onegenui/core';
import { UseBoundStore, StoreApi } from 'zustand';

/**
 * Data context value
 */
interface DataContextValue {
    /** The current data model */
    data: DataModel;
    /** Auth state for visibility evaluation */
    authState?: AuthState;
    /** Get a value by path */
    get: (path: string) => unknown;
    /** Set a value by path */
    set: (path: string, value: unknown) => void;
    /** Update multiple values at once */
    update: (updates: Record<string, unknown>) => void;
}
/**
 * Props for DataProvider
 */
interface DataProviderProps {
    /** Initial data model */
    initialData?: DataModel;
    /** Auth state */
    authState?: AuthState;
    /** Callback when data changes */
    onDataChange?: (path: string, value: unknown) => void;
    children: ReactNode;
}
/**
 * Provider for data model context
 *
 * Uses Zustand store as backing store for optimal performance.
 * Context API provides stable public interface for package consumers.
 */
declare function DataProvider({ initialData, authState, onDataChange, children, }: DataProviderProps): react_jsx_runtime.JSX.Element;
/**
 * Hook to access the data context
 */
declare function useData(): DataContextValue;
/**
 * Hook to get a value from the data model
 * Optimized: subscribes only to the specific path via Zustand selector
 */
declare function useDataValue<T>(path: string): T | undefined;
/**
 * Hook to get and set a value from the data model (like useState)
 */
declare function useDataBinding<T>(path: string): [T | undefined, (value: T) => void];

/**
 * Visibility context value
 */
interface VisibilityContextValue {
    /** Evaluate a visibility condition */
    isVisible: (condition: VisibilityCondition | undefined) => boolean;
    /** The underlying visibility context */
    ctx: VisibilityContext;
}
/**
 * Props for VisibilityProvider
 */
interface VisibilityProviderProps {
    children: ReactNode;
}
/**
 * Provider for visibility evaluation
 */
declare function VisibilityProvider({ children }: VisibilityProviderProps): react_jsx_runtime.JSX.Element;
/**
 * Hook to access visibility evaluation
 */
declare function useVisibility(): VisibilityContextValue;
/**
 * Hook to check if a condition is visible
 */
declare function useIsVisible(condition: VisibilityCondition | undefined): boolean;

/**
 * Pending confirmation state
 */
interface PendingConfirmation$1 {
    /** The resolved action */
    action: ResolvedAction;
    /** The action handler */
    handler: ActionHandler;
    /** Resolve callback */
    resolve: () => void;
    /** Reject callback */
    reject: () => void;
}
/**
 * Action tracking callback type
 */
type ActionTrackingCallback = (info: {
    actionName: string;
    params: Record<string, unknown>;
    elementType?: string;
    context?: Record<string, unknown>;
}) => void;
/**
 * Action context value
 */
interface ActionContextValue$1 {
    /** Registered action handlers */
    handlers: Record<string, ActionHandler>;
    /** Currently loading action names */
    loadingActions: Set<string>;
    /** Pending confirmation dialog */
    pendingConfirmation: PendingConfirmation$1 | null;
    /** Execute an action */
    execute: (action: Action) => Promise<void>;
    /** Confirm the pending action */
    confirm: () => void;
    /** Cancel the pending action */
    cancel: () => void;
    /** Register an action handler */
    registerHandler: (name: string, handler: ActionHandler) => void;
}
/**
 * Props for ActionProvider
 */
interface ActionProviderProps$1 {
    /** Initial action handlers */
    handlers?: Record<string, ActionHandler>;
    /** Navigation function */
    navigate?: (path: string) => void;
    /** Optional callback to track executed actions (for proactive AI) */
    onActionExecuted?: ActionTrackingCallback;
    children: ReactNode;
}
/**
 * Provider for action execution - Now uses Zustand for state
 */
declare function ActionProvider$1({ handlers: initialHandlers, navigate, onActionExecuted, children, }: ActionProviderProps$1): react_jsx_runtime.JSX.Element;
/**
 * Hook to access action context
 */
declare function useActions(): ActionContextValue$1;
/**
 * Hook to execute an action
 */
declare function useAction(action: Action): {
    execute: () => Promise<void>;
    isLoading: boolean;
};
/**
 * Props for ConfirmDialog component
 */
interface ConfirmDialogProps {
    /** The confirmation config */
    confirm: ActionConfirm;
    /** Called when confirmed */
    onConfirm: () => void;
    /** Called when cancelled */
    onCancel: () => void;
}
/**
 * Default confirmation dialog component
 */
declare function ConfirmDialog({ confirm, onConfirm, onCancel, }: ConfirmDialogProps): react_jsx_runtime.JSX.Element;

/**
 * Field validation state
 */
interface FieldValidationState {
    /** Whether the field has been touched */
    touched: boolean;
    /** Whether the field has been validated */
    validated: boolean;
    /** Validation result */
    result: ValidationResult | null;
}
/**
 * Validation context value
 */
interface ValidationContextValue {
    /** Custom validation functions from catalog */
    customFunctions: Record<string, ValidationFunction>;
    /** Validation state by field path */
    fieldStates: Record<string, FieldValidationState>;
    /** Validate a field */
    validate: (path: string, config: ValidationConfig) => ValidationResult;
    /** Mark field as touched */
    touch: (path: string) => void;
    /** Clear validation for a field */
    clear: (path: string) => void;
    /** Validate all fields */
    validateAll: () => boolean;
    /** Register field config */
    registerField: (path: string, config: ValidationConfig) => void;
}
/**
 * Props for ValidationProvider
 */
interface ValidationProviderProps {
    /** Custom validation functions from catalog */
    customFunctions?: Record<string, ValidationFunction>;
    children: ReactNode;
}
/**
 * Provider for validation - Now uses Zustand for state
 */
declare function ValidationProvider({ customFunctions, children, }: ValidationProviderProps): react_jsx_runtime.JSX.Element;
/**
 * Hook to access validation context
 */
declare function useValidation(): ValidationContextValue;
/**
 * Hook to get validation state for a field
 */
declare function useFieldValidation(path: string, config?: ValidationConfig): {
    state: FieldValidationState;
    validate: () => ValidationResult;
    touch: () => void;
    clear: () => void;
    errors: string[];
    isValid: boolean;
};

/**
 * Domain Slice - Data model, auth state, validation
 */

interface DomainSlice {
    dataModel: DataModel;
    setDataModel: (data: DataModel) => void;
    updateDataModel: (path: string, value: unknown) => void;
    resetDataModel: () => void;
    auth: AuthState;
    setAuth: (auth: AuthState) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

/**
 * UI Slice - Loading states, progress, confirmations
 */

interface ConfirmationDialog {
    id: string;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}
interface ToolProgress$1 {
    id: string;
    name: string;
    status: "pending" | "running" | "complete" | "error";
    progress?: number;
    message?: string;
}
interface UISlice {
    confirmations: ConfirmationDialog[];
    showConfirmation: (dialog: Omit<ConfirmationDialog, "id">) => string;
    hideConfirmation: (id: string) => void;
    toolProgress: Map<string, ToolProgress$1>;
    setToolProgress: (progress: ToolProgress$1) => void;
    clearToolProgress: (id: string) => void;
    clearAllToolProgress: () => void;
    globalLoading: boolean;
    setGlobalLoading: (loading: boolean) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
}

/**
 * Settings Slice - AI settings, theme, preferences
 *
 * NOTE: Model selection is centralized in @onegenui/providers.
 * Use `createModelForTask()` or `getModelConfig()` from the providers package.
 */

type ThemeMode = "light" | "dark" | "system";
/**
 * AI Model type - matches models from @onegenui/providers
 * Use `createModelForTask()` or `getModelConfig()` from providers package for model selection.
 */
type AIModel = "gemini-3-flash-preview" | "gemini-3-pro-preview" | "gpt-5.2" | "claude-haiku-4.5" | "claude-sonnet-4.5" | "claude-opus-4.5";
interface AISettings {
    model: AIModel;
    temperature: number;
    maxTokens: number;
    streamingEnabled: boolean;
    autoSuggestions: boolean;
}
interface SettingsSlice {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    aiSettings: AISettings;
    setAISettings: (settings: Partial<AISettings>) => void;
    resetAISettings: () => void;
    compactMode: boolean;
    setCompactMode: (compact: boolean) => void;
    animationsEnabled: boolean;
    setAnimationsEnabled: (enabled: boolean) => void;
}

/**
 * Analytics Slice - Action tracking, metrics
 */

interface TrackedAction$1 {
    id: string;
    type: string;
    elementKey?: string;
    elementType?: string;
    timestamp: number;
    data?: unknown;
}
interface AnalyticsSlice {
    actions: TrackedAction$1[];
    trackAction: (action: Omit<TrackedAction$1, "id" | "timestamp">) => void;
    clearActions: () => void;
    metrics: {
        totalActions: number;
        sessionStart: number;
        lastActionTime: number;
    };
    getRecentActions: (count?: number) => TrackedAction$1[];
    getActionsByType: (type: string) => TrackedAction$1[];
    getActionsByElement: (elementKey: string) => TrackedAction$1[];
}

/**
 * Actions Slice - Action execution state management
 *
 * Manages:
 * - Loading states per action
 * - Pending confirmations
 * - Action history
 */

/**
 * Pending confirmation dialog
 */
interface PendingConfirmation {
    id: string;
    actionName: string;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    payload?: unknown;
    timestamp: number;
}
/**
 * Action execution record
 */
interface ActionExecution {
    id: string;
    actionName: string;
    status: "pending" | "running" | "success" | "error";
    startTime: number;
    endTime?: number;
    error?: string;
    payload?: unknown;
    result?: unknown;
}
interface ActionsSlice {
    loadingActions: Set<string>;
    isActionLoading: (actionName: string) => boolean;
    setActionLoading: (actionName: string, loading: boolean) => void;
    clearActionLoading: (actionName: string) => void;
    clearAllLoading: () => void;
    pendingConfirmations: PendingConfirmation[];
    addPendingConfirmation: (confirmation: Omit<PendingConfirmation, "id" | "timestamp">) => string;
    removePendingConfirmation: (id: string) => void;
    getPendingConfirmation: (id: string) => PendingConfirmation | undefined;
    clearPendingConfirmations: () => void;
    addConfirmation: (confirmation: Omit<PendingConfirmation, "id" | "timestamp">) => string;
    removeConfirmation: (id: string) => void;
    actionHistory: ActionExecution[];
    maxHistorySize: number;
    startAction: (actionName: string, payload?: unknown) => string;
    completeAction: (id: string, result?: unknown) => void;
    failAction: (id: string, error: string) => void;
    getActionStatus: (id: string) => ActionExecution | undefined;
    getRecentActionExecutions: (count?: number) => ActionExecution[];
    addToHistory: (info: {
        actionName: string;
        payload?: unknown;
    }) => void;
    clearHistory: () => void;
}

/**
 * Validation Slice - Field validation state management
 *
 * Manages:
 * - Field touched states
 * - Validation results per field
 * - Form-level validation state
 */

/**
 * Validation result for a single field
 */
interface FieldValidationResult {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
}
/**
 * State for a single field
 */
interface FieldState {
    path: string;
    touched: boolean;
    validated: boolean;
    validationResult: FieldValidationResult | null;
    lastValidatedAt?: number;
}
/**
 * Form-level validation state
 */
interface FormValidationState {
    isValid: boolean;
    isDirty: boolean;
    isValidating: boolean;
    touchedCount: number;
    errorCount: number;
}
interface ValidationSlice {
    fieldStates: Record<string, FieldState>;
    touchField: (path: string) => void;
    untouchField: (path: string) => void;
    setFieldValidation: (path: string, result: FieldValidationResult) => void;
    clearFieldValidation: (path: string) => void;
    getFieldState: (path: string) => FieldState | undefined;
    isFieldTouched: (path: string) => boolean;
    isFieldValid: (path: string) => boolean;
    getFieldErrors: (path: string) => string[];
    isValidating: boolean;
    setIsValidating: (validating: boolean) => void;
    getFormState: () => FormValidationState;
    touchAllFields: (paths: string[]) => void;
    clearAllValidation: () => void;
    setMultipleFieldValidations: (results: Array<{
        path: string;
        result: FieldValidationResult;
    }>) => void;
    getFieldsWithErrors: () => string[];
    getTouchedFields: () => string[];
}

/**
 * Tool Progress Slice - Tool execution progress tracking
 *
 * Manages:
 * - Active tool progress
 * - Tool execution history
 * - Auto-cleanup of completed tools
 */

/**
 * Slice-specific progress event (with required timestamp and message history)
 */
interface StoredProgressEvent extends ToolProgressEvent {
    timestamp: number;
    /** History of unique messages for this tool execution */
    messageHistory?: Array<{
        message: string;
        timestamp: number;
    }>;
}
interface ToolProgressSlice {
    progressEvents: StoredProgressEvent[];
    maxEvents: number;
    addProgress: (event: Omit<ToolProgressEvent, "timestamp" | "type">) => void;
    addProgressEvent: (event: Omit<ToolProgressEvent, "timestamp" | "type">) => void;
    updateProgress: (toolCallId: string, updates: Partial<Omit<ToolProgressEvent, "toolCallId" | "timestamp" | "type">>) => void;
    updateProgressEvent: (toolCallId: string, updates: Partial<Omit<ToolProgressEvent, "toolCallId" | "timestamp" | "type">>) => void;
    clearProgress: () => void;
    clearProgressEvents: () => void;
    clearCompletedOlderThan: (ms: number) => void;
    clearCompletedProgressOlderThan: (ms: number) => void;
    removeProgress: (toolCallId: string) => void;
    getProgress: (toolCallId: string) => StoredProgressEvent | undefined;
    getActiveProgress: () => StoredProgressEvent[];
    getAllProgress: () => StoredProgressEvent[];
    isToolRunning: () => boolean;
    isSpecificToolRunning: (toolName: string) => boolean;
    getProgressByToolName: (toolName: string) => StoredProgressEvent[];
}

/**
 * Plan Execution Slice - Unified plan and progress tracking
 *
 * Integrates planning with tool progress for native "generating" state.
 * Replaces separate usePlanState hook with Zustand-based centralized state.
 */

type PlanStepStatus = "pending" | "running" | "complete" | "error";
interface PlanSubtask {
    id: number;
    task: string;
    agent: string;
    status: PlanStepStatus;
    startTime?: number;
    endTime?: number;
}
interface PlanStep {
    id: number;
    task: string;
    agent: string;
    status: PlanStepStatus;
    dependencies: number[];
    parallel?: boolean;
    subtasks?: PlanSubtask[];
    startTime?: number;
    endTime?: number;
    result?: unknown;
}
interface ExecutionPlan {
    goal: string;
    steps: PlanStep[];
}
interface PlanExecutionState {
    /** Current execution plan */
    plan: ExecutionPlan | null;
    /** Whether orchestration is active */
    isOrchestrating: boolean;
    /** Current parallel execution level */
    parallelLevel: number | null;
    /** Timestamp when orchestration started */
    orchestrationStartTime: number | null;
}
interface PlanExecutionSlice {
    planExecution: PlanExecutionState;
    setPlanCreated: (goal: string, steps: Array<{
        id: number;
        task: string;
        agent: string;
        dependencies?: number[];
        parallel?: boolean;
        subtasks?: Array<{
            id: number;
            task: string;
            agent: string;
        }>;
    }>) => void;
    setStepStarted: (stepId: number) => void;
    setStepDone: (stepId: number, result?: unknown) => void;
    setStepError: (stepId: number, error: string) => void;
    setSubtaskStarted: (parentId: number, subtaskId: number) => void;
    setSubtaskDone: (parentId: number, subtaskId: number, result?: unknown) => void;
    setLevelStarted: (level: number) => void;
    setOrchestrationDone: () => void;
    resetPlanExecution: () => void;
    getActiveStep: () => PlanStep | null;
    getActiveSubtask: () => PlanSubtask | null;
    getCompletedStepIds: () => number[];
    getPlanProgress: () => {
        completed: number;
        total: number;
        percentage: number;
    };
    isPlanRunning: () => boolean;
}

/**
 * Deep Research Slice - State management for deep research feature
 *
 * Manages research settings, active sessions, and results
 * Uses centralized configuration from @onegenui/deep-research
 */

type DeepResearchEffortLevel = "standard" | "deep" | "max";
interface DeepResearchSettings {
    enabled: boolean;
    effortLevel: DeepResearchEffortLevel;
    maxSteps: number;
    parallelRequests: number;
    autoStopOnQuality: boolean;
    includeVisualizations: boolean;
    qualityThreshold: number;
}
interface AuthenticatedSource {
    platform: string;
    displayName: string;
    isConnected: boolean;
    lastValidated?: Date;
}
interface ResearchPhase {
    id: string;
    label: string;
    status: "pending" | "running" | "complete" | "error";
    progress: number;
    details?: string;
    startTime?: number;
    endTime?: number;
}
interface ResearchSource {
    id: string;
    url: string;
    title: string;
    domain: string;
    credibility: number;
    status: "fetching" | "analyzing" | "complete" | "error";
}
interface ActiveResearch {
    id: string;
    query: string;
    effortLevel: DeepResearchEffortLevel;
    status: "initializing" | "searching" | "analyzing" | "synthesizing" | "complete" | "error" | "stopped";
    startTime: number;
    estimatedTimeMs: number;
    progress: number;
    currentPhase: string;
    phases: ResearchPhase[];
    sources: ResearchSource[];
    sourcesTarget: number;
    error?: string;
}
interface ResearchResultSummary {
    id: string;
    query: string;
    completedAt: number;
    sourcesUsed: number;
    qualityScore: number;
    hasVisualizations: boolean;
}
interface DeepResearchSlice {
    deepResearchSettings: DeepResearchSettings;
    setDeepResearchEnabled: (enabled: boolean) => void;
    setDeepResearchEffortLevel: (level: DeepResearchEffortLevel) => void;
    setDeepResearchSettings: (settings: Partial<DeepResearchSettings>) => void;
    resetDeepResearchSettings: () => void;
    authenticatedSources: AuthenticatedSource[];
    setAuthenticatedSources: (sources: AuthenticatedSource[]) => void;
    updateAuthenticatedSource: (platform: string, updates: Partial<AuthenticatedSource>) => void;
    activeResearch: ActiveResearch | null;
    startResearch: (query: string) => void;
    updateResearchProgress: (updates: Partial<ActiveResearch>) => void;
    updateResearchPhase: (phaseId: string, updates: Partial<ResearchPhase>) => void;
    addResearchSource: (source: ResearchSource) => void;
    updateResearchSource: (sourceId: string, updates: Partial<ResearchSource>) => void;
    stopResearch: () => void;
    completeResearch: (qualityScore: number) => void;
    failResearch: (error: string) => void;
    clearActiveResearch: () => void;
    researchHistory: ResearchResultSummary[];
    addToResearchHistory: (result: ResearchResultSummary) => void;
    clearResearchHistory: () => void;
}

/**
 * UI Tree Slice - Streaming UI state management
 *
 * This slice manages the UI tree state during streaming generation.
 * Using Zustand ensures proper reactivity when the tree is updated
 * from async stream handlers.
 */

interface UITreeSlice {
    uiTree: UITree | null;
    isTreeStreaming: boolean;
    treeVersion: number;
    setUITree: (tree: UITree | null) => void;
    updateUITree: (updater: (tree: UITree) => UITree) => void;
    setElement: (key: string, element: UIElement) => void;
    removeElement: (key: string) => void;
    applyTreePatch: (patch: JsonPatch) => void;
    setTreeStreaming: (streaming: boolean) => void;
    clearUITree: () => void;
    bumpTreeVersion: () => void;
}

/**
 * Workspace Slice
 *
 * Manages Canvas workspace state:
 * - Open documents (tabs)
 * - Active document
 * - Workspace layout mode
 * - YOLO mode toggle
 * - AI edit approvals
 */

/**
 * Editor content type - supports both Lexical and Tiptap formats
 *
 * Lexical format has a root node with children
 * Tiptap format has a type and content array
 */
type EditorContent = Record<string, unknown>;
/** Document in workspace */
interface WorkspaceDocument {
    /** Unique document ID */
    id: string;
    /** Document title */
    title: string;
    /** Editor content (Lexical or Tiptap format) */
    content: EditorContent | null;
    /** Last saved timestamp */
    savedAt: number | null;
    /** Last modified timestamp */
    modifiedAt: number;
    /** Has unsaved changes */
    isDirty: boolean;
    /** Document format */
    format: "tiptap" | "lexical" | "markdown" | "html";
}
/** Pending AI edit requiring approval */
interface PendingAIEdit {
    /** Edit ID */
    id: string;
    /** Target document ID */
    documentId: string;
    /** Description of the edit */
    description: string;
    /** Preview of changes (diff) */
    preview: {
        before: string;
        after: string;
    };
    /** New content if approved */
    newContent: EditorContent;
    /** Created timestamp */
    createdAt: number;
}
/** Workspace layout mode */
type WorkspaceLayout = "chat-only" | "split" | "canvas-only";
interface WorkspaceSlice {
    /** Open documents */
    documents: WorkspaceDocument[];
    /** Active document ID */
    activeDocumentId: string | null;
    /** Workspace layout mode */
    workspaceLayout: WorkspaceLayout;
    /** YOLO mode - auto-apply AI edits */
    yoloMode: boolean;
    /** Pending AI edits requiring approval */
    pendingEdits: PendingAIEdit[];
    /** Is workspace panel visible */
    isWorkspaceOpen: boolean;
    /** Create new document */
    createDocument: (title?: string) => WorkspaceDocument;
    /** Open existing document */
    openDocument: (doc: WorkspaceDocument) => void;
    /** Close document by ID */
    closeDocument: (id: string) => void;
    /** Set active document */
    setActiveDocument: (id: string) => void;
    /** Update document content */
    updateDocumentContent: (id: string, content: EditorContent | null) => void;
    /** Rename document */
    renameDocument: (id: string, title: string) => void;
    /** Mark document as saved */
    markDocumentSaved: (id: string) => void;
    /** Set workspace layout */
    setWorkspaceLayout: (layout: WorkspaceLayout) => void;
    /** Toggle workspace panel */
    toggleWorkspace: () => void;
    /** Toggle YOLO mode */
    setYoloMode: (enabled: boolean) => void;
    /** Add pending AI edit */
    addPendingEdit: (edit: Omit<PendingAIEdit, "id" | "createdAt">) => void;
    /** Approve pending edit */
    approvePendingEdit: (editId: string) => void;
    /** Reject pending edit */
    rejectPendingEdit: (editId: string) => void;
    /** Clear all pending edits */
    clearPendingEdits: () => void;
    /** Get active document */
    getActiveDocument: () => WorkspaceDocument | null;
    /** Check if document is open */
    isDocumentOpen: (id: string) => boolean;
}

/**
 * Canvas Slice
 *
 * Manages inline Canvas editor state for GenUI components.
 * Separate from WorkspaceSlice which handles standalone documents.
 *
 * Key features:
 * - Per-canvas state management by canvasId (usually element.key)
 * - Streaming-safe updates without forcing re-mount
 * - Tiptap editor state synchronization
 * - Pending AI edits queue
 */

/** Tiptap document format */
type CanvasEditorState = {
    type: "doc";
    content: unknown[];
};
/** Canvas instance state */
interface CanvasInstance {
    /** Unique canvas ID (usually element.key from GenUI tree) */
    id: string;
    /** Current editor content (Tiptap format) */
    content: CanvasEditorState | null;
    /** Is content being streamed from AI */
    isStreaming: boolean;
    /** Content version (increments on each update) */
    version: number;
    /** Last update timestamp */
    updatedAt: number;
    /** Has unsaved local changes */
    isDirty: boolean;
    /** Document title (optional) */
    title?: string;
    /** Associated document ID for persistence */
    documentId?: string;
}
/** Pending AI content update */
interface CanvasPendingUpdate {
    /** Canvas ID */
    canvasId: string;
    /** New content */
    content: CanvasEditorState;
    /** Update timestamp */
    timestamp: number;
}
interface CanvasSlice {
    /** Map of canvas instances by ID */
    canvasInstances: Map<string, CanvasInstance>;
    /** Pending updates queue (for batching during streaming) */
    canvasPendingUpdates: CanvasPendingUpdate[];
    /** Initialize or get a canvas instance */
    initCanvas: (canvasId: string, initialContent?: CanvasEditorState | null, options?: {
        title?: string;
        documentId?: string;
    }) => CanvasInstance;
    /** Remove a canvas instance */
    removeCanvas: (canvasId: string) => void;
    /** Check if canvas exists */
    hasCanvas: (canvasId: string) => boolean;
    /** Get canvas instance */
    getCanvas: (canvasId: string) => CanvasInstance | undefined;
    /** Update canvas content (streaming-safe) */
    updateCanvasContent: (canvasId: string, content: CanvasEditorState | null) => void;
    /** Set streaming state */
    setCanvasStreaming: (canvasId: string, isStreaming: boolean) => void;
    /** Mark canvas as dirty (has unsaved changes) */
    setCanvasDirty: (canvasId: string, isDirty: boolean) => void;
    /** Queue an update for later application */
    queueCanvasUpdate: (canvasId: string, content: CanvasEditorState) => void;
    /** Apply all pending updates for a canvas */
    flushCanvasUpdates: (canvasId: string) => void;
    /** Clear pending updates without applying */
    clearCanvasPendingUpdates: (canvasId: string) => void;
    /** Get all canvas IDs */
    getCanvasIds: () => string[];
    /** Get streaming canvases */
    getStreamingCanvases: () => CanvasInstance[];
}

/**
 * ComponentStateSlice - Centralized component state management
 *
 * Each component can register its state here via useElementState hook.
 * This state is automatically:
 * 1. Stored in Zustand (reactive)
 * 2. Synced to UI tree (for AI context)
 * 3. Included in API requests
 *
 * @module store/slices/component-state
 */

interface ComponentStateSlice {
    /** State for each element, indexed by elementKey */
    componentState: Record<string, Record<string, unknown>>;
    /** Set entire state for an element */
    setComponentState: (elementKey: string, state: Record<string, unknown>) => void;
    /** Update specific fields in element state (shallow merge) */
    updateComponentState: (elementKey: string, updates: Record<string, unknown>) => void;
    /** Deep merge updates into element state */
    mergeComponentState: (elementKey: string, updates: Record<string, unknown>) => void;
    /** Clear state for a specific element */
    clearComponentState: (elementKey: string) => void;
    /** Clear all component state (e.g., on chat clear) */
    clearAllComponentState: () => void;
    /** Get state for an element (returns empty object if not found) */
    getElementState: (elementKey: string) => Record<string, unknown>;
}

/**
 * Store Types - Shared types for Zustand slices with immer middleware
 *
 * This is the official Zustand pattern for typing slices with middleware.
 * See: https://zustand.docs.pmnd.rs/guides/typescript#slices-pattern
 */

/**
 * The complete store state combining all slices
 */
type StoreState = DomainSlice & UISlice & SelectionSlice & SettingsSlice & AnalyticsSlice & ActionsSlice & ValidationSlice & ToolProgressSlice & PlanExecutionSlice & DeepResearchSlice & UITreeSlice & WorkspaceSlice & CanvasSlice & ComponentStateSlice;

/**
 * Selection Slice - Unified element selection state
 *
 * Supports:
 * - Single element selection (component focus)
 * - Multi-selection
 * - Deep selection (granular sub-element selection)
 * - Hover/focus tracking
 */

/**
 * Deep selection info - represents a selected sub-element (SERIALIZABLE)
 *
 * This is the canonical type for selection data stored in Zustand.
 * It contains ONLY serializable data - no DOM references.
 *
 * For DOM access, use DeepSelectionInfoWithElement from contexts/selection/types.ts
 * which extends this type with an optional `element` property.
 */
interface DeepSelectionInfo$1 {
    /** Unique ID for this selection (store-generated) */
    id: string;
    /** The parent component's element key */
    elementKey: string;
    /** CSS path from component root to the selected element */
    cssPath: string;
    /** Tag name of the selected element */
    tagName: string;
    /** Text content (truncated) for AI context */
    textContent: string;
    /** The containing item's data (if selection is within a selectable-item) */
    containingItem?: Record<string, unknown>;
    /** The index of the item in the parent array */
    itemIndex?: number;
    /** The item's unique ID (from data-item-id attribute) */
    itemId?: string;
    /** Type of selection: 'item' for full item, 'granular' for specific text */
    selectionType: "item" | "granular";
    /** Timestamp of selection */
    timestamp: number;
}
/**
 * Input type for creating a new selection.
 * id and timestamp are generated by the store.
 */
type DeepSelectionInput$1 = Omit<DeepSelectionInfo$1, "id" | "timestamp">;
interface SelectionSlice {
    selectedKey: string | null;
    selectedElement: UIElement | null;
    select: (key: string | null, element: UIElement | null) => void;
    clearSelection: () => void;
    multiSelectedKeys: Set<string>;
    addToMultiSelection: (key: string) => void;
    removeFromMultiSelection: (key: string) => void;
    toggleMultiSelection: (key: string) => void;
    clearMultiSelection: () => void;
    isMultiSelected: (key: string) => boolean;
    deepSelections: DeepSelectionInfo$1[];
    deepSelectionActive: boolean;
    addDeepSelection: (selection: DeepSelectionInput$1) => string;
    removeDeepSelection: (id: string) => void;
    removeDeepSelectionByElement: (elementKey: string, cssPath: string) => void;
    clearDeepSelections: () => void;
    clearDeepSelectionsForElement: (elementKey: string) => void;
    isDeepSelected: (elementKey: string, cssPath: string) => boolean;
    getDeepSelectionsForElement: (elementKey: string) => DeepSelectionInfo$1[];
    setDeepSelectionActive: (active: boolean) => void;
    getGranularSelection: () => Record<string, Set<string>>;
    hoveredKey: string | null;
    setHoveredKey: (key: string | null) => void;
    focusedKey: string | null;
    setFocusedKey: (key: string | null) => void;
}

/**
 * Data about a selectable item (used in selection logic)
 */
interface SelectableItemData {
    /** Unique identifier for this item */
    itemId: string;
    /** The parent element's key */
    elementKey: string;
    /** Optional data associated with this item */
    data?: unknown;
    /** DOM element reference (if available) */
    element?: HTMLElement;
}
/**
 * Represents a selected item
 */
interface SelectedItem {
    /** Unique identifier for this item */
    itemId: string;
    /** The parent element's key */
    elementKey: string;
    /** Optional data associated with this item */
    data?: unknown;
}
/**
 * Deep selection with DOM element reference.
 *
 * Extends the serializable store type with an optional HTMLElement reference.
 * The element is reconstructed on-demand via findElementByCssPath() and is NOT
 * stored in Zustand (immer cannot handle DOM nodes).
 */
interface DeepSelectionInfo extends DeepSelectionInfo$1 {
    /** The actual DOM element reference (computed on-demand, not stored) */
    element?: HTMLElement | null;
}
/**
 * Input for creating a selection with optional DOM element.
 * id and timestamp are generated by the store.
 */
interface DeepSelectionInput extends DeepSelectionInput$1 {
    /** DOM element reference (for tracking, not stored in Zustand) */
    element?: HTMLElement | null;
}
/**
 * Selection context value type
 */
interface SelectionContextValue {
    /** Map of elementKey -> Set of selected itemIds (derived from Zustand) */
    granularSelection: Record<string, Set<string>>;
    /** Toggle selection of an item within an element */
    toggleSelection: (elementKey: string, itemId: string) => void;
    /** Clear selection for a specific element or all */
    clearSelection: (elementKey?: string) => void;
    /** Check if an item is selected */
    isSelected: (elementKey: string, itemId: string) => boolean;
    /** Get all selected item IDs for an element */
    getSelectedItems: (elementKey: string) => string[];
    /** Current deep selections (multiple elements can be selected) */
    deepSelections: DeepSelectionInfo[];
    /** Clear all deep selections */
    clearDeepSelection: () => void;
    /** Check if deep selection is currently active (prevents component-level selection) */
    isDeepSelectionActive: () => boolean;
}
/**
 * Props for SelectionProvider
 */
interface SelectionProviderProps {
    children: ReactNode;
}
/**
 * Props for the SelectableItem component
 */
interface SelectableItemProps {
    /** The parent element's key (from element.key) */
    elementKey: string;
    /** Unique identifier for this item within the parent */
    itemId: string;
    /** Children to render inside the selectable wrapper */
    children: ReactNode;
    /** HTML element to render as (default: 'div') */
    as?: React.ElementType;
    /** Additional CSS class name */
    className?: string;
    /** Inline styles */
    style?: React.CSSProperties;
    /** Additional props to spread onto the element */
    [key: string]: unknown;
}

/**
 * Provider for granular item selection within components.
 *
 * Architecture:
 * - `deepSelections` is the SINGLE SOURCE OF TRUTH for all selections
 * - `granularSelection` is DERIVED from deepSelections (flat structure for component API)
 * - This ensures visual state and logical state are always in sync
 *
 * Features:
 * - Automatic event delegation: components only need data-* attributes
 * - Global CSS injection for consistent styling
 * - Zero boilerplate in components
 *
 * Components should add these attributes to selectable items:
 * - data-selectable-item: marks the element as selectable
 * - data-element-key: the component's element.key
 * - data-item-id: unique identifier for the item
 */
declare function SelectionProvider({ children }: SelectionProviderProps): react_jsx_runtime.JSX.Element;

/**
 * Hook to access granular selection functionality.
 * Must be used within a SelectionProvider.
 */
declare function useSelection(): SelectionContextValue;
/**
 * Simplified hook for components that only need to check selection state.
 * Returns helpers scoped to a specific element.
 */
declare function useItemSelection(elementKey: string): {
    isItemSelected: (itemId: string) => boolean;
    selectedItems: string[];
    hasSelection: boolean;
};

/**
 * Core wrapper component for making items selectable.
 *
 * This is the recommended way to implement granular selection in components.
 * It automatically handles:
 * - Selection state tracking
 * - Visual feedback (via CSS)
 * - Event delegation integration
 *
 * @example
 * ```tsx
 * import { SelectableItem } from "@onegenui/react";
 *
 * // Inside your component:
 * {items.map(item => (
 *   <SelectableItem
 *     key={item.id}
 *     elementKey={element.key}
 *     itemId={item.id}
 *     style={{ padding: 16 }}
 *   >
 *     {item.content}
 *   </SelectableItem>
 * ))}
 * ```
 */
declare function SelectableItem({ elementKey, itemId, children, as: Component, className, style, ...rest }: SelectableItemProps): react_jsx_runtime.JSX.Element;

/**
 * Helper to generate the required data attributes for a selectable item.
 * Use this in components to reduce boilerplate.
 *
 * @example
 * ```tsx
 * {items.map(item => (
 *   <div key={item.id} {...selectableItemProps(element.key, item.id)}>
 *     {item.content}
 *   </div>
 * ))}
 * ```
 */
declare function selectableItemProps(elementKey: string, itemId: string, isSelected?: boolean): Record<string, string | undefined>;

interface MarkdownTheme$1 {
    /** Code block background color */
    codeBlockBg: string;
    /** Code block border color */
    codeBlockBorder: string;
    /** Inline code background color */
    inlineCodeBg: string;
    /** Link color */
    linkColor: string;
    /** Blockquote border color */
    blockquoteBorder: string;
    /** Horizontal rule color */
    hrColor: string;
}
interface MarkdownContextValue {
    /** Whether markdown rendering is enabled globally */
    enabled: boolean;
    /** The theme for markdown rendering */
    theme: MarkdownTheme$1;
    /** Render text with markdown support */
    renderText: (content: string | null | undefined, options?: RenderTextOptions) => ReactNode;
}
interface RenderTextOptions {
    /** Whether to render inline (no block elements like paragraphs) */
    inline?: boolean;
    /** Additional className */
    className?: string;
    /** Additional style */
    style?: CSSProperties;
}
interface MarkdownProviderProps {
    children: ReactNode;
    /** Whether markdown rendering is enabled (default: true) */
    enabled?: boolean;
    /** Custom theme overrides */
    theme?: Partial<MarkdownTheme$1>;
}

/**
 * Provider for global markdown rendering configuration.
 *
 * Wrap your app with this provider to enable markdown rendering in all components.
 * Components can use `useRenderText()` to render text with markdown support.
 *
 * @example
 * ```tsx
 * <MarkdownProvider>
 *   <App />
 * </MarkdownProvider>
 * ```
 */
declare function MarkdownProvider({ children, enabled, theme: themeOverrides, }: MarkdownProviderProps): react_jsx_runtime.JSX.Element;
/**
 * Hook to access the markdown rendering context.
 *
 * Returns `renderText` function that automatically applies markdown formatting.
 * If no provider is found, returns a fallback that renders plain text.
 *
 * @example
 * ```tsx
 * function MyComponent({ description }: { description: string }) {
 *   const { renderText } = useMarkdown();
 *   return <div>{renderText(description)}</div>;
 * }
 * ```
 */
declare function useMarkdown(): MarkdownContextValue;
/**
 * Convenience hook that returns just the renderText function.
 *
 * @example
 * ```tsx
 * function MyComponent({ description }: { description: string }) {
 *   const renderText = useRenderText();
 *   return <div>{renderText(description)}</div>;
 * }
 * ```
 */
declare function useRenderText(): (content: string | null | undefined, options?: RenderTextOptions) => ReactNode;

/**
 * Citation data structure - supports both web and document citations
 */
interface Citation {
    id: string;
    title: string;
    url?: string | null;
    domain?: string | null;
    pageNumber?: number | null;
    excerpt?: string | null;
    documentTitle?: string | null;
    snippet?: string | null;
}
interface CitationContextValue {
    citations: Citation[];
    setCitations: (citations: Citation[]) => void;
    addCitation: (citation: Citation) => void;
    clearCitations: () => void;
    getCitation: (id: string) => Citation | undefined;
}
/**
 * Provider for citation data that can be displayed inline in markdown.
 */
declare function CitationProvider({ children }: {
    children: ReactNode;
}): React$1.FunctionComponentElement<React$1.ProviderProps<CitationContextValue | null>>;
/**
 * Hook to access citation context
 */
declare function useCitations(): CitationContextValue;

/**
 * Form field for dynamic question forms
 */
interface FormField {
    id: string;
    label: string;
    type: "text" | "number" | "select" | "checkbox" | "date" | "textarea" | "radio";
    options?: {
        value: string;
        label: string;
    }[];
    placeholder?: string;
    defaultValue?: string | number | boolean;
    /** Allow user to enter custom value (adds "Other" option to select/radio) */
    allowCustom?: boolean;
    validation?: {
        required?: boolean;
        min?: number;
        max?: number;
        minLength?: number;
        maxLength?: number;
        pattern?: string;
    };
}
/**
 * Quick reply option for simple button choices
 */
interface QuickReplyOption {
    id: string;
    label: string;
    value: string;
    variant?: "default" | "primary" | "success" | "danger";
}
/**
 * Question payload from AI asking for user input
 * Supports multiple interaction types for better UX
 */
interface QuestionPayload {
    id: string;
    text: string;
    type: "text" | "form" | "quick-reply";
    /** Form fields (for type: "form") */
    fields?: FormField[];
    /** Quick reply options (for type: "quick-reply") */
    options?: QuickReplyOption[];
    /** Allow multiple selection for quick-reply */
    multiple?: boolean;
    /** Allow custom text input in addition to options */
    allowCustom?: boolean;
    required?: boolean;
}
/**
 * Suggestion chip for quick actions
 */
interface SuggestionChip {
    id: string;
    label: string;
    prompt: string;
    icon?: string;
    variant?: "default" | "primary" | "success" | "warning";
}
/**
 * Chat message type
 */
interface ChatMessage {
    role: "assistant" | "user" | "system";
    content: string;
}
/**
 * File attachment containing metadata and preview
 */
interface FileAttachment {
    id: string;
    type: "document" | "image" | "spreadsheet" | "presentation" | "other";
    file: File;
    preview?: string;
}
/** Server-cached document attachment (from library) */
interface LibraryAttachment {
    id: string;
    documentId: string;
    fileName: string;
    mimeType: string;
    pageCount?: number;
    type: "library-document";
}
type Attachment = FileAttachment | LibraryAttachment;
declare function isLibraryAttachment(a: Attachment): a is LibraryAttachment;
declare function isFileAttachment(a: Attachment): a is FileAttachment;
/**
 * Persisted attachment data (serializable for database storage)
 */
interface PersistedAttachment {
    id: string;
    fileName: string;
    mimeType: string;
    type: "document" | "image" | "spreadsheet" | "presentation" | "other";
    /** Parsed text content of the document */
    parsedContent?: string;
    /** Base64 encoded content for images */
    base64Content?: string;
    /** Size in bytes */
    size: number;
}
/**
 * Tool progress event for granular UI updates
 */
interface ToolProgress {
    toolName: string;
    toolCallId: string;
    status: "starting" | "progress" | "complete" | "error";
    message?: string;
    data?: unknown;
}
/**
 * A single turn in the conversation
 */
interface ConversationTurn {
    id: string;
    userMessage: string;
    assistantMessages: ChatMessage[];
    treeSnapshot: UITree | null;
    timestamp: number;
    /** Questions from AI requiring user response */
    questions?: QuestionPayload[];
    /** Suggestion chips for quick follow-up actions */
    suggestions?: SuggestionChip[];
    /** User's answers to questions */
    questionAnswers?: Record<string, unknown>;
    /** Whether this turn was triggered proactively (hides user message in UI) */
    isProactive?: boolean;
    /** Files attached to this turn (runtime only, contains File objects) */
    attachments?: Attachment[];
    /** Persisted attachment data (serializable, for database storage) */
    persistedAttachments?: PersistedAttachment[];
    /** Tool progress events for granular updates */
    toolProgress?: ToolProgress[];
    /** Document index from Vectorless (smart parsing) */
    documentIndex?: DocumentIndex;
    /** Error message if turn failed */
    error?: string;
    /** Whether turn is still loading */
    isLoading?: boolean;
    /** Turn completion status for detailed state tracking */
    status?: "pending" | "streaming" | "complete" | "failed" | "partial";
}
/**
 * Minimal message format for AI SDK multi-turn conversations.
 * Used to pass conversation history to backend for native multi-turn support.
 */
interface ConversationMessage {
    role: "user" | "assistant";
    content: string;
}
/**
 * Converts ConversationTurn[] to ConversationMessage[] for AI SDK.
 * Includes all completed turns - model handles context window.
 */
declare function buildConversationMessages(turns: ConversationTurn[]): ConversationMessage[];
/**
 * Options for useUIStream
 */
interface UseUIStreamOptions {
    /** API endpoint */
    api: string;
    /** Callback when complete */
    onComplete?: (tree: UITree) => void;
    /** Callback on error */
    onError?: (error: Error) => void;
    /** Function to get dynamic headers (e.g. for auth) */
    getHeaders?: () => Record<string, string> | Promise<Record<string, string>>;
    /** Function to get current chat ID - used to bind streams to their originating chat */
    getChatId?: () => string | undefined;
    /** Callback when stream completes for a different chat (background completion) */
    onBackgroundComplete?: (chatId: string, tree: UITree, conversation: ConversationTurn[]) => void;
}
/**
 * Return type for useUIStream
 */
interface UseUIStreamReturn {
    /** Current UI tree */
    tree: UITree | null;
    /** Full conversation history (user messages + assistant messages + snapshots) */
    conversation: ConversationTurn[];
    /** Whether currently streaming */
    isStreaming: boolean;
    /** Error if any */
    error: Error | null;
    /** Send a prompt to generate UI */
    send: (prompt: string, context?: Record<string, unknown>, attachments?: Attachment[]) => Promise<void>;
    /** Clear the current tree and conversation */
    clear: () => void;
    /** Remove an element from the tree */
    removeElement: (elementKey: string) => void;
    /** Remove specific sub-items from an element's array prop by index or ID (supports undo) */
    removeSubItems: (elementKey: string, identifiers: (number | string)[]) => void;
    /** Update an element's props in the tree */
    updateElement: (elementKey: string, updates: Record<string, unknown>) => void;
    /** Update an element's layout (size, grid, resizable) */
    updateElementLayout: (elementKey: string, layoutUpdates: {
        width?: number;
        height?: number;
        column?: number;
        row?: number;
        columnSpan?: number;
        rowSpan?: number;
        resizable?: boolean;
    }) => void;
    /** Delete a turn and rollback to previous state */
    deleteTurn: (turnId: string) => void;
    /** Edit a turn message and regenerate */
    editTurn: (turnId: string, newMessage: string) => Promise<void>;
    /** Undo last action */
    undo: () => void;
    /** Redo last undone action */
    redo: () => void;
    /** Whether undo is available */
    canUndo: boolean;
    /** Whether redo is available */
    canRedo: boolean;
    /** Load a full session state */
    loadSession: (session: {
        tree: UITree;
        conversation: ConversationTurn[];
    }) => void;
    /** Answer a question from AI */
    answerQuestion: (turnId: string, questionId: string, answers: Record<string, unknown>) => void;
    /** Abort the current streaming request */
    abort: () => void;
}
type FlatElement = UIElement & {
    parentKey?: string | null;
};
/**
 * Types of user actions that can be tracked
 */
type ActionType = "toggle" | "input" | "select" | "click" | "complete" | "create" | "delete" | "update" | "submit" | "expand" | "collapse" | "drag" | "drop";
/**
 * A tracked user action on a component
 */
interface TrackedAction {
    id: string;
    timestamp: number;
    type: ActionType;
    elementKey: string;
    elementType: string;
    payload?: unknown;
    context?: {
        itemId?: string;
        itemIndex?: number;
        itemLabel?: string;
        previousValue?: unknown;
        newValue?: unknown;
        parentKey?: string;
    };
}
/**
 * Options for action tracker
 *
 * KISS Principle: Only essential options, smart defaults handle the rest.
 * The system automatically detects when user is editing and delays triggers.
 */
interface ActionTrackerOptions {
    /** Enable/disable action tracking */
    enabled: boolean;
    /**
     * Debounce delay in ms before triggering proactive AI.
     * Timer only starts when user is NOT focused on an editable element.
     * Default: 2000 (2 seconds)
     */
    debounceMs?: number;
    /** Maximum number of actions to keep in context for AI. Default: 5 */
    maxActionsInContext?: number;
}
/**
 * Proactivity mode for AI Assistant
 */
type ProactivityMode = "full" | "on-request" | "disabled";
/**
 * AI Assistant settings
 */
interface AIAssistantSettings {
    proactivity: {
        enabled: boolean;
        mode: ProactivityMode;
        debounceMs: number;
    };
    suggestions: {
        enabled: boolean;
        maxChips: number;
    };
    dataCollection: {
        preferForm: boolean;
        autoAsk: boolean;
    };
    onboarding: {
        showOnFirstUse: boolean;
        completed: boolean;
    };
}
/**
 * Default AI Assistant settings
 */
declare const DEFAULT_AI_SETTINGS: AIAssistantSettings;

interface DocumentSettings {
    smartParsingEnabled: boolean;
}
interface ExtendedAISettings extends AIAssistantSettings {
    documents: DocumentSettings;
}
declare const DEFAULT_EXTENDED_SETTINGS: ExtendedAISettings;
interface AISettingsContextValue {
    settings: ExtendedAISettings;
    updateSettings: (partial: Partial<ExtendedAISettings>) => void;
    setProactivityMode: (mode: ProactivityMode) => void;
    setProactivityEnabled: (enabled: boolean) => void;
    setSuggestionsEnabled: (enabled: boolean) => void;
    setDataCollectionPreferForm: (preferForm: boolean) => void;
    setSmartParsingEnabled: (enabled: boolean) => void;
    resetSettings: () => void;
    completeOnboarding: () => void;
    isLoading: boolean;
    isSyncing: boolean;
}

interface AISettingsProviderProps {
    children: ReactNode;
    initialSettings?: Partial<ExtendedAISettings>;
}
declare function AISettingsProvider({ children, initialSettings, }: AISettingsProviderProps): react_jsx_runtime.JSX.Element;
declare function useAISettings(): AISettingsContextValue;
declare function useAISettingsOptional(): AISettingsContextValue | null;
declare function useIsProactivityEnabled(): boolean;
declare function useAreSuggestionsEnabled(): boolean;
declare function useIsSmartParsingEnabled(): boolean;

interface ActionContextValue {
    /** Recent actions (limited by maxActionsInContext) */
    actions: TrackedAction[];
    /** Track a new user action */
    trackAction: (action: Omit<TrackedAction, "id" | "timestamp">) => void;
    /** Clear all tracked actions */
    clearActions: () => void;
    /** Get actions for AI context */
    getActionsForContext: () => TrackedAction[];
    /** Last action tracked */
    lastAction: TrackedAction | null;
    /** Subscribe to action events (for proactive AI) */
    onAction: (callback: (actions: TrackedAction[]) => void) => () => void;
    /** Options */
    options: ActionTrackerOptions;
    /** Update options */
    setOptions: (options: Partial<ActionTrackerOptions>) => void;
}

interface ActionProviderProps {
    children: ReactNode;
    initialOptions?: Partial<ActionTrackerOptions>;
}
declare function ActionProvider({ children, initialOptions, }: ActionProviderProps): react_jsx_runtime.JSX.Element;

declare function useActionContext(): ActionContextValue;
declare function useElementActionTracker(elementKey: string, elementType: string): {
    track: (type: ActionType, context?: TrackedAction["context"], payload?: unknown) => void;
    isEnabled: boolean;
};
declare function useActionSubscriber(callback: (actions: TrackedAction[]) => void, deps?: unknown[]): void;

declare function formatActionsForPrompt(actions: TrackedAction[]): string;

type DomainType = "workout" | "workout_plan" | "meal" | "nutrition_plan" | "trip" | "flight" | "hotel" | "project" | "task" | "schedule" | "supplement" | "calendar" | "diary";
interface AutoSavePayload {
    type: DomainType;
    chatId: string;
    elementKey: string;
    data: Record<string, unknown>;
}
interface AutoSaveResult {
    success: boolean;
    id?: string;
    error?: string;
}
interface AutoSaveContextValue {
    /**
     * Chat ID for the current context (used for source linking)
     */
    chatId: string | null;
    /**
     * Execute auto-save for a domain component
     */
    autoSave: (payload: Omit<AutoSavePayload, "chatId">) => Promise<AutoSaveResult>;
    /**
     * Debounced auto-save (recommended for use in components)
     */
    debouncedAutoSave: (payload: Omit<AutoSavePayload, "chatId">, delayMs?: number) => void;
    /**
     * Check if auto-save is enabled for this context
     */
    isEnabled: boolean;
}
interface AutoSaveProviderProps {
    children: ReactNode;
    /**
     * Current chat ID for source linking
     */
    chatId: string | null;
    /**
     * Enable/disable auto-save (default: true when chatId is provided)
     */
    enabled?: boolean;
    /**
     * Optional custom save endpoint
     */
    saveEndpoint?: string;
    /**
     * Callback when save completes
     */
    onSaveComplete?: (result: AutoSaveResult) => void;
    /**
     * Callback on save error
     */
    onSaveError?: (error: Error) => void;
}
declare function AutoSaveProvider({ children, chatId, enabled, saveEndpoint, onSaveComplete, onSaveError, }: AutoSaveProviderProps): react_jsx_runtime.JSX.Element;
/**
 * Hook to access auto-save functionality in domain components
 */
declare function useAutoSave(): AutoSaveContextValue;
/**
 * Hook to auto-save domain data on mount and when data changes
 */
declare function useDomainAutoSave(type: DomainType, elementKey: string, data: Record<string, unknown> | null, options?: {
    debounceMs?: number;
    skipMount?: boolean;
}): void;

interface UseElementStateOptions {
    /** Auto-sync to UI tree (default: true) */
    syncToTree?: boolean;
    /** Debounce ms for tree sync (default: 300) */
    debounceMs?: number;
}
/**
 * Hook to manage component state via Zustand with automatic tree sync
 *
 * @param elementKey - Unique key of the element
 * @param initialProps - Initial props from tree
 * @param options - Configuration options
 * @returns Tuple of [mergedState, updateFunction]
 */
declare function useElementState<T extends Record<string, unknown>>(elementKey: string, initialProps: T, options?: UseElementStateOptions): [T, (updates: Partial<T>) => void];

/**
 * Tool progress context value
 */
interface ToolProgressContextValue {
    /** All active tool progress events (not yet complete) */
    activeProgress: StoredProgressEvent[];
    /** All tool progress events (including complete) */
    allProgress: StoredProgressEvent[];
    /** Whether any tool is currently running */
    isToolRunning: boolean;
    /** Add a new tool progress event */
    addProgress: (event: Omit<StoredProgressEvent, "timestamp" | "type">) => void;
    /** Update an existing tool progress event */
    updateProgress: (toolCallId: string, updates: Partial<Omit<StoredProgressEvent, "toolCallId" | "timestamp" | "type">>) => void;
    /** Clear all progress */
    clearProgress: () => void;
    /** Clear completed progress older than X ms */
    clearCompletedOlderThan: (ms: number) => void;
}
/**
 * Tool progress provider props
 */
interface ToolProgressProviderProps {
    children: ReactNode;
    /** Auto-clear completed progress after X ms (default: 3000) */
    autoClearCompleteMs?: number;
    /** Maximum number of progress events to keep (default: 50) */
    maxEvents?: number;
}
/**
 * ToolProgressProvider - Global provider for tool execution progress
 *
 * Wrap your app with this provider to enable automatic tool progress tracking.
 * The progress state is managed centrally via Zustand and can be consumed anywhere.
 */
declare function ToolProgressProvider({ children, autoClearCompleteMs, maxEvents: _maxEvents, }: ToolProgressProviderProps): react_jsx_runtime.JSX.Element;
/**
 * useToolProgress - Access the tool progress context
 *
 * @throws Error if used outside of ToolProgressProvider
 */
declare function useToolProgress(): ToolProgressContextValue;
/**
 * useToolProgressOptional - Access the tool progress context (optional)
 *
 * Returns null if used outside of ToolProgressProvider (doesn't throw)
 */
declare function useToolProgressOptional(): ToolProgressContextValue | null;
/**
 * useIsToolRunning - Check if any tool is currently running
 */
declare function useIsToolRunning(): boolean;
/**
 * useActiveToolProgress - Get only active (running) tool progress
 */
declare function useActiveToolProgress$1(): StoredProgressEvent[];

type UnifiedProgressItemType = "plan-step" | "plan-subtask" | "tool";
type UnifiedProgressStatus = "pending" | "running" | "complete" | "error";
interface UnifiedProgressItem {
    id: string;
    type: UnifiedProgressItemType;
    label: string;
    message?: string;
    status: UnifiedProgressStatus;
    progress?: number;
    startTime?: number;
    endTime?: number;
    parentId?: string;
    children?: UnifiedProgressItem[];
}
interface UnifiedProgressState {
    /** Whether any generation is in progress */
    isGenerating: boolean;
    /** Current goal/description of what's being generated */
    goal: string | null;
    /** All progress items (plan steps + tools) */
    items: UnifiedProgressItem[];
    /** Currently active items */
    activeItems: UnifiedProgressItem[];
    /** Overall progress percentage */
    overallProgress: number;
    /** Time elapsed since generation started (ms) */
    elapsedTime: number | null;
}
interface UnifiedProgressContextValue extends UnifiedProgressState {
    /** Get item by ID */
    getItem: (id: string) => UnifiedProgressItem | undefined;
    /** Check if a specific item is running */
    isItemRunning: (id: string) => boolean;
}
interface UnifiedProgressProviderProps {
    children: ReactNode;
}
declare function UnifiedProgressProvider({ children, }: UnifiedProgressProviderProps): react_jsx_runtime.JSX.Element;
/**
 * useUnifiedProgress - Access the unified progress context
 */
declare function useUnifiedProgress(): UnifiedProgressContextValue;
/**
 * useUnifiedProgressOptional - Access unified progress (optional)
 */
declare function useUnifiedProgressOptional(): UnifiedProgressContextValue | null;
/**
 * useIsGenerating - Check if any generation is in progress
 */
declare function useIsGenerating(): boolean;
/**
 * useGeneratingGoal - Get the current generation goal
 */
declare function useGeneratingGoal(): string | null;

interface SinglePropChange {
    elementKey: string;
    propName: string;
    oldValue: unknown;
    newValue: unknown;
}
interface ElementChange {
    key: string;
    props: Record<string, unknown>;
    /** Previous values before the change (for undo) */
    previousProps?: Record<string, unknown>;
    /** Timestamp of the change */
    timestamp: number;
}
interface ChangeHistoryItem {
    changes: SinglePropChange[];
    timestamp: number;
}
interface EditModeContextValue {
    /** Whether edit mode is active */
    isEditing: boolean;
    /** Enable edit mode */
    enableEditing: () => void;
    /** Disable edit mode */
    disableEditing: () => void;
    /** Toggle edit mode */
    toggleEditing: () => void;
    /** Currently focused element key (for highlighting) */
    focusedKey: string | null;
    /** Set focused element */
    setFocusedKey: (key: string | null) => void;
    /** Track pending changes before commit */
    pendingChanges: Map<string, Record<string, unknown>>;
    /** Record a pending change */
    recordChange: (elementKey: string, propName: string, newValue: unknown, previousValue?: unknown) => void;
    /** Commit all pending changes (or auto-committed) */
    commitChanges: () => void;
    /** Discard all pending changes */
    discardChanges: () => void;
    /** Undo last change */
    undo: () => void;
    /** Redo last undone change */
    redo: () => void;
    /** Whether undo is available */
    canUndo: boolean;
    /** Whether redo is available */
    canRedo: boolean;
    /** Change history for diff view */
    history: ChangeHistoryItem[];
    /** Number of pending changes */
    pendingCount: number;
    /** Callback when changes are committed */
    onCommit?: (changes: Array<ElementChange>) => void;
}
interface EditModeProviderProps {
    children: ReactNode;
    /** Initial edit mode state */
    initialEditing?: boolean;
    /** Callback when changes are committed */
    onCommit?: (changes: Array<ElementChange>) => void;
    /** Auto-save delay in ms (0 to disable, default 1500) */
    autoSaveDelay?: number;
    /** Max history items to keep */
    maxHistoryItems?: number;
}
declare function EditModeProvider({ children, initialEditing, onCommit, autoSaveDelay, maxHistoryItems, }: EditModeProviderProps): react_jsx_runtime.JSX.Element;
declare function useEditMode(): EditModeContextValue;
/**
 * Hook to check if a specific element is being edited
 */
declare function useIsElementEditing(elementKey: string): boolean;
/**
 * Hook for element-specific edit functionality
 */
declare function useElementEdit(elementKey: string): {
    isEditing: boolean;
    isFocused: boolean;
    handleChange: (propName: string, newValue: unknown) => void;
    handleFocus: () => void;
    handleBlur: () => void;
};

/**
 * Renderer Types
 */

/**
 * Props passed to component renderers
 */
interface ComponentRenderProps<P = Record<string, unknown>> {
    /** The element being rendered */
    element: UIElement<string, P>;
    /** Rendered children */
    children?: ReactNode;
    /** Render text with markdown support (core-level) */
    renderText?: (content: string | null | undefined, options?: {
        inline?: boolean;
        className?: string;
        style?: CSSProperties;
    }) => ReactNode;
    /**
     * Render editable text. When in edit mode, returns an editable span.
     * When not in edit mode, returns the text as-is (or uses renderText if markdown).
     * Use this for props that should be inline-editable.
     *
     * @param propName - The prop name (e.g., "title", "description")
     * @param value - The text value
     * @param options - Additional options (className, as tag, multiline)
     */
    renderEditableText?: (propName: string, value: string | null | undefined, options?: {
        className?: string;
        as?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
        multiline?: boolean;
        placeholder?: string;
    }) => ReactNode;
    /** Execute an action */
    onAction?: (action: Action) => void;
    /** Whether the parent is loading */
    loading?: boolean;
}
/**
 * Component renderer type
 */
type ComponentRenderer<P = Record<string, unknown>> = ComponentType<ComponentRenderProps<P>>;
/**
 * Registry of component renderers
 */
type ComponentRegistry = Record<string, ComponentRenderer<any>>;
/**
 * Props for the Renderer component
 */
interface RendererProps {
    /** The UI tree to render */
    tree: UITree | null;
    /** Component registry */
    registry: ComponentRegistry;
    /** Whether the tree is currently loading/streaming */
    loading?: boolean;
    /** Fallback component for unknown types */
    fallback?: ComponentRenderer;
    /** Enable element selection */
    selectable?: boolean;
    /** Callback when an element is selected */
    onElementSelect?: (element: UIElement) => void;
    /** Long-press delay for selection (ms) - applies to all devices */
    selectionDelayMs?: number;
    /** Currently selected element key (for visual highlight) */
    selectedKey?: string | null;
    /** Enable automatic interaction tracking for proactive AI */
    trackInteractions?: boolean;
    /** Callback when user interacts with elements (for proactive AI) */
    onInteraction?: (action: Omit<TrackedAction, "id" | "timestamp">) => void;
    /** Callback when an element is resized (for elements with layout.resizable) */
    onResize?: (elementKey: string, size: {
        width: number;
        height: number;
    }) => void;
    /**
     * Enable automatic responsive grid layout for root children.
     * When true, root children are wrapped in a CSS grid with auto-fit columns.
     * Default: true (enabled for optimal use of screen space)
     */
    autoGrid?: boolean;
}
/**
 * Props for internal ElementRenderer component
 */
interface ElementRendererProps$1 {
    element: UIElement;
    tree: UITree;
    registry: ComponentRegistry;
    loading?: boolean;
    fallback?: ComponentRenderer;
    selectable?: boolean;
    onElementSelect?: (element: UIElement) => void;
    selectionDelayMs: number;
    selectedKey?: string | null;
    onResize?: (elementKey: string, size: {
        width: number;
        height: number;
    }) => void;
}
/**
 * Props for JSONUIProvider
 */
interface JSONUIProviderProps {
    /** Component registry */
    registry: ComponentRegistry;
    /** Initial data model */
    initialData?: Record<string, unknown>;
    /** Auth state */
    authState?: {
        isSignedIn: boolean;
        user?: Record<string, unknown>;
    };
    /** Action handlers */
    actionHandlers?: Record<string, (params: Record<string, unknown>) => Promise<unknown> | unknown>;
    /** Navigation function */
    navigate?: (path: string) => void;
    /** Custom validation functions */
    validationFunctions?: Record<string, (value: unknown, args?: Record<string, unknown>) => boolean>;
    /** Callback when data changes */
    onDataChange?: (path: string, value: unknown) => void;
    children: ReactNode;
}

/**
 * Combined provider for all JSONUI contexts
 */
declare function JSONUIProvider({ registry, initialData, authState, actionHandlers, navigate, validationFunctions, onDataChange, children, }: JSONUIProviderProps): react_jsx_runtime.JSX.Element;

/**
 * Main renderer component with error boundary
 */
declare function Renderer({ tree, registry, loading, fallback, selectable, onElementSelect, selectionDelayMs, selectedKey, trackInteractions, onInteraction, onResize, autoGrid, onError, }: RendererProps & {
    onError?: (error: Error) => void;
}): react_jsx_runtime.JSX.Element | null;
/**
 * Helper to create a renderer component from a catalog
 */
declare function createRendererFromCatalog<C extends Catalog<Record<string, ComponentDefinition>>>(_catalog: C, registry: ComponentRegistry): ComponentType<Omit<RendererProps, "registry">>;

/**
 * Element props equality comparator for memoization
 */

/**
 * Memoization comparator: structural sharing in patch-utils.ts means only
 * modified elements get new references. This enables O(1) equality checks
 * instead of deep comparison.
 */
declare function elementRendererPropsAreEqual(prevProps: ElementRendererProps$1, nextProps: ElementRendererProps$1): boolean;

/**
 * Skeleton Loader Components
 *
 * Loading states for placeholder and missing elements during streaming.
 */

/**
 * Props for skeleton loader components
 */
interface SkeletonProps {
    /** Element key for data attribute */
    elementKey: string;
    /** Optional custom class name */
    className?: string;
}
/**
 * Placeholder skeleton for forward-referenced elements
 */
declare function PlaceholderSkeleton({ elementKey }: SkeletonProps): ReactNode;
/**
 * Child skeleton for missing children during streaming
 */
declare function ChildSkeleton({ elementKey }: SkeletonProps): ReactNode;
/**
 * Check if an element is a placeholder
 */
declare function isPlaceholderElement(element: {
    type: string;
    _meta?: {
        isPlaceholder?: boolean;
    };
}): boolean;

interface ElementRendererProps {
    element: UIElement;
    tree: UITree;
    registry: ComponentRegistry;
    loading?: boolean;
    fallback?: ComponentRenderer;
    selectable?: boolean;
    onElementSelect?: (element: UIElement) => void;
    selectionDelayMs: number;
    selectedKey?: string | null;
    onResize?: (elementKey: string, size: {
        width: number;
        height: number;
    }) => void;
}
declare const ElementRenderer: React__default.NamedExoticComponent<ElementRendererProps>;

/**
 * Information about user's native text selection
 */
interface TextSelectionInfo {
    /** The selected text content */
    text: string;
    /** The JSON-UI element key containing the selection (if within a component) */
    elementKey?: string;
    /** The component type (e.g., "List", "Email", "Document") */
    elementType?: string;
}
/**
 * Hook to capture native browser text selection.
 *
 * This allows users to:
 * 1. Select text with click+drag (or long-press on mobile)
 * 2. Copy the text normally
 * 3. Have the selection passed to AI as context when sending a message
 *
 * @example
 * ```tsx
 * const { getTextSelection, clearTextSelection, hasTextSelection } = useTextSelection();
 *
 * const handleSend = () => {
 *   const selection = getTextSelection();
 *   if (selection) {
 *     // Include in AI context
 *     context.textSelection = selection;
 *   }
 *   // ... send message
 *   clearTextSelection();
 * };
 * ```
 */
declare function useTextSelection(): {
    getTextSelection: () => TextSelectionInfo | null;
    restoreTextSelection: (range: Range) => void;
    clearTextSelection: () => void;
    hasTextSelection: () => boolean;
};

/**
 * Information about a preserved text selection
 */
interface PreservedTextSelection {
    /** The selected text content */
    text: string;
    /** The saved Range object for potential restoration */
    range: Range | null;
    /** The JSON-UI element key containing the selection (if within a component) */
    elementKey?: string;
    /** The component type (e.g., "List", "Email", "Document") */
    elementType?: string;
    /** Timestamp when the selection was preserved */
    timestamp: number;
    /** Whether the text was auto-copied to clipboard */
    copiedToClipboard: boolean;
}
interface UsePreservedSelectionReturn {
    /** Currently preserved selection (if any) */
    preserved: PreservedTextSelection | null;
    /** Preserve the current browser text selection before it's lost */
    preserve: () => Promise<void>;
    /** Attempt to restore the preserved selection in the DOM */
    restore: () => boolean;
    /** Clear the preserved selection */
    clear: () => void;
    /** Copy preserved text to clipboard (returns success status) */
    copyToClipboard: () => Promise<boolean>;
    /** Whether there is a preserved selection */
    hasPreserved: boolean;
}
/**
 * Hook to preserve text selection when focus moves to another element.
 *
 * This solves the problem where clicking on an input/textarea clears
 * the user's text selection. The hook:
 * 1. Saves the selection text and Range before it's lost
 * 2. Optionally auto-copies to clipboard for convenience
 * 3. Allows restoring the selection if the DOM structure hasn't changed
 *
 * @example
 * ```tsx
 * function ChatInput() {
 *   const { preserved, preserve, clear } = usePreservedSelection();
 *
 *   const handleFocus = useCallback(() => {
 *     preserve(); // Save any current text selection
 *   }, [preserve]);
 *
 *   return (
 *     <>
 *       <input onFocus={handleFocus} ... />
 *       {preserved && (
 *         <TextSelectionBadge
 *           text={preserved.text}
 *           onClear={clear}
 *         />
 *       )}
 *     </>
 *   );
 * }
 * ```
 */
declare function usePreservedSelection(): UsePreservedSelectionReturn;

type ResizeHandle = "e" | "s" | "se" | "sw" | "n" | "w" | "ne" | "nw";
interface ResizeState {
    /** Current width in pixels */
    width: number;
    /** Current height in pixels */
    height: number;
    /** Whether the element is currently being resized */
    isResizing: boolean;
    /** The active resize handle */
    activeHandle: ResizeHandle | null;
}
interface UseResizableOptions {
    /** Initial size configuration */
    initialSize?: ElementSize;
    /** Resize behavior configuration */
    config?: ElementResizeConfig | boolean;
    /** Callback when resize starts */
    onResizeStart?: (state: ResizeState) => void;
    /** Callback during resize */
    onResize?: (state: ResizeState) => void;
    /** Callback when resize ends */
    onResizeEnd?: (state: ResizeState) => void;
    /** Element ref to measure initial size */
    elementRef?: React.RefObject<HTMLElement | null>;
    /** Constrain resize to container boundaries (default: true) */
    constrainToContainer?: boolean;
}
interface UseResizableReturn {
    /** Current resize state */
    state: ResizeState;
    /** Start resizing from a handle */
    startResize: (handle: ResizeHandle, e: React.MouseEvent | React.TouchEvent) => void;
    /** Stop resizing */
    stopResize: () => void;
    /** Reset to initial size */
    reset: () => void;
    /** Get resize config (normalized from boolean) */
    resizeConfig: ElementResizeConfig;
    /** Style object to apply to the element */
    style: React.CSSProperties;
}

/**
 * Get the CSS cursor for a resize handle (exported alias)
 */
declare function getResizeCursor(handle: ResizeHandle): string;

/**
 * Hook to handle element resizing with mouse/touch drag.
 *
 * @example
 * ```tsx
 * function ResizableCard() {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const { state, startResize, style } = useResizable({
 *     initialSize: { width: 300, height: 200 },
 *     config: { horizontal: true, vertical: true },
 *     elementRef: ref,
 *   });
 *
 *   return (
 *     <div ref={ref} style={style}>
 *       <ResizeHandle position="se" onMouseDown={(e) => startResize('se', e)} />
 *     </div>
 *   );
 * }
 * ```
 */
declare function useResizable({ initialSize, config, onResizeStart, onResize, onResizeEnd, elementRef, constrainToContainer, }?: UseResizableOptions): UseResizableReturn;

interface UseLayoutManagerOptions {
    /** Current UI tree */
    tree: UITree | null;
    /** Callback to update the tree */
    onTreeUpdate?: (updater: (tree: UITree) => UITree) => void;
    /** Callback when layout changes (for AI context) */
    onLayoutChange?: (elementKey: string, layout: ElementLayout) => void;
}
interface UseLayoutManagerReturn {
    /** Update layout for an element */
    updateLayout: (elementKey: string, layout: Partial<ElementLayout>) => void;
    /** Update size for an element */
    updateSize: (elementKey: string, width: number, height: number) => void;
    /** Update grid position for an element */
    updateGridPosition: (elementKey: string, position: {
        column?: number;
        row?: number;
        columnSpan?: number;
        rowSpan?: number;
    }) => void;
    /** Enable/disable resize for an element */
    setResizable: (elementKey: string, resizable: boolean) => void;
    /** Get layout for an element */
    getLayout: (elementKey: string) => ElementLayout | undefined;
    /** Get all elements with layout */
    getLayoutElements: () => Array<{
        key: string;
        layout: ElementLayout;
    }>;
}
/**
 * Hook to manage element layouts within a UI tree.
 *
 * Provides functions to update element sizes, grid positions, and resize configs.
 * Changes are persisted back to the tree and optionally notified to the AI.
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { tree, setTree } = useUIStream(...);
 *   const { updateSize, updateGridPosition } = useLayoutManager({
 *     tree,
 *     onTreeUpdate: (updater) => setTree(updater(tree!)),
 *     onLayoutChange: (key, layout) => console.log(`${key} layout changed`, layout),
 *   });
 *
 *   return (
 *     <FreeGridCanvas>
 *       <ResizableWrapper
 *         element={element}
 *         onResize={(key, size) => updateSize(key, size.width, size.height)}
 *       >
 *         <Card>Content</Card>
 *       </ResizableWrapper>
 *     </FreeGridCanvas>
 *   );
 * }
 * ```
 */
declare function useLayoutManager({ tree, onTreeUpdate, onLayoutChange, }: UseLayoutManagerOptions): UseLayoutManagerReturn;

/**
 * Hook for streaming UI generation
 */
declare function useUIStream({ api, onComplete, onError, getHeaders, getChatId, onBackgroundComplete, }: UseUIStreamOptions): UseUIStreamReturn;

/**
 * Hook to detect mobile viewport
 */
declare function useIsMobile(breakpoint?: number): boolean;

/**
 * Public store hook type - hides internal immer types
 */
type OneGenUIStore = UseBoundStore<StoreApi<StoreState>>;
/**
 * Main store hook. Use this to access the store state and actions.
 *
 * @example
 * ```tsx
 * const theme = useStore((s) => s.theme);
 * const setTheme = useStore((s) => s.setTheme);
 * ```
 */
declare const useStore: OneGenUIStore;
/**
 * Alias for useStore - alternative name
 */
declare const useUIStore: OneGenUIStore;
declare const useDeepSelections: () => DeepSelectionInfo$1[];
declare const useDeepSelectionActive: () => boolean;
declare const useGranularSelection: () => Record<string, Set<string>>;
declare const useLoadingActions: () => Set<string>;
declare const usePendingConfirmations: () => PendingConfirmation[];
declare const useActionHistory: () => ActionExecution[];
declare const useFieldStates: () => Record<string, FieldState>;
declare const useIsValidating: () => boolean;
declare const useFormState: () => {
    isValid: boolean;
    isDirty: boolean;
    isValidating: boolean;
    touchedCount: number;
    errorCount: number;
};
declare const useProgressEvents: () => StoredProgressEvent[];
declare const useActiveToolProgress: () => StoredProgressEvent[];
declare const useIsAnyToolRunning: () => boolean;
declare const selectPlanExecution: (s: StoreState) => PlanExecutionState;
declare const usePlanExecution: () => PlanExecutionState;
declare const useIsPlanRunning: () => boolean;
declare const usePlanProgress: () => {
    completed: number;
    total: number;
    percentage: number;
};
declare const useActiveStep: () => PlanStep | null;
declare const useDeepResearchSettings: () => DeepResearchSettings;
declare const useDeepResearchEnabled: () => boolean;
declare const useDeepResearchEffortLevel: () => DeepResearchEffortLevel;
declare const useActiveResearch: () => ActiveResearch | null;
declare const useAuthenticatedSources: () => AuthenticatedSource[];
declare const useResearchHistory: () => ResearchResultSummary[];
declare const useIsResearchActive: () => boolean;
declare const useResearchProgress: () => {
    progress: number;
    phase: string;
    sourcesFound: number;
    sourcesTarget: number;
};
declare const useWorkspaceDocuments: () => WorkspaceDocument[];
declare const useActiveDocumentId: () => string | null;
declare const useWorkspaceLayout: () => WorkspaceLayout;
declare const useYoloMode: () => boolean;
declare const usePendingAIEdits: () => PendingAIEdit[];
declare const useIsWorkspaceOpen: () => boolean;
declare const useActiveDocument: () => WorkspaceDocument | null;
declare const useWorkspaceActions: () => {
    createDocument: (title?: string) => WorkspaceDocument;
    openDocument: (doc: WorkspaceDocument) => void;
    closeDocument: (id: string) => void;
    setActiveDocument: (id: string) => void;
    updateDocumentContent: (id: string, content: EditorContent | null) => void;
    renameDocument: (id: string, title: string) => void;
    markDocumentSaved: (id: string) => void;
    setWorkspaceLayout: (layout: WorkspaceLayout) => void;
    toggleWorkspace: () => void;
    setYoloMode: (enabled: boolean) => void;
    addPendingEdit: (edit: Omit<PendingAIEdit, "id" | "createdAt">) => void;
    approvePendingEdit: (editId: string) => void;
    rejectPendingEdit: (editId: string) => void;
    clearPendingEdits: () => void;
};
declare const useCanvasInstances: () => CanvasInstance[];
declare const useCanvasInstance: (canvasId: string) => CanvasInstance | undefined;
declare const useCanvasContent: (canvasId: string) => CanvasEditorState | null;
declare const useCanvasVersion: (canvasId: string) => number;
declare const useCanvasIsStreaming: (canvasId: string) => boolean;
declare const useCanvasActions: () => {
    initCanvas: (canvasId: string, initialContent?: CanvasEditorState | null, options?: {
        title?: string;
        documentId?: string;
    }) => CanvasInstance;
    removeCanvas: (canvasId: string) => void;
    updateCanvasContent: (canvasId: string, content: CanvasEditorState | null) => void;
    setCanvasStreaming: (canvasId: string, isStreaming: boolean) => void;
    setCanvasDirty: (canvasId: string, isDirty: boolean) => void;
    queueCanvasUpdate: (canvasId: string, content: CanvasEditorState) => void;
    flushCanvasUpdates: (canvasId: string) => void;
    clearCanvasPendingUpdates: (canvasId: string) => void;
};
declare const useComponentState: (elementKey: string) => Record<string, unknown>;
declare const useAllComponentState: () => Record<string, Record<string, unknown>>;
declare const useComponentStateActions: () => {
    setComponentState: (elementKey: string, state: Record<string, unknown>) => void;
    updateComponentState: (elementKey: string, updates: Record<string, unknown>) => void;
    mergeComponentState: (elementKey: string, updates: Record<string, unknown>) => void;
    clearComponentState: (elementKey: string) => void;
    clearAllComponentState: () => void;
    getElementState: (elementKey: string) => Record<string, unknown>;
};

/**
 * Convert a flat element list to a UITree
 */
declare function flatToTree(elements: FlatElement[]): UITree;

/**
 * EditableContext state management for inline editing
 */
interface EditableContextValue {
    /** Currently editing path (e.g., "elements/card-1/props/title") */
    editingPath: string | null;
    /** Current value being edited */
    editingValue: unknown;
    /** Start editing a field */
    startEdit: (path: string, currentValue: unknown) => void;
    /** Commit the edit with new value */
    commitEdit: (path: string, newValue: unknown) => void;
    /** Cancel editing */
    cancelEdit: () => void;
    /** Callback when a value is changed */
    onValueChange?: (path: string, newValue: unknown) => void;
}
/**
 * Provider for editable content management
 */
declare function EditableProvider({ children, onValueChange, }: {
    children: ReactNode;
    onValueChange?: (path: string, newValue: unknown) => void;
}): react_jsx_runtime.JSX.Element;
/**
 * Hook to access editable context
 */
declare function useEditableContext(): EditableContextValue | null;
/**
 * Props returned by useEditable hook
 */
interface EditableProps {
    /** Whether this field is currently being edited */
    isEditing: boolean;
    /** Current value (editing value if editing, otherwise original) */
    value: unknown;
    /** Trigger edit mode */
    onStartEdit: () => void;
    /** Commit the current edit */
    onCommit: (newValue: unknown) => void;
    /** Cancel the current edit */
    onCancel: () => void;
    /** Style hint for editable elements */
    editableClassName: string;
}
/**
 * Hook for making content editable
 *
 * @param path - Unique path to this editable value (e.g., "elements/card-1/props/title")
 * @param currentValue - Current value to display
 * @param locked - If true, editing is disabled
 * @returns Props and handlers for editable content
 */
declare function useEditable(path: string, currentValue: unknown, locked?: boolean): EditableProps;
/**
 * Generic editable text component
 */
declare function EditableText({ path, value, locked, as: Component, className, }: {
    path: string;
    value: string;
    locked?: boolean;
    as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
    className?: string;
}): react_jsx_runtime.JSX.Element;
/**
 * Editable number component
 */
declare function EditableNumber({ path, value, locked, className, }: {
    path: string;
    value: number;
    locked?: boolean;
    className?: string;
}): react_jsx_runtime.JSX.Element;

interface MarkdownTextProps {
    content: string;
    className?: string;
    style?: CSSProperties;
    inline?: boolean;
    theme?: Partial<MarkdownTheme>;
    enableMath?: boolean;
}
interface MarkdownTheme {
    codeBlockBg: string;
    codeBlockBorder: string;
    inlineCodeBg: string;
    linkColor: string;
    blockquoteBorder: string;
    hrColor: string;
}
declare const MarkdownText: React$1.NamedExoticComponent<MarkdownTextProps>;

interface TextSelectionBadgeProps {
    /** The preserved selection to display */
    selection: PreservedTextSelection;
    /** Callback when user clears the selection */
    onClear: () => void;
    /** Callback to restore the selection in the DOM */
    onRestore?: () => void;
    /** Maximum characters to show before truncating */
    maxLength?: number;
    /** Custom className for styling */
    className?: string;
}
/**
 * Badge component that displays a preserved text selection.
 *
 * Shows:
 * - Truncated preview of the selected text
 * - "Copied" indicator if auto-copied to clipboard
 * - Button to restore selection in DOM (if possible)
 * - Button to clear/dismiss
 *
 * @example
 * ```tsx
 * {preserved && (
 *   <TextSelectionBadge
 *     selection={preserved}
 *     onClear={clear}
 *     onRestore={restore}
 *   />
 * )}
 * ```
 */
declare function TextSelectionBadge({ selection, onClear, onRestore, maxLength, className, }: TextSelectionBadgeProps): react_jsx_runtime.JSX.Element;

interface ResizableWrapperProps {
    /** The UI element being rendered */
    element: UIElement;
    /** Child content to render */
    children: React__default.ReactNode;
    /** Override layout config */
    layout?: ElementLayout;
    /** Callback when element is resized */
    onResize?: (elementKey: string, size: {
        width: number;
        height: number;
    }) => void;
    /** Custom className */
    className?: string;
    /** Whether resize is enabled (overrides element.layout.resizable) */
    enabled?: boolean;
    /** Force handles visible (e.g., when element is selected) */
    showHandles?: boolean;
}
/**
 * Wrapper component that adds resize handles to its children.
 *
 * Reads configuration from `element.layout.resizable` or accepts overrides via props.
 * Handles are only shown when the wrapper is hovered.
 *
 * @example
 * ```tsx
 * <ResizableWrapper
 *   element={element}
 *   onResize={(key, size) => console.log(`${key} resized to ${size.width}x${size.height}`)}
 * >
 *   <Card {...cardProps} />
 * </ResizableWrapper>
 * ```
 */
declare function ResizableWrapper({ element, children, layout: overrideLayout, onResize, className, enabled: overrideEnabled, showHandles, }: ResizableWrapperProps): react_jsx_runtime.JSX.Element;

interface FreeGridCanvasProps {
    columns?: number;
    rows?: number;
    cellSize?: number;
    gap?: number;
    minRowHeight?: number;
    showGrid?: boolean;
    gridLineColor?: string;
    backgroundColor?: string;
    children: React__default.ReactNode;
    onLayoutChange?: (elementKey: string, layout: ElementLayout) => void;
    className?: string;
    style?: React__default.CSSProperties;
}
interface GridCellProps {
    column?: number;
    row?: number;
    columnSpan?: number;
    rowSpan?: number;
    children: React__default.ReactNode;
    className?: string;
    style?: React__default.CSSProperties;
}

/**
 * A CSS Grid-based canvas for free-form layout of UI elements.
 */
declare function FreeGridCanvas({ columns, rows, cellSize, gap, minRowHeight, showGrid, gridLineColor, backgroundColor, children, onLayoutChange: _onLayoutChange, className, style, }: FreeGridCanvasProps): react_jsx_runtime.JSX.Element;

/**
 * A cell within the FreeGridCanvas that can span multiple columns/rows.
 */
declare function GridCell({ column, row, columnSpan, rowSpan, children, className, style, }: GridCellProps): react_jsx_runtime.JSX.Element;

/**
 * Generate CSS styles from an element's layout configuration.
 */
declare function getLayoutStyles(layout: ElementLayout | undefined): React__default.CSSProperties;
/**
 * Create a layout configuration from grid position and size.
 */
declare function createLayout(options?: {
    column?: number;
    row?: number;
    columnSpan?: number;
    rowSpan?: number;
    width?: number | string;
    height?: number | string;
    resizable?: boolean;
}): ElementLayout;

interface ToolProgressOverlayProps {
    /** Position of the overlay */
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center";
    /** Custom class name */
    className?: string;
    /** Whether to show the overlay (default: auto based on isToolRunning) */
    show?: boolean;
    /** Maximum number of items to show */
    maxItems?: number;
    /** Custom render function for each progress item */
    renderItem?: (progress: ToolProgressEvent) => React__default.ReactNode;
}
/**
 * ToolProgressOverlay - Automatically shows tool execution progress
 *
 * This component renders as a floating overlay that automatically appears
 * when tools are running and hides when complete. Place it once at the root
 * of your app for global tool progress visibility.
 *
 * @example
 * ```tsx
 * <ToolProgressProvider>
 *   <App />
 *   <ToolProgressOverlay position="top-right" />
 * </ToolProgressProvider>
 * ```
 */
declare const ToolProgressOverlay: React__default.NamedExoticComponent<ToolProgressOverlayProps>;

interface CanvasBlockProps {
    /** Document unique identifier */
    documentId?: string;
    /** Initial content (serialized state) */
    initialContent?: unknown;
    /** Markdown content (easier for AI to generate) */
    markdown?: string;
    /** Images to embed in document */
    images?: Array<{
        url: string;
        alt?: string;
        caption?: string;
    }>;
    /** Editor mode */
    mode?: "view" | "edit" | "collab";
    /** Width (CSS value) */
    width?: string;
    /** Height (CSS value) */
    height?: string;
    /** Show formatting toolbar */
    showToolbar?: boolean;
    /** Action to trigger on save */
    onSaveAction?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Document title */
    title?: string;
}
interface CanvasBlockComponentProps {
    element: UIElement<"Canvas", CanvasBlockProps>;
    onAction?: (action: {
        type: string;
        payload?: unknown;
    }) => void;
    loading?: boolean;
    /** Custom editor component to render (injected from app level) */
    EditorComponent?: React.ComponentType<{
        initialState?: unknown;
        onChange?: (state: unknown, serialized: unknown) => void;
        placeholder?: string;
        editable?: boolean;
        enableFloatingToolbar?: boolean;
        enableDragDrop?: boolean;
        enableAI?: boolean;
        enableProactiveSuggestions?: boolean;
        className?: string;
    }>;
}
declare const CanvasBlock: React$1.NamedExoticComponent<CanvasBlockComponentProps>;

interface DocumentBlockProps {
    /** Document title */
    title: string;
    /** Document content */
    content: string;
    /** Content format */
    format?: "markdown" | "html" | "text";
    /** Allow editing inline */
    editable?: boolean;
    /** Document ID for opening in Canvas */
    documentId?: string;
    /** Show "Open in Canvas" button */
    showOpenInCanvas?: boolean;
}
interface DocumentBlockComponentProps {
    element: UIElement<"Document", DocumentBlockProps>;
    onAction?: (action: {
        type: string;
        payload?: unknown;
    }) => void;
    renderText?: (content: string, options?: {
        markdown?: boolean;
    }) => React.ReactNode;
    loading?: boolean;
}
declare const DocumentBlock: React$1.NamedExoticComponent<DocumentBlockComponentProps>;

/**
 * Selection System Ports - Hexagonal Architecture
 * Defines interfaces for selection management abstraction
 */

interface DeepSelectionData {
    id: string;
    elementKey: string;
    cssPath: string;
    tagName: string;
    textContent: string;
    itemId?: string;
    selectionType: "item" | "granular";
}
interface AddDeepSelectionInput {
    elementKey: string;
    cssPath: string;
    tagName: string;
    textContent: string;
    itemId?: string;
    selectionType: "item" | "granular";
}
/**
 * Port for managing selection state
 * Abstracts the selection storage and operations
 */
interface SelectionManagerPort {
    addDeepSelection(selection: AddDeepSelectionInput): string;
    removeDeepSelection(id: string): void;
    removeDeepSelectionByElement(elementKey: string, cssPath: string): void;
    clearDeepSelections(): void;
    clearDeepSelectionsForElement(elementKey: string): void;
    getDeepSelections(): DeepSelectionData[];
    getDeepSelectionsForElement(elementKey: string): DeepSelectionData[];
    isDeepSelected(elementKey: string, cssPath: string): boolean;
    isDeepSelectionActive(): boolean;
    setDeepSelectionActive(active: boolean): void;
    getSelectedKey(): string | null;
    setSelectedKey(key: string | null): void;
    subscribe(callback: (selections: DeepSelectionData[]) => void): () => void;
}
/**
 * Port for DOM element tracking
 * Abstracts DOM queries and element management
 */
interface DOMSelectorPort {
    registerElement(elementKey: string, element: HTMLElement): void;
    unregisterElement(elementKey: string): void;
    getElement(elementKey: string): HTMLElement | null;
    getSelectableItems(elementKey: string): SelectableItemData[];
    getCSSPath(element: HTMLElement, root?: HTMLElement): string;
    getCSSPathCached(element: HTMLElement, root?: HTMLElement): string;
    cleanup(): void;
}
/**
 * Port for selection event handling
 * Abstracts event subscription and delegation
 */
interface SelectionEventPort {
    onItemClick(handler: (item: SelectableItemData, event: MouseEvent) => void): () => void;
    onItemHover(handler: (item: SelectableItemData | null) => void): () => void;
    onKeyDown(handler: (event: KeyboardEvent) => void): () => void;
    onLongPress(handler: (item: SelectableItemData) => void): () => void;
    enterDeepSelectionMode(): void;
    exitDeepSelectionMode(): void;
    isDeepSelectionActive(): boolean;
}
/**
 * Port for selection export/serialization
 * Abstracts how selection data is exported for AI context
 */
interface SelectionExportPort {
    exportForAI(selections: DeepSelectionData[]): {
        summary: string;
        selections: Array<{
            type: string;
            elementKey: string;
            cssPath: string;
            textContent: string;
            itemId?: string;
        }>;
    };
    exportAsText(selections: DeepSelectionData[]): string;
    exportAsJSON(selections: DeepSelectionData[]): string;
}
/**
 * Combined selection port for full functionality
 */
interface SelectionPort extends SelectionManagerPort, DOMSelectorPort, SelectionEventPort, SelectionExportPort {
}

/**
 * Data Manager Port - Hexagonal interface for data operations
 */

/**
 * Port for data model management
 */
interface DataManagerPort {
    getDataModel(): DataModel;
    setDataModel(data: DataModel): void;
    updateDataModel(path: string, value: unknown): void;
    resetDataModel(): void;
    getValue(path: string): unknown;
    setValue(path: string, value: unknown): void;
    updateMultiple(updates: Record<string, unknown>): void;
    getAuth(): AuthState;
    setAuth(auth: AuthState): void;
    isAuthenticated(): boolean;
    hasRole(role: string): boolean;
    hasPermission(permission: string): boolean;
    subscribe(callback: (data: DataModel) => void): () => void;
    subscribeToPath(path: string, callback: (value: unknown) => void): () => void;
}
/**
 * Port for action management
 */
interface ActionManagerPort {
    isActionLoading(actionName: string): boolean;
    setActionLoading(actionName: string, loading: boolean): void;
    getLoadingActions(): Set<string>;
    startAction(actionName: string, payload?: unknown): string;
    completeAction(id: string, result?: unknown): void;
    failAction(id: string, error: string): void;
    getActionStatus(id: string): {
        status: "pending" | "running" | "success" | "error";
        error?: string;
        result?: unknown;
    } | undefined;
    showConfirmation(options: {
        actionName: string;
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        payload?: unknown;
    }): string;
    hideConfirmation(id: string): void;
    getPendingConfirmations(): Array<{
        id: string;
        actionName: string;
        title: string;
        message: string;
    }>;
    subscribeToLoading(actionName: string, callback: (loading: boolean) => void): () => void;
}
/**
 * Port for validation management
 */
interface ValidationManagerPort {
    touchField(path: string): void;
    untouchField(path: string): void;
    setFieldValidation(path: string, result: {
        isValid: boolean;
        errors: string[];
        warnings?: string[];
    }): void;
    clearFieldValidation(path: string): void;
    isFieldTouched(path: string): boolean;
    isFieldValid(path: string): boolean;
    getFieldErrors(path: string): string[];
    getFormState(): {
        isValid: boolean;
        isDirty: boolean;
        isValidating: boolean;
        touchedCount: number;
        errorCount: number;
    };
    touchAllFields(paths: string[]): void;
    clearAllValidation(): void;
    getFieldsWithErrors(): string[];
    subscribeToField(path: string, callback: (state: {
        touched: boolean;
        valid: boolean;
        errors: string[];
    }) => void): () => void;
}
/**
 * Port for tool progress management
 */
interface ToolProgressManagerPort {
    addProgress(event: {
        toolCallId: string;
        toolName: string;
        status: "starting" | "progress" | "complete" | "error";
        message?: string;
        data?: unknown;
        progress?: number;
    }): void;
    updateProgress(toolCallId: string, updates: {
        status?: "starting" | "progress" | "complete" | "error";
        message?: string;
        data?: unknown;
        progress?: number;
    }): void;
    removeProgress(toolCallId: string): void;
    clearProgress(): void;
    clearCompletedOlderThan(ms: number): void;
    getProgress(toolCallId: string): {
        toolName: string;
        status: string;
        message?: string;
        progress?: number;
    } | undefined;
    getActiveProgress(): Array<{
        toolCallId: string;
        toolName: string;
        status: string;
        message?: string;
    }>;
    isToolRunning(): boolean;
    isSpecificToolRunning(toolName: string): boolean;
    subscribeToProgress(toolCallId: string, callback: (progress: {
        status: string;
        message?: string;
    } | undefined) => void): () => void;
    subscribeToRunning(callback: (running: boolean) => void): () => void;
}

/**
 * Selection Use Cases - Pure Business Logic
 * Extracted from provider.tsx for testability and reusability
 */

/**
 * Determine if an item should be added to or removed from selection
 */
declare function computeToggleSelection(currentSelection: SelectedItem[], item: SelectedItem): SelectedItem[];
/**
 * Add item to selection (no-op if already selected)
 */
declare function computeAddSelection(currentSelection: SelectedItem[], item: SelectedItem): SelectedItem[];
/**
 * Remove item from selection
 */
declare function computeRemoveSelection(currentSelection: SelectedItem[], itemId: string, elementKey?: string): SelectedItem[];
/**
 * Replace entire selection with new items
 */
declare function computeReplaceSelection(_currentSelection: SelectedItem[], newItems: SelectedItem[]): SelectedItem[];
/**
 * Check if an item is in selection
 */
declare function isItemSelected(selection: SelectedItem[], itemId: string, elementKey?: string): boolean;
/**
 * Get selection count by element key
 */
declare function getSelectionCountByElement(selection: SelectedItem[], elementKey: string): number;
/**
 * Get all items for a specific element
 */
declare function getSelectionForElement(selection: SelectedItem[], elementKey: string): SelectedItem[];
/**
 * Compute multi-select with shift key
 * Returns items between last selected and current
 */
declare function computeRangeSelection(allItems: SelectableItemData[], currentSelection: SelectedItem[], newItem: SelectableItemData, elementKey: string): SelectedItem[];
/**
 * Generate summary text for selected items
 */
declare function generateSelectionSummary(selection: SelectedItem[]): string;
/**
 * Export selection as AI-friendly format
 */
declare function exportSelectionForAI(selection: SelectedItem[]): {
    summary: string;
    items: Array<{
        type: string;
        id: string;
        elementKey: string;
        data?: unknown;
    }>;
};
/**
 * Generate summary text for deep selections
 */
declare function generateDeepSelectionSummary(selections: DeepSelectionData[]): string;
/**
 * Export deep selections for AI context
 */
declare function exportDeepSelectionForAI(selections: DeepSelectionData[]): {
    summary: string;
    selections: Array<{
        type: string;
        elementKey: string;
        cssPath: string;
        tagName: string;
        textContent: string;
        itemId?: string;
    }>;
};
/**
 * Export deep selections as plain text (for clipboard)
 */
declare function exportDeepSelectionAsText(selections: DeepSelectionData[]): string;
/**
 * Export deep selections as JSON
 */
declare function exportDeepSelectionAsJSON(selections: DeepSelectionData[]): string;
/**
 * Check if a CSS path is selected for an element
 */
declare function isDeepSelectionSelected(selections: DeepSelectionData[], elementKey: string, cssPath: string): boolean;
/**
 * Get deep selections grouped by element key
 */
declare function groupDeepSelectionsByElement(selections: DeepSelectionData[]): Map<string, DeepSelectionData[]>;

export { type AIAssistantSettings, AISettingsProvider, type ActionContextValue$1 as ActionContextValue, type ActionManagerPort, ActionProvider$1 as ActionProvider, type ActionProviderProps$1 as ActionProviderProps, type ActionTrackerOptions, type ActionTrackingCallback, ActionProvider as ActionTrackingProvider, type ActionType, type AddDeepSelectionInput, type Attachment, type AutoSaveContextValue, type AutoSavePayload, AutoSaveProvider, type AutoSaveResult, CanvasBlock, type CanvasBlockProps, type CanvasEditorState, type CanvasInstance, type CanvasPendingUpdate, type CanvasSlice, type ChangeHistoryItem, type ChatMessage, ChildSkeleton, type Citation, CitationProvider, type ComponentRegistry, type ComponentRenderProps, type ComponentRenderer, ConfirmDialog, type ConfirmDialogProps, type ConversationMessage, type ConversationTurn, DEFAULT_AI_SETTINGS, DEFAULT_EXTENDED_SETTINGS, type DOMSelectorPort, type DataContextValue, type DataManagerPort, DataProvider, type DataProviderProps, type DeepResearchEffortLevel, type DeepSelectionData, type DeepSelectionInfo, type DeepSelectionInput, DocumentBlock, type DocumentBlockProps, type DocumentSettings, type DomainType, type EditModeContextValue, EditModeProvider, type EditModeProviderProps, EditableNumber, type EditableProps, EditableProvider, EditableText, type ElementChange, ElementRenderer, type ElementRendererProps$1 as ElementRendererProps, type ExtendedAISettings, type FieldValidationState, type FileAttachment, type FlatElement, type FormField, FreeGridCanvas, type FreeGridCanvasProps, GridCell, type GridCellProps, JSONUIProvider, type JSONUIProviderProps, type LibraryAttachment, type MarkdownContextValue, MarkdownProvider, type MarkdownProviderProps, MarkdownText, type MarkdownTextProps, type MarkdownTheme$1 as MarkdownTheme, type PendingAIEdit, type PendingConfirmation$1 as PendingConfirmation, type PersistedAttachment, PlaceholderSkeleton, type PlanExecutionState, type PlanStep, type PlanStepStatus, type PlanSubtask, type PreservedTextSelection, type ProactivityMode, type QuestionPayload, type RenderTextOptions, Renderer, type RendererProps, ResizableWrapper, type ResizableWrapperProps, type ResizeHandle, type ResizeState, SelectableItem, type SelectableItemProps, type SelectionContextValue, type SelectionEventPort, type SelectionExportPort, type SelectionManagerPort, type SelectionPort, SelectionProvider, type SelectionProviderProps, type SinglePropChange, type SkeletonProps, type ExecutionPlan as StorePlanType, type SuggestionChip, TextSelectionBadge, type TextSelectionBadgeProps, type TextSelectionInfo, type ToolProgress, type ToolProgressContextValue, type ToolProgressManagerPort, ToolProgressOverlay, type ToolProgressOverlayProps, ToolProgressProvider, type ToolProgressProviderProps, type TrackedAction, type UnifiedProgressContextValue, type UnifiedProgressItem, type UnifiedProgressItemType, UnifiedProgressProvider, type UnifiedProgressProviderProps, type UnifiedProgressState, type UnifiedProgressStatus, type UseElementStateOptions, type UseLayoutManagerOptions, type UseLayoutManagerReturn, type UsePreservedSelectionReturn, type UseResizableOptions, type UseResizableReturn, type UseUIStreamOptions, type UseUIStreamReturn, type ValidationContextValue, type ValidationManagerPort, ValidationProvider, type ValidationProviderProps, type VisibilityContextValue, VisibilityProvider, type VisibilityProviderProps, type WorkspaceDocument, type WorkspaceLayout, buildConversationMessages, computeAddSelection, computeRangeSelection, computeRemoveSelection, computeReplaceSelection, computeToggleSelection, createLayout, createRendererFromCatalog, elementRendererPropsAreEqual, exportDeepSelectionAsJSON, exportDeepSelectionAsText, exportDeepSelectionForAI, exportSelectionForAI, flatToTree, formatActionsForPrompt, generateDeepSelectionSummary, generateSelectionSummary, getLayoutStyles, getResizeCursor, getSelectionCountByElement, getSelectionForElement, groupDeepSelectionsByElement, isDeepSelectionSelected, isFileAttachment, isItemSelected, isLibraryAttachment, isPlaceholderElement, selectPlanExecution, selectableItemProps, useAISettings, useAISettingsOptional, useAction, useActionContext, useActionHistory, useActionSubscriber, useActions, useActiveDocument, useActiveDocumentId, useActiveResearch, useActiveStep, useActiveToolProgress$1 as useActiveToolProgress, useActiveToolProgress as useActiveToolProgressStore, useAllComponentState, useAreSuggestionsEnabled, useAuthenticatedSources, useAutoSave, useCanvasActions, useCanvasContent, useCanvasInstance, useCanvasInstances, useCanvasIsStreaming, useCanvasVersion, useCitations, useComponentState, useComponentStateActions, useData, useDataBinding, useDataValue, useDeepResearchEffortLevel, useDeepResearchEnabled, useDeepResearchSettings, useDeepSelectionActive, useDeepSelections, useDomainAutoSave, useEditMode, useEditable, useEditableContext, useElementActionTracker, useElementEdit, useElementState, useFieldStates, useFieldValidation, useFormState, useGeneratingGoal, useGranularSelection, useIsAnyToolRunning, useIsElementEditing, useIsGenerating, useIsMobile, useIsPlanRunning, useIsProactivityEnabled, useIsResearchActive, useIsSmartParsingEnabled, useIsToolRunning, useIsValidating, useIsVisible, useIsWorkspaceOpen, useItemSelection, useLayoutManager, useLoadingActions, useMarkdown, usePendingAIEdits, usePendingConfirmations, usePlanExecution, usePlanProgress, usePreservedSelection, useProgressEvents, useRenderText, useResearchHistory, useResearchProgress, useResizable, useSelection, useStore, useTextSelection, useToolProgress, useToolProgressOptional, useUIStore, useUIStream, useUnifiedProgress, useUnifiedProgressOptional, useValidation, useVisibility, useWorkspaceActions, useWorkspaceDocuments, useWorkspaceLayout, useYoloMode };
