"use client";

import type { AIAssistantSettings, ProactivityMode } from "../../hooks/types";
import { DEFAULT_AI_SETTINGS } from "../../hooks/types";

// ─────────────────────────────────────────────────────────────────────────────
// Storage Key
// ─────────────────────────────────────────────────────────────────────────────

export const STORAGE_KEY = "json-render-ai-settings";

// ─────────────────────────────────────────────────────────────────────────────
// Extended Settings (includes document processing)
// ─────────────────────────────────────────────────────────────────────────────

export interface DocumentSettings {
  smartParsingEnabled: boolean;
}

export interface ExtendedAISettings extends AIAssistantSettings {
  documents: DocumentSettings;
}

export const DEFAULT_EXTENDED_SETTINGS: ExtendedAISettings = {
  ...DEFAULT_AI_SETTINGS,
  documents: {
    smartParsingEnabled: false,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Context Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AISettingsContextValue {
  settings: ExtendedAISettings;
  updateSettings: (partial: Partial<ExtendedAISettings>) => void;
  setProactivityMode: (mode: ProactivityMode) => void;
  setProactivityEnabled: (enabled: boolean) => void;
  setSuggestionsEnabled: (enabled: boolean) => void;
  setDataCollectionPreferForm: (preferForm: boolean) => void;
  setSmartParsingEnabled: (enabled: boolean) => void;
  resetSettings: () => void;
  completeOnboarding: () => void;
  isLoading: boolean;
  isSyncing: boolean;
}
