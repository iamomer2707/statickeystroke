import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Search, CheckCircle2, XCircle, Mail, Phone, MapPin,
  RefreshCcw, Shield,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import API from '../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const toast = useToast();

  const load = () => {
    setLoading(true);
    API.get('/users/')
      .then((res) => setUsers(res.data.users || []))
      .catch((err) => toast.error(err.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    let list = users;
    if (filter === 'active') list = list.filter((u) => u.status === 'activated');
    else if (filter === 'pending') list = list.filter((u) => u.status !== 'activated');
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((u) =>
        [u.name, u.loginid, u.email, u.mobile, u.city].some((v) =>
          String(v || '').toLowerCase().includes(q),
        ),
      );
    }
    return list;
  }, [users, query, filter]);

  const setUserStatus = async (id, activate) => {
    try {
      const endpoint = activate ? '/activate-user/' : '/deactivate-user/';
      const res = await API.post(endpoint, { user_id: id });
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: activate ? 'activated' : 'waiting' } : u,
          ),
        );
      }
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-2">
          <Users size={14} className="text-cyber-primary" aria-hidden="true" />
          <span className="text-xs font-medium text-cyber-primary">User management</span>
        </div>
        <h1 className="font-display font-semibold text-3xl sm:text-4xl text-cyber-text tracking-tight">
          Registered users
        </h1>
        <p className="text-cyber-muted text-sm mt-1.5">
          Activate accounts, review profiles, and monitor the registration queue.
        </p>
      </motion.div>

      <GlassCard className="p-5">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between mb-5">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, login, email…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] focus:border-cyber-primary/50 outline-none text-cyber-text placeholder-cyber-muted/60 text-sm transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex rounded-lg bg-white/[0.03] border border-white/[0.08] p-0.5">
              {[
                { key: 'all', label: 'All' },
                { key: 'active', label: 'Active' },
                { key: 'pending', label: 'Pending' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    filter === f.key
                      ? 'bg-white/[0.08] text-cyber-text'
                      : 'text-cyber-muted hover:text-cyber-text'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <NeonButton size="md" variant="secondary" icon={RefreshCcw} onClick={load}>
              Refresh
            </NeonButton>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading users…" />
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-cyber-muted text-sm">No users match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((u, i) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.025, 0.4) }}
                className="relative p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.05] transition-colors"
              >
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    u.status === 'activated'
                      ? 'bg-cyber-success/10 text-cyber-success border-cyber-success/30'
                      : 'bg-cyber-warning/10 text-cyber-warning border-cyber-warning/30'
                  }`}>
                    {u.status === 'activated' ? 'Active' : 'Pending'}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyber-primary/10 border border-cyber-primary/25 flex items-center justify-center">
                    <span className="font-display font-semibold text-cyber-primary">
                      {u.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-cyber-text truncate">{u.name}</p>
                    <p className="text-[11px] text-cyber-muted truncate">@{u.loginid}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-cyber-muted">
                  <Row icon={Mail} value={u.email} />
                  <Row icon={Phone} value={u.mobile} />
                  <Row icon={MapPin} value={[u.city, u.state].filter(Boolean).join(', ') || '—'} />
                  <Row icon={Shield} value={`SKDA: ${u.skda || 0}ms`} />
                </div>

                <div className="mt-4">
                  {u.status === 'activated' ? (
                    <NeonButton fullWidth size="sm" variant="danger" icon={XCircle} onClick={() => setUserStatus(u.id, false)}>
                      Deactivate
                    </NeonButton>
                  ) : (
                    <NeonButton fullWidth size="sm" variant="success" icon={CheckCircle2} onClick={() => setUserStatus(u.id, true)}>
                      Activate
                    </NeonButton>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function Row({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={11} className="text-cyber-muted shrink-0" aria-hidden="true" />
      <span className="truncate">{value}</span>
    </div>
  );
}
