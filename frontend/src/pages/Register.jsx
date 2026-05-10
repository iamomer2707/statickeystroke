import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, User, Lock, Mail, Phone, MapPin,
  Building, Map, ArrowRight, ChevronLeft,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useKeystrokeDynamics } from '../hooks/useKeystrokeDynamics';
import GlassCard from '../components/ui/GlassCard';
import CyberInput from '../components/ui/CyberInput';
import NeonButton from '../components/ui/NeonButton';
import KeystrokeVisualizer from '../components/keystroke/KeystrokeVisualizer';
import TypingHeatmap from '../components/keystroke/TypingHeatmap';
import KeystrokeWaveform from '../components/keystroke/KeystrokeWaveform';
import ParticleBackground from '../components/layout/ParticleBackground';
import Navbar from '../components/layout/Navbar';
import API from '../api/axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', loginid: '', password: '', email: '', mobile: '',
    locality: '', address: '', city: '', state: '',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const toast = useToast();
  const navigate = useNavigate();
  const keystroke = useKeystrokeDynamics();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.loginid || !formData.email || !formData.mobile) {
        toast.error('Please fill in all required fields');
        return;
      }
      setStep(2);
      return;
    }
    if (!formData.password) {
      toast.error('Please type a password');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/register/', {
        ...formData,
        skda: String(keystroke.totalDuration),
      });
      if (res.data.success) {
        toast.success('Registered. Wait for admin activation.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-10">
          <p className="text-xs font-medium text-cyber-primary uppercase tracking-widest mb-2">
            Create your account
          </p>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-cyber-text tracking-tight">
            Two minutes. One typing pattern.
          </h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[
            { n: 1, label: 'Personal info' },
            { n: 2, label: 'Capture rhythm' },
          ].map((s, i, arr) => {
            const isDone = step > s.n;
            const isActive = step === s.n;
            return (
              <div key={s.n} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-semibold text-xs border transition-colors ${
                      isActive
                        ? 'bg-cyber-primary text-cyber-black border-cyber-primary'
                        : isDone
                          ? 'bg-cyber-primary/10 text-cyber-primary border-cyber-primary/30'
                          : 'bg-white/[0.04] text-cyber-muted border-white/[0.10]'
                    }`}
                  >
                    {s.n}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      isActive || isDone ? 'text-cyber-text' : 'text-cyber-muted'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div
                    className={`w-12 h-px transition-colors ${
                      step > s.n ? 'bg-cyber-primary' : 'bg-white/[0.10]'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <GlassCard className="p-7" gradient>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-cyber-primary/10 border border-cyber-primary/25 flex items-center justify-center">
                    <UserPlus size={18} className="text-cyber-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-cyber-text tracking-tight">
                      {step === 1 ? 'Tell us about you' : 'Set your password'}
                    </h2>
                    <p className="text-xs text-cyber-muted">
                      {step === 1
                        ? 'Basics first — we\'ll capture your typing pattern next.'
                        : 'Type naturally — your rhythm becomes your second factor.'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {step === 1 ? (
                    <>
                      <CyberInput label="Full name" icon={User} placeholder="John Doe" value={formData.name} onChange={handleChange('name')} required />
                      <CyberInput label="Login ID" icon={User} placeholder="johndoe123" value={formData.loginid} onChange={handleChange('loginid')} required />
                      <CyberInput label="Email" type="email" icon={Mail} placeholder="john@example.com" value={formData.email} onChange={handleChange('email')} required />
                      <CyberInput label="Mobile" icon={Phone} placeholder="+1 234 567 890" value={formData.mobile} onChange={handleChange('mobile')} required />
                      <div className="grid grid-cols-2 gap-3">
                        <CyberInput label="City" icon={Building} placeholder="New York" value={formData.city} onChange={handleChange('city')} />
                        <CyberInput label="State" icon={Map} placeholder="NY" value={formData.state} onChange={handleChange('state')} />
                      </div>
                      <CyberInput label="Locality" icon={MapPin} placeholder="Downtown" value={formData.locality} onChange={handleChange('locality')} />
                    </>
                  ) : (
                    <>
                      <div className="px-3.5 py-3 rounded-lg bg-cyber-primary/[0.06] border border-cyber-primary/20">
                        <p className="text-xs text-cyber-text leading-relaxed">
                          Type your password as you naturally would.
                          The pauses between keys are recorded as your signature.
                        </p>
                      </div>
                      <CyberInput
                        label="Password"
                        type="password"
                        icon={Lock}
                        placeholder="Type naturally…"
                        value={formData.password}
                        onChange={handleChange('password')}
                        onKeyDown={keystroke.handleKeyDown}
                        onKeyUp={keystroke.handleKeyUp}
                        hint="Pattern is captured as you type."
                        required
                      />
                      <CyberInput label="Address" icon={MapPin} placeholder="Full address" value={formData.address} onChange={handleChange('address')} />
                    </>
                  )}

                  <div className="flex gap-2 pt-2">
                    {step === 2 && (
                      <NeonButton variant="secondary" size="lg" onClick={() => setStep(1)} type="button" icon={ChevronLeft}>
                        Back
                      </NeonButton>
                    )}
                    <NeonButton
                      type="submit"
                      fullWidth
                      size="lg"
                      loading={loading}
                      variant="primary"
                      iconRight={step === 1 ? ArrowRight : undefined}
                      icon={step === 2 ? UserPlus : undefined}
                    >
                      {step === 1 ? 'Next' : loading ? 'Creating account…' : 'Create account'}
                    </NeonButton>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-xs text-cyber-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-cyber-primary hover:text-cyber-text transition-colors font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </GlassCard>

          <div className="space-y-4">
            <GlassCard className="p-5">
              <KeystrokeVisualizer
                keyEvents={keystroke.keyEvents}
                isTyping={keystroke.isTyping}
                currentKey={keystroke.currentKey}
              />
            </GlassCard>
            <GlassCard className="p-5">
              <KeystrokeWaveform waveformData={keystroke.waveformData} />
            </GlassCard>
            <GlassCard className="p-5">
              <TypingHeatmap heatmapData={keystroke.heatmapData} />
            </GlassCard>
            {keystroke.getStats() && (
              <GlassCard className="p-5">
                <p className="text-xs font-medium text-cyber-muted mb-3">Live stats</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Keys', value: keystroke.getStats().totalKeys },
                    { label: 'Avg hold', value: `${Math.round(keystroke.getStats().avgHoldTime)}ms` },
                    { label: 'Avg flight', value: `${Math.round(keystroke.getStats().avgFlightTime)}ms` },
                    { label: 'WPM', value: keystroke.getStats().wpm },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2">
                      <p className="text-[10px] text-cyber-muted uppercase tracking-wider">{s.label}</p>
                      <p className="text-lg font-display font-semibold text-cyber-text tabular-nums tracking-tight">
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
