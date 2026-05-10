import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  Shield, Fingerprint, Brain, Lock, ArrowRight, Zap,
  Eye, KeyRound, ChevronDown, Sparkles,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import ParticleBackground from '../components/layout/ParticleBackground';
import Navbar from '../components/layout/Navbar';

const features = [
  {
    icon: Fingerprint,
    title: 'Biometric typing',
    description: 'Your unique typing rhythm becomes a second factor — invisible, frictionless, hard to forge.',
  },
  {
    icon: Brain,
    title: 'ML-powered analysis',
    description: 'A Random Forest classifier studies hold time, flight time, and rhythm to verify identity.',
  },
  {
    icon: Lock,
    title: 'Password-shadow protection',
    description: 'Even with your password, an impostor still has to type it like you. They can\'t.',
  },
  {
    icon: Zap,
    title: 'Real-time capture',
    description: 'Millisecond-precision keystroke timing — visualised live as you type.',
  },
];

const stats = [
  { value: '300', unit: 'ms', label: 'Tolerance window' },
  { value: '< 0.1', unit: '%', label: 'False acceptance' },
  { value: 'RF', unit: '', label: 'Classifier model' },
  { value: '99.2', unit: '%', label: 'Accuracy' },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />

      {/* Hero */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-5xl mx-auto text-center pt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.10] mb-8"
          >
            <Sparkles size={12} className="text-cyber-primary" />
            <span className="text-xs font-medium text-cyber-text">
              Keystroke biometrics · Live ML classifier
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-semibold text-5xl sm:text-6xl lg:text-7xl mb-6 leading-[1.05] tracking-tightest text-cyber-text"
          >
            Your typing rhythm is{' '}
            <span className="text-gradient-full">a password</span>
            <br />
            no one else can replicate.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-lg text-cyber-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            SKDA captures the milliseconds between every keystroke and trains a Random
            Forest classifier on your unique signature — a second factor that travels
            silently with everything you type.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          >
            <Link to="/register">
              <NeonButton size="lg" icon={KeyRound} iconRight={ArrowRight}>
                Get started
              </NeonButton>
            </Link>
            <Link to="/login">
              <NeonButton size="lg" variant="secondary" icon={Eye}>
                Sign in
              </NeonButton>
            </Link>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={item}
                className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-4 text-left hover:border-white/[0.15] transition-colors"
              >
                <p className="text-3xl font-display font-semibold text-cyber-text tracking-tight tabular-nums">
                  {s.value}
                  <span className="text-cyber-muted text-base font-medium ml-0.5">{s.unit}</span>
                </p>
                <p className="text-[11px] text-cyber-muted mt-1">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex justify-center"
          >
            <ChevronDown size={20} className="text-cyber-muted animate-float" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center mb-16"
          >
            <p className="text-xs font-medium text-cyber-primary uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="font-display font-semibold text-4xl sm:text-5xl text-cyber-text tracking-tight mb-4">
              Built for the way you type, not what you type.
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={item}>
                <GlassCard className="p-7 h-full" hover>
                  <div className="w-11 h-11 rounded-xl bg-cyber-primary/10 border border-cyber-primary/20 flex items-center justify-center mb-5">
                    <f.icon size={20} className="text-cyber-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-cyber-text tracking-tight mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-cyber-muted leading-relaxed">
                    {f.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium text-cyber-primary uppercase tracking-widest mb-3">
              Three steps
            </p>
            <h2 className="font-display font-semibold text-4xl text-cyber-text tracking-tight">
              From sign-up to verified.
            </h2>
          </motion.div>

          <div className="space-y-3">
            {[
              { step: '01', title: 'Register and type', desc: 'Create your account. As you type your password, every press and release is timed to the millisecond.', icon: KeyRound },
              { step: '02', title: 'Pattern analysis', desc: 'Hold duration, flight time, and rhythm are fed into a Random Forest classifier to build your biometric profile.', icon: Brain },
              { step: '03', title: 'Continuous verification', desc: 'When you change your password, the system recomputes your signature and confirms the match within a 300 ms window.', icon: Shield },
            ].map((it, i) => (
              <motion.div
                key={it.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <GlassCard className="p-6 flex items-start gap-5" hover>
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.10] flex items-center justify-center">
                    <span className="font-display text-sm font-semibold text-cyber-primary tabular-nums">
                      {it.step}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg text-cyber-text tracking-tight mb-1.5">
                      {it.title}
                    </h3>
                    <p className="text-sm text-cyber-muted leading-relaxed">
                      {it.desc}
                    </p>
                  </div>
                  <it.icon size={18} className="text-cyber-muted hidden sm:block shrink-0 mt-1" aria-hidden="true" />
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <GlassCard className="p-10 text-center relative overflow-hidden" gradient>
            <div
              aria-hidden
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  'radial-gradient(circle at 50% 0%, rgba(167,139,250,0.25), transparent 70%)',
              }}
            />
            <div className="relative">
              <h3 className="font-display font-semibold text-3xl sm:text-4xl text-cyber-text tracking-tight mb-3">
                Try it. Type once.
              </h3>
              <p className="text-cyber-muted mb-8 max-w-md mx-auto">
                Two minutes to register. One keystroke pattern. Forever your second factor.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link to="/register">
                  <NeonButton size="lg" icon={KeyRound} iconRight={ArrowRight}>
                    Create my profile
                  </NeonButton>
                </Link>
                <Link to="/login">
                  <NeonButton size="lg" variant="ghost">
                    I have an account
                  </NeonButton>
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-cyber-primary" aria-hidden="true" />
            <span className="text-xs text-cyber-muted">
              SKDA v2.0 · Keystroke dynamic authentication
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/login" className="text-xs text-cyber-muted hover:text-cyber-text transition-colors">Sign in</Link>
            <Link to="/register" className="text-xs text-cyber-muted hover:text-cyber-text transition-colors">Register</Link>
            <Link to="/admin-login" className="text-xs text-cyber-muted hover:text-cyber-text transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
