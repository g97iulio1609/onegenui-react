"use client";

import { createContext } from "react";
import type { SelectionContextValue } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

export const SelectionContext = createContext<
  SelectionContextValue | undefined
>(undefined);
