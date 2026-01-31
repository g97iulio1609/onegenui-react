/**
 * Settings Slice - AI settings, theme, preferences
 * 
 * NOTE: Model selection is now centralized server-side in `lib/services/model-config.ts`.
 * The AIModel type here is kept for backward compatibility but new code should use
 * the server-side `getModelForTask()` function.
 */
import type { SliceCreator } from "../types";

export type ThemeMode = "light" | "dark" | "system";

/** @deprecated Use server-side model config from `lib/services/model-config.ts` */
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
  temperature: 0.7,
  maxTokens: 8192,
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
