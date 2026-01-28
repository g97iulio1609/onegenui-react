import {
  STORAGE_KEY,
  DEFAULT_EXTENDED_SETTINGS,
  type ExtendedAISettings,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Local Storage Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function loadSettings(): ExtendedAISettings {
  if (typeof window === "undefined") return DEFAULT_EXTENDED_SETTINGS;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ExtendedAISettings>;
      return {
        proactivity: {
          ...DEFAULT_EXTENDED_SETTINGS.proactivity,
          ...parsed.proactivity,
        },
        suggestions: {
          ...DEFAULT_EXTENDED_SETTINGS.suggestions,
          ...parsed.suggestions,
        },
        dataCollection: {
          ...DEFAULT_EXTENDED_SETTINGS.dataCollection,
          ...parsed.dataCollection,
        },
        onboarding: {
          ...DEFAULT_EXTENDED_SETTINGS.onboarding,
          ...parsed.onboarding,
        },
        documents: {
          ...DEFAULT_EXTENDED_SETTINGS.documents,
          ...parsed.documents,
        },
      };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_EXTENDED_SETTINGS;
}

export function saveSettings(settings: ExtendedAISettings): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// API Helpers
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchSettingsFromAPI(): Promise<ExtendedAISettings | null> {
  try {
    const res = await fetch("/api/settings");
    if (!res.ok) return null;
    const data = await res.json();
    return {
      proactivity: data.proactivity ?? DEFAULT_EXTENDED_SETTINGS.proactivity,
      suggestions: data.suggestions ?? DEFAULT_EXTENDED_SETTINGS.suggestions,
      dataCollection:
        data.dataCollection ?? DEFAULT_EXTENDED_SETTINGS.dataCollection,
      onboarding: {
        showOnFirstUse: DEFAULT_EXTENDED_SETTINGS.onboarding.showOnFirstUse,
        completed: data.onboarding?.completed ?? false,
      },
      documents: data.documents ?? DEFAULT_EXTENDED_SETTINGS.documents,
    };
  } catch {
    return null;
  }
}

export async function saveSettingsToAPI(
  settings: Partial<ExtendedAISettings>,
): Promise<boolean> {
  try {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    return res.ok;
  } catch {
    return false;
  }
}
