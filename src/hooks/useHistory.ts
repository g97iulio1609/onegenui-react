"use client";

import { useState, useCallback } from "react";
import type { UITree } from "@onegenui/core";
import type { ConversationTurn } from "./types";

/**
 * State snapshot for history
 */
export interface HistorySnapshot {
  tree: UITree | null;
  conversation: ConversationTurn[];
}

/**
 * Return type for useHistory hook
 */
export interface UseHistoryReturn {
  history: HistorySnapshot[];
  historyIndex: number;
  pushHistory: () => void;
  undo: () => HistorySnapshot | null;
  redo: () => HistorySnapshot | null;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
}

/**
 * Hook for managing undo/redo history
 * Follows Single Responsibility Principle - only manages history state
 */
export function useHistory(
  getCurrentState: () => {
    tree: UITree | null;
    conversation: ConversationTurn[];
  },
): UseHistoryReturn {
  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = useCallback(() => {
    const { tree, conversation } = getCurrentState();
    const snapshot: HistorySnapshot = {
      tree: tree ? JSON.parse(JSON.stringify(tree)) : null,
      conversation: JSON.parse(JSON.stringify(conversation)),
    };
    setHistory((prev) => {
      // Truncate any redo history
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, snapshot];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [getCurrentState, historyIndex]);

  const undo = useCallback((): HistorySnapshot | null => {
    if (historyIndex < 0) return null;
    const snapshot = history[historyIndex];
    if (snapshot) {
      setHistoryIndex((prev) => prev - 1);
      return snapshot;
    }
    return null;
  }, [history, historyIndex]);

  const redo = useCallback((): HistorySnapshot | null => {
    if (historyIndex >= history.length - 1) return null;
    const nextIndex = historyIndex + 1;
    const snapshot = history[nextIndex];
    if (snapshot) {
      setHistoryIndex(nextIndex);
      return snapshot;
    }
    return null;
  }, [history, historyIndex]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

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
    clearHistory,
  };
}
