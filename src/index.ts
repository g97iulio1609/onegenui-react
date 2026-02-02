// Contexts
export {
  DataProvider,
  useData,
  useDataValue,
  useDataBinding,
  type DataContextValue,
  type DataProviderProps,
} from "./contexts/data";

export {
  VisibilityProvider,
  useVisibility,
  useIsVisible,
  type VisibilityContextValue,
  type VisibilityProviderProps,
} from "./contexts/visibility";

export {
  ActionProvider,
  useActions,
  useAction,
  ConfirmDialog,
  type ActionContextValue,
  type ActionProviderProps,
  type PendingConfirmation,
  type ConfirmDialogProps,
  type ActionTrackingCallback,
} from "./contexts/actions";

export {
  ValidationProvider,
  useValidation,
  useFieldValidation,
  type ValidationContextValue,
  type ValidationProviderProps,
  type FieldValidationState,
} from "./contexts/validation";

export {
  SelectionProvider,
  useSelection,
  useItemSelection,
  selectableItemProps,
  SelectableItem,
  type SelectionContextValue,
  type SelectionProviderProps,
  type SelectableItemProps,
  type DeepSelectionInfo,
  type DeepSelectionInput,
} from "./contexts/selection";

// Markdown Context (core-level markdown rendering)
export {
  MarkdownProvider,
  useMarkdown,
  useRenderText,
  type MarkdownContextValue,
  type MarkdownProviderProps,
  type MarkdownTheme,
  type RenderTextOptions,
} from "./contexts/markdown";

// Citation Context (inline citation support for documents)
export {
  CitationProvider,
  useCitations,
  type Citation,
} from "./contexts/citation";

// AI Settings Context
export {
  AISettingsProvider,
  useAISettings,
  useAISettingsOptional,
  useIsProactivityEnabled,
  useAreSuggestionsEnabled,
  useIsSmartParsingEnabled,
  type DocumentSettings,
  type ExtendedAISettings,
  DEFAULT_EXTENDED_SETTINGS,
} from "./contexts/ai-settings";

// Action Tracking Context
export {
  ActionProvider as ActionTrackingProvider,
  useActionContext,
  useElementActionTracker,
  useActionSubscriber,
  formatActionsForPrompt,
} from "./contexts/action-tracking";

// Auto-Save Context (domain data persistence)
export {
  AutoSaveProvider,
  useAutoSave,
  useDomainAutoSave,
  type AutoSaveContextValue,
  type AutoSavePayload,
  type AutoSaveResult,
  type DomainType,
} from "./contexts/autosave";

// Tree Sync Context (sync component state back to tree for AI context)
export {
  TreeSyncProvider,
  useTreeSync,
  useTreeSyncCallback,
  useTreeSyncContext,
  type TreeSyncContextValue,
  type TreeSyncProviderProps,
  type UpdateElementFn,
} from "./contexts/tree-sync";

// Tool Progress Context (real-time tool execution tracking)
export {
  ToolProgressProvider,
  useToolProgress,
  useToolProgressOptional,
  useIsToolRunning,
  useActiveToolProgress,
  type ToolProgressContextValue,
  type ToolProgressProviderProps,
  type ToolProgressEvent,
  type ToolProgressStatus,
} from "./contexts/tool-progress";

// Unified Progress Context (plan + tool progress integrated)
export {
  UnifiedProgressProvider,
  useUnifiedProgress,
  useUnifiedProgressOptional,
  useIsGenerating,
  useGeneratingGoal,
  type UnifiedProgressContextValue,
  type UnifiedProgressProviderProps,
  type UnifiedProgressItem,
  type UnifiedProgressItemType,
  type UnifiedProgressStatus,
  type UnifiedProgressState,
} from "./contexts/unified-progress";

// Edit Mode Context (inline editing support)
export {
  EditModeProvider,
  useEditMode,
  useIsElementEditing,
  useElementEdit,
  type EditModeContextValue,
  type EditModeProviderProps,
  type ElementChange,
  type ChangeHistoryItem,
  type SinglePropChange,
} from "./contexts/edit-mode";

// Renderer - Main UI rendering components
export { Renderer, createRendererFromCatalog } from "./renderer.js";

// Renderer module (modular components from renderer directory)
export {
  JSONUIProvider,
  ElementRenderer,
  PlaceholderSkeleton,
  ChildSkeleton,
  isPlaceholderElement,
  elementRendererPropsAreEqual,
  type ComponentRenderProps,
  type ComponentRenderer,
  type ComponentRegistry,
  type RendererProps,
  type ElementRendererProps,
  type JSONUIProviderProps,
  type SkeletonProps,
} from "./renderer/index";

// Hooks
export {
  useUIStream,
  useTextSelection,
  useIsMobile,
  usePreservedSelection,
  useResizable,
  useLayoutManager,
  getResizeCursor,
  flatToTree,
  type UseUIStreamOptions,
  type UseUIStreamReturn,
  type ConversationTurn,
  type ConversationMessage,
  buildConversationMessages,
  type ChatMessage,
  type FlatElement,
  type FormField,
  type QuestionPayload,
  type SuggestionChip,
  type ActionType,
  type TrackedAction,
  type ActionTrackerOptions,
  type ProactivityMode,
  type AIAssistantSettings,
  type TextSelectionInfo,
  type PreservedTextSelection,
  type Attachment,
  type FileAttachment,
  type LibraryAttachment,
  type PersistedAttachment,
  type UsePreservedSelectionReturn,
  type ResizeHandle,
  type ResizeState,
  type UseResizableOptions,
  type UseResizableReturn,
  type UseLayoutManagerOptions,
  type UseLayoutManagerReturn,
  type ToolProgress,
  type DocumentIndex,
  type DocumentIndexNode,
  DEFAULT_AI_SETTINGS,
} from "./hooks";

// Attachment utilities (runtime functions)
export { isLibraryAttachment, isFileAttachment } from "./hooks/types";

// Editable
export {
  EditableProvider,
  useEditableContext,
  useEditable,
  EditableText,
  EditableNumber,
  type EditableProps,
} from "./editable";

// Components
export {
  MarkdownText,
  TextSelectionBadge,
  ResizableWrapper,
  FreeGridCanvas,
  GridCell,
  getLayoutStyles,
  createLayout,
  ToolProgressOverlay,
  // Canvas integration
  CanvasBlock,
  DocumentBlock,
  type MarkdownTextProps,
  type TextSelectionBadgeProps,
  type ResizableWrapperProps,
  type FreeGridCanvasProps,
  type GridCellProps,
  type ToolProgressOverlayProps,
  type CanvasBlockProps,
  type DocumentBlockProps,
} from "./components";

// Ports (Hexagonal Architecture)
export {
  type SelectionManagerPort,
  type DOMSelectorPort,
  type SelectionEventPort,
  type SelectionExportPort,
  type SelectionPort,
  type DeepSelectionData,
  type AddDeepSelectionInput,
  type DataManagerPort,
  type ActionManagerPort,
  type ValidationManagerPort,
  type ToolProgressManagerPort,
} from "./ports";

// Store (Zustand)
export {
  useStore,
  useUIStore,
  useDeepSelections,
  useDeepSelectionActive,
  useGranularSelection,
  // Actions selectors
  useLoadingActions,
  usePendingConfirmations,
  useActionHistory,
  // Validation selectors
  useFieldStates,
  useIsValidating,
  useFormState,
  // Tool progress selectors
  useProgressEvents,
  useActiveToolProgress as useActiveToolProgressStore,
  useIsAnyToolRunning,
  // Plan execution selectors
  selectPlanExecution,
  usePlanExecution,
  useIsPlanRunning,
  usePlanProgress,
  useActiveStep,
  // Deep Research selectors
  useDeepResearchSettings,
  useDeepResearchEnabled,
  useDeepResearchEffortLevel,
  useActiveResearch,
  useAuthenticatedSources,
  useResearchHistory,
  useIsResearchActive,
  useResearchProgress,
  // Workspace selectors
  useWorkspaceDocuments,
  useActiveDocumentId,
  useWorkspaceLayout,
  useYoloMode,
  usePendingAIEdits,
  useIsWorkspaceOpen,
  useActiveDocument,
  useWorkspaceActions,
  // Canvas selectors
  useCanvasInstances,
  useCanvasInstance,
  useCanvasContent,
  useCanvasVersion,
  useCanvasIsStreaming,
  useCanvasActions,
  // Types
  type PlanExecutionState,
  type PlanStep,
  type PlanSubtask,
  type PlanStepStatus,
  type ExecutionPlan as StorePlanType,
  type DeepResearchEffortLevel,
  type WorkspaceDocument,
  type WorkspaceLayout,
  type PendingAIEdit,
  type CanvasSlice,
  type CanvasInstance,
  type CanvasEditorState,
  type CanvasPendingUpdate,
  // Note: DeepSelectionInfo is exported from ./contexts/selection
} from "./store";

// Use Cases (Pure Business Logic)
export {
  computeToggleSelection,
  computeAddSelection,
  computeRemoveSelection,
  computeReplaceSelection,
  computeRangeSelection,
  isItemSelected,
  getSelectionCountByElement,
  getSelectionForElement,
  generateSelectionSummary,
  exportSelectionForAI,
  // Deep selection use cases
  generateDeepSelectionSummary,
  exportDeepSelectionForAI,
  exportDeepSelectionAsText,
  exportDeepSelectionAsJSON,
  isDeepSelectionSelected,
  groupDeepSelectionsByElement,
} from "./use-cases";
