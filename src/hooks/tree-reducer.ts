/**
 * Tree Reducer Module
 *
 * Pure reducer function for managing UITree state.
 * Guarantees immutability - every action returns a NEW tree reference.
 */

import type { UITree, UIElement, JsonPatch } from "@onegenui/core";
import { setByPath } from "@onegenui/core";

// ─────────────────────────────────────────────────────────────────────────────
// Action Types
// ─────────────────────────────────────────────────────────────────────────────

export type TreeAction =
  | { type: "PATCH"; patch: JsonPatch }
  | { type: "PATCH_BATCH"; patches: JsonPatch[] }
  | { type: "RESET"; tree: UITree }
  | { type: "CLEAR" };

// ─────────────────────────────────────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────────────────────────────────────

export const initialTree: UITree = {
  root: "",
  elements: {},
};

// ─────────────────────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────────────────────

export function treeReducer(state: UITree, action: TreeAction): UITree {
  switch (action.type) {
    case "PATCH":
      return applyPatchImmutable(state, action.patch);

    case "PATCH_BATCH":
      return action.patches.reduce(
        (tree, patch) => applyPatchImmutable(tree, patch),
        state,
      );

    case "RESET":
      return deepClone(action.tree);

    case "CLEAR":
      return initialTree;

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Pure Immutable Patch Application
// ─────────────────────────────────────────────────────────────────────────────

function applyPatchImmutable(tree: UITree, patch: JsonPatch): UITree {
  // Always create new references at the top level
  const newTree: UITree = {
    root: tree.root,
    elements: { ...tree.elements },
  };

  switch (patch.op) {
    case "set":
    case "add":
    case "replace": {
      if (patch.path === "/root") {
        return { ...newTree, root: patch.value as string };
      }

      if (patch.path.startsWith("/elements/")) {
        const pathParts = patch.path.slice("/elements/".length).split("/");
        const elementKey = pathParts[0];

        if (!elementKey) return newTree;

        if (pathParts.length === 1) {
          // Adding/setting entire element - deep clone the value
          newTree.elements[elementKey] = deepClone(patch.value as UIElement);
        } else {
          // Setting property within element - deep clone, modify, replace
          const existingElement = newTree.elements[elementKey];
          if (existingElement) {
            const newElement = deepClone(existingElement);
            const propPath = "/" + pathParts.slice(1).join("/");
            setByPath(
              newElement as unknown as Record<string, unknown>,
              propPath,
              deepClone(patch.value),
            );
            newTree.elements[elementKey] = newElement;
          }
        }
      }
      break;
    }

    case "remove": {
      if (patch.path === "/root") {
        return { ...newTree, root: "" };
      }

      if (patch.path.startsWith("/elements/")) {
        const pathParts = patch.path.slice("/elements/".length).split("/");
        const elementKey = pathParts[0];

        if (!elementKey) return newTree;

        if (pathParts.length === 1) {
          // Removing entire element
          const { [elementKey]: _, ...rest } = newTree.elements;
          newTree.elements = rest;
        } else {
          // Removing property within element
          const existingElement = newTree.elements[elementKey];
          if (existingElement) {
            const newElement = deepClone(existingElement);
            const propPath = "/" + pathParts.slice(1).join("/");
            removeByPath(
              newElement as unknown as Record<string, unknown>,
              propPath,
            );
            newTree.elements[elementKey] = newElement;
          }
        }
      }
      break;
    }
  }

  return newTree;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function deepClone<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }
  return JSON.parse(JSON.stringify(value));
}

function removeByPath(obj: Record<string, unknown>, path: string): void {
  const segments = path.startsWith("/")
    ? path.slice(1).split("/")
    : path.split("/");

  if (segments.length === 0) return;

  let current: unknown = obj;

  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    if (current === null || typeof current !== "object") return;

    if (segment === undefined) return;
    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index) || index < 0 || index >= current.length)
        return;
      current = current[index];
    } else {
      current = (current as Record<string, unknown>)[segment];
    }
  }

  const lastSegment = segments[segments.length - 1];

  if (current === null || typeof current !== "object") return;

  if (lastSegment === undefined) return;
  if (Array.isArray(current)) {
    const index = Number(lastSegment);
    if (Number.isInteger(index) && index >= 0 && index < current.length) {
      current.splice(index, 1);
    }
  } else {
    delete (current as Record<string, unknown>)[lastSegment];
  }
}
