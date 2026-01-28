import { useState, useCallback, useRef } from "react";
import type { UITree } from "@onegenui/core";
import type { ConversationTurn } from "../types";

export interface HistorySnapshot {
  tree: UITree | null;
  conversation: ConversationTurn[];
}

export interface UseHistoryReturn {
  history: HistorySnapshot[];
  historyIndex: number;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  setHistory: React.Dispatch<React.SetStateAction<HistorySnapshot[]>>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Hook for managing undo/redo history
 */
export function useHistory(
  tree: UITree | null,
  conversation: ConversationTurn[],
  setTree: (tree: UITree | null) => void,
  setConversation: React.Dispatch<React.SetStateAction<ConversationTurn[]>>,
  treeRef: React.MutableRefObject<UITree | null>,
): UseHistoryReturn {
  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = useCallback(() => {
    const snapshot = {
      tree: tree ? JSON.parse(JSON.stringify(tree)) : null,
      conversation: JSON.parse(JSON.stringify(conversation)),
    };
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, snapshot];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [tree, conversation, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex < 0) return;
    const snapshot = history[historyIndex];
    if (snapshot) {
      setTree(snapshot.tree);
      treeRef.current = snapshot.tree;
      setConversation(snapshot.conversation);
      setHistoryIndex((prev) => prev - 1);
    }
  }, [history, historyIndex, setTree, setConversation, treeRef]);

  const redo = useCallback(() => {
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
    setHistoryIndex,
  };
}
