import styles from './TaskCard.module.css';

const STATUS_COLORS = {
  'todo': '#f59e0b',
  'in-progress': '#3b82f6',
  'done': '#10b981',
};

const PRIORITY_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.status} style={{ background: STATUS_COLORS[task.status] + '22', color: STATUS_COLORS[task.status] }}>
          {task.status}
        </span>
        <span className={styles.priority} style={{ color: PRIORITY_COLORS[task.priority] }}>
          ● {task.priority}
        </span>
      </div>

      <h3 className={`${styles.title} ${task.status === 'done' ? styles.done : ''}`}>{task.title}</h3>

      {task.description && <p className={styles.desc}>{task.description}</p>}

      {dueDate && (
        <p className={`${styles.due} ${isOverdue ? styles.overdue : ''}`}>
          📅 {isOverdue ? 'Overdue: ' : 'Due: '}{dueDate}
        </p>
      )}

      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => onEdit(task)}>Edit</button>
        <button className={styles.deleteBtn} onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </div>
  );
}
