import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Refined surface card. Quieter borders, subtle hover lift, optional
 * gradient hairline (`gradient`) or featured ring (`glow`).
 */
export default function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  gradient = false,
  delay = 0,
  as: Tag = motion.div,
  ...props
}) {
  return (
    <Tag
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -2, transition: { duration: 0.18 } } : undefined}
      className={clsx(
        'relative rounded-2xl overflow-hidden',
        'bg-cyber-card/70 backdrop-blur-xl',
        'border border-white/[0.06]',
        hover && 'transition-shadow duration-300 hover:border-white/[0.10] hover:shadow-lift',
        glow && 'neon-border',
        gradient && 'gradient-border',
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}
