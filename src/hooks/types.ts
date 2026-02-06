import type {
  UITree,
  UIElement,
  DocumentIndex,
  DocumentIndexNode,
} from "@onegenui/core";

// Re-export core types for convenience
export type { DocumentIndex, DocumentIndexNode };

// ─────────────────────────────────────────────────────────────────────────────
// AI Interactive Types (Questions, Suggestions)
// Must be defined before ConversationTurn which uses them
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Form field for dynamic question forms
 */
export interface FormField {
  id: string;
  label: string;
  type:
    | "text"
    | "number"
    | "select"
    | "checkbox"
    | "date"
    | "textarea"
    | "radio";
  options?: { value: string; label: string }[];
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
export interface QuickReplyOption {
  id: string;
  label: string;
  value: string;
  variant?: "default" | "primary" | "success" | "danger";
}

/**
 * Question payload from AI asking for user input
 * Supports multiple interaction types for better UX
 */
export interface QuestionPayload {
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
export interface SuggestionChip {
  id: string;
  label: string;
  prompt: string;
  icon?: string;
  variant?: "default" | "primary" | "success" | "warning";
}

// ─────────────────────────────────────────────────────────────────────────────
// Chat Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Chat message type
 */
export interface ChatMessage {
  role: "assistant" | "user" | "system";
  content: string;
}

/**
 * File attachment containing metadata and preview
 */
export interface FileAttachment {
  id: string;
  type: "document" | "image" | "spreadsheet" | "presentation" | "other";
  file: File;
  preview?: string;
}

/** Server-cached document attachment (from library) */
export interface LibraryAttachment {
  id: string;
  documentId: string;
  fileName: string;
  mimeType: string;
  pageCount?: number;
  type: "library-document";
}

export type Attachment = FileAttachment | LibraryAttachment;

export function isLibraryAttachment(a: Attachment): a is LibraryAttachment {
  return a.type === "library-document" && "documentId" in a;
}

export function isFileAttachment(a: Attachment): a is FileAttachment {
  return a.type !== "library-document" && "file" in a && a.file instanceof File;
}

/**
 * Persisted attachment data (serializable for database storage)
 */
export interface PersistedAttachment {
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
export interface ToolProgress {
  toolName: string;
  toolCallId: string;
  status:
    | "pending"
    | "starting"
    | "progress"
    | "running"
    | "complete"
    | "error";
  message?: string;
  data?: unknown;
  progress?: number;
}

/**
 * A single turn in the conversation
 */
export interface ConversationTurn {
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
export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Converts ConversationTurn[] to ConversationMessage[] for AI SDK.
 * Includes all completed turns - model handles context window.
 */
export function buildConversationMessages(
  turns: ConversationTurn[],
): ConversationMessage[] {
  const messages: ConversationMessage[] = [];

  for (const turn of turns) {
    // Skip proactive turns and incomplete turns
    if (turn.isProactive || !turn.assistantMessages?.length) continue;

    // Add user message
    if (turn.userMessage) {
      messages.push({ role: "user", content: turn.userMessage });
    }

    // Add assistant response
    const assistantContent = turn.assistantMessages
      .map((m) => m.content)
      .filter(Boolean)
      .join("\n");

    if (assistantContent) {
      messages.push({ role: "assistant", content: assistantContent });
    }
  }

  return messages;
}

// ─────────────────────────────────────────────────────────────────────────────
// useUIStream Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Options for useUIStream
 */
export interface UseUIStreamOptions {
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
export interface UseUIStreamReturn {
  /** Current UI tree */
  tree: UITree | null;
  /** Full conversation history (user messages + assistant messages + snapshots) */
  conversation: ConversationTurn[];
  /** Whether currently streaming */
  isStreaming: boolean;
  /** Error if any */
  error: Error | null;
  /** Send a prompt to generate UI */
  send: (
    prompt: string,
    context?: Record<string, unknown>,
    attachments?: Attachment[],
  ) => Promise<void>;
  /** Clear the current tree and conversation */
  clear: () => void;
  /** Remove an element from the tree */
  removeElement: (elementKey: string) => void;
  /** Remove specific sub-items from an element's array prop by index or ID (supports undo) */
  removeSubItems: (
    elementKey: string,
    identifiers: (number | string)[],
  ) => void;
  /** Update an element's props in the tree */
  updateElement: (elementKey: string, updates: Record<string, unknown>) => void;
  /** Update an element's layout (size, grid, resizable) */
  updateElementLayout: (
    elementKey: string,
    layoutUpdates: {
      width?: number;
      height?: number;
      column?: number;
      row?: number;
      columnSpan?: number;
      rowSpan?: number;
      resizable?: boolean;
    },
  ) => void;
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
  answerQuestion: (
    turnId: string,
    questionId: string,
    answers: Record<string, unknown>,
  ) => void;
  /** Abort the current streaming request */
  abort: () => void;
  // Note: Plan state now in Zustand store - use usePlanExecution() hook
}

// ─────────────────────────────────────────────────────────────────────────────
// flatToTree Types (re-export from core for convenience)
// ─────────────────────────────────────────────────────────────────────────────

export type FlatElement = UIElement & { parentKey?: string | null };

// ─────────────────────────────────────────────────────────────────────────────
// Action Tracking Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Types of user actions that can be tracked
 */
export type ActionType =
  | "toggle"
  | "input"
  | "select"
  | "click"
  | "complete"
  | "create"
  | "delete"
  | "update"
  | "submit"
  | "expand"
  | "collapse"
  | "drag"
  | "drop";

/**
 * A tracked user action on a component
 */
export interface TrackedAction {
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
export interface ActionTrackerOptions {
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

// ─────────────────────────────────────────────────────────────────────────────
// AI Settings Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Proactivity mode for AI Assistant
 */
export type ProactivityMode = "full" | "on-request" | "disabled";

/**
 * AI Assistant settings
 */
export interface AIAssistantSettings {
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
export const DEFAULT_AI_SETTINGS: AIAssistantSettings = {
  proactivity: {
    enabled: true,
    mode: "full",
    debounceMs: 2000,
  },
  suggestions: {
    enabled: true,
    maxChips: 4,
  },
  dataCollection: {
    preferForm: true,
    autoAsk: true,
  },
  onboarding: {
    showOnFirstUse: true,
    completed: false,
  },
};
