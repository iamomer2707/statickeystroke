import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import {
  LayoutDashboard, KeyRound, Database, BarChart3, Users,
  FileBarChart, Shield, X,
} from 'lucide-react';

const userLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/change-password', icon: KeyRound, label: 'Change password' },
  { to: '/dataset', icon: Database, label: 'Dataset' },
  { to: '/classification', icon: BarChart3, label: 'Classification' },
];

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/reports', icon: FileBarChart, label: 'Reports' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={clsx(
          'fixed top-14 left-0 bottom-0 z-40 w-60',
          'bg-cyber-card/40 backdrop-blur-xl border-r border-white/[0.06]',
          'transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex flex-col h-full p-3">
          <button
            onClick={onClose}
            className="lg:hidden self-end p-2 text-cyber-muted hover:text-cyber-text mb-1 ring-focus rounded-md"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>

          <nav className="flex-1 space-y-0.5">
            <p className="text-[10px] font-medium uppercase tracking-widest text-cyber-muted/60 mb-3 px-3">
              {isAdmin ? 'Admin' : 'Navigation'}
            </p>
            {links.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) => clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg',
                  'text-sm font-medium transition-colors duration-150',
                  'group relative',
                  isActive
                    ? 'bg-white/[0.06] text-cyber-text'
                    : 'text-cyber-muted hover:text-cyber-text hover:bg-white/[0.03]',
                )}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-cyber-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon
                      size={15}
                      className={clsx(
                        'shrink-0 transition-transform group-hover:scale-105',
                        isActive ? 'text-cyber-primary' : '',
                      )}
                      aria-hidden="true"
                    />
                    <span className="tracking-tight">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 px-3 py-2">
              <Shield size={12} className="text-cyber-primary" aria-hidden="true" />
              <span className="text-[10px] text-cyber-muted tracking-wide">
                SKDA v2.0 · Secured
              </span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
