import { motion } from 'framer-motion';

/**
 * Refined aurora background — replaces the previous canvas particle web.
 * Two slow-drifting radial blobs + faint dot grid + noise. Clean, premium, calm.
 */
export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-cyber-black" />

      {/* Drifting violet blob */}
      <motion.div
        aria-hidden
        initial={{ x: '-20%', y: '-10%' }}
        animate={{ x: ['-20%', '10%', '-20%'], y: ['-10%', '8%', '-10%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full opacity-50 blur-[120px]"
        style={{ background: 'radial-gradient(circle at center, rgba(167,139,250,0.45), transparent 60%)' }}
      />

      {/* Drifting cyan blob */}
      <motion.div
        aria-hidden
        initial={{ x: '10%', y: '20%' }}
        animate={{ x: ['10%', '-12%', '10%'], y: ['20%', '5%', '20%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 right-0 w-[55vw] h-[55vw] rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle at center, rgba(34,211,238,0.40), transparent 60%)' }}
      />

      {/* Faint pink accent */}
      <motion.div
        aria-hidden
        initial={{ x: '0%', y: '0%' }}
        animate={{ x: ['0%', '8%', '0%'], y: ['0%', '-6%', '0%'] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] rounded-full opacity-25 blur-[140px]"
        style={{ background: 'radial-gradient(circle at center, rgba(244,114,182,0.30), transparent 60%)' }}
      />

      {/* Dot grid + noise overlays */}
      <div className="absolute inset-0 cyber-grid" />
      <div className="absolute inset-0 bg-noise opacity-60" />

      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,12,0.85) 100%)',
      }} />
    </div>
  );
}
