import { describe, it, expect } from "vitest";
import {
  setByPathWithStructuralSharing,
  removeByPath,
} from "../structural-sharing";

describe("structural-sharing", () => {
  describe("setByPathWithStructuralSharing", () => {
    it("should set a simple path", () => {
      const obj = { a: 1, b: 2 };
      const result = setByPathWithStructuralSharing(obj, "/c", 3) as Record<
        string,
        number
      >;
      expect(result.c).toBe(3);
      expect(result.a).toBe(1);
      expect(result).not.toBe(obj);
    });

    it("should set a nested path", () => {
      const obj = { a: { b: { c: 1 } } };
      const result = setByPathWithStructuralSharing(obj, "/a/b/c", 2);
      expect((result.a as any).b.c).toBe(2);
      expect(result).not.toBe(obj);
    });

    it("should create intermediate objects", () => {
      const obj: Record<string, unknown> = {};
      const result = setByPathWithStructuralSharing(obj, "/a/b/c", 1);
      expect((result.a as any).b.c).toBe(1);
    });

    it("should handle array indices", () => {
      const obj = { items: [1, 2, 3] };
      const result = setByPathWithStructuralSharing(obj, "/items/1", 10);
      expect((result.items as number[])[1]).toBe(10);
    });

    it("should handle array append with -", () => {
      const obj = { items: [1, 2] };
      const result = setByPathWithStructuralSharing(obj, "/items/-", 3);
      expect((result.items as number[]).length).toBe(3);
      expect((result.items as number[])[2]).toBe(3);
    });

    it("should preserve structural sharing", () => {
      const nested = { deep: { value: 1 } };
      const obj = { a: nested, b: { other: 2 } };
      const result = setByPathWithStructuralSharing(obj, "/b/other", 3);
      // Unchanged paths should share references
      expect(result.a).toBe(nested);
    });

    it("should handle path without leading slash", () => {
      const obj = { a: 1 };
      const result = setByPathWithStructuralSharing(obj, "b", 2) as Record<
        string,
        number
      >;
      expect(result.b).toBe(2);
    });
  });

  describe("removeByPath", () => {
    it("should remove object property", () => {
      const obj: Record<string, unknown> = { a: 1, b: 2 };
      removeByPath(obj, "/a");
      expect(obj).toEqual({ b: 2 });
    });

    it("should remove nested property", () => {
      const obj = { a: { b: { c: 1, d: 2 } } };
      removeByPath(obj, "/a/b/c");
      expect((obj.a as any).b).toEqual({ d: 2 });
    });

    it("should remove array element", () => {
      const arr = [1, 2, 3];
      removeByPath(arr, "/1");
      expect(arr).toEqual([1, 3]);
    });

    it("should handle invalid path gracefully", () => {
      const obj = { a: 1 };
      removeByPath(obj, "/nonexistent/path");
      expect(obj).toEqual({ a: 1 });
    });

    it("should handle empty path", () => {
      const obj = { a: 1 };
      removeByPath(obj, "");
      expect(obj).toEqual({ a: 1 });
    });
  });
});
