/**
 * useStreamingConnection - SSE connection management
 * Handles fetch, abort, and reader lifecycle
 */

import { useRef, useCallback } from "react";

export interface StreamConnection {
  reader: ReadableStreamDefaultReader<Uint8Array>;
  abort: () => void;
}

export interface ConnectionOptions {
  /** API endpoint */
  api: string;
  /** Request headers */
  headers?: Record<string, string>;
  /** Request body */
  body: string | FormData;
  /** AbortSignal for cancellation */
  signal?: AbortSignal;
}

export interface UseStreamingConnectionReturn {
  /** Connect and get a reader */
  connect: (options: ConnectionOptions) => Promise<StreamConnection>;
  /** Abort current connection */
  abort: () => void;
  /** Check if currently connected */
  isConnected: boolean;
}

/**
 * Hook for managing SSE streaming connections
 */
export function useStreamingConnection(): UseStreamingConnectionReturn {
  const abortControllerRef = useRef<AbortController | null>(null);
  const isConnectedRef = useRef(false);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isConnectedRef.current = false;
  }, []);

  const connect = useCallback(
    async (options: ConnectionOptions): Promise<StreamConnection> => {
      // Abort any existing connection
      abort();

      // Create new abort controller
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Build headers
      const headers: Record<string, string> = { ...options.headers };
      if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(options.api, {
        method: "POST",
        headers,
        body: options.body,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      isConnectedRef.current = true;

      const reader = response.body.getReader();

      return {
        reader,
        abort: () => {
          controller.abort();
          isConnectedRef.current = false;
        },
      };
    },
    [abort],
  );

  return {
    connect,
    abort,
    get isConnected() {
      return isConnectedRef.current;
    },
  };
}
