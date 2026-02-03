import type { ReactNode } from "react";
import type { UIElement } from "@onegenui/core";

export interface EditableWrapperProps {
  element: UIElement;
  children: ReactNode;
  onTextChange?: (propName: string, newValue: string) => void;
  forceEditable?: boolean;
  className?: string;
}

export interface EditableTextNodeProps {
  elementKey: string;
  propName: string;
  value: string;
  isMobile: boolean;
  onTextChange?: (propName: string, newValue: string) => void;
}
