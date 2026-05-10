import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KeyRound, Lock, Shield, ShieldAlert, ShieldCheck,
  ArrowRight, RefreshCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useKeystrokeDynamics } from '../hooks/useKeystrokeDynamics';
import GlassCard from '../components/ui/GlassCard';
import CyberInput from '../components/ui/CyberInput';
import NeonButton from '../components/ui/NeonButton';
import KeystrokeVisualizer from '../components/keystroke/KeystrokeVisualizer';
import KeystrokeWaveform from '../components/keystroke/KeystrokeWaveform';
import API from '../api/axios';

export default function ChangePassword() {
  const { user } = useAuth();
  const toast = useToast();
  const keystroke = useKeystrokeDynamics();

  const [form, setForm] = useState({ current: '', next: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.current || !form.next) {
      toast.error('Both passwords are required');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await API.post('/change-password/', {
        loginid: user.loginid,
        current_password: form.current,
        new_password: form.next,
        skda: String(keystroke.totalDuration),
      });
      setResult({ success: true, ...res.data });
      toast.success('Password updated. Pattern verified.');
    } catch (err) {
      setResult({ success: false, message: err.message || 'Verification failed' });
      toast.error(err.message || 'Pattern mismatch');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm({ current: '', next: '' });
    setResult(null);
    keystroke.reset();
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-2">
          <KeyRound size={14} className="text-cyber-primary" aria-hidden="true" />
          <span className="text-xs font-medium text-cyber-primary">
            Biometric password update
          </span>
        </div>
        <h1 className="font-display font-semibold text-3xl sm:text-4xl text-cyber-text tracking-tight">
          Change password
        </h1>
        <p className="text-cyber-muted text-sm mt-1.5 max-w-2xl">
          The new password is accepted only if your typing rhythm matches your stored
          profile within the 300 ms tolerance window.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-5">
        <GlassCard className="p-7" gradient>
          <form onSubmit={handleSubmit} className="space-y-4">
            <CyberInput
              label="Current password"
              type="password"
              icon={Lock}
              placeholder="Enter your current password"
              value={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.value })}
              required
            />
            <div className="px-3.5 py-3 rounded-lg bg-cyber-primary/[0.06] border border-cyber-primary/20">
              <p className="text-xs text-cyber-text leading-relaxed">
                Type the new password naturally. Your rhythm — not just the
                characters — is what gets verified.
              </p>
            </div>
            <CyberInput
              label="New password"
              type="password"
              icon={KeyRound}
              placeholder="Type your new password naturally…"
              value={form.next}
              onChange={(e) => setForm({ ...form, next: e.target.value })}
              onKeyDown={keystroke.handleKeyDown}
              onKeyUp={keystroke.handleKeyUp}
              hint="Pattern is captured as you type."
              required
            />

            <div className="flex gap-2 pt-2">
              <NeonButton
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                variant="primary"
                icon={Shield}
                iconRight={ArrowRight}
              >
                {loading ? 'Verifying pattern…' : 'Verify and update'}
              </NeonButton>
              <NeonButton type="button" size="lg" variant="secondary" icon={RefreshCcw} onClick={reset}>
                Reset
              </NeonButton>
            </div>
          </form>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-5 p-4 rounded-xl border ${
                  result.success
                    ? 'bg-cyber-success/[0.06] border-cyber-success/30'
                    : 'bg-cyber-danger/[0.06] border-cyber-danger/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <ShieldCheck size={16} className="text-cyber-success" />
                  ) : (
                    <ShieldAlert size={16} className="text-cyber-danger" />
                  )}
                  <p className={`text-sm font-medium ${
                    result.success ? 'text-cyber-success' : 'text-cyber-danger'
                  }`}>
                    {result.success ? 'Pattern verified' : 'Pattern mismatch'}
                  </p>
                </div>
                <p className="text-xs text-cyber-muted">{result.message}</p>
                {typeof result.difference !== 'undefined' && (
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                    <Stat label="Stored" value={`${result.stored_skda}ms`} />
                    <Stat label="Captured" value={`${result.new_skda}ms`} />
                    <Stat label="Δ" value={`${result.difference}ms`} highlight={!result.success} />
                  </div>
                )}
              </motion.div>
            )}
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
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className={`px-2.5 py-2 rounded-lg border ${
      highlight
        ? 'border-cyber-danger/30 bg-cyber-danger/[0.05]'
        : 'border-white/[0.08] bg-white/[0.03]'
    }`}>
      <p className="text-cyber-muted">{label}</p>
      <p className={`font-semibold tabular-nums ${
        highlight ? 'text-cyber-danger' : 'text-cyber-text'
      }`}>
        {value}
      </p>
    </div>
  );
}
