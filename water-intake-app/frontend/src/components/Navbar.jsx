import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenu} aria-label="Toggle menu">☰</button>
        <span className="brand"><span className="brand-drop">💧</span> AquaTrack</span>
      </div>
      <div className="navbar-right">
        <span className="nav-user">{user?.name}</span>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
