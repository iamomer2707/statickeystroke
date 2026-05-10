import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, KeyRound, Database, BarChart3,
  Users, FileBarChart, LogOut, Home, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Command palette — opens with ⌘K / Ctrl+K. Keyboard-navigable list of
 * routes and actions. Uses fuzzy substring matching to keep things light.
 */
export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  const items = useMemo(() => {
    const base = [
      { id: 'home', label: 'Go home', kind: 'Navigate', icon: Home, run: () => navigate('/') },
    ];
    if (isAdmin) {
      base.push(
        { id: 'admin', label: 'Admin dashboard', kind: 'Navigate', icon: LayoutDashboard, run: () => navigate('/admin') },
        { id: 'admin-users', label: 'Manage users', kind: 'Navigate', icon: Users, run: () => navigate('/admin/users') },
        { id: 'admin-reports', label: 'ML reports', kind: 'Navigate', icon: FileBarChart, run: () => navigate('/admin/reports') },
      );
    } else if (user) {
      base.push(
        { id: 'dash', label: 'My dashboard', kind: 'Navigate', icon: LayoutDashboard, run: () => navigate('/dashboard') },
        { id: 'change', label: 'Change password', kind: 'Action', icon: KeyRound, run: () => navigate('/change-password') },
        { id: 'dataset', label: 'Browse dataset', kind: 'Navigate', icon: Database, run: () => navigate('/dataset') },
        { id: 'classification', label: 'View classification', kind: 'Navigate', icon: BarChart3, run: () => navigate('/classification') },
      );
    }
    if (user || isAdmin) {
      base.push({
        id: 'logout',
        label: 'Sign out',
        kind: 'Action',
        icon: LogOut,
        run: () => { logout(); navigate('/'); },
      });
    }
    return base;
  }, [navigate, user, isAdmin, logout]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i => i.label.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    setActive(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const onKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[active];
      if (item) { item.run(); onClose(); }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[91] w-[92%] max-w-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="rounded-2xl bg-cyber-card/90 backdrop-blur-2xl border border-white/[0.10] shadow-lift overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                <Search size={16} className="text-cyber-muted" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Type a command or search…"
                  className="flex-1 bg-transparent outline-none text-sm font-medium text-cyber-text placeholder-cyber-muted/60"
                />
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.06] text-[10px] font-mono text-cyber-muted">esc</kbd>
              </div>

              <div className="max-h-80 overflow-y-auto py-1">
                {filtered.length === 0 ? (
                  <p className="px-4 py-8 text-sm text-cyber-muted text-center">
                    No matches for &ldquo;{query}&rdquo;.
                  </p>
                ) : (
                  filtered.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = i === active;
                    return (
                      <button
                        key={item.id}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => { item.run(); onClose(); }}
                        className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors ${
                          isActive ? 'bg-white/[0.06] text-cyber-text' : 'text-cyber-muted'
                        }`}
                      >
                        <Icon size={15} className={isActive ? 'text-cyber-primary' : ''} aria-hidden="true" />
                        <span className="flex-1 text-left font-medium tracking-tight">{item.label}</span>
                        <span className="text-[10px] uppercase tracking-widest text-cyber-muted/70">{item.kind}</span>
                        {isActive && <ArrowRight size={14} className="text-cyber-primary" />}
                      </button>
                    );
                  })
                )}
              </div>

              <div className="px-4 py-2 border-t border-white/[0.06] flex items-center gap-3 text-[10px] text-cyber-muted/80">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.06] font-mono">↑ ↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.06] font-mono">↵</kbd> select</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
