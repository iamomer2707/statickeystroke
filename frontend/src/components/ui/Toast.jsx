import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import clsx from 'clsx';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'border-cyber-success/30 bg-cyber-success/[0.08] text-cyber-success',
  error: 'border-cyber-danger/30 bg-cyber-danger/[0.08] text-cyber-danger',
  warning: 'border-cyber-warning/30 bg-cyber-warning/[0.08] text-cyber-warning',
  info: 'border-cyber-primary/30 bg-cyber-primary/[0.08] text-cyber-primary',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className={clsx(
                'pointer-events-auto',
                'flex items-center gap-3 px-4 py-3 rounded-xl',
                'backdrop-blur-xl border shadow-lift',
                styles[toast.type],
              )}
              role="status"
            >
              <Icon size={18} className="shrink-0" aria-hidden="true" />
              <p className="text-sm font-medium flex-1 text-cyber-text">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity ring-focus rounded-md"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
