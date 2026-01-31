"use client";

/**
 * Question Handler - Manages question answers and context
 *
 * Handles:
 * - Collecting previous answers from conversation
 * - Formatting answer responses
 * - Building prompt for question responses
 */

import type { ConversationTurn, QuestionPayload } from "../types";

/**
 * Collect all previous question answers from conversation
 */
export function collectPreviousAnswers(
  conversation: ConversationTurn[],
  currentTurnId?: string,
): Record<string, unknown> {
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

  // Add current turn's existing answers if provided
  if (currentTurnId) {
    const currentTurn = conversation.find((t) => t.id === currentTurnId);
    if (currentTurn?.questionAnswers) {
      for (const qAnswers of Object.values(currentTurn.questionAnswers)) {
        if (typeof qAnswers === "object" && qAnswers !== null) {
          Object.assign(
            allPreviousAnswers,
            qAnswers as Record<string, unknown>,
          );
        }
      }
    }
  }

  return allPreviousAnswers;
}

/**
 * Format answer summary for prompt
 */
export function formatAnswerSummary(answers: Record<string, unknown>): string {
  return Object.entries(answers)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
}

/**
 * Build prompt for question response
 */
export function buildQuestionResponsePrompt(
  questionText: string,
  answers: Record<string, unknown>,
): string {
  const answerSummary = formatAnswerSummary(answers);
  return `[User Response] ${questionText}\nAnswer: ${answerSummary}`;
}

/**
 * Build context for question response send
 */
export function buildQuestionResponseContext(
  question: QuestionPayload,
  turnId: string,
  answers: Record<string, unknown>,
  previousAnswers: Record<string, unknown>,
): Record<string, unknown> {
  return {
    isQuestionResponse: true,
    questionId: question.id,
    turnId,
    originalQuestion: question.text,
    answers,
    previousAnswers,
    allCollectedData: { ...previousAnswers, ...answers },
    hideUserMessage: true,
  };
}

/**
 * Update conversation with question answer
 */
export function addQuestionAnswer(
  turns: ConversationTurn[],
  turnId: string,
  questionId: string,
  answers: Record<string, unknown>,
): ConversationTurn[] {
  return turns.map((t) => {
    if (t.id !== turnId) return t;
    const existing = t.questionAnswers ?? {};
    return {
      ...t,
      questionAnswers: {
        ...existing,
        [questionId]: answers,
      },
    };
  });
}
