import { useNavigate, useLocation, Link } from 'react-router-dom';
import { logout } from '../api/auth';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (_) {}
    localStorage.clear();
    navigate('/login');
  };

  const name = localStorage.getItem('name');

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/dashboard" className="header-logo">
          Measurely
        </Link>
        <nav className="header-nav">
          <Link
            to="/dashboard"
            className={`nav-link${location.pathname === '/dashboard' ? ' nav-link--active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className={`nav-link${location.pathname === '/profile' ? ' nav-link--active' : ''}`}
          >
            Profile
          </Link>
        </nav>
        <div className="header-right">
          {name && <span className="header-name">{name}</span>}
          <button className="header-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
