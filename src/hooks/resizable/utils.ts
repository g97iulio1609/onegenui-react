import type { ElementResizeConfig } from "@onegenui/core";
import type { ResizeHandle } from "./types";

/**
 * Parse size value (number or CSS string) to number
 */
export function parseSize(
  value: number | string | undefined,
  fallback: number,
): number {
  if (value === undefined) return fallback;
  if (typeof value === "number") return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Normalize config (boolean or object) to object
 */
export function normalizeConfig(
  config: ElementResizeConfig | boolean | undefined,
): ElementResizeConfig {
  if (config === undefined || config === false) {
    return { horizontal: false, vertical: false };
  }
  if (config === true) {
    return { horizontal: true, vertical: true };
  }
  return config;
}

/**
 * Snap value to grid
 */
export function snapToGrid(
  value: number,
  gridSize: number | undefined,
): number {
  if (!gridSize || gridSize <= 0) return value;
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Find the closest scrollable container to constrain resize bounds
 */
export function findScrollableContainer(
  element: HTMLElement | null,
): HTMLElement | null {
  if (!element) return null;

  let parent = element.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;

    if (
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowX === "auto" ||
      overflowX === "scroll" ||
      parent.hasAttribute("data-render-container")
    ) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return document.body;
}

/**
 * Calculate max dimensions based on container bounds and element position
 */
export function getContainerConstraints(
  element: HTMLElement,
  container: HTMLElement,
  handle: ResizeHandle,
): { maxWidth: number; maxHeight: number } {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  let maxWidth = Infinity;
  let maxHeight = Infinity;

  if (handle.includes("e")) {
    maxWidth = containerRect.right - elementRect.left - 16;
  }
  if (handle.includes("w")) {
    maxWidth = elementRect.right - containerRect.left - 16;
  }
  if (handle.includes("s")) {
    maxHeight = Math.max(containerRect.height * 2, 1000);
  }
  if (handle.includes("n")) {
    maxHeight = elementRect.bottom - containerRect.top - 16;
  }

  return { maxWidth, maxHeight };
}

/**
 * Get CSS cursor for a resize handle
 */
export function getCursorForHandle(handle: ResizeHandle | null): string {
  switch (handle) {
    case "e":
    case "w":
      return "ew-resize";
    case "n":
    case "s":
      return "ns-resize";
    case "se":
    case "nw":
      return "nwse-resize";
    case "sw":
    case "ne":
      return "nesw-resize";
    default:
      return "";
  }
}

/**
 * Get the CSS cursor for a resize handle (exported alias)
 */
export function getResizeCursor(handle: ResizeHandle): string {
  return getCursorForHandle(handle);
}
