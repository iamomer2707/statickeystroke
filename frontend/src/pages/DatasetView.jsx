import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Download, RefreshCcw } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatsCard from '../components/ui/StatsCard';
import { useToast } from '../context/ToastContext';
import API from '../api/axios';

export default function DatasetView() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const toast = useToast();

  const load = () => {
    setLoading(true);
    API.get('/dataset/')
      .then((res) => {
        setColumns(res.data.columns || []);
        setRows(res.data.data || []);
        setTotal(res.data.total_rows || 0);
      })
      .catch((err) => toast.error(err.message || 'Could not load dataset'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [rows, query]);

  const downloadCSV = () => {
    if (!filtered.length) return;
    const header = columns.join(',');
    const body = filtered
      .map((r) => columns.map((c) => JSON.stringify(r[c] ?? '')).join(','))
      .join('\n');
    const blob = new Blob([`${header}\n${body}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keystroke-dataset.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Dataset exported');
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-2">
          <Database size={14} className="text-cyber-secondary" aria-hidden="true" />
          <span className="text-xs font-medium text-cyber-secondary">
            Raw keystroke dataset
          </span>
        </div>
        <h1 className="font-display font-semibold text-3xl sm:text-4xl text-cyber-text tracking-tight">
          Keystroke dataset
        </h1>
        <p className="text-cyber-muted text-sm mt-1.5">
          Browse the raw timing samples used to train the Random Forest classifier.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-3">
        <StatsCard title="Total rows" value={total.toLocaleString()} icon={Database} color="primary" delay={0.05} />
        <StatsCard title="Columns" value={columns.length} icon={Search} color="secondary" delay={0.1} />
        <StatsCard title="Showing" value={`${filtered.length}/${rows.length}`} icon={Search} color="accent" delay={0.15} />
      </div>

      <GlassCard className="p-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all columns…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] focus:border-cyber-primary/50 outline-none text-cyber-text placeholder-cyber-muted/60 text-sm transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <NeonButton size="md" variant="secondary" icon={RefreshCcw} onClick={load}>
              Refresh
            </NeonButton>
            <NeonButton size="md" variant="primary" icon={Download} onClick={downloadCSV}>
              Export
            </NeonButton>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Streaming dataset…" />
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-cyber-muted text-sm">No data to display.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
            <table className="w-full text-xs">
              <thead className="bg-white/[0.03] sticky top-0">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="text-left py-2.5 px-4 text-cyber-muted text-[10px] font-medium uppercase tracking-widest border-b border-white/[0.06]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 200).map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={col} className="py-2 px-4 text-cyber-text whitespace-nowrap font-mono tabular-nums">
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 200 && (
              <p className="text-center text-[11px] text-cyber-muted py-3 bg-white/[0.02]">
                Showing first 200 rows of {filtered.length} matches.
              </p>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
