"use client";

/**
 * Stream Reader - Async iterator for SSE streams with timeout
 *
 * Provides:
 * - Idle timeout protection
 * - Line buffering
 * - Event parsing via parseSSELine
 */

import { parseSSELine, type StreamEvent } from "./stream-parser";

const IDLE_TIMEOUT_MS = 90000; // 90 seconds

/**
 * Read SSE stream with idle timeout protection
 * Yields parsed events from the stream
 */
export async function* readStreamWithTimeout(
  reader: ReadableStreamDefaultReader<Uint8Array>,
): AsyncGenerator<StreamEvent, void, unknown> {
  const decoder = new TextDecoder();
  let buffer = "";
  let lastActivityTime = Date.now();

  const resetIdleTimer = () => {
    lastActivityTime = Date.now();
  };

  while (true) {
    // Create read with idle timeout check
    const readPromise = reader.read();
    const timeoutPromise = new Promise<never>((_, reject) => {
      const checkInterval = setInterval(() => {
        if (Date.now() - lastActivityTime > IDLE_TIMEOUT_MS) {
          clearInterval(checkInterval);
          reject(new Error(`Stream idle timeout: no activity for ${IDLE_TIMEOUT_MS / 1000}s`));
        }
      }, 5000);
      readPromise.finally(() => clearInterval(checkInterval));
    });

    const { done, value } = await Promise.race([readPromise, timeoutPromise]);
    if (done) break;

    // Raw data received - reset timer
    resetIdleTimer();

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line) continue;

      const event = parseSSELine(line);
      if (event) {
        yield event;
      }
    }
  }
}
