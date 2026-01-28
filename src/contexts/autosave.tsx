"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type DomainType =
  | "workout"
  | "workout_plan"
  | "meal"
  | "nutrition_plan"
  | "trip"
  | "flight"
  | "hotel"
  | "project"
  | "task"
  | "schedule"
  | "supplement"
  | "calendar"
  | "diary";

interface AutoSavePayload {
  type: DomainType;
  chatId: string;
  elementKey: string;
  data: Record<string, unknown>;
}

interface AutoSaveResult {
  success: boolean;
  id?: string;
  error?: string;
}

interface AutoSaveContextValue {
  /**
   * Chat ID for the current context (used for source linking)
   */
  chatId: string | null;

  /**
   * Execute auto-save for a domain component
   */
  autoSave: (
    payload: Omit<AutoSavePayload, "chatId">,
  ) => Promise<AutoSaveResult>;

  /**
   * Debounced auto-save (recommended for use in components)
   */
  debouncedAutoSave: (
    payload: Omit<AutoSavePayload, "chatId">,
    delayMs?: number,
  ) => void;

  /**
   * Check if auto-save is enabled for this context
   */
  isEnabled: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const AutoSaveContext = createContext<AutoSaveContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

interface AutoSaveProviderProps {
  children: ReactNode;
  /**
   * Current chat ID for source linking
   */
  chatId: string | null;
  /**
   * Enable/disable auto-save (default: true when chatId is provided)
   */
  enabled?: boolean;
  /**
   * Optional custom save endpoint
   */
  saveEndpoint?: string;
  /**
   * Callback when save completes
   */
  onSaveComplete?: (result: AutoSaveResult) => void;
  /**
   * Callback on save error
   */
  onSaveError?: (error: Error) => void;
}

const DEFAULT_DEBOUNCE_MS = 1500;

export function AutoSaveProvider({
  children,
  chatId,
  enabled = true,
  saveEndpoint = "/api/domain/save",
  onSaveComplete,
  onSaveError,
}: AutoSaveProviderProps) {
  const debounceTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const pendingRef = useRef<Map<string, AutoSavePayload>>(new Map());

  const autoSave = useCallback(
    async (
      payload: Omit<AutoSavePayload, "chatId">,
    ): Promise<AutoSaveResult> => {
      if (!chatId || !enabled) {
        return {
          success: false,
          error: "Auto-save disabled or no chat context",
        };
      }

      try {
        const fullPayload: AutoSavePayload = {
          ...payload,
          chatId,
        };

        const response = await fetch(saveEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullPayload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = errorData.error || "Failed to save";
          onSaveError?.(new Error(error));
          return { success: false, error };
        }

        const result = await response.json();
        onSaveComplete?.(result);
        return result;
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        onSaveError?.(error instanceof Error ? error : new Error(msg));
        return { success: false, error: msg };
      }
    },
    [chatId, enabled, saveEndpoint, onSaveComplete, onSaveError],
  );

  const debouncedAutoSave = useCallback(
    (
      payload: Omit<AutoSavePayload, "chatId">,
      delayMs = DEFAULT_DEBOUNCE_MS,
    ) => {
      if (!chatId || !enabled) return;

      const key = `${payload.type}:${payload.elementKey}`;

      // Cancel existing timer for this key
      const existingTimer = debounceTimersRef.current.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Store the latest payload
      pendingRef.current.set(key, { ...payload, chatId });

      // Set new timer
      const timer = setTimeout(() => {
        const pendingPayload = pendingRef.current.get(key);
        if (pendingPayload) {
          autoSave(pendingPayload);
          pendingRef.current.delete(key);
        }
        debounceTimersRef.current.delete(key);
      }, delayMs);

      debounceTimersRef.current.set(key, timer);
    },
    [chatId, enabled, autoSave],
  );

  const value = useMemo<AutoSaveContextValue>(
    () => ({
      chatId,
      autoSave,
      debouncedAutoSave,
      isEnabled: Boolean(chatId && enabled),
    }),
    [chatId, autoSave, debouncedAutoSave, enabled],
  );

  return (
    <AutoSaveContext.Provider value={value}>
      {children}
    </AutoSaveContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook to access auto-save functionality in domain components
 */
export function useAutoSave(): AutoSaveContextValue {
  const context = useContext(AutoSaveContext);
  if (!context) {
    // Return a no-op context if not within a provider
    return {
      chatId: null,
      autoSave: async () => ({ success: false, error: "No AutoSaveProvider" }),
      debouncedAutoSave: () => {},
      isEnabled: false,
    };
  }
  return context;
}

/**
 * Hook to auto-save domain data on mount and when data changes
 */
export function useDomainAutoSave(
  type: DomainType,
  elementKey: string,
  data: Record<string, unknown> | null,
  options?: {
    debounceMs?: number;
    skipMount?: boolean;
  },
) {
  const { debouncedAutoSave, isEnabled } = useAutoSave();
  const mountedRef = useRef(false);
  const lastDataRef = useRef<string | null>(null);

  // Auto-save on mount and data changes
  React.useEffect(() => {
    if (!isEnabled || !data || !elementKey) return;

    // Skip mount if requested
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (options?.skipMount) return;
    }

    // Serialize data for change detection
    const serialized = JSON.stringify(data);
    if (serialized === lastDataRef.current) return;
    lastDataRef.current = serialized;

    debouncedAutoSave({ type, elementKey, data }, options?.debounceMs);
  }, [
    type,
    elementKey,
    data,
    isEnabled,
    debouncedAutoSave,
    options?.debounceMs,
    options?.skipMount,
  ]);
}

export type {
  DomainType,
  AutoSaveContextValue,
  AutoSavePayload,
  AutoSaveResult,
};
