"use client";

// =============================================================================
// Action Tracking Utilities
// =============================================================================

import type { TrackedAction } from "../../hooks/types";

export const generateId = () =>
  `action-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/** Check if document has focus on an editable element */
export const isUserCurrentlyEditing = (): boolean => {
  if (typeof document === "undefined") return false;
  const active = document.activeElement;
  if (!active) return false;
  const tag = active.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    (active as HTMLElement).isContentEditable
  );
};

export function formatActionsForPrompt(actions: TrackedAction[]): string {
  if (actions.length === 0) return "";

  const formatted = actions.map((action) => {
    const parts = [`- ${action.type} on ${action.elementType}`];
    if (action.context?.itemLabel) {
      parts.push(`"${action.context.itemLabel}"`);
    }
    if (
      action.context?.previousValue !== undefined &&
      action.context?.newValue !== undefined
    ) {
      parts.push(
        `(${action.context.previousValue} -> ${action.context.newValue})`,
      );
    }
    return parts.join(" ");
  });

  return `
RECENT USER ACTIONS:
${formatted.join("\n")}

Based on these actions, you may proactively offer relevant assistance.
`;
}
