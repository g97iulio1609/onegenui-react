/**
 * Structural sharing utilities for immutable updates
 */

/**
 * Set a value by JSON Pointer path with structural sharing.
 * Only clones objects along the modified path.
 */
export function setByPathWithStructuralSharing<
  T extends Record<string, unknown>,
>(obj: T, path: string, value: unknown): T {
  const segments = path.startsWith("/")
    ? path.slice(1).split("/")
    : path.split("/");
  if (segments.length === 0 || (segments.length === 1 && segments[0] === "")) {
    return value as T;
  }

  const result = { ...obj } as T;
  let current: Record<string, unknown> = result;

  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i]!;
    const nextValue = current[segment];

    if (Array.isArray(nextValue)) {
      current[segment] = [...nextValue];
    } else if (nextValue && typeof nextValue === "object") {
      current[segment] = { ...nextValue };
    } else {
      current[segment] = {};
    }
    current = current[segment] as Record<string, unknown>;
  }

  const lastSegment = segments[segments.length - 1]!;

  // Handle JSON Pointer "-" suffix for array append (RFC 6901)
  if (lastSegment === "-" && Array.isArray(current)) {
    (current as unknown[]).push(value);
  } else if (Array.isArray(current)) {
    const index = parseInt(lastSegment, 10);
    if (!isNaN(index)) {
      (current as unknown[])[index] = value;
    }
  } else if (lastSegment === "-") {
    // Edge case: path ends with /property/- for array append
    if (segments.length >= 2) {
      const arrayPropertyName = segments[segments.length - 2]!;
      const arrayProperty = current[arrayPropertyName];
      if (Array.isArray(arrayProperty)) {
        current[arrayPropertyName] = [...arrayProperty, value];
      } else if (!arrayProperty) {
        current[arrayPropertyName] = [value];
      }
    }
  } else {
    current[lastSegment] = value;
  }

  return result;
}

/**
 * Remove a value from an object/array by JSON Pointer path
 */
export function removeByPath(
  target: Record<string, unknown> | unknown[],
  path: string,
): void {
  const segments = path.startsWith("/")
    ? path.slice(1).split("/")
    : path.split("/");

  if (segments.length === 0) return;

  let current: Record<string, unknown> | unknown[] = target;

  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i]!;

    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index) || index < 0 || index >= current.length)
        return;
      const nextValue = current[index];
      if (Array.isArray(nextValue) || typeof nextValue === "object") {
        current = nextValue as Record<string, unknown> | unknown[];
      } else {
        return;
      }
    } else {
      const nextValue = current[segment];
      if (Array.isArray(nextValue) || typeof nextValue === "object") {
        current = nextValue as Record<string, unknown> | unknown[];
      } else {
        return;
      }
    }
  }

  const lastSegment = segments[segments.length - 1]!;

  if (Array.isArray(current)) {
    const index = Number(lastSegment);
    if (!Number.isInteger(index) || index < 0 || index >= current.length)
      return;
    current.splice(index, 1);
    return;
  }

  delete current[lastSegment];
}
