/**
 * Reconnection Manager - Exponential backoff + resume-from-sequence
 *
 * Tracks the last successfully processed sequence number.
 * On stream break, retries with exponential backoff and sends
 * X-Resume-After-Sequence header so the backend can skip already-sent frames.
 */

export interface ReconnectionConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_CONFIG: ReconnectionConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 8000,
};

export interface ReconnectionState {
  lastSequence: number;
  retryCount: number;
  isReconnecting: boolean;
}

export interface ReconnectionManager {
  /** Record a successfully processed frame sequence */
  recordSequence(sequence: number): void;
  /** Get the last successfully processed sequence */
  getLastSequence(): number;
  /** Attempt reconnection. Returns true if should retry, false if exhausted. */
  shouldRetry(): boolean;
  /** Get delay before next retry (exponential backoff with jitter) */
  getRetryDelay(): number;
  /** Get headers to send on reconnection (X-Resume-After-Sequence) */
  getResumeHeaders(): Record<string, string>;
  /** Reset state for a new stream */
  reset(): void;
  /** Get current state */
  getState(): ReconnectionState;
}

export function createReconnectionManager(
  config: Partial<ReconnectionConfig> = {},
): ReconnectionManager {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  let lastSequence = -1;
  let retryCount = 0;

  return {
    recordSequence(sequence) {
      if (sequence > lastSequence) {
        lastSequence = sequence;
      }
    },

    getLastSequence() {
      return lastSequence;
    },

    shouldRetry() {
      return retryCount < cfg.maxRetries;
    },

    getRetryDelay() {
      const exponential = cfg.baseDelayMs * Math.pow(2, retryCount);
      const capped = Math.min(exponential, cfg.maxDelayMs);
      // Add 10-30% jitter to prevent thundering herd
      const jitter = capped * (0.1 + Math.random() * 0.2);
      retryCount++;
      return Math.round(capped + jitter);
    },

    getResumeHeaders() {
      if (lastSequence < 0) return {};
      return { "X-Resume-After-Sequence": String(lastSequence) };
    },

    reset() {
      lastSequence = -1;
      retryCount = 0;
    },

    getState() {
      return {
        lastSequence,
        retryCount,
        isReconnecting: retryCount > 0,
      };
    },
  };
}
