import type { UITree, UIElement, JsonPatch } from "@onegenui/core";
import {
  setByPathWithStructuralSharing,
  removeByPath as removeByPathSharing,
} from "./patches/structural-sharing";
import {
  ensureChildrenExist,
  removeNodeFromTree as removeNode,
} from "./patches/tree-utils";
import {
  createPlaceholder,
  isPlaceholder,
  getPatchDepth,
} from "./patches/types";

// Re-exports from modular files
export { isPlaceholder };
export { removeNode as removeNodeFromTree };
export { removeByPathSharing as removeByPath };

/**
 * Parse a single JSON patch line
 */
export function parsePatchLine(line: string): JsonPatch | null {
  try {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//")) {
      return null;
    }
    return JSON.parse(trimmed) as JsonPatch;
  } catch {
    return null;
  }
}

/**
 * Options for applying patches
 */
export interface ApplyPatchOptions {
  /** Turn ID for tracking which turn modified elements */
  turnId?: string;
  /** Element types that should not be removed by AI (e.g., ["Canvas"]) */
  protectedTypes?: string[];
}

type ElementMeta = UIElement["_meta"];

function buildCreatedMeta(existingMeta: ElementMeta, turnId?: string): ElementMeta {
  if (!turnId && !existingMeta) return undefined;

  const now = Date.now();
  const createdTurnId = existingMeta?.createdTurnId ?? existingMeta?.turnId ?? turnId;
  const lastModifiedTurnId =
    turnId ?? existingMeta?.lastModifiedTurnId ?? existingMeta?.turnId;

  return {
    ...existingMeta,
    turnId: createdTurnId,
    createdTurnId,
    lastModifiedTurnId,
    createdAt: existingMeta?.createdAt ?? now,
    lastModifiedAt: existingMeta?.lastModifiedAt ?? now,
  };
}

function buildUpdatedMeta(existingMeta: ElementMeta, turnId?: string): ElementMeta {
  if (!turnId && !existingMeta) return undefined;

  const now = Date.now();
  const createdTurnId = existingMeta?.createdTurnId ?? existingMeta?.turnId ?? turnId;
  const resolvedLastModifiedAt = turnId
    ? now
    : existingMeta?.lastModifiedAt ?? now;
  const lastModifiedTurnId =
    turnId ?? existingMeta?.lastModifiedTurnId ?? existingMeta?.turnId;

  return {
    ...existingMeta,
    turnId: createdTurnId,
    createdTurnId,
    lastModifiedTurnId,
    createdAt: existingMeta?.createdAt ?? now,
    lastModifiedAt: resolvedLastModifiedAt,
  };
}

/**
 * Apply a JSON patch to the current tree
 */
export function applyPatch(
  tree: UITree,
  patch: JsonPatch,
  options: ApplyPatchOptions = {},
): UITree {
  const { turnId, protectedTypes = [] } = options;

  const newTree = { ...tree, elements: { ...tree.elements } };

  switch (patch.op) {
    case "set":
    case "add":
    case "replace": {
      if (patch.path === "/root") {
        newTree.root = patch.value as string;
        return newTree;
      }

      if (patch.path.startsWith("/elements/")) {
        const pathParts = patch.path.slice("/elements/".length).split("/");
        const elementKey = pathParts[0];

        if (!elementKey) return newTree;

        if (pathParts.length === 1) {
          const element = patch.value as UIElement;
          const existingElement = newTree.elements[elementKey];
          const meta = existingElement
            ? buildUpdatedMeta(existingElement._meta ?? element._meta, turnId)
            : buildCreatedMeta(element._meta, turnId);
          const newElement = meta ? { ...element, _meta: meta } : element;

          ensureChildrenExist(
            newTree.elements,
            newElement.children,
            createPlaceholder,
            turnId,
          );
          newTree.elements[elementKey] = newElement;
        } else {
          let element = newTree.elements[elementKey];

          if (!element) {
            const isChildrenOperation = pathParts.some((p) => p === "children");
            if (isChildrenOperation) {
              element = {
                key: elementKey,
                type: "Stack",
                props: { gap: "md" },
                children: [],
                _meta: buildCreatedMeta({ autoCreated: true }, turnId),
              } as UIElement;
            } else {
              element = createPlaceholder(elementKey, turnId);
            }
            newTree.elements[elementKey] = element;
          }

          const propPath = "/" + pathParts.slice(1).join("/");
          const newElement = setByPathWithStructuralSharing(
            element as unknown as Record<string, unknown>,
            propPath,
            patch.value,
          ) as unknown as UIElement;

          if (
            propPath.startsWith("/children") &&
            typeof patch.value === "string"
          ) {
            const childKey = patch.value;
            if (!newTree.elements[childKey]) {
              newTree.elements[childKey] = createPlaceholder(childKey, turnId);
            }
            const childElement = newTree.elements[childKey];
            if (childElement && childElement.parentKey !== elementKey) {
              newTree.elements[childKey] = {
                ...childElement,
                parentKey: elementKey,
              };
            }
          }

          const updatedMeta = buildUpdatedMeta(
            newElement._meta ?? element._meta,
            turnId,
          );
          const updatedElement = updatedMeta
            ? { ...newElement, _meta: updatedMeta }
            : newElement;

          newTree.elements[elementKey] = updatedElement;
        }
      }
      break;
    }
    case "remove": {
      if (patch.path === "/root") {
        newTree.root = "";
        return newTree;
      }

      if (patch.path.startsWith("/elements/")) {
        const pathParts = patch.path.slice("/elements/".length).split("/");
        const elementKey = pathParts[0];

        if (!elementKey) return newTree;

        // Check if element is protected from removal
        if (pathParts.length === 1) {
          const element = newTree.elements[elementKey];
          if (element && protectedTypes.includes(element.type)) {
            // Skip removal of protected element types
            console.debug(
              `[applyPatch] Blocked removal of protected element: ${element.type}`,
            );
            return newTree;
          }
          const { [elementKey]: _, ...rest } = newTree.elements;
          newTree.elements = rest;
        } else {
          const element = newTree.elements[elementKey];
          if (element) {
            const propPath = "/" + pathParts.slice(1).join("/");
            const newElement = { ...element };
            removeByPathSharing(
              newElement as unknown as Record<string, unknown>,
              propPath,
            );
            newTree.elements[elementKey] = newElement;
          }
        }
      }
      break;
    }
    case "ensure": {
      if (patch.path.startsWith("/elements/")) {
        const pathParts = patch.path.slice("/elements/".length).split("/");
        const elementKey = pathParts[0];

        if (!elementKey) return newTree;

        if (pathParts.length === 1 && !newTree.elements[elementKey]) {
          const newElement = patch.value as UIElement;
          const meta = buildCreatedMeta(newElement._meta, turnId);
          const ensuredElement = meta ? { ...newElement, _meta: meta } : newElement;
          ensureChildrenExist(
            newTree.elements,
            ensuredElement.children,
            createPlaceholder,
            turnId,
          );
          newTree.elements[elementKey] = ensuredElement;
        }
      }
      break;
    }
  }

  return newTree;
}

/**
 * Apply multiple patches in dependency order (ORDER-INDEPENDENT).
 */
export function applyPatchesBatch(
  tree: UITree,
  patches: JsonPatch[],
  options: ApplyPatchOptions = {},
): UITree {
  if (patches.length === 0) return tree;

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

  elementPatches.sort((a, b) => a.path.localeCompare(b.path));
  propPatches.sort((a, b) => a.path.localeCompare(b.path));

  let newTree = { ...tree, elements: { ...tree.elements } };

  for (const patch of rootPatches) {
    newTree = applyPatch(newTree, patch, options);
  }
  for (const patch of elementPatches) {
    newTree = applyPatch(newTree, patch, options);
  }
  for (const patch of propPatches) {
    newTree = applyPatch(newTree, patch, options);
  }
  for (const patch of otherPatches) {
    newTree = applyPatch(newTree, patch, options);
  }

  return newTree;
}
