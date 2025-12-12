"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import type { LeadWithRelations } from "@/types";
import type { Task, Note } from "@prisma/client";

interface DashboardData {
  leads: LeadWithRelations[];
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateForInput(date: Date | string): string {
  return new Date(date).toISOString().split("T")[0];
}

function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Icons
function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// Task Row Component
function TaskRow({
  task,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onUpdate: (id: string, data: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [deadline, setDeadline] = useState(formatDateForInput(task.deadline));
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onUpdate(task.id, { title, deadline: new Date(deadline), status });
    setIsEditing(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDeadline(formatDateForInput(task.deadline));
    setStatus(task.status);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      setLoading(true);
      await onDelete(task.id);
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    setStatus(newStatus as Task["status"]);
    await onUpdate(task.id, { status: newStatus as Task["status"] });
    setLoading(false);
  };

  if (isEditing) {
    return (
      <tr className="border-b border-gray-50 last:border-0 bg-gray-50">
        <td className="py-2 pr-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </td>
        <td className="py-2 pr-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Task["status"])}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="pending">pending</option>
            <option value="in_progress">in progress</option>
            <option value="completed">completed</option>
          </select>
        </td>
        <td className="py-2 pr-2">
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </td>
        <td className="py-2">
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              disabled={loading}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
            >
              <CheckIcon />
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded"
            >
              <XIcon />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-50 last:border-0 group">
      <td className="py-2 text-gray-900">{task.title}</td>
      <td className="py-2">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={loading}
          className={`px-2 py-0.5 rounded-full text-xs border-0 cursor-pointer ${getStatusColor(task.status)}`}
        >
          <option value="pending">pending</option>
          <option value="in_progress">in progress</option>
          <option value="completed">completed</option>
        </select>
      </td>
      <td className="py-2 text-gray-600">{formatDate(task.deadline)}</td>
      <td className="py-2">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Edit"
          >
            <EditIcon />
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

// Note Card Component
function NoteCard({
  note,
  onUpdate,
  onDelete,
}: {
  note: Note;
  onUpdate: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onUpdate(note.id, content);
    setIsEditing(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setContent(note.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this note?")) {
      setLoading(true);
      await onDelete(note.id);
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-gray-50 rounded-lg p-3 border border-emerald-200">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
        />
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-3 group relative">
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
          title="Edit"
        >
          <EditIcon />
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded"
          title="Delete"
        >
          <TrashIcon />
        </button>
      </div>
      <p className="text-sm text-gray-900 pr-16">{note.content}</p>
      <p className="text-xs text-gray-500 mt-1">{formatDate(note.createdAt)}</p>
    </div>
  );
}

// Add Task Form
function AddTaskForm({
  leadId,
  onAdd,
  onCancel,
}: {
  leadId: string;
  onAdd: (leadId: string, title: string, deadline: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState(formatDateForInput(new Date()));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onAdd(leadId, title, deadline);
    setTitle("");
    setDeadline(formatDateForInput(new Date()));
    setLoading(false);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded-lg">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
        autoFocus
      />
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="px-2 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
      >
        Add
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        Cancel
      </button>
    </form>
  );
}

// Add Note Form
function AddNoteForm({
  leadId,
  onAdd,
  onCancel,
}: {
  leadId: string;
  onAdd: (leadId: string, content: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await onAdd(leadId, content);
    setContent("");
    setLoading(false);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-2 bg-gray-50 rounded-lg">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Note content"
        rows={2}
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
        autoFocus
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-2 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
        >
          Add
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Lead Card Component
function LeadCard({
  lead,
  onUpdateLead,
  onDeleteLead,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: {
  lead: LeadWithRelations;
  onUpdateLead: (id: string, name: string) => Promise<void>;
  onDeleteLead: (id: string) => Promise<void>;
  onAddTask: (leadId: string, title: string, deadline: string) => Promise<void>;
  onUpdateTask: (id: string, data: Partial<Task>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onAddNote: (leadId: string, content: string) => Promise<void>;
  onUpdateNote: (id: string, content: string) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(lead.name);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [loading, setLoading] = useState(false);

  const pendingTasks = lead.tasks.filter((t) => t.status === "pending").length;
  const inProgressTasks = lead.tasks.filter((t) => t.status === "in_progress").length;

  const handleSaveName = async () => {
    if (name.trim() && name !== lead.name) {
      setLoading(true);
      await onUpdateLead(lead.id, name);
      setLoading(false);
    }
    setIsEditingName(false);
  };

  const handleDeleteLead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${lead.name}" and all its tasks and notes?`)) {
      setLoading(true);
      await onDeleteLead(lead.id);
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 flex-1"
        >
          <ChevronIcon expanded={isExpanded} />
          {isEditingName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") {
                  setName(lead.name);
                  setIsEditingName(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="font-medium text-gray-900 px-2 py-0.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
          ) : (
            <span className="font-medium text-gray-900">{lead.name}</span>
          )}
        </button>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{lead.tasks.length} tasks</span>
          <span>{lead.notes.length} notes</span>
          {inProgressTasks > 0 && (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
              {inProgressTasks} in progress
            </span>
          )}
          {pendingTasks > 0 && (
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">
              {pendingTasks} pending
            </span>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingName(true);
              }}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              title="Edit lead name"
            >
              <EditIcon />
            </button>
            <button
              onClick={handleDeleteLead}
              disabled={loading}
              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
              title="Delete lead"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 px-4 py-4">
          {/* Tasks Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Tasks ({lead.tasks.length})
              </h4>
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded"
              >
                <PlusIcon size={14} />
                Add Task
              </button>
            </div>
            {showAddTask && (
              <AddTaskForm
                leadId={lead.id}
                onAdd={onAddTask}
                onCancel={() => setShowAddTask(false)}
              />
            )}
            {lead.tasks.length === 0 && !showAddTask ? (
              <p className="text-sm text-gray-500 italic">No tasks yet</p>
            ) : lead.tasks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="pb-2 font-medium">Title</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Deadline</th>
                      <th className="pb-2 font-medium w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lead.tasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onUpdate={onUpdateTask}
                        onDelete={onDeleteTask}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>

          {/* Notes Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Notes ({lead.notes.length})
              </h4>
              <button
                onClick={() => setShowAddNote(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded"
              >
                <PlusIcon size={14} />
                Add Note
              </button>
            </div>
            {showAddNote && (
              <AddNoteForm
                leadId={lead.id}
                onAdd={onAddNote}
                onCancel={() => setShowAddNote(false)}
              />
            )}
            {lead.notes.length === 0 && !showAddNote ? (
              <p className="text-sm text-gray-500 italic">No notes yet</p>
            ) : lead.notes.length > 0 ? (
              <div className="space-y-2">
                {lead.notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onUpdate={onUpdateNote}
                    onDelete={onDeleteNote}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

// Add Lead Form
function AddLeadForm({
  onAdd,
  onCancel,
}: {
  onAdd: (name: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onAdd(name);
    setName("");
    setLoading(false);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 bg-white border border-gray-200 rounded-lg mb-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Lead name"
        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        autoFocus
      />
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
      >
        Add Lead
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
      >
        Cancel
      </button>
    </form>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddLead, setShowAddLead] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Lead CRUD
  const handleAddLead = async (name: string) => {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (response.ok) {
      await fetchData();
    }
  };

  const handleUpdateLead = async (id: string, name: string) => {
    const response = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (response.ok) {
      await fetchData();
    }
  };

  const handleDeleteLead = async (id: string) => {
    const response = await fetch(`/api/leads/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await fetchData();
    }
  };

  // Task CRUD
  const handleAddTask = async (leadId: string, title: string, deadline: string) => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, title, deadline }),
    });
    if (response.ok) {
      await fetchData();
    }
  };

  const handleUpdateTask = async (id: string, taskData: Partial<Task>) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (response.ok) {
      await fetchData();
    }
  };

  const handleDeleteTask = async (id: string) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await fetchData();
    }
  };

  // Note CRUD
  const handleAddNote = async (leadId: string, content: string) => {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, content }),
    });
    if (response.ok) {
      await fetchData();
    }
  };

  const handleUpdateNote = async (id: string, content: string) => {
    const response = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (response.ok) {
      await fetchData();
    }
  };

  const handleDeleteNote = async (id: string) => {
    const response = await fetch(`/api/notes/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥝</span>
          <h1 className="text-xl font-semibold text-gray-900">Kiwi</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" title="Back to Chat" className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="hidden sm:inline">Chat</span>
            </Button>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600 mt-1">View and manage all your leads, tasks, and notes</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddLead(true)}
            className="flex items-center gap-1"
          >
            <PlusIcon size={18} />
            Add Lead
          </Button>
        </div>

        {showAddLead && (
          <AddLeadForm onAdd={handleAddLead} onCancel={() => setShowAddLead(false)} />
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {data && !loading && (
          <>
            {data.leads.length === 0 && !showAddLead ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No leads yet. Start by adding a lead or chat with Kiwi!</p>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <Button variant="primary" size="sm" onClick={() => setShowAddLead(true)}>
                    Add Lead
                  </Button>
                  <Link href="/">
                    <Button variant="secondary" size="sm">
                      Go to Chat
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {data.leads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onUpdateLead={handleUpdateLead}
                    onDeleteLead={handleDeleteLead}
                    onAddTask={handleAddTask}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                    onAddNote={handleAddNote}
                    onUpdateNote={handleUpdateNote}
                    onDeleteNote={handleDeleteNote}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
