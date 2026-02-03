import type { UIElement } from "@onegenui/core";

const TEXT_PROP_NAMES = [
  "text",
  "title",
  "subtitle",
  "label",
  "description",
  "content",
  "heading",
  "caption",
  "placeholder",
  "value",
  "name",
  "message",
];

export function isTextProp(key: string, value: unknown): boolean {
  if (typeof value !== "string") return false;
  if (value.length === 0) return false;
  return TEXT_PROP_NAMES.some((name) =>
    key.toLowerCase().includes(name.toLowerCase()),
  );
}

export function getEditableProps(
  element: UIElement,
): Array<{ key: string; value: string }> {
  const editable = element.editable;
  const props: Array<{ key: string; value: string }> = [];

  if (editable === false) return [];

  if (editable === undefined || editable === true) {
    for (const [key, value] of Object.entries(element.props || {})) {
      if (isTextProp(key, value)) {
        props.push({ key, value: value as string });
      }
    }
  } else if (Array.isArray(editable)) {
    for (const propName of editable) {
      const value = element.props?.[propName];
      if (typeof value === "string") {
        props.push({ key: propName, value });
      }
    }
  }

  return props;
}
