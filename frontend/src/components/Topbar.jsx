import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Topbar = () => {
  const { logout, user } = useAuth();

  return (
    <header className="hidden border-b border-slate-200 bg-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <div>
          <p className="text-sm text-slate-500">Signed in as</p>
          <p className="font-semibold text-ink">{user?.name} <span className="text-sm font-medium capitalize text-slate-500">({user?.role})</span></p>
        </div>
        <button onClick={logout} className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
