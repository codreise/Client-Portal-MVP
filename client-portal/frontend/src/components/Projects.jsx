import { useEffect, useState } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';

function StatusBadge({ status }) {
  const colors = {
    active: "bg-green-100 text-green-700",
    paused: "bg-yellow-100 text-yellow-700",
    done: "bg-gray-200 text-gray-700",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || ""}`}>
      {status}
    </span>
  );
}

function ProjectForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [status, setStatus] = useState(initial?.status || 'active');
  const [deadline, setDeadline] = useState(initial?.deadline?.slice(0,10) || '');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (deadline && new Date(deadline) < new Date().setHours(0,0,0,0)) {
      toast.error("Deadline cannot be in the past");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ title, status, deadline: deadline || null });
      toast.success("Saved!");
    } catch (err) {
      toast.error("Failed to save project");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="input"
          placeholder="Project title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <select
          className="input"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="done">Done</option>
        </select>
        <input
          type="date"
          className="input"
          value={deadline || ''}
          onChange={e => setDeadline(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="btn-primary"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function Projects() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const list = await api.listProjects();
      setItems(list);
    } catch (e) {
      toast.error(e?.response?.data?.error || e.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function create(data) {
    try {
      const item = await api.createProject(data);
      setItems(prev => [item, ...prev]);
      toast.success("Project created!");
    } catch (e) {
      toast.error(e?.response?.data?.error || e.message || "Failed to create project");
    }
  }

  async function update(id, data) {
    try {
      const item = await api.updateProject(id, data);
      setItems(prev => prev.map(p => (p.id === id ? item : p)));
      setEditing(null);
      toast.success("Project updated!");
    } catch (e) {
      toast.error(e?.response?.data?.error || e.message || "Failed to update project");
    }
  }

  async function remove(id) {
    try {
      await api.deleteProject(id);
      setItems(prev => prev.filter(p => p.id !== id));
      toast.success("Project deleted!");
    } catch (e) {
      toast.error(e?.response?.data?.error || e.message || "Failed to delete project");
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-semibold text-primary mb-4">Add new project</h3>
        <ProjectForm onSubmit={create} />
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading projects...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center">No projects yet. Start by creating one!</p>
      ) : (
        <ul className="space-y-4">
          {items.map(p => (
            <li key={p.id} className="card">
              {editing === p.id ? (
                <ProjectForm
                  initial={p}
                  onSubmit={(data) => update(p.id, data)}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-primary">{p.title}</div>
                    <div className="text-sm text-gray-600 flex gap-2 items-center">
                      <StatusBadge status={p.status} />
                      {p.deadline && <span>Deadline: {p.deadline}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 transition"
                      onClick={() => setEditing(p.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
                      onClick={() => remove(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}