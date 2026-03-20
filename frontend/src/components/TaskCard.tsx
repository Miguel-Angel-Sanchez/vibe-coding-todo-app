import type { Item } from "../types";
import Tag from "./Tag";

interface TaskCardProps {
  item: Item;
  onDelete: (itemId: number) => void;
  onEdit: (item: Item) => void;
  onDragStart: (e: React.DragEvent<HTMLElement>, item: Item) => void;
}

function getDueDateStyle(due_date: string | null | undefined): {
  className: string;
  label: string;
} | null {
  if (!due_date) return null;

  const now = new Date();
  const due = new Date(due_date);

  // Strip time to compare calendar days
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  const formatted = due.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (dueStart <= todayStart) {
    // Expired or due today → red
    return { className: "text-rose-600 font-medium", label: formatted };
  }
  if (diffHours < 48) {
    // Less than 48 hours remaining → orange
    return { className: "text-orange-500 font-medium", label: formatted };
  }
  // More than 48 hours → slate
  return { className: "text-slate-500", label: formatted };
}

export default function TaskCard({
  item,
  onDelete,
  onEdit,
  onDragStart,
}: TaskCardProps) {
  const dueDateStyle = getDueDateStyle(item.due_date);

  return (
    <article
      data-testid={`task-${item.id}`}
      className="group rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md cursor-grab"
      draggable
      onDragStart={(e) => onDragStart(e, item)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-slate-800">{item.name}</h3>
          {item.description && (
            <p className="mt-1 text-xs text-slate-500">{item.description}</p>
          )}
          {dueDateStyle && (
            <p
              data-testid={`task-due-date-${item.id}`}
              className={`mt-1 text-xs ${dueDateStyle.className}`}
            >
              📅 {dueDateStyle.label}
            </p>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <Tag key={tag.id} name={tag.name} color={tag.color} />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            data-testid={`edit-task-${item.id}`}
            onClick={() => onEdit(item)}
            className="opacity-0 group-hover:opacity-100 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
          >
            Edit
          </button>
          <button
            data-testid={`delete-task-${item.id}`}
            onClick={() => onDelete(item.id)}
            className="opacity-0 group-hover:opacity-100 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
