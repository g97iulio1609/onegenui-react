import { useCallback } from "react";
import type { UITree } from "@onegenui/core";
import type { ConversationTurn, QuestionPayload } from "../types";

export interface UseConversationReturn {
  deleteTurn: (turnId: string) => void;
  editTurn: (turnId: string, newMessage: string) => Promise<void>;
  answerQuestion: (
    turnId: string,
    questionId: string,
    answers: Record<string, unknown>,
  ) => void;
}

/**
 * Hook for conversation management (delete, edit, answer)
 */
export function useConversation(
  conversation: ConversationTurn[],
  setConversation: React.Dispatch<React.SetStateAction<ConversationTurn[]>>,
  setTree: (tree: UITree | null) => void,
  treeRef: React.MutableRefObject<UITree | null>,
  pushHistory: () => void,
  send: (
    prompt: string,
    context?: Record<string, unknown>,
    attachments?: unknown[],
  ) => Promise<void>,
): UseConversationReturn {
  const deleteTurn = useCallback(
    (turnId: string) => {
      pushHistory();

      setConversation((prev) => {
        const turnIndex = prev.findIndex((t) => t.id === turnId);
        if (turnIndex === -1) return prev;

        const newConversation = prev.slice(0, turnIndex);
        const previousTurn = newConversation[newConversation.length - 1];
        const restoredTree = previousTurn?.treeSnapshot ?? null;
        setTree(restoredTree);
        treeRef.current = restoredTree;

        return newConversation;
      });
    },
    [pushHistory, setConversation, setTree, treeRef],
  );

  const editTurn = useCallback(
    async (turnId: string, newMessage: string) => {
      pushHistory();

      const turnIndex = conversation.findIndex((t) => t.id === turnId);
      if (turnIndex === -1) return;

      const newConversation = conversation.slice(0, turnIndex);
      setConversation(newConversation);

      const previousTurn = newConversation[newConversation.length - 1];
      const restoredTree = previousTurn?.treeSnapshot ?? null;
      setTree(restoredTree);
      treeRef.current = restoredTree;

      await send(newMessage, restoredTree ? { tree: restoredTree } : undefined);
    },
    [conversation, send, pushHistory, setConversation, setTree, treeRef],
  );

  const answerQuestion = useCallback(
    (turnId: string, questionId: string, answers: Record<string, unknown>) => {
      const turn = conversation.find((t) => t.id === turnId);
      const question = turn?.questions?.find(
        (q: QuestionPayload) => q.id === questionId,
      );

      // Collect all previous answers
      const allPreviousAnswers: Record<string, unknown> = {};
      for (const t of conversation) {
        if (t.questionAnswers) {
          for (const qAnswers of Object.values(t.questionAnswers)) {
            if (typeof qAnswers === "object" && qAnswers !== null) {
              Object.assign(allPreviousAnswers, qAnswers);
            }
          }
        }
      }

      if (turn?.questionAnswers) {
        for (const qAnswers of Object.values(turn.questionAnswers)) {
          if (typeof qAnswers === "object" && qAnswers !== null) {
            Object.assign(
              allPreviousAnswers,
              qAnswers as Record<string, unknown>,
            );
          }
        }
      }

      setConversation((prev) =>
        prev.map((t) => {
          if (t.id !== turnId) return t;
          const existing = t.questionAnswers ?? {};
          return {
            ...t,
            questionAnswers: {
              ...existing,
              [questionId]: answers,
            },
          };
        }),
      );

      if (question) {
        const answerSummary = Object.entries(answers)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");

        const prompt = `[User Response] ${question.text}\nAnswer: ${answerSummary}`;
        const combinedAnswers = { ...allPreviousAnswers, ...answers };

        send(prompt, {
          isQuestionResponse: true,
          questionId,
          turnId,
          originalQuestion: question.text,
          answers,
          previousAnswers: allPreviousAnswers,
          allCollectedData: combinedAnswers,
          hideUserMessage: true,
        });
      }
    },
    [conversation, send, setConversation],
  );

  return { deleteTurn, editTurn, answerQuestion };
}
