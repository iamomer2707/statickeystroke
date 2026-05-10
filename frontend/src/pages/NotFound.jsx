import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import NeonButton from '../components/ui/NeonButton';
import ParticleBackground from '../components/layout/ParticleBackground';

export default function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <ParticleBackground />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10 max-w-lg"
      >
        <h1 className="text-7xl sm:text-9xl font-display font-semibold text-gradient-full tracking-tightest mb-4">
          404
        </h1>
        <h2 className="font-display font-semibold text-xl text-cyber-text tracking-tight mb-3">
          Lost the signal.
        </h2>
        <p className="text-cyber-muted text-sm mb-8 leading-relaxed">
          The route you&apos;re looking for doesn&apos;t exist or has moved. Head back to base.
        </p>

        <Link to="/">
          <NeonButton size="lg" variant="primary" icon={Home}>
            Return home
          </NeonButton>
        </Link>
      </motion.div>
    </div>
  );
}
