/**
 * Patch Module
 *
 * Modular utilities for UITree JSON Patch operations.
 */

// Types and classification
export {
  PLACEHOLDER_TYPE,
  type PlaceholderMeta,
  type ClassifiedPatches,
  createPlaceholder,
  isPlaceholder,
  classifyPatches,
  getPatchDepth,
  sortPatchesByPath,
} from "./types";

// Structural sharing utilities
export {
  setByPathWithStructuralSharing,
  removeByPath,
} from "./structural-sharing";

// Tree manipulation utilities
export {
  removeNodeFromTree,
  ensureChildrenExist,
  getRootElement,
  getDescendantKeys,
} from "./tree-utils";

// Re-export from main patch-utils
export { parsePatchLine, applyPatch, applyPatchesBatch } from "../patch-utils";

// Re-export flatToTree from its module
export { flatToTree } from "../flat-to-tree";
