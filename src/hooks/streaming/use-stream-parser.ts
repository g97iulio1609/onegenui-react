/**
 * useStreamParser - Parse SSE stream lines
 * Handles line buffering and format detection
 */

import { useCallback, useRef } from "react";
import {
  parseSSELine,
  parseDataPart,
  processBufferChunk,
  classifyPayload,
} from "./stream-utils";
import type { PayloadClassification } from "./stream-utils";

export interface UseStreamParserOptions {
  /** Callback for each classified payload */
  onPayload: (classification: PayloadClassification) => void;
  /** Callback for parse errors */
  onParseError?: (error: Error, line: string) => void;
}

export interface UseStreamParserReturn {
  /** Process a chunk of text from the stream */
  processChunk: (chunk: string) => void;
  /** Flush any remaining buffer */
  flush: () => void;
  /** Reset the parser state */
  reset: () => void;
}

/**
 * Hook for parsing SSE stream data
 */
export function useStreamParser(
  options: UseStreamParserOptions,
): UseStreamParserReturn {
  const { onPayload, onParseError } = options;
  const bufferRef = useRef("");

  const processLine = useCallback(
    (line: string) => {
      if (!line) return;

      const parsed = parseSSELine(line);
      if (!parsed) return;

      // Parse data content
      if (parsed.type === "d" || parsed.type === "data") {
        try {
          const payload = parseDataPart(parsed.content);
          const classification = classifyPayload(payload);

          if (classification.kind !== "ignore") {
            onPayload(classification);
          }
        } catch (error) {
          onParseError?.(error as Error, line);
        }
      }
    },
    [onPayload, onParseError],
  );

  const processChunk = useCallback(
    (chunk: string) => {
      const { lines, remaining } = processBufferChunk(bufferRef.current, chunk);
      bufferRef.current = remaining;

      for (const line of lines) {
        processLine(line);
      }
    },
    [processLine],
  );

  const flush = useCallback(() => {
    if (bufferRef.current) {
      processLine(bufferRef.current);
      bufferRef.current = "";
    }
  }, [processLine]);

  const reset = useCallback(() => {
    bufferRef.current = "";
  }, []);

  return {
    processChunk,
    flush,
    reset,
  };
}
