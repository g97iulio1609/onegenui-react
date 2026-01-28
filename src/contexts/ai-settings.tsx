"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { ProactivityMode } from "../hooks/types";
import {
  DEFAULT_EXTENDED_SETTINGS,
  type ExtendedAISettings,
  type AISettingsContextValue,
} from "./ai-settings/types";
import {
  loadSettings,
  saveSettings,
  fetchSettingsFromAPI,
  saveSettingsToAPI,
} from "./ai-settings/storage";

// Re-export types for convenience
export type {
  DocumentSettings,
  ExtendedAISettings,
  AISettingsContextValue,
} from "./ai-settings/types";
export { DEFAULT_EXTENDED_SETTINGS } from "./ai-settings/types";

const AISettingsContext = createContext<AISettingsContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

interface AISettingsProviderProps {
  children: ReactNode;
  initialSettings?: Partial<ExtendedAISettings>;
}

export function AISettingsProvider({
  children,
  initialSettings,
}: AISettingsProviderProps) {
  const [settings, setSettings] = useState<ExtendedAISettings>(() => {
    const loaded = loadSettings();
    if (initialSettings) {
      return {
        proactivity: { ...loaded.proactivity, ...initialSettings.proactivity },
        suggestions: { ...loaded.suggestions, ...initialSettings.suggestions },
        dataCollection: {
          ...loaded.dataCollection,
          ...initialSettings.dataCollection,
        },
        onboarding: { ...loaded.onboarding, ...initialSettings.onboarding },
        documents: { ...loaded.documents, ...initialSettings.documents },
      };
    }
    return loaded;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchSettingsFromAPI().then((apiSettings) => {
      if (apiSettings) {
        setSettings(apiSettings);
        saveSettings(apiSettings);
      }
      setIsLoading(false);
    });
  }, []);

  const syncToAPI = useCallback((newSettings: Partial<ExtendedAISettings>) => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = setTimeout(async () => {
      setIsSyncing(true);
      await saveSettingsToAPI(newSettings);
      setIsSyncing(false);
    }, 500);
  }, []);

  const updateAndSync = useCallback(
    (
      newSettings: ExtendedAISettings,
      changedPart: Partial<ExtendedAISettings>,
    ) => {
      setSettings(newSettings);
      saveSettings(newSettings);
      syncToAPI(changedPart);
    },
    [syncToAPI],
  );

  const updateSettings = useCallback(
    (partial: Partial<ExtendedAISettings>) => {
      setSettings((prev) => {
        const next = {
          proactivity: { ...prev.proactivity, ...partial.proactivity },
          suggestions: { ...prev.suggestions, ...partial.suggestions },
          dataCollection: { ...prev.dataCollection, ...partial.dataCollection },
          onboarding: { ...prev.onboarding, ...partial.onboarding },
          documents: { ...prev.documents, ...partial.documents },
        };
        saveSettings(next);
        syncToAPI(partial);
        return next;
      });
    },
    [syncToAPI],
  );

  const setProactivityMode = useCallback(
    (mode: ProactivityMode) => {
      const change = {
        proactivity: {
          enabled: mode !== "disabled",
          mode,
          debounceMs: settings.proactivity.debounceMs,
        },
      };
      updateAndSync(
        {
          ...settings,
          proactivity: { ...settings.proactivity, ...change.proactivity },
        },
        change,
      );
    },
    [settings, updateAndSync],
  );

  const setProactivityEnabled = useCallback(
    (enabled: boolean) => {
      const change = {
        proactivity: {
          enabled,
          mode: enabled ? settings.proactivity.mode : "disabled",
          debounceMs: settings.proactivity.debounceMs,
        },
      };
      updateAndSync(
        {
          ...settings,
          proactivity: { ...settings.proactivity, ...change.proactivity },
        },
        change,
      );
    },
    [settings, updateAndSync],
  );

  const setSuggestionsEnabled = useCallback(
    (enabled: boolean) => {
      const change = { suggestions: { ...settings.suggestions, enabled } };
      updateAndSync({ ...settings, ...change }, change);
    },
    [settings, updateAndSync],
  );

  const setDataCollectionPreferForm = useCallback(
    (preferForm: boolean) => {
      const change = {
        dataCollection: { ...settings.dataCollection, preferForm },
      };
      updateAndSync({ ...settings, ...change }, change);
    },
    [settings, updateAndSync],
  );

  const setSmartParsingEnabled = useCallback(
    (enabled: boolean) => {
      const change = { documents: { smartParsingEnabled: enabled } };
      updateAndSync({ ...settings, ...change }, change);
    },
    [settings, updateAndSync],
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_EXTENDED_SETTINGS);
    saveSettings(DEFAULT_EXTENDED_SETTINGS);
    syncToAPI(DEFAULT_EXTENDED_SETTINGS);
  }, [syncToAPI]);

  const completeOnboarding = useCallback(() => {
    const change = { onboarding: { ...settings.onboarding, completed: true } };
    updateAndSync({ ...settings, ...change }, change);
  }, [settings, updateAndSync]);

  const value: AISettingsContextValue = {
    settings,
    updateSettings,
    setProactivityMode,
    setProactivityEnabled,
    setSuggestionsEnabled,
    setDataCollectionPreferForm,
    setSmartParsingEnabled,
    resetSettings,
    completeOnboarding,
    isLoading,
    isSyncing,
  };

  return (
    <AISettingsContext.Provider value={value}>
      {children}
    </AISettingsContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

export function useAISettings(): AISettingsContextValue {
  const context = useContext(AISettingsContext);
  if (!context) {
    throw new Error("useAISettings must be used within AISettingsProvider");
  }
  return context;
}

export function useAISettingsOptional(): AISettingsContextValue | null {
  return useContext(AISettingsContext);
}

export function useIsProactivityEnabled(): boolean {
  const context = useContext(AISettingsContext);
  if (!context) return true;
  return (
    context.settings.proactivity.enabled &&
    context.settings.proactivity.mode !== "disabled"
  );
}

export function useAreSuggestionsEnabled(): boolean {
  const context = useContext(AISettingsContext);
  if (!context) return true;
  return context.settings.suggestions.enabled;
}

export function useIsSmartParsingEnabled(): boolean {
  const context = useContext(AISettingsContext);
  if (!context) return false;
  return context.settings.documents.smartParsingEnabled;
}
