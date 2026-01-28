/**
 * Skeleton Loader Components
 *
 * Loading states for placeholder and missing elements during streaming.
 */

import type { ReactNode } from "react";

/**
 * Props for skeleton loader components
 */
export interface SkeletonProps {
  /** Element key for data attribute */
  elementKey: string;
  /** Optional custom class name */
  className?: string;
}

/**
 * Placeholder skeleton for forward-referenced elements
 */
export function PlaceholderSkeleton({ elementKey }: SkeletonProps): ReactNode {
  return (
    <div
      key={elementKey}
      className="w-full h-16 bg-muted/10 animate-pulse rounded-lg my-2 border border-border/20"
      data-placeholder-for={elementKey}
    />
  );
}

/**
 * Child skeleton for missing children during streaming
 */
export function ChildSkeleton({ elementKey }: SkeletonProps): ReactNode {
  return (
    <div
      key={`${elementKey}-skeleton`}
      className="w-full h-12 bg-muted/10 animate-pulse rounded-md my-1"
    />
  );
}

/**
 * Check if an element is a placeholder
 */
export function isPlaceholderElement(element: {
  type: string;
  _meta?: { isPlaceholder?: boolean };
}): boolean {
  return (
    element.type === "__placeholder__" || element._meta?.isPlaceholder === true
  );
}
