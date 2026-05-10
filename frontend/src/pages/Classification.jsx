import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, ShieldOff, Activity, RefreshCcw, Award } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import StatsCard from '../components/ui/StatsCard';
import NeonButton from '../components/ui/NeonButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  MetricsBarChart, MetricsRadarChart, ClassificationTable,
} from '../components/charts/MetricsChart';
import { useToast } from '../context/ToastContext';
import API from '../api/axios';

export default function Classification() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    API.get('/classification/')
      .then((res) => setData(res.data))
      .catch((err) => toast.error(err.message || 'Could not run classification'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <LoadingSpinner text="Running Random Forest…" />;
  if (!data?.classification_report) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-cyber-muted">No classification data available.</p>
        <NeonButton variant="primary" icon={RefreshCcw} onClick={load} className="mt-4">
          Retry
        </NeonButton>
      </GlassCard>
    );
  }

  const accuracy = data.classification_report.accuracy ?? 0;
  const macroAvg = data.classification_report['macro avg'] || {};

  const radarData = [
    { metric: 'Precision', value: Math.round((macroAvg.precision || 0) * 100) },
    { metric: 'Recall', value: Math.round((macroAvg.recall || 0) * 100) },
    { metric: 'F1', value: Math.round((macroAvg['f1-score'] || 0) * 100) },
    { metric: 'Accuracy', value: Math.round(accuracy * 100) },
    { metric: '1 - FAR', value: Math.max(0, Math.round((1 - (data.FAR || 0)) * 100)) },
    { metric: '1 - FRR', value: Math.max(0, Math.round((1 - (data.FRR || 0)) * 100)) },
  ];

  const barData = [
    { name: 'FAR', value: parseFloat(((data.FAR || 0) * 100).toFixed(2)) },
    { name: 'FRR', value: parseFloat(((data.FRR || 0) * 100).toFixed(2)) },
    { name: 'ERR', value: parseFloat(((data.ERR || 0) * 100).toFixed(2)) },
    { name: 'Accuracy', value: parseFloat((accuracy * 100).toFixed(2)) },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} className="text-cyber-accent" aria-hidden="true" />
            <span className="text-xs font-medium text-cyber-accent">
              ML classification engine
            </span>
          </div>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-cyber-text tracking-tight">
            Random Forest
          </h1>
          <p className="text-cyber-muted text-sm mt-1.5 max-w-2xl">
            Live evaluation of the keystroke classifier — FAR, FRR, EER, and per-class precision/recall.
          </p>
        </div>
        <NeonButton variant="secondary" icon={RefreshCcw} onClick={load}>
          Re-run
        </NeonButton>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard title="Accuracy" value={`${(accuracy * 100).toFixed(1)}%`} subtitle="Overall correctness" icon={Award} color="success" delay={0.05} />
        <StatsCard title="FAR" value={`${((data.FAR || 0) * 100).toFixed(2)}%`} subtitle="False acceptance" icon={Target} color="warning" delay={0.1} />
        <StatsCard title="FRR" value={`${((data.FRR || 0) * 100).toFixed(2)}%`} subtitle="False rejection" icon={ShieldOff} color="accent" delay={0.15} />
        <StatsCard title="ERR" value={`${((data.ERR || 0) * 100).toFixed(2)}%`} subtitle="Equal error rate" icon={Activity} color="secondary" delay={0.2} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <h3 className="font-display font-semibold text-base text-cyber-text tracking-tight mb-4">
            Performance metrics
          </h3>
          <MetricsBarChart data={barData} />
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="font-display font-semibold text-base text-cyber-text tracking-tight mb-4">
            Quality radar
          </h3>
          <MetricsRadarChart data={radarData} />
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <h3 className="font-display font-semibold text-base text-cyber-text tracking-tight mb-4">
          Per-class report
        </h3>
        <ClassificationTable report={data.classification_report} />
      </GlassCard>
    </div>
  );
}
