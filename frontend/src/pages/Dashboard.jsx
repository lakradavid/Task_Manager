import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import styles from './Dashboard.module.css';

const STATUSES = ['all', 'todo', 'in-progress', 'done'];
const PRIORITIES = ['all', 'low', 'medium', 'high'];

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', search: '' });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      const { data } = await api.get('/tasks', { params });
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleSave = async (taskData) => {
    if (editTask) {
      const { data } = await api.put(`/tasks/${editTask._id}`, taskData);
      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
    } else {
      const { data } = await api.post('/tasks', taskData);
      setTasks((prev) => [data, ...prev]);
    }
    setShowModal(false);
    setEditTask(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const openEdit = (task) => { setEditTask(task); setShowModal(true); };
  const openCreate = () => { setEditTask(null); setShowModal(true); };

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className="container">
        <div className={styles.header}>
          <div>
            <h2 className={styles.greeting}>Hello, {user?.name} 👋</h2>
            <p className={styles.sub}>Here's your task overview</p>
          </div>
          <button className={styles.addBtn} onClick={openCreate}>+ New Task</button>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          {[
            { label: 'Total', value: stats.total, color: '#6366f1' },
            { label: 'To Do', value: stats.todo, color: '#f59e0b' },
            { label: 'In Progress', value: stats.inProgress, color: '#3b82f6' },
            { label: 'Done', value: stats.done, color: '#10b981' },
          ].map((s) => (
            <div key={s.label} className={styles.statCard} style={{ borderTopColor: s.color }}>
              <span className={styles.statValue} style={{ color: s.color }}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <input
            className={styles.search}
            placeholder="Search tasks…"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
          </select>
          <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p === 'all' ? 'All Priorities' : p}</option>)}
          </select>
        </div>

        {/* Task List */}
        {loading ? (
          <p className={styles.empty}>Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No tasks found.</p>
            <button className={styles.addBtn} onClick={openCreate}>Create your first task</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <TaskModal
          task={editTask}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTask(null); }}
        />
      )}
    </div>
  );
}
