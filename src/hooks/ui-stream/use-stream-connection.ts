"use client";

/**
 * Stream Connection Hook - Manages HTTP connection lifecycle + reconnection
 *
 * Owns:
 * - AbortController map (keyed by chatId)
 * - Reconnection manager (exponential backoff, resume-from-sequence)
 * - setupAbort: cancels previous requests, creates fresh controller
 * - connect: performs fetch with merged headers, returns reader
 * - connectWithRetry: connect with automatic reconnection on failure
 * - abort / clearControllers for cleanup
 */

import { useRef, useCallback, useMemo } from "react";
import {
  createReconnectionManager,
  type ReconnectionManager,
} from "./reconnection-manager";
import { streamLog } from "./logger";

export interface UseStreamConnectionReturn {
  setupAbort: (chatId?: string) => { signal: AbortSignal; abortKey: string };
  connect: (params: ConnectParams) => Promise<ReadableStreamDefaultReader<Uint8Array>>;
  connectWithRetry: (params: ConnectParams) => Promise<ReadableStreamDefaultReader<Uint8Array>>;
  abort: () => void;
  clearControllers: () => void;
  reconnection: ReconnectionManager;
}

interface ConnectParams {
  api: string;
  body: string | FormData;
  headers: Record<string, string>;
  signal: AbortSignal;
  getHeaders?: () => Record<string, string> | Promise<Record<string, string>>;
}

async function performFetch(params: ConnectParams, extraHeaders: Record<string, string> = {}): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const dynamicHeaders = params.getHeaders ? await params.getHeaders() : {};
  const mergedHeaders = { ...params.headers, ...dynamicHeaders, ...extraHeaders };

  const response = await fetch(params.api, {
    method: "POST",
    headers: mergedHeaders,
    body: params.body,
    signal: params.signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Stream request failed (${response.status}): ${errorText}`);
  }
  if (!response.body) {
    throw new Error("Response body is null — streaming not supported");
  }
  return response.body.getReader();
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}

export function useStreamConnection(): UseStreamConnectionReturn {
  const controllersRef = useRef<Map<string, AbortController>>(new Map());
  const reconnection = useMemo(() => createReconnectionManager(), []);

  const setupAbort = useCallback((chatId?: string) => {
    for (const controller of controllersRef.current.values()) {
      controller.abort();
    }
    controllersRef.current.clear();
    reconnection.reset();
    const controller = new AbortController();
    const abortKey = chatId ?? "default";
    controllersRef.current.set(abortKey, controller);
    return { signal: controller.signal, abortKey };
  }, [reconnection]);

  const connect = useCallback(
    (params: ConnectParams) => performFetch(params),
    [],
  );

  const connectWithRetry = useCallback(
    async (params: ConnectParams): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
      try {
        const resumeHeaders = reconnection.getResumeHeaders();
        return await performFetch(params, resumeHeaders);
      } catch (err) {
        if ((err as Error).name === "AbortError") throw err;
        if (!reconnection.shouldRetry()) throw err;

        const retryDelay = reconnection.getRetryDelay();
        const state = reconnection.getState();
        streamLog.warn("Stream connection failed, retrying", {
          attempt: state.retryCount,
          delayMs: retryDelay,
          lastSequence: state.lastSequence,
          error: (err as Error).message,
        });

        await delay(retryDelay, params.signal);
        return connectWithRetry(params);
      }
    },
    [reconnection],
  );

  const abort = useCallback(() => {
    for (const controller of controllersRef.current.values()) {
      controller.abort();
    }
    controllersRef.current.clear();
  }, []);

  const clearControllers = useCallback(() => {
    controllersRef.current.clear();
  }, []);

  return { setupAbort, connect, connectWithRetry, abort, clearControllers, reconnection };
}
