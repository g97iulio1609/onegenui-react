/**
 * Domain Slice - Data model, auth state, validation
 */
import type { DataModel, AuthState } from "@onegenui/core";
import type { SliceCreator } from "../types";

export interface DomainSlice {
  // Data model
  dataModel: DataModel;
  setDataModel: (data: DataModel) => void;
  updateDataModel: (path: string, value: unknown) => void;
  resetDataModel: () => void;

  // Auth state
  auth: AuthState;
  setAuth: (auth: AuthState) => void;

  // Data loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const initialDataModel: DataModel = {};
const initialAuth: AuthState = {
  isSignedIn: false,
  user: undefined,
};

export const createDomainSlice: SliceCreator<DomainSlice> = (set) => ({
  // Data model
  dataModel: initialDataModel,
  setDataModel: (data) => set({ dataModel: data }),
  updateDataModel: (path, value) =>
    set((state) => {
      // Support both JSON Pointer ("/a/b") and dot notation ("a.b")
      const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
      const parts = normalizedPath.includes("/")
        ? normalizedPath.split("/")
        : normalizedPath.split(".");

      if (parts.length === 0 || (parts.length === 1 && parts[0] === "")) return;

      const obj = state.dataModel as Record<string, unknown>;

      // Single level path
      if (parts.length === 1) {
        obj[parts[0] as string] = value;
        return;
      }

      // Multi-level path
      let current = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i] as string;
        if (!current[key] || typeof current[key] !== "object") {
          current[key] = {};
        }
        current = current[key] as Record<string, unknown>;
      }
      const lastKey = parts[parts.length - 1] as string;
      current[lastKey] = value;
    }),
  resetDataModel: () => set({ dataModel: initialDataModel }),

  // Auth
  auth: initialAuth,
  setAuth: (auth) => set({ auth }),

  // Loading
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
});
