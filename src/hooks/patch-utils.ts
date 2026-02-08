import {
  NormalizedUiPatchSchema,
  type UITree,
  type UIElement,
  type JsonPatch,
} from "@onegenui/core";
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

function mergeElementForAdd(
  existing: UIElement,
  incoming: UIElement,
): UIElement {
  const existingChildren = Array.isArray(existing.children)
    ? existing.children
    : [];
  const incomingChildren = Array.isArray(incoming.children)
    ? incoming.children
    : [];

  const mergedChildren =
    incoming.children === undefined || incomingChildren.length === 0
      ? existingChildren
      : [...new Set([...existingChildren, ...incomingChildren])];

  return {
    ...existing,
    ...incoming,
    props: {
      ...(existing.props ?? {}),
      ...(incoming.props ?? {}),
    },
    children: mergedChildren,
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
  const parsedPatch = NormalizedUiPatchSchema.safeParse(patch);
  if (!parsedPatch.success) {
    const reason = parsedPatch.error.issues
      .map((issue) => issue.message)
      .join("; ");
    throw new Error(`Invalid UI patch: ${reason}`);
  }
  const normalizedPatch = parsedPatch.data;
  const patchPath = normalizedPatch.path;
  if (typeof patchPath !== "string") {
    throw new Error("Invalid UI patch: path is required.");
  }

  const newTree = { ...tree, elements: { ...tree.elements } };

  switch (normalizedPatch.op) {
    case "set":
    case "add":
    case "replace": {
      if (patchPath === "/root") {
        newTree.root = normalizedPatch.value as string;
        return newTree;
      }

      if (patchPath.startsWith("/elements/")) {
        const pathParts = patchPath
          .slice("/elements/".length)
          .split("/");
        const elementKey = pathParts[0];

        if (!elementKey) return newTree;

        if (pathParts.length === 1) {
          const element = normalizedPatch.value as UIElement;
          const existingElement = newTree.elements[elementKey];
          const mergedElement =
            (normalizedPatch.op === "add" ||
              normalizedPatch.op === "replace") &&
            existingElement
              ? mergeElementForAdd(existingElement, element)
              : element;
          const meta = existingElement
            ? buildUpdatedMeta(mergedElement._meta ?? existingElement._meta, turnId)
            : buildCreatedMeta(mergedElement._meta, turnId);
          const newElement = meta
            ? { ...mergedElement, _meta: meta }
            : mergedElement;

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
            normalizedPatch.value,
          ) as unknown as UIElement;

          if (
            propPath.startsWith("/children") &&
            typeof normalizedPatch.value === "string"
          ) {
            const childKey = normalizedPatch.value;
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
      if (patchPath === "/root") {
        newTree.root = "";
        return newTree;
      }

      if (patchPath.startsWith("/elements/")) {
        const pathParts = patchPath
          .slice("/elements/".length)
          .split("/");
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
      if (patchPath.startsWith("/elements/")) {
        const pathParts = patchPath
          .slice("/elements/".length)
          .split("/");
        const elementKey = pathParts[0];

        if (!elementKey) return newTree;

        if (pathParts.length === 1 && !newTree.elements[elementKey]) {
          const newElement = normalizedPatch.value as UIElement;
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

  const applyGroup = (group: JsonPatch[]) => {
    for (const patch of group) {
      try {
        newTree = applyPatch(newTree, patch, options);
      } catch (e) {
        if (typeof console !== "undefined") {
          console.warn("[applyPatchesBatch] Skipping invalid patch:", patch.path, e);
        }
      }
    }
  };
  applyGroup(rootPatches);
  applyGroup(elementPatches);
  applyGroup(propPatches);
  applyGroup(otherPatches);

  return newTree;
}
