/**
 * Settings Slice - AI settings, theme, preferences
 */
import type { SliceCreator } from "../types";

export type ThemeMode = "light" | "dark" | "system";
export type AIModel =
  | "gemini-2.0-flash"
  | "gemini-2.5-pro"
  | "gpt-4o"
  | "claude-3.5-sonnet";

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
  model: "gemini-2.0-flash",
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
