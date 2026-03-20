import type { Item, Tag } from "../types";

export const mockTags = {
  bug: { id: 1, name: "Bug", color: "#EF4444" },
  feature: { id: 2, name: "Feature", color: "#22C55E" },
  enhancement: { id: 3, name: "Enhancement", color: "#3B82F6" },
};

export const mockItems = {
  simple: {
    id: 1,
    name: "Simple Task",
    description: "A simple task",
    tags: [],
  },
  withDescription: {
    id: 2,
    name: "Task with Description",
    description: "This is a detailed description",
    tags: [],
  },
  withTags: {
    id: 3,
    name: "Task with Tags",
    description: "Has multiple tags",
    tags: [mockTags.bug, mockTags.feature],
  },
  minimal: { id: 4, name: "Minimal", description: "", tags: [] },
  withDueDate: {
    id: 5,
    name: "Task with Due Date",
    description: "Has a due date",
    due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    tags: [],
  },
  overdue: {
    id: 6,
    name: "Overdue Task",
    description: "Already past due",
    due_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tags: [],
  },
};

export function createMockItem(overrides?: Partial<Item>): Item {
  return {
    id: Math.floor(Math.random() * 10000),
    name: "Test Task",
    description: "Test description",
    tags: [],
    ...overrides,
  };
}

export function createMockTag(overrides?: Partial<Tag>): Tag {
  return {
    id: Math.floor(Math.random() * 10000),
    name: "Test Tag",
    color: "#6366F1",
    ...overrides,
  };
}

export function createMockItems(count: number): Item[] {
  return Array.from({ length: count }, (_, i) =>
    createMockItem({ id: i + 1, name: `Task ${i + 1}` }),
  );
}
