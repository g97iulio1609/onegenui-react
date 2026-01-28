import { describe, it, expect } from "vitest";
import { flatToTree, removeNodeFromTree, applyPatch } from "./hooks/index";
import type { UITree } from "@onegenui/core";

describe("applyPatch", () => {
  it("appends to children array with JSON Pointer '-' suffix", () => {
    const tree: UITree = {
      root: "parent",
      elements: {
        parent: {
          key: "parent",
          type: "Stack",
          props: {},
          children: [],
        },
      },
    };

    const result = applyPatch(tree, {
      op: "add",
      path: "/elements/parent/children/-",
      value: "child1",
    });

    expect(result.elements["parent"]?.children).toEqual(["child1"]);
  });

  it("appends multiple children with '-' suffix", () => {
    const tree: UITree = {
      root: "parent",
      elements: {
        parent: {
          key: "parent",
          type: "Stack",
          props: {},
          children: [],
        },
      },
    };

    let result = applyPatch(tree, {
      op: "add",
      path: "/elements/parent/children/-",
      value: "child1",
    });

    result = applyPatch(result, {
      op: "add",
      path: "/elements/parent/children/-",
      value: "child2",
    });

    result = applyPatch(result, {
      op: "add",
      path: "/elements/parent/children/-",
      value: "child3",
    });

    expect(result.elements["parent"]?.children).toEqual([
      "child1",
      "child2",
      "child3",
    ]);
  });

  it("creates element and then appends children correctly", () => {
    const tree: UITree = {
      root: "",
      elements: {},
    };

    // Set root
    let result = applyPatch(tree, {
      op: "set",
      path: "/root",
      value: "dashboard",
    });

    // Add parent element
    result = applyPatch(result, {
      op: "add",
      path: "/elements/dashboard",
      value: {
        key: "dashboard",
        type: "Stack",
        props: { gap: "lg" },
        children: [],
      },
    });

    // Add child element
    result = applyPatch(result, {
      op: "add",
      path: "/elements/card",
      value: {
        key: "card",
        type: "Card",
        props: { title: "Test" },
        children: [],
      },
    });

    // Link child to parent
    result = applyPatch(result, {
      op: "add",
      path: "/elements/dashboard/children/-",
      value: "card",
    });

    expect(result.root).toBe("dashboard");
    expect(result.elements["dashboard"]?.children).toEqual(["card"]);
    expect(result.elements["card"]).toBeDefined();
    expect(result.elements["card"]?.parentKey).toBe("dashboard");
  });
});

describe("flatToTree", () => {
  it("converts array of elements to tree structure", () => {
    const elements = [
      { key: "container", type: "stack", props: {}, parentKey: null },
      {
        key: "text1",
        type: "text",
        props: { content: "Hello" },
        parentKey: "container",
      },
      {
        key: "text2",
        type: "text",
        props: { content: "World" },
        parentKey: "container",
      },
    ];

    const tree = flatToTree(elements);

    expect(tree.root).toBe("container");
    expect(Object.keys(tree.elements)).toHaveLength(3);
    expect(tree.elements["container"]).toBeDefined();
    expect(tree.elements["text1"]).toBeDefined();
    expect(tree.elements["text2"]).toBeDefined();
  });

  it("builds parent-child relationships", () => {
    const elements = [
      { key: "root", type: "stack", props: {}, parentKey: null },
      { key: "child1", type: "text", props: {}, parentKey: "root" },
      { key: "child2", type: "text", props: {}, parentKey: "root" },
    ];

    const tree = flatToTree(elements);

    expect(tree.elements["root"]!.children).toHaveLength(2);
    expect(tree.elements["root"]!.children).toContain("child1");
    expect(tree.elements["root"]!.children).toContain("child2");
  });

  it("handles single root element", () => {
    const elements = [
      {
        key: "only",
        type: "text",
        props: { content: "Single" },
        parentKey: null,
      },
    ];

    const tree = flatToTree(elements);

    expect(tree.root).toBe("only");
    expect(Object.keys(tree.elements)).toHaveLength(1);
  });

  it("handles deeply nested elements", () => {
    const elements = [
      { key: "level0", type: "stack", props: {}, parentKey: null },
      { key: "level1", type: "stack", props: {}, parentKey: "level0" },
      { key: "level2", type: "stack", props: {}, parentKey: "level1" },
      { key: "level3", type: "text", props: {}, parentKey: "level2" },
    ];

    const tree = flatToTree(elements);

    expect(tree.root).toBe("level0");
    expect(tree.elements["level0"]!.children).toContain("level1");
    expect(tree.elements["level1"]!.children).toContain("level2");
    expect(tree.elements["level2"]!.children).toContain("level3");
  });

  it("preserves element props", () => {
    const elements = [
      {
        key: "btn",
        type: "button",
        props: { label: "Click me", variant: "primary" },
        parentKey: null,
      },
    ];

    const tree = flatToTree(elements);

    expect(tree.elements["btn"]!.props).toEqual({
      label: "Click me",
      variant: "primary",
    });
  });

  it("preserves visibility conditions", () => {
    const elements = [
      {
        key: "conditional",
        type: "text",
        props: {},
        parentKey: null,
        visible: { path: "/isVisible" },
      },
    ];

    const tree = flatToTree(elements);

    expect(tree.elements["conditional"]!.visible).toEqual({
      path: "/isVisible",
    });
  });

  it("handles elements with undefined parentKey as root", () => {
    const elements = [
      { key: "root", type: "stack", props: {} } as {
        key: string;
        type: string;
        props: Record<string, unknown>;
        parentKey?: string | null;
      },
    ];

    const tree = flatToTree(elements);

    // Elements without parentKey should not become root (only null parentKey)
    // This tests the edge case
    expect(tree.elements["root"]).toBeDefined();
  });

  it("handles empty elements array", () => {
    const tree = flatToTree([]);

    expect(tree.root).toBe("");
    expect(Object.keys(tree.elements)).toHaveLength(0);
  });

  it("handles multiple children correctly", () => {
    const elements = [
      { key: "parent", type: "grid", props: {}, parentKey: null },
      { key: "a", type: "card", props: {}, parentKey: "parent" },
      { key: "b", type: "card", props: {}, parentKey: "parent" },
      { key: "c", type: "card", props: {}, parentKey: "parent" },
      { key: "d", type: "card", props: {}, parentKey: "parent" },
    ];

    const tree = flatToTree(elements);

    expect(tree.elements["parent"]!.children).toHaveLength(4);
    expect(tree.elements["parent"]!.children).toEqual(["a", "b", "c", "d"]);
  });
});

describe("removeNodeFromTree", () => {
  it("removes a leaf node from parent", () => {
    const elements = [
      { key: "root", type: "stack", props: {}, parentKey: null },
      { key: "child1", type: "text", props: {}, parentKey: "root" },
      { key: "child2", type: "text", props: {}, parentKey: "root" },
    ];
    const tree = flatToTree(elements);

    removeNodeFromTree(tree, "child1");

    expect(tree.elements["child1"]).toBeUndefined();
    expect(tree.elements["root"]).toBeDefined();
    expect(tree.elements["root"]!.children).toEqual(["child2"]);
  });

  it("removes a node and its descendants (deep removal)", () => {
    const elements = [
      { key: "root", type: "stack", props: {}, parentKey: null },
      { key: "parent", type: "stack", props: {}, parentKey: "root" },
      { key: "child", type: "stack", props: {}, parentKey: "parent" },
      { key: "grandchild", type: "text", props: {}, parentKey: "child" },
      { key: "sibling", type: "text", props: {}, parentKey: "root" },
    ];
    const tree = flatToTree(elements);

    removeNodeFromTree(tree, "parent");

    expect(tree.elements["parent"]).toBeUndefined();
    expect(tree.elements["child"]).toBeUndefined();
    expect(tree.elements["grandchild"]).toBeUndefined();
    expect(tree.elements["root"]).toBeDefined();
    expect(tree.elements["sibling"]).toBeDefined();
    expect(tree.elements["root"]!.children).toEqual(["sibling"]);
  });

  it("removes root node properly", () => {
    const elements = [
      { key: "root", type: "stack", props: {}, parentKey: null },
      { key: "child", type: "text", props: {}, parentKey: "root" },
    ];
    const tree = flatToTree(elements);

    removeNodeFromTree(tree, "root");

    expect(tree.root).toBe("");
    expect(tree.elements["root"]).toBeUndefined();
    expect(tree.elements["child"]).toBeUndefined();
  });

  it("does nothing if key does not exist", () => {
    const elements = [
      { key: "root", type: "stack", props: {}, parentKey: null },
    ];
    const tree = flatToTree(elements);
    const originalJson = JSON.stringify(tree);

    removeNodeFromTree(tree, "non-existent");

    expect(JSON.stringify(tree)).toBe(originalJson);
  });
});
