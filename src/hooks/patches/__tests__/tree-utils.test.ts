import { describe, it, expect } from "vitest";
import type { UITree, UIElement } from "@onegenui/core";
import {
  removeNodeFromTree,
  getRootElement,
  getDescendantKeys,
} from "../tree-utils";

const createTestTree = (): UITree => ({
  root: "root",
  elements: {
    root: {
      key: "root",
      type: "Container",
      props: {},
      children: ["child1", "child2"],
    },
    child1: {
      key: "child1",
      type: "Text",
      props: {},
      parentKey: "root",
      children: ["grandchild1"],
    },
    child2: {
      key: "child2",
      type: "Text",
      props: {},
      parentKey: "root",
    },
    grandchild1: {
      key: "grandchild1",
      type: "Text",
      props: {},
      parentKey: "child1",
    },
  } as Record<string, UIElement>,
});

describe("tree-utils", () => {
  describe("removeNodeFromTree", () => {
    it("should remove a leaf node", () => {
      const tree = createTestTree();
      removeNodeFromTree(tree, "child2");
      expect(tree.elements.child2).toBeUndefined();
      expect(tree.elements.root?.children).toEqual(["child1"]);
    });

    it("should remove node and all descendants", () => {
      const tree = createTestTree();
      removeNodeFromTree(tree, "child1");
      expect(tree.elements.child1).toBeUndefined();
      expect(tree.elements.grandchild1).toBeUndefined();
      expect(tree.elements.root?.children).toEqual(["child2"]);
    });

    it("should clear root when removing root node", () => {
      const tree = createTestTree();
      removeNodeFromTree(tree, "root");
      expect(tree.root).toBe("");
      expect(tree.elements.root).toBeUndefined();
    });

    it("should handle removing non-existent node", () => {
      const tree = createTestTree();
      const originalElements = { ...tree.elements };
      removeNodeFromTree(tree, "nonexistent");
      expect(Object.keys(tree.elements).length).toBe(
        Object.keys(originalElements).length,
      );
    });
  });

  describe("getRootElement", () => {
    it("should return root element", () => {
      const tree = createTestTree();
      const root = getRootElement(tree);
      expect(root?.key).toBe("root");
      expect(root?.type).toBe("Container");
    });

    it("should return null for empty tree", () => {
      const tree: UITree = { root: "", elements: {} };
      const root = getRootElement(tree);
      expect(root).toBeNull();
    });

    it("should return null for missing root element", () => {
      const tree: UITree = { root: "missing", elements: {} };
      const root = getRootElement(tree);
      expect(root).toBeNull();
    });
  });

  describe("getDescendantKeys", () => {
    it("should return all descendant keys", () => {
      const tree = createTestTree();
      const descendants = getDescendantKeys(tree, "root");
      expect(descendants).toContain("child1");
      expect(descendants).toContain("child2");
      expect(descendants).toContain("grandchild1");
      expect(descendants).not.toContain("root");
    });

    it("should return empty array for leaf node", () => {
      const tree = createTestTree();
      const descendants = getDescendantKeys(tree, "grandchild1");
      expect(descendants).toEqual([]);
    });

    it("should return empty array for non-existent node", () => {
      const tree = createTestTree();
      const descendants = getDescendantKeys(tree, "nonexistent");
      expect(descendants).toEqual([]);
    });
  });
});
