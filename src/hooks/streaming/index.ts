/**
 * Streaming module - Public API
 *
 * This module provides composable hooks for UI streaming:
 * - useStreamingConnection: SSE connection management
 * - useStreamParser: Parse SSE stream lines
 * - usePatchBuffer: Batch patch processing
 * - useTreeState: UI Tree state management
 * - useStreamHistory: Undo/redo history
 *
 * Stream utilities for pure functions:
 * - parseSSELine, parseDataPart: Parse SSE format
 * - sortPatchesByDepth, groupPatches: Patch ordering
 * - classifyPayload: Route payloads to handlers
 */

// Types
export * from "./types";

// Pure utility functions
export {
  parseSSELine,
  parseDataPart,
  processBufferChunk,
  isPatchOperation,
  isTreePatch,
  payloadToPatch,
  sortPatchesByDepth,
  groupPatches,
  isValidPatch,
  classifyPayload,
} from "./stream-utils";
export type { PayloadClassification } from "./stream-utils";

// Composable hooks
export { useStreamingConnection } from "./use-streaming-connection";
export type {
  StreamConnection,
  ConnectionOptions,
  UseStreamingConnectionReturn,
} from "./use-streaming-connection";

export { useStreamParser } from "./use-stream-parser";
export type {
  UseStreamParserOptions,
  UseStreamParserReturn,
} from "./use-stream-parser";

export { usePatchBuffer } from "./use-patch-buffer";
export type {
  UsePatchBufferOptions,
  UsePatchBufferReturn,
} from "./use-patch-buffer";

export { useTreeState } from "./use-tree-state";
export type { UseTreeStateReturn, LayoutUpdates } from "./use-tree-state";

export { useStreamHistory } from "./use-stream-history";
export type { UseStreamHistoryReturn } from "./use-stream-history";
