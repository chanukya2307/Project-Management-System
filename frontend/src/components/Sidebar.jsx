import { CheckSquare, FolderKanban, LayoutDashboard, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const baseLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare }
];

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const links = user?.role === 'admin'
    ? [...baseLinks, { to: '/users', label: 'Users', icon: Users }]
    : baseLinks;

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 transform border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-6 py-5">
            <p className="text-xl font-bold text-ink">ProjectFlow</p>
            <p className="mt-1 text-sm text-slate-500">Delivery workspace</p>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-5">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-ink'}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      {open && <button className="fixed inset-0 z-20 bg-slate-900/30 lg:hidden" onClick={onClose} aria-label="Close navigation" />}
    </>
  );
};

export default Sidebar;
