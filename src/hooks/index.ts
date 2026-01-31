// Hooks Module
// Split for maintainability from original 667-line monolithic file

// Types
export type {
  ChatMessage,
  ConversationTurn,
  ConversationMessage,
  UseUIStreamOptions,
  UseUIStreamReturn,
  FlatElement,
  // AI Interactive types
  FormField,
  QuestionPayload,
  SuggestionChip,
  // Action Tracking types
  ActionType,
  TrackedAction,
  ActionTrackerOptions,
  // AI Settings types
  ProactivityMode,
  AIAssistantSettings,
  // Tool progress types
  ToolProgress,
  // Attachment types
  Attachment,
  FileAttachment,
  LibraryAttachment,
  PersistedAttachment,
  isLibraryAttachment,
  isFileAttachment,
  // Document index types (from core)
  DocumentIndex,
  DocumentIndexNode,
} from "./types";

// Utilities from types
export { buildConversationMessages } from "./types";

// Text Selection types
export type { TextSelectionInfo } from "./useTextSelection";

// Preserved Selection types
export type {
  PreservedTextSelection,
  UsePreservedSelectionReturn,
} from "./usePreservedSelection";

// Resizable types
export type {
  ResizeHandle,
  ResizeState,
  UseResizableOptions,
  UseResizableReturn,
} from "./useResizable";

// Layout Manager types
export type {
  UseLayoutManagerOptions,
  UseLayoutManagerReturn,
} from "./useLayoutManager";

// History types
export type { HistorySnapshot, UseHistoryReturn } from "./useHistory";

// Constants
export { DEFAULT_AI_SETTINGS } from "./types";

// Main hook
export { useUIStream } from "./useUIStream";

// Text Selection hook
export { useTextSelection } from "./useTextSelection";

// Mobile detection hook
export { useIsMobile } from "./useIsMobile";

// Preserved Selection hook (for preventing text selection loss on focus)
export { usePreservedSelection } from "./usePreservedSelection";

// Resizable hook
export { useResizable, getResizeCursor } from "./useResizable";

// Layout Manager hook
export { useLayoutManager } from "./useLayoutManager";

// History hook (extracted for SOLID compliance)
export { useHistory } from "./useHistory";

// Note: Plan state now managed by Zustand store. Use usePlanExecution() from store.

// Deep Research hook
export { useDeepResearch } from "./useDeepResearch";

// Editable Text rendering hook
export {
  useRenderEditableText,
  createRenderEditableText,
  type RenderEditableTextFn,
  type RenderEditableTextOptions,
} from "./useRenderEditableText";

// Utilities
export { flatToTree } from "./flat-to-tree";
export {
  parsePatchLine,
  removeByPath,
  applyPatch,
  removeNodeFromTree,
} from "./patch-utils";
