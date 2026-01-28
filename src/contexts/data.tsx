"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import { getByPath, type DataModel, type AuthState } from "@onegenui/core";
import { useStore } from "../store";

/**
 * Data context value
 */
export interface DataContextValue {
  /** The current data model */
  data: DataModel;
  /** Auth state for visibility evaluation */
  authState?: AuthState;
  /** Get a value by path */
  get: (path: string) => unknown;
  /** Set a value by path */
  set: (path: string, value: unknown) => void;
  /** Update multiple values at once */
  update: (updates: Record<string, unknown>) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

/**
 * Props for DataProvider
 */
export interface DataProviderProps {
  /** Initial data model */
  initialData?: DataModel;
  /** Auth state */
  authState?: AuthState;
  /** Callback when data changes */
  onDataChange?: (path: string, value: unknown) => void;
  children: ReactNode;
}

/**
 * Provider for data model context
 *
 * Uses Zustand store as backing store for optimal performance.
 * Context API provides stable public interface for package consumers.
 */
export function DataProvider({
  initialData = {},
  authState,
  onDataChange,
  children,
}: DataProviderProps) {
  // Use Zustand store for state management
  const data = useStore((s) => s.dataModel);
  const storeAuth = useStore((s) => s.auth);
  const setDataModel = useStore((s) => s.setDataModel);
  const updateDataModel = useStore((s) => s.updateDataModel);
  const setAuth = useStore((s) => s.setAuth);

  // Sync initial data to store on mount
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setDataModel(initialData);
    }
  }, []); // Only on mount

  // Sync authState prop to store
  useEffect(() => {
    if (authState) {
      setAuth(authState);
    }
  }, [authState, setAuth]);

  const get = useCallback((path: string) => getByPath(data, path), [data]);

  const set = useCallback(
    (path: string, value: unknown) => {
      updateDataModel(path, value);
      onDataChange?.(path, value);
    },
    [updateDataModel, onDataChange],
  );

  const update = useCallback(
    (updates: Record<string, unknown>) => {
      for (const [path, value] of Object.entries(updates)) {
        updateDataModel(path, value);
        onDataChange?.(path, value);
      }
    },
    [updateDataModel, onDataChange],
  );

  // Use store auth or prop auth
  const effectiveAuth = authState ?? storeAuth;

  const value = useMemo<DataContextValue>(
    () => ({
      data,
      authState: effectiveAuth,
      get,
      set,
      update,
    }),
    [data, effectiveAuth, get, set, update],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

/**
 * Hook to access the data context
 */
export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within a DataProvider");
  }
  return ctx;
}

/**
 * Hook to get a value from the data model
 * Optimized: subscribes only to the specific path via Zustand selector
 */
export function useDataValue<T>(path: string): T | undefined {
  // Direct Zustand subscription for granular updates
  const value = useStore((s) => getByPath(s.dataModel, path));
  return value as T | undefined;
}

/**
 * Hook to get and set a value from the data model (like useState)
 */
export function useDataBinding<T>(
  path: string,
): [T | undefined, (value: T) => void] {
  const value = useDataValue<T>(path);
  const updateDataModel = useStore((s) => s.updateDataModel);

  const setValue = useCallback(
    (newValue: T) => updateDataModel(path, newValue),
    [path, updateDataModel],
  );

  return [value, setValue];
}
