import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import clsx from 'clsx';

const palette = {
  primary: { text: 'text-cyber-primary', bg: 'bg-cyber-primary/10', dot: 'bg-cyber-primary' },
  secondary: { text: 'text-cyber-secondary', bg: 'bg-cyber-secondary/10', dot: 'bg-cyber-secondary' },
  accent: { text: 'text-cyber-accent', bg: 'bg-cyber-accent/10', dot: 'bg-cyber-accent' },
  success: { text: 'text-cyber-success', bg: 'bg-cyber-success/10', dot: 'bg-cyber-success' },
  warning: { text: 'text-cyber-warning', bg: 'bg-cyber-warning/10', dot: 'bg-cyber-warning' },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'primary',
  delay = 0,
}) {
  const c = palette[color];

  return (
    <GlassCard delay={delay} className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className={clsx('w-1.5 h-1.5 rounded-full', c.dot)} />
            <p className="text-xs font-medium text-cyber-muted truncate">{title}</p>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: delay + 0.15 }}
            className="text-3xl font-display font-semibold text-cyber-text tracking-tight tabular-nums"
          >
            {value}
          </motion.p>
          {subtitle && <p className="text-xs text-cyber-muted">{subtitle}</p>}
          {trend !== undefined && (
            <p className={clsx(
              'text-xs font-medium',
              trend >= 0 ? 'text-cyber-success' : 'text-cyber-danger',
            )}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last period
            </p>
          )}
        </div>
        {Icon && (
          <div className={clsx('p-2.5 rounded-xl shrink-0', c.bg)}>
            <Icon size={20} className={c.text} aria-hidden="true" />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
