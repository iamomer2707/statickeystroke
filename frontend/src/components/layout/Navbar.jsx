import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Shield, Sun, Moon, LogOut, User, Menu, Command } from 'lucide-react';

export default function Navbar({ onMenuToggle, onOpenCommand }) {
  const { user, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-cyber-black/70 border-b border-white/[0.06]"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            {(user || isAdmin) && (
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 text-cyber-muted hover:text-cyber-text transition-colors ring-focus rounded-md"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2.5 group ring-focus rounded-md">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-cyber-primary/10 border border-cyber-primary/25 flex items-center justify-center group-hover:bg-cyber-primary/15 transition-colors">
                  <Shield size={14} className="text-cyber-primary" aria-hidden="true" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyber-success animate-pulse-soft" />
              </div>
              <div className="leading-tight">
                <h1 className="font-display text-sm font-semibold text-cyber-text tracking-tight">
                  SKDA
                </h1>
                <p className="text-[10px] text-cyber-muted tracking-wide">
                  Keystroke auth
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {(user || isAdmin) && onOpenCommand && (
              <button
                onClick={onOpenCommand}
                className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-cyber-muted bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] hover:text-cyber-text transition-colors ring-focus"
              >
                <Command size={12} aria-hidden="true" />
                <span>Search</span>
                <kbd className="ml-2 px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.06] text-[10px] font-mono">⌘ K</kbd>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-cyber-muted hover:text-cyber-text hover:bg-white/[0.04] transition-colors ring-focus"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {(user || isAdmin) && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                  <User size={13} className="text-cyber-muted" aria-hidden="true" />
                  <span className="text-xs font-medium text-cyber-text">
                    {isAdmin ? 'Admin' : user?.name}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-cyber-accent' : 'bg-cyber-success'}`} />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-cyber-muted hover:text-cyber-danger hover:bg-cyber-danger/10 transition-colors ring-focus"
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
