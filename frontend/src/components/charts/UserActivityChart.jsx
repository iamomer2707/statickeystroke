import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-cyber-card/95 backdrop-blur-xl border border-white/[0.10] rounded-lg px-3 py-2 shadow-lift">
      <p className="text-[10px] text-cyber-muted mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs font-medium tabular-nums" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export default function UserActivityChart({ data }) {
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#8a8a96', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8a8a96', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            tickLine={false}
          />
          <Tooltip content={<Tip />} cursor={{ stroke: 'rgba(167,139,250,0.3)' }} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          <Line
            type="monotone"
            dataKey="skda"
            stroke="#a78bfa"
            strokeWidth={2}
            dot={{ fill: '#a78bfa', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#a78bfa', stroke: '#fff', strokeWidth: 2 }}
            name="SKDA value"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
