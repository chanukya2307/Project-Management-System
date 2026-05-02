import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <span className="text-base font-bold text-ink">ProjectFlow</span>
        <button className="focus-ring rounded-md p-2" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <main className="lg:pl-72">
        <Topbar />
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
