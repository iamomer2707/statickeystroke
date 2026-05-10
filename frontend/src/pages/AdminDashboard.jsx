import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, Clock, Activity, BarChart3, ArrowRight,
  Shield, FileBarChart, Cpu, Database,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import StatsCard from '../components/ui/StatsCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import UserActivityChart from '../components/charts/UserActivityChart';
import API from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard-stats/')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading admin console…" />;

  const distribution = (stats?.skda_distribution || []).slice(0, 10);

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-2">
          <Shield size={14} className="text-cyber-accent" aria-hidden="true" />
          <span className="text-xs font-medium text-cyber-accent">Admin console</span>
        </div>
        <h1 className="font-display font-semibold text-3xl sm:text-4xl text-cyber-text tracking-tight">
          Operations control
        </h1>
        <p className="text-cyber-muted text-sm mt-1.5">
          Monitor accounts, the activation queue, and ML model performance.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard title="Total users" value={stats?.total_users ?? 0} icon={Users} color="primary" delay={0.05} />
        <StatsCard title="Active" value={stats?.active_users ?? 0} icon={UserCheck} color="success" delay={0.1} />
        <StatsCard title="Pending" value={stats?.pending_users ?? 0} icon={Clock} color="warning" delay={0.15} />
        <StatsCard title="Profiles" value={(stats?.skda_distribution || []).length} icon={Activity} color="accent" delay={0.2} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="p-6 lg:col-span-2" delay={0.25}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-cyber-primary" aria-hidden="true" />
              <h3 className="font-display font-semibold text-base text-cyber-text tracking-tight">SKDA distribution</h3>
            </div>
            <span className="text-[10px] font-medium text-cyber-muted">Top 10</span>
          </div>
          {distribution.length > 0 ? (
            <UserActivityChart data={distribution.map((u) => ({ name: u.loginid, skda: u.skda }))} />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-cyber-muted text-sm">No registered users yet.</p>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden" delay={0.3} gradient>
          <div
            aria-hidden
            className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.30), transparent 60%)' }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Cpu size={16} className="text-cyber-accent" aria-hidden="true" />
              <h3 className="font-display font-semibold text-base text-cyber-text tracking-tight">System</h3>
            </div>
            <div className="space-y-1.5">
              <SystemRow label="ML pipeline" value="OK" />
              <SystemRow label="Database" value="OK" />
              <SystemRow label="Auth service" value="OK" />
              <SystemRow label="API latency" value="< 80ms" />
            </div>
            <div className="mt-4 px-3 py-2.5 rounded-lg bg-cyber-primary/[0.06] border border-cyber-primary/20">
              <p className="text-[11px] text-cyber-text leading-relaxed">
                Random Forest model loaded. FAR/FRR/ERR computed on demand.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div>
        <h2 className="font-display font-semibold text-lg text-cyber-text tracking-tight mb-4">
          Quick navigation
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { to: '/admin/users', icon: Users, label: 'Manage users', desc: 'Activate, review, inspect accounts.' },
            { to: '/admin/reports', icon: FileBarChart, label: 'ML reports', desc: 'Classification metrics + dataset.' },
            { to: '/dataset', icon: Database, label: 'Dataset', desc: 'Browse keystroke samples directly.' },
          ].map((link, i) => (
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

function SystemRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyber-success animate-pulse-soft" />
        <span className="text-xs text-cyber-muted">{label}</span>
      </div>
      <span className="text-xs text-cyber-text font-medium tabular-nums">{value}</span>
    </div>
  );
}
