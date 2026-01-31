"use client";

/**
 * Request Builder - Constructs HTTP request body and headers
 *
 * Handles different request formats:
 * - FormData for file uploads
 * - JSON for library documents only
 * - JSON for text-only requests
 */

import type { UITree } from "@onegenui/core";
import type {
  Attachment,
  ConversationTurn,
  FileAttachment,
  LibraryAttachment,
} from "../types";

/**
 * Generate idempotency key for request deduplication
 */
export function generateIdempotencyKey(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function isFileAttachment(a: Attachment): a is FileAttachment {
  return a.type !== "library-document" && "file" in a && a.file instanceof File;
}

export function isLibraryAttachment(a: Attachment): a is LibraryAttachment {
  return a.type === "library-document" && "documentId" in a;
}

/** Build conversation messages array for multi-turn context */
export function buildConversationMessages(
  conversation: ConversationTurn[],
): Array<{ role: "user" | "assistant"; content: string }> {
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

  for (const turn of conversation) {
    // Only include completed turns (not loading)
    if (turn.isLoading) continue;

    // Add user message
    if (turn.userMessage) {
      messages.push({ role: "user", content: turn.userMessage });
    }

    // Add assistant response (combine all messages)
    const assistantContent = turn.assistantMessages
      .filter((m) => m.type === "text" && m.text)
      .map((m) => m.text)
      .join("\n");

    if (assistantContent) {
      messages.push({ role: "assistant", content: assistantContent });
    }
  }

  return messages;
}

export interface RequestBuilderInput {
  prompt: string;
  context?: Record<string, unknown>;
  currentTree: UITree;
  conversation: ConversationTurn[];
  attachments?: Attachment[];
}

export interface RequestBuilderOutput {
  body: string | FormData;
  headers: Record<string, string>;
}

/**
 * Build request body and headers based on attachment types
 */
export function buildRequest(input: RequestBuilderInput): RequestBuilderOutput {
  const { prompt, context, currentTree, conversation, attachments } = input;
  const headers: Record<string, string> = {};

  // Generate idempotency key for deduplication
  const idempotencyKey = generateIdempotencyKey();
  headers["X-Idempotency-Key"] = idempotencyKey;

  const hasTreeContext =
    context && typeof context === "object" && "tree" in context;

  // Build conversation history for multi-turn support
  const conversationMessages = buildConversationMessages(conversation);

  // Separate file attachments from library attachments
  const fileAttachments = attachments?.filter(isFileAttachment) ?? [];
  const libraryAttachments = attachments?.filter(isLibraryAttachment) ?? [];

  if (fileAttachments.length > 0) {
    // Use FormData for file uploads
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("idempotencyKey", idempotencyKey);
    if (context) {
      formData.append("context", JSON.stringify(context));
    }
    if (!hasTreeContext) {
      formData.append("currentTree", JSON.stringify(currentTree));
    }
    // Include conversation history for multi-turn context
    if (conversationMessages.length > 0) {
      formData.append("messages", JSON.stringify(conversationMessages));
    }

    fileAttachments.forEach((att) => {
      formData.append("files", att.file);
    });

    // Include library document IDs
    if (libraryAttachments.length > 0) {
      formData.append(
        "libraryDocumentIds",
        JSON.stringify(libraryAttachments.map((a) => a.documentId)),
      );
    }

    // Don't set Content-Type header for FormData, browser sets it with boundary
    return { body: formData, headers };
  }

  if (libraryAttachments.length > 0) {
    // Only library documents, use JSON
    const bodyPayload: Record<string, unknown> = {
      prompt,
      context,
      idempotencyKey,
      libraryDocumentIds: libraryAttachments.map((a) => a.documentId),
    };
    if (!hasTreeContext) {
      bodyPayload.currentTree = currentTree;
    }
    if (conversationMessages.length > 0) {
      bodyPayload.messages = conversationMessages;
    }
    headers["Content-Type"] = "application/json";
    return { body: JSON.stringify(bodyPayload), headers };
  }

  // Use JSON for text-only requests
  const bodyPayload: Record<string, unknown> = { prompt, context, idempotencyKey };
  if (!hasTreeContext) {
    bodyPayload.currentTree = currentTree;
  }
  // Include conversation history for multi-turn context
  if (conversationMessages.length > 0) {
    bodyPayload.messages = conversationMessages;
  }
  headers["Content-Type"] = "application/json";
  return { body: JSON.stringify(bodyPayload), headers };
}
