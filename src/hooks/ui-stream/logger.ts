"use client";

/**
 * Stream Logger - Buffered logger for useUIStream
 *
 * DISABLED by default. Set NEXT_PUBLIC_DEBUG=true to enable.
 * Batches logs and sends them to debug endpoint every 500ms.
 */

const DEBUG =
  typeof window !== "undefined" &&
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_DEBUG === "true";

const LOG_ENDPOINT = "/api/debug-log";
const LOG_BUFFER: string[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function formatLog(level: string, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  const dataStr = data
    ? `\n  DATA: ${JSON.stringify(data, null, 2).replace(/\n/g, "\n  ")}`
    : "";
  return `[${timestamp}] [${level}] [useUIStream] ${message}${dataStr}`;
}

function flushLogs(): void {
  if (!DEBUG || LOG_BUFFER.length === 0) return;
  const logs = LOG_BUFFER.splice(0, LOG_BUFFER.length);
  if (typeof window !== "undefined") {
    fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs }),
    }).catch(() => {});
  }
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushLogs();
  }, 500);
}

export interface StreamLogger {
  debug: (msg: string, data?: unknown) => void;
  info: (msg: string, data?: unknown) => void;
  warn: (msg: string, data?: unknown) => void;
  error: (msg: string, data?: unknown) => void;
}

/**
 * Logger - all output disabled by default, requires NEXT_PUBLIC_DEBUG=true
 */
export const streamLog: StreamLogger = {
  debug: (msg: string, data?: unknown) => {
    if (!DEBUG) return;
    LOG_BUFFER.push(formatLog("DEBUG", msg, data));
    scheduleFlush();
  },
  info: (msg: string, data?: unknown) => {
    if (!DEBUG) return;
    LOG_BUFFER.push(formatLog("INFO", msg, data));
    scheduleFlush();
  },
  warn: (msg: string, data?: unknown) => {
    if (!DEBUG) return;
    LOG_BUFFER.push(formatLog("WARN", msg, data));
    scheduleFlush();
  },
  error: (msg: string, data?: unknown) => {
    if (!DEBUG) return;
    console.error(`[useUIStream] ${msg}`, data ?? "");
    LOG_BUFFER.push(formatLog("ERROR", msg, data));
    scheduleFlush();
  },
};

/**
 * Silent logger for testing or production
 */
export const silentLogger: StreamLogger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};
