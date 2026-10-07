import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/add', label: 'Add Water', icon: '➕' },
  { to: '/history', label: 'History', icon: '🗓️' },
  { to: '/profile', label: 'Profile', icon: '⚙️' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <nav>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={onClose}
            className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
          >
            <span className="side-icon">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
