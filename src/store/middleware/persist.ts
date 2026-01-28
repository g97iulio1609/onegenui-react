/**
 * Persist Middleware Configuration - Session/Local storage persistence
 */
import { type StateCreator } from "zustand";
import { persist, type PersistOptions } from "zustand/middleware";

/**
 * Create a persisted slice with sensible defaults
 */
export function createPersistedSlice<T>(
  name: string,
  sliceCreator: StateCreator<T>,
  options?: Partial<PersistOptions<T>>,
): StateCreator<T, [], [["zustand/persist", T]]> {
  return persist(sliceCreator, {
    name,
    version: 1,
    ...options,
  });
}

/**
 * Partial persistence - only persist specific keys
 */
export function createPartialPersist<T extends object>(
  name: string,
  keys: (keyof T)[],
): Pick<PersistOptions<T>, "name" | "partialize"> {
  return {
    name,
    partialize: (state) =>
      Object.fromEntries(
        keys.filter((k) => k in state).map((k) => [k, state[k]]),
      ) as T,
  };
}
