import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ParticleBackground from './ParticleBackground';
import CommandPalette from '../CommandPalette';

export default function Layout({ showSidebar = true }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((s) => !s);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navbar
        onMenuToggle={() => setSidebarOpen((s) => !s)}
        onOpenCommand={() => setCmdOpen(true)}
      />

      {showSidebar && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      <main className={`relative z-10 pt-14 transition-all duration-300 ${showSidebar ? 'lg:pl-60' : ''}`}>
        <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
