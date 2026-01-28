/**
 * Logging Middleware - Action logging for debugging
 */
import { type StateCreator, type StoreMutatorIdentifier } from "zustand";

type LoggerImpl = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string,
) => StateCreator<T, Mps, Mcs>;

type Logger = <T>(
  f: StateCreator<T, [], []>,
  name?: string,
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  const loggedSet: typeof set = (...args) => {
    const prevState = get();
    set(...(args as Parameters<typeof set>));
    const nextState = get();

    if (process.env.NODE_ENV !== "production") {
      console.groupCollapsed(
        `%c${name || "store"} %caction`,
        "color: #9e9e9e; font-weight: bold",
        "color: inherit; font-weight: normal",
      );
      console.log("%cprev", "color: #9e9e9e", prevState);
      console.log("%cnext", "color: #4caf50", nextState);
      console.groupEnd();
    }
  };

  return f(loggedSet, get, store);
};

export const logger = loggerImpl as Logger;
