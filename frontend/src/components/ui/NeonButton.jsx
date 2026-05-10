import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Refined button — solid primary, subtle secondary, ghost. No neon glow.
 * API kept compatible with the previous `NeonButton` export.
 */
const variants = {
  primary:
    'bg-cyber-primary text-cyber-black border-cyber-primary hover:bg-violet-300 hover:border-violet-300 active:scale-[0.98] shadow-glow-violet',
  secondary:
    'bg-white/[0.04] text-cyber-text border-white/[0.10] hover:bg-white/[0.08] hover:border-white/[0.18]',
  accent:
    'bg-cyber-accent text-cyber-black border-cyber-accent hover:bg-pink-300 hover:border-pink-300 active:scale-[0.98]',
  success:
    'bg-cyber-success text-cyber-black border-cyber-success hover:bg-emerald-300 hover:border-emerald-300',
  danger:
    'bg-cyber-danger/15 text-cyber-danger border-cyber-danger/40 hover:bg-cyber-danger/25 hover:border-cyber-danger/60',
  ghost:
    'bg-transparent text-cyber-muted border-transparent hover:text-cyber-text hover:bg-white/[0.04]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-sm gap-2.5',
};

export default function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileHover={!disabled ? { y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.985 } : undefined}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'btn-base ring-focus tracking-tight font-medium',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
          <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
        </svg>
      ) : Icon ? (
        <Icon size={16} aria-hidden="true" />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight size={16} aria-hidden="true" />}
    </motion.button>
  );
}
