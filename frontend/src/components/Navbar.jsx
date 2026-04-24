import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.logo}>✅ TaskManager</span>
        <div className={styles.right}>
          <span className={styles.name}>{user?.name}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
