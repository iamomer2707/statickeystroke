import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-cyber-card/95 backdrop-blur-xl border border-white/[0.10] rounded-lg px-3 py-2 shadow-lift">
      <p className="text-[10px] text-cyber-muted mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="text-xs font-medium tabular-nums"
          style={{ color: entry.color || entry.fill }}
        >
          {entry.name}:{' '}
          {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}%
        </p>
      ))}
    </div>
  );
};

const COLORS = ['#a78bfa', '#22d3ee', '#f472b6', '#34d399', '#fbbf24'];

export function MetricsBarChart({ data }) {
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="22%">
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#8a8a96', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8a8a96', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            tickLine={false}
          />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<Tip />} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MetricsRadarChart({ data }) {
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: '#8a8a96', fontSize: 10 }} />
          <PolarRadiusAxis tick={{ fill: '#8a8a96', fontSize: 9 }} stroke="rgba(255,255,255,0.06)" />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#a78bfa"
            fill="#a78bfa"
            fillOpacity={0.18}
            strokeWidth={1.5}
          />
          <Tooltip content={<Tip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ClassificationTable({ report }) {
  if (!report) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/[0.08]">
            <th className="text-left py-2.5 px-3 text-cyber-muted text-[10px] font-medium uppercase tracking-widest">Class</th>
            <th className="text-right py-2.5 px-3 text-cyber-primary text-[10px] font-medium uppercase tracking-widest">Precision</th>
            <th className="text-right py-2.5 px-3 text-cyber-secondary text-[10px] font-medium uppercase tracking-widest">Recall</th>
            <th className="text-right py-2.5 px-3 text-cyber-accent text-[10px] font-medium uppercase tracking-widest">F1</th>
            <th className="text-right py-2.5 px-3 text-cyber-success text-[10px] font-medium uppercase tracking-widest">Support</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(report)
            .filter(([key]) => !['accuracy', 'macro avg', 'weighted avg'].includes(key))
            .map(([cls, metrics]) => (
              <tr key={cls} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="py-2 px-3 text-cyber-text font-medium">{cls}</td>
                <td className="text-right py-2 px-3 text-cyber-primary tabular-nums">
                  {(metrics.precision * 100).toFixed(1)}%
                </td>
                <td className="text-right py-2 px-3 text-cyber-secondary tabular-nums">
                  {(metrics.recall * 100).toFixed(1)}%
                </td>
                <td className="text-right py-2 px-3 text-cyber-accent tabular-nums">
                  {(metrics['f1-score'] * 100).toFixed(1)}%
                </td>
                <td className="text-right py-2 px-3 text-cyber-success tabular-nums">
                  {metrics.support}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
