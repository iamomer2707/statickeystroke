import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = { sm: 16, md: 28, lg: 44 };
  const dim = sizes[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        style={{ width: dim, height: dim }}
        className="rounded-full border-2 border-white/[0.08] border-t-cyber-primary"
      />
      {text && (
        <p className="text-cyber-muted text-sm font-medium animate-pulse-soft">{text}</p>
      )}
    </div>
  );
}
