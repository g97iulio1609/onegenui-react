import type { ActionType, TrackedAction } from "../hooks/types";
import { isInteractiveElement } from "./dom";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_SELECTION_DELAY = 350;
export const MOVE_TOLERANCE_PX = 10;
export const EDGE_ZONE_SIZE = 16;

// ─────────────────────────────────────────────────────────────────────────────
// Haptic Feedback
// ─────────────────────────────────────────────────────────────────────────────

export function triggerHaptic(pattern: number | number[] = 50): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore errors on unsupported devices
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Target Detection
// ─────────────────────────────────────────────────────────────────────────────

export function isIgnoredTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  if (target.closest("[data-jsonui-ignore-select]")) return true;

  // Skip editable elements when in edit mode
  if (
    target.closest(".editable-text-node") ||
    target.closest("[data-editable='true']") ||
    target.closest("[contenteditable='true']")
  ) {
    return true;
  }

  const tagName = target.tagName.toLowerCase();
  if (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    tagName === "button" ||
    target.closest("button") ||
    target.isContentEditable ||
    target.getAttribute("role") === "button" ||
    target.getAttribute("role") === "slider" ||
    target.getAttribute("role") === "tab" ||
    target.getAttribute("role") === "checkbox" ||
    target.getAttribute("role") === "switch" ||
    target.getAttribute("role") === "menuitem"
  ) {
    return true;
  }

  if (
    target.hasAttribute("draggable") ||
    target.closest("[draggable]") ||
    target.closest(".react-draggable") ||
    target.closest("[data-drag-handle]") ||
    target.closest("[data-interactive]")
  ) {
    return true;
  }

  if (tagName === "a" || target.closest("a")) {
    return true;
  }

  return false;
}

export function isInEdgeZone(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  edgeSize: number = EDGE_ZONE_SIZE,
): boolean {
  const inLeftEdge = clientX < rect.left + edgeSize;
  const inRightEdge = clientX > rect.right - edgeSize;
  const inTopEdge = clientY < rect.top + edgeSize;
  const inBottomEdge = clientY > rect.bottom - edgeSize;

  return inLeftEdge || inRightEdge || inTopEdge || inBottomEdge;
}

// ─────────────────────────────────────────────────────────────────────────────
// Interaction Tracking Utilities
// ─────────────────────────────────────────────────────────────────────────────

export function getActionTypeFromEvent(
  target: HTMLElement,
  eventType: string,
): ActionType | null {
  const tagName = target.tagName.toLowerCase();
  const inputType = target.getAttribute("type")?.toLowerCase();
  const role = target.getAttribute("role")?.toLowerCase();

  if (
    (tagName === "input" && inputType === "checkbox") ||
    role === "checkbox" ||
    target.hasAttribute("data-checkbox")
  ) {
    return "toggle";
  }

  if (
    tagName === "select" ||
    (tagName === "input" && inputType === "radio") ||
    role === "listbox" ||
    role === "option"
  ) {
    return "select";
  }

  if (
    tagName === "input" ||
    tagName === "textarea" ||
    role === "textbox" ||
    target.isContentEditable
  ) {
    return eventType === "change" ? "input" : null;
  }

  if (
    tagName === "button" ||
    role === "button" ||
    target.hasAttribute("data-interactive")
  ) {
    return "click";
  }

  if (eventType === "click") {
    if (isInteractiveElement(target)) {
      return "click";
    }
  }

  return null;
}

export function extractInteractionContext(
  target: HTMLElement,
  _elementKey: string,
): TrackedAction["context"] {
  const context: TrackedAction["context"] = {};

  const selectableItem = target.closest("[data-selectable-item]");
  if (selectableItem instanceof HTMLElement) {
    const itemId = selectableItem.getAttribute("data-item-id");
    if (itemId) {
      context.itemId = itemId;
    }
  }

  const textContent =
    target.textContent?.trim().substring(0, 100) ||
    target.getAttribute("aria-label") ||
    target.getAttribute("title");

  if (textContent) {
    context.itemLabel = textContent;
  }

  if (target instanceof HTMLInputElement) {
    if (target.type === "checkbox") {
      context.newValue = target.checked;
      context.previousValue = !target.checked;
    } else {
      context.newValue = target.value;
    }
  } else if (target instanceof HTMLSelectElement) {
    context.newValue = target.value;
    const selectedOption = target.options[target.selectedIndex];
    if (selectedOption) {
      context.itemLabel = selectedOption.text;
    }
  } else if (target instanceof HTMLTextAreaElement) {
    context.newValue = target.value;
  }

  return context;
}

export function findClosestElementKey(target: HTMLElement): string | null {
  const elementWrapper = target.closest("[data-jsonui-element-key]");
  if (elementWrapper instanceof HTMLElement) {
    return elementWrapper.getAttribute("data-jsonui-element-key");
  }
  return null;
}
