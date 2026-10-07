import { useState } from 'react';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <Navbar onMenu={() => setOpen((o) => !o)} />
      <div className="app-body">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        {open && <div className="backdrop" onClick={() => setOpen(false)} />}
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
