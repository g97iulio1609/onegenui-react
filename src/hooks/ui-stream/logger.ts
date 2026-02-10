"use client";

/**
 * Stream Logger - Console-based logger for useUIStream
 *
 * DISABLED by default. Set NEXT_PUBLIC_DEBUG=true to enable.
 * Uses browser console for debugging - no network requests.
 */

const DEBUG =
  typeof window !== "undefined" &&
  typeof process !== "undefined" &&
  process.env?.NODE_ENV === "development" &&
  process.env?.NEXT_PUBLIC_DEBUG === "true";

function formatLog(level: string, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  const dataStr = data
    ? `\n  DATA: ${JSON.stringify(data, null, 2).replace(/\n/g, "\n  ")}`
    : "";
  return `[${timestamp}] [${level}] [useUIStream] ${message}${dataStr}`;
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
    console.debug(formatLog("DEBUG", msg, data));
  },
  info: (msg: string, data?: unknown) => {
    if (!DEBUG) return;
    console.info(formatLog("INFO", msg, data));
  },
  warn: (msg: string, data?: unknown) => {
    if (!DEBUG) return;
    console.warn(formatLog("WARN", msg, data));
  },
  error: (msg: string, data?: unknown) => {
    if (!DEBUG) return;
    console.error(formatLog("ERROR", msg, data));
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
