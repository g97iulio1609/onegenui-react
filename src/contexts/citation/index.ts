"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";
import { createElement } from "react";

/**
 * Citation data structure - supports both web and document citations
 */
export interface Citation {
  id: string;
  title: string;
  // Web source fields
  url?: string | null;
  domain?: string | null;
  // Document source fields
  pageNumber?: number | null;
  excerpt?: string | null;
  documentTitle?: string | null;
  // Common
  snippet?: string | null;
}

interface CitationContextValue {
  citations: Citation[];
  setCitations: (citations: Citation[]) => void;
  addCitation: (citation: Citation) => void;
  clearCitations: () => void;
  getCitation: (id: string) => Citation | undefined;
}

const CitationContext = createContext<CitationContextValue | null>(null);

/**
 * Provider for citation data that can be displayed inline in markdown.
 */
export function CitationProvider({ children }: { children: ReactNode }) {
  const [citations, setCitationsState] = useState<Citation[]>([]);

  const setCitations = useCallback((newCitations: Citation[]) => {
    setCitationsState(newCitations);
  }, []);

  const addCitation = useCallback((citation: Citation) => {
    setCitationsState((prev) => {
      // Avoid duplicates
      if (prev.some((c) => c.id === citation.id)) return prev;
      return [...prev, citation];
    });
  }, []);

  const clearCitations = useCallback(() => {
    setCitationsState([]);
  }, []);

  const getCitation = useCallback(
    (id: string) => citations.find((c) => c.id === id),
    [citations],
  );

  // Listen for citations events from useUIStream
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCitations = (event: CustomEvent<{ citations: Citation[] }>) => {
      const newCitations = event.detail?.citations;
      if (newCitations && Array.isArray(newCitations)) {
        setCitationsState(newCitations);
      }
    };

    window.addEventListener(
      "onegenui:citations",
      handleCitations as EventListener,
    );
    return () => {
      window.removeEventListener(
        "onegenui:citations",
        handleCitations as EventListener,
      );
    };
  }, []);

  const value = useMemo(
    () => ({
      citations,
      setCitations,
      addCitation,
      clearCitations,
      getCitation,
    }),
    [citations, setCitations, addCitation, clearCitations, getCitation],
  );

  return createElement(CitationContext.Provider, { value }, children);
}

/**
 * Hook to access citation context
 */
export function useCitations(): CitationContextValue {
  const context = useContext(CitationContext);
  if (!context) {
    // Fallback for when no provider is present
    return {
      citations: [],
      setCitations: () => {},
      addCitation: () => {},
      clearCitations: () => {},
      getCitation: () => undefined,
    };
  }
  return context;
}

export { CitationContext };
