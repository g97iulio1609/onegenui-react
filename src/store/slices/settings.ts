/**
 * Settings Slice - AI settings, theme, preferences
 * 
 * NOTE: Model selection is centralized in @onegenui/providers.
 * Use `createModelForTask()` or `getModelConfig()` from the providers package.
 */
import type { SliceCreator } from "../types";

export type ThemeMode = "light" | "dark" | "system";

/**
 * AI Model type - matches models from @onegenui/providers
 * Use `createModelForTask()` or `getModelConfig()` from providers package for model selection.
 */
export type AIModel =
  | "gemini-3-flash-preview"
  | "gemini-3-pro-preview"
  | "gpt-5.2"
  | "claude-haiku-4.5"
  | "claude-sonnet-4.5"
  | "claude-opus-4.5";

export interface AISettings {
  model: AIModel;
  temperature: number;
  maxTokens: number;
  streamingEnabled: boolean;
  autoSuggestions: boolean;
}

export interface SettingsSlice {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // AI settings
  aiSettings: AISettings;
  setAISettings: (settings: Partial<AISettings>) => void;
  resetAISettings: () => void;

  // Preferences
  compactMode: boolean;
  setCompactMode: (compact: boolean) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

const defaultAISettings: AISettings = {
  model: "gemini-3-flash-preview",
  temperature: 1,
  maxTokens: 65000,
  streamingEnabled: true,
  autoSuggestions: true,
};

export const createSettingsSlice: SliceCreator<SettingsSlice> = (set) => ({
  // Theme
  theme: "system",
  setTheme: (theme) => set({ theme }),

  // AI settings
  aiSettings: defaultAISettings,
  setAISettings: (settings) =>
    set((state) => {
      Object.assign(state.aiSettings, settings);
    }),
  resetAISettings: () => set({ aiSettings: defaultAISettings }),

  // Preferences
  compactMode: false,
  setCompactMode: (compactMode) => set({ compactMode }),
  animationsEnabled: true,
  setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
});
