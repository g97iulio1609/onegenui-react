"use client";

/**
 * Document Index Handler - Processes document index events from stream
 *
 * Handles document-index-ui events from Vectorless:
 * - First document: Set as current index
 * - Additional documents: Merge into existing index
 */

import type { DocumentIndex, DocumentIndexNode } from "@onegenui/core";

/**
 * Process document index UI event
 * Returns updated index (merged if existing)
 */
export function processDocumentIndex(
  uiComponent: { type: string; props: DocumentIndex },
  currentIndex: DocumentIndex | null | undefined,
): DocumentIndex | null {
  if (!uiComponent?.props) return currentIndex;

  if (!currentIndex) {
    // First document
    return uiComponent.props;
  }

  // Additional document - merge into existing
  const newDoc = uiComponent.props;
  return {
    title: `${currentIndex.title} + ${newDoc.title}`,
    description: [currentIndex.description, newDoc.description]
      .filter(Boolean)
      .join("\n\n---\n\n"),
    pageCount: currentIndex.pageCount + newDoc.pageCount,
    nodes: [
      ...currentIndex.nodes,
      // Add separator node for clarity
      {
        title: `📄 ${newDoc.title}`,
        nodeId: `doc-${Date.now()}`,
        startPage: 1,
        endPage: newDoc.pageCount,
        summary: newDoc.description,
        children: newDoc.nodes,
      } as DocumentIndexNode,
    ],
  };
}
