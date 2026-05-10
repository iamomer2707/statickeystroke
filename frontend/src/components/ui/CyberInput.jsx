import { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Refined input. Pill-soft surface, single thin border, focus ring instead of
 * neon glow. Supports password toggle, icon, error/success messages.
 */
export default function CyberInput({
  label,
  type = 'text',
  icon: Icon,
  error,
  success,
  hint,
  onKeyDown,
  onKeyUp,
  className,
  wrapperClassName,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const state = error ? 'error' : success ? 'success' : 'normal';
  const ringColor = state === 'error'
    ? 'rgba(248,113,113,0.45)'
    : state === 'success'
      ? 'rgba(52,211,153,0.45)'
      : 'rgba(167,139,250,0.45)';

  return (
    <div className={clsx('space-y-1.5', wrapperClassName)}>
      {label && (
        <label className="block text-xs font-medium text-cyber-muted">
          {label}
        </label>
      )}
      <div
        className={clsx(
          'relative flex items-center rounded-xl overflow-hidden',
          'bg-white/[0.03] border transition-colors duration-200',
          state === 'error'
            ? 'border-cyber-danger/40'
            : state === 'success'
              ? 'border-cyber-success/40'
              : 'border-white/[0.08] hover:border-white/[0.14]',
        )}
        style={focused ? { boxShadow: `0 0 0 3px ${ringColor}` } : undefined}
      >
        {Icon && (
          <div
            className={clsx(
              'pl-3.5 transition-colors duration-200',
              focused ? 'text-cyber-primary' : 'text-cyber-muted',
            )}
          >
            <Icon size={16} aria-hidden="true" />
          </div>
        )}
        <input
          type={inputType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          className={clsx(
            'w-full bg-transparent px-3.5 py-2.5',
            'text-cyber-text placeholder-cyber-muted/60',
            'text-sm font-medium tracking-tight',
            'outline-none',
            Icon && 'pl-2.5',
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="px-3 text-cyber-muted hover:text-cyber-text transition-colors ring-focus"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {hint && !error && !success && (
        <p className="text-[11px] text-cyber-muted/80 pl-1">{hint}</p>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] text-cyber-danger pl-1"
        >
          {error}
        </motion.p>
      )}
      {success && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] text-cyber-success pl-1"
        >
          {success}
        </motion.p>
      )}
    </div>
  );
}
