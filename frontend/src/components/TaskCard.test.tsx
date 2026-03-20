import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TaskCard from "./TaskCard";
import { mockItems } from "../test/mock-data";

describe("TaskCard", () => {
  const defaultProps = {
    item: mockItems.simple,
    onDelete: vi.fn(),
    onEdit: vi.fn(),
    onDragStart: vi.fn(),
  };

  it("renders task name", () => {
    render(<TaskCard {...defaultProps} />);
    expect(screen.getByText(mockItems.simple.name)).toBeInTheDocument();
  });

  it("renders task description when provided", () => {
    render(<TaskCard {...defaultProps} item={mockItems.withDescription} />);
    expect(
      screen.getByText(mockItems.withDescription.description),
    ).toBeInTheDocument();
  });

  it("does not render description when empty", () => {
    const itemWithoutDesc = { ...mockItems.simple, description: "" };
    render(<TaskCard {...defaultProps} item={itemWithoutDesc} />);

    // Only the name should be visible
    expect(screen.getByText(itemWithoutDesc.name)).toBeInTheDocument();
    const taskCard = screen.getByTestId(`task-${itemWithoutDesc.id}`);
    expect(taskCard.querySelectorAll("p").length).toBe(0);
  });

  it("renders tags when present", () => {
    render(<TaskCard {...defaultProps} item={mockItems.withTags} />);

    mockItems.withTags.tags.forEach((tag) => {
      expect(screen.getByText(tag.name)).toBeInTheDocument();
    });
  });

  it("does not render tags section when no tags", () => {
    render(<TaskCard {...defaultProps} item={mockItems.simple} />);

    const taskCard = screen.getByTestId(`task-${mockItems.simple.id}`);
    const tagContainer = taskCard.querySelector(".flex.flex-wrap.gap-1\\.5");
    expect(tagContainer).not.toBeInTheDocument();
  });

  it("renders delete button", () => {
    render(<TaskCard {...defaultProps} />);
    expect(
      screen.getByTestId(`delete-task-${mockItems.simple.id}`),
    ).toBeInTheDocument();
  });

  it("renders edit button", () => {
    render(<TaskCard {...defaultProps} />);
    expect(
      screen.getByTestId(`edit-task-${mockItems.simple.id}`),
    ).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(<TaskCard {...defaultProps} onEdit={onEdit} />);

    const editButton = screen.getByTestId(`edit-task-${mockItems.simple.id}`);
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockItems.simple);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<TaskCard {...defaultProps} onDelete={onDelete} />);

    const deleteButton = screen.getByTestId(
      `delete-task-${mockItems.simple.id}`,
    );
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockItems.simple.id);
  });

  it("is draggable", () => {
    render(<TaskCard {...defaultProps} />);
    const taskCard = screen.getByTestId(`task-${mockItems.simple.id}`);
    expect(taskCard).toHaveAttribute("draggable", "true");
  });

  it("calls onDragStart when drag starts", () => {
    const onDragStart = vi.fn();
    render(<TaskCard {...defaultProps} onDragStart={onDragStart} />);

    const taskCard = screen.getByTestId(`task-${mockItems.simple.id}`);
    const dragEvent = new Event("dragstart", { bubbles: true });

    taskCard.dispatchEvent(dragEvent);

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDragStart).toHaveBeenCalledWith(
      expect.any(Object),
      mockItems.simple,
    );
  });

  it("has correct styling classes", () => {
    render(<TaskCard {...defaultProps} />);
    const taskCard = screen.getByTestId(`task-${mockItems.simple.id}`);

    expect(taskCard).toHaveClass("group");
    expect(taskCard).toHaveClass("rounded-lg");
    expect(taskCard).toHaveClass("cursor-grab");
  });

  it("does not render due date when not set", () => {
    render(<TaskCard {...defaultProps} item={mockItems.simple} />);
    expect(
      screen.queryByTestId(`task-due-date-${mockItems.simple.id}`),
    ).not.toBeInTheDocument();
  });

  it("renders due date with red color when expired", () => {
    const expiredItem = { ...mockItems.simple, due_date: "2020-01-01T00:00:00" };
    render(<TaskCard {...defaultProps} item={expiredItem} />);
    const dueDateEl = screen.getByTestId(`task-due-date-${expiredItem.id}`);
    expect(dueDateEl).toBeInTheDocument();
    expect(dueDateEl).toHaveClass("text-rose-600");
  });

  it("renders due date with orange color when less than 48 hours away", () => {
    const soon = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const urgentItem = { ...mockItems.simple, due_date: soon };
    render(<TaskCard {...defaultProps} item={urgentItem} />);
    const dueDateEl = screen.getByTestId(`task-due-date-${urgentItem.id}`);
    expect(dueDateEl).toBeInTheDocument();
    expect(dueDateEl).toHaveClass("text-orange-500");
  });

  it("renders due date with normal color when more than 48 hours away", () => {
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const futureItem = { ...mockItems.simple, due_date: future };
    render(<TaskCard {...defaultProps} item={futureItem} />);
    const dueDateEl = screen.getByTestId(`task-due-date-${futureItem.id}`);
    expect(dueDateEl).toBeInTheDocument();
    expect(dueDateEl).toHaveClass("text-slate-500");
  });
});
