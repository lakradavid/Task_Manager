import { useState } from 'react';
import styles from './TaskModal.module.css';

const DEFAULT = { title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' };

export default function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(
    task
      ? { ...task, dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '' }
      : DEFAULT
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSaving(true);
    try {
      await onSave({ ...form, dueDate: form.dueDate || null });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Title *
            <input type="text" value={form.title} onChange={set('title')} placeholder="Task title" required />
          </label>

          <label>Description
            <textarea value={form.description} onChange={set('description')} placeholder="Optional description" rows={3} />
          </label>

          <div className={styles.row}>
            <label>Status
              <select value={form.status} onChange={set('status')}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>

            <label>Priority
              <select value={form.priority} onChange={set('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>

          <label>Due Date
            <input type="date" value={form.dueDate} onChange={set('dueDate')} />
          </label>

          <div className={styles.btnRow}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving…' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
