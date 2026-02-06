/**
 * Patch module types
 * Types for UITree patch operations
 */

import type { JsonPatch, UIElement } from "@onegenui/core";

/**
 * Placeholder element type for forward-referenced children
 */
export const PLACEHOLDER_TYPE = "__placeholder__";

/**
 * Placeholder element metadata
 */
export interface PlaceholderMeta {
  turnId?: string;
  createdAt: number;
  isPlaceholder: true;
}

/**
 * Create a placeholder element for a forward-referenced child
 */
export function createPlaceholder(key: string, turnId?: string): UIElement {
  return {
    key,
    type: PLACEHOLDER_TYPE,
    props: {},
    children: [],
    _meta: {
      turnId,
      createdTurnId: turnId,
      lastModifiedTurnId: turnId,
      createdAt: Date.now(),
      isPlaceholder: true,
    },
  } as UIElement;
}

/**
 * Check if an element is a placeholder
 */
export function isPlaceholder(element: UIElement): boolean {
  return (
    element.type === PLACEHOLDER_TYPE ||
    (element._meta as any)?.isPlaceholder === true
  );
}

/**
 * Patch classification by type
 */
export interface ClassifiedPatches {
  rootPatches: JsonPatch[];
  elementPatches: JsonPatch[];
  propPatches: JsonPatch[];
  otherPatches: JsonPatch[];
}

/**
 * Classify patches by their type for ordered processing
 */
export function classifyPatches(patches: JsonPatch[]): ClassifiedPatches {
  const rootPatches: JsonPatch[] = [];
  const elementPatches: JsonPatch[] = [];
  const propPatches: JsonPatch[] = [];
  const otherPatches: JsonPatch[] = [];

  for (const patch of patches) {
    if (patch.path === "/root") {
      rootPatches.push(patch);
    } else if (patch.path.startsWith("/elements/")) {
      const depth = getPatchDepth(patch);
      if (depth === 1) {
        elementPatches.push(patch);
      } else {
        propPatches.push(patch);
      }
    } else {
      otherPatches.push(patch);
    }
  }

  return { rootPatches, elementPatches, propPatches, otherPatches };
}

/**
 * Get path depth for sorting
 */
export function getPatchDepth(patch: JsonPatch): number {
  if (!patch.path.startsWith("/elements/")) return 0;
  const parts = patch.path.slice("/elements/".length).split("/");
  return parts.length;
}

/**
 * Sort patches for deterministic processing order
 */
export function sortPatchesByPath(patches: JsonPatch[]): JsonPatch[] {
  return [...patches].sort((a, b) => a.path.localeCompare(b.path));
}
