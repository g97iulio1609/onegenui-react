"use client";

/**
 * Stream Logger - Buffered logger for useUIStream
 *
 * Batches logs and sends them to debug endpoint every 500ms.
 * Works in browser only.
 */

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
  if (LOG_BUFFER.length === 0) return;
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
 * Logger that buffers and sends to debug endpoint
 */
export const streamLog: StreamLogger = {
  debug: (msg: string, data?: unknown) => {
    console.log(`[useUIStream] ${msg}`, data ?? "");
    LOG_BUFFER.push(formatLog("DEBUG", msg, data));
    scheduleFlush();
  },
  info: (msg: string, data?: unknown) => {
    console.log(`[useUIStream] ${msg}`, data ?? "");
    LOG_BUFFER.push(formatLog("INFO", msg, data));
    scheduleFlush();
  },
  warn: (msg: string, data?: unknown) => {
    console.warn(`[useUIStream] ${msg}`, data ?? "");
    LOG_BUFFER.push(formatLog("WARN", msg, data));
    scheduleFlush();
  },
  error: (msg: string, data?: unknown) => {
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
