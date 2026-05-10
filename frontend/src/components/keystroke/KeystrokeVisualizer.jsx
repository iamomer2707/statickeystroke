import { motion, AnimatePresence } from 'framer-motion';

export default function KeystrokeVisualizer({ keyEvents, isTyping, currentKey }) {
  const lastEvents = keyEvents.slice(-24);
  const maxHold = Math.max(...lastEvents.map((e) => e.holdDuration), 200);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-cyber-success animate-pulse-soft' : 'bg-cyber-muted/50'}`} />
          <span className="text-xs font-medium text-cyber-text">
            {isTyping ? 'Capturing…' : 'Waiting for input'}
          </span>
        </div>
        {currentKey && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-2 py-0.5 rounded-md bg-cyber-primary/15 text-cyber-primary text-[11px] font-mono border border-cyber-primary/25"
          >
            {currentKey === ' ' ? '␣' : currentKey.toUpperCase()}
          </motion.span>
        )}
      </div>

      <div className="h-28 rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden p-3 flex items-end gap-1">
        <AnimatePresence>
          {lastEvents.map((event, i) => (
            <motion.div
              key={`${event.timestamp}-${i}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: `${(event.holdDuration / maxHold) * 100}%`, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="flex-1 min-w-[3px] rounded-t-sm relative group"
              style={{
                background: 'linear-gradient(to top, rgba(167,139,250,0.85), rgba(34,211,238,0.6))',
              }}
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-cyber-card px-1.5 py-0.5 rounded text-[10px] font-mono text-cyber-text whitespace-nowrap border border-white/[0.10] z-10">
                {event.key} · {event.holdDuration}ms
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {lastEvents.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-cyber-muted/60 text-xs">Start typing to visualise</p>
          </div>
        )}
      </div>

      {keyEvents.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-cyber-muted">
          <span>
            Keys{' '}
            <span className="text-cyber-text font-medium tabular-nums">
              {keyEvents.length}
            </span>
          </span>
          <span>
            Avg hold{' '}
            <span className="text-cyber-text font-medium tabular-nums">
              {Math.round(keyEvents.reduce((a, e) => a + e.holdDuration, 0) / keyEvents.length)}
              ms
            </span>
          </span>
          <span>
            Duration{' '}
            <span className="text-cyber-text font-medium tabular-nums">
              {(keyEvents[keyEvents.length - 1]?.timestamp / 1000).toFixed(1)}s
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
