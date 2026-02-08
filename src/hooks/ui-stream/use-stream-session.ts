"use client";

/**
 * Stream Session Hook - Manages conversation state and streaming lifecycle
 *
 * Owns:
 * - conversation + conversationRef (kept in sync via useEffect)
 * - isStreaming / error flags
 * - sendingRef guard against concurrent sends
 * - clear() that resets everything including TreeStoreBridge
 */

import { useState, useCallback, useRef, useEffect } from "react";
import type { ConversationTurn } from "../types";
import type { TreeStoreBridge } from "./tree-store-bridge";

export interface UseStreamSessionReturn {
  conversation: ConversationTurn[];
  isStreaming: boolean;
  error: Error | null;
  conversationRef: React.MutableRefObject<ConversationTurn[]>;
  sendingRef: React.MutableRefObject<boolean>;
  setConversation: React.Dispatch<React.SetStateAction<ConversationTurn[]>>;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  clear: () => void;
}

export function useStreamSession(
  bridge: TreeStoreBridge,
  resetPlanExecution: () => void,
): UseStreamSessionReturn {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const conversationRef = useRef<ConversationTurn[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const sendingRef = useRef(false);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  const clear = useCallback(() => {
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
    clear,
  };
}
