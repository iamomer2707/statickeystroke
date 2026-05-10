import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Shield, KeyRound, Database, BarChart3, ArrowRight,
  Fingerprint, Clock, CheckCircle2, AlertCircle, Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import StatsCard from '../components/ui/StatsCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import API from '../api/axios';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard-stats/')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading your dashboard…" />;

  const skdaValue = parseInt(user?.skda || 0, 10);
  const isStrong = skdaValue > 0;

  const quickLinks = [
    { to: '/change-password', icon: KeyRound, label: 'Change password', desc: 'Verify your typing pattern.' },
    { to: '/dataset', icon: Database, label: 'View dataset', desc: 'Inspect raw keystroke data.' },
    { to: '/classification', icon: BarChart3, label: 'ML classification', desc: 'See FAR / FRR / EER metrics.' },
  ];

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-success animate-pulse-soft" />
          <span className="text-xs font-medium text-cyber-success">
            Authenticated session
          </span>
        </div>
        <h1 className="font-display font-semibold text-3xl sm:text-4xl text-cyber-text tracking-tight">
          Welcome, <span className="text-gradient">{user?.name}</span>
        </h1>
        <p className="text-cyber-muted text-sm mt-1.5">
          Your biometric profile is active. Login ID:{' '}
          <span className="text-cyber-text font-medium">{user?.loginid}</span>
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard title="SKDA profile" value={isStrong ? `${skdaValue}ms` : '—'} subtitle="Stored typing duration" icon={Fingerprint} color="primary" delay={0.05} />
        <StatsCard title="Account" value="Active" subtitle="Verified by admin" icon={CheckCircle2} color="success" delay={0.1} />
        <StatsCard title="Tolerance" value="±300ms" subtitle="Match window" icon={Clock} color="secondary" delay={0.15} />
        <StatsCard title="Network" value={stats?.total_users ?? '—'} subtitle={`${stats?.active_users ?? 0} active`} icon={Activity} color="accent" delay={0.2} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="p-6 lg:col-span-2" delay={0.25}>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-cyber-primary" aria-hidden="true" />
            <h3 className="font-display font-semibold text-base text-cyber-text tracking-tight">Profile snapshot</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {[
              ['Name', user?.name],
              ['Login ID', user?.loginid],
              ['Email', user?.email],
              ['Mobile', user?.mobile],
              ['Status', user?.status],
              ['SKDA', `${skdaValue}ms`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3 py-2.5 border-b border-white/[0.06] last:border-0">
                <span className="text-cyber-muted text-xs">{k}</span>
                <span className="text-cyber-text text-xs font-medium truncate max-w-[60%]" title={v}>{v}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden" delay={0.3} gradient>
          <div
            aria-hidden
            className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.4), transparent 60%)' }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-cyber-warning" aria-hidden="true" />
              <h3 className="font-display font-semibold text-base text-cyber-text tracking-tight">Security posture</h3>
            </div>
            <div className="space-y-3.5">
              <SecurityBar label="Biometric profile" pct={isStrong ? 95 : 0} />
              <SecurityBar label="Account verified" pct={user?.status === 'activated' ? 100 : 30} />
              <SecurityBar label="Pattern strength" pct={Math.min(95, Math.max(40, Math.round((skdaValue % 1500) / 15)))} />
            </div>
            {!isStrong && (
              <div className="mt-4 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-cyber-warning/[0.06] border border-cyber-warning/20">
                <AlertCircle size={13} className="text-cyber-warning shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[11px] text-cyber-text leading-relaxed">
                  No typing pattern recorded yet. Update your password to strengthen your profile.
                </p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      <div>
        <h2 className="font-display font-semibold text-lg text-cyber-text tracking-tight mb-4">
          Quick actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link, i) => (
            <Link key={link.to} to={link.to}>
              <GlassCard className="p-5 group cursor-pointer h-full" delay={0.35 + i * 0.05}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyber-primary/10 border border-cyber-primary/20 flex items-center justify-center">
                    <link.icon size={18} className="text-cyber-primary" aria-hidden="true" />
                  </div>
                  <ArrowRight size={16} className="text-cyber-muted group-hover:text-cyber-text group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                </div>
                <h3 className="font-display font-semibold text-sm text-cyber-text tracking-tight mb-0.5">{link.label}</h3>
                <p className="text-xs text-cyber-muted leading-relaxed">{link.desc}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecurityBar({ label, pct }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-cyber-muted">{label}</span>
        <span className="text-cyber-text font-medium tabular-nums">{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-cyber-primary"
        />
      </div>
    </div>
  );
}
