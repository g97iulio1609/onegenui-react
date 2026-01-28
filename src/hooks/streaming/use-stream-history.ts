/**
 * useStreamHistory - History management for undo/redo
 * Tracks state snapshots and provides navigation
 */

import { useState, useCallback } from "react";
import type { UITree } from "@onegenui/core";
import type { ConversationTurn } from "../types";
import type { HistorySnapshot } from "./types";

export interface UseStreamHistoryReturn {
  /** Push current state to history */
  pushHistory: (tree: UITree | null, conversation: ConversationTurn[]) => void;
  /** Undo to previous state */
  undo: () => HistorySnapshot | null;
  /** Redo to next state */
  redo: () => HistorySnapshot | null;
  /** Clear all history */
  clearHistory: () => void;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Current history index */
  historyIndex: number;
  /** Total history length */
  historyLength: number;
}

/**
 * Hook for managing undo/redo history
 */
export function useStreamHistory(): UseStreamHistoryReturn {
  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = useCallback(
    (tree: UITree | null, conversation: ConversationTurn[]) => {
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
    },
    [historyIndex],
  );

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

  return {
    pushHistory,
    undo,
    redo,
    clearHistory,
    canUndo: historyIndex >= 0,
    canRedo: historyIndex < history.length - 1,
    historyIndex,
    historyLength: history.length,
  };
}
