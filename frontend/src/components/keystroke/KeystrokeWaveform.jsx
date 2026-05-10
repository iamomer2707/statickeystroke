import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-cyber-card/95 backdrop-blur-xl border border-white/[0.10] rounded-lg px-3 py-2 shadow-lift">
      <p className="text-[10px] text-cyber-muted mb-1">Event #{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs font-medium" style={{ color: entry.color }}>
          {entry.name}: <span className="font-mono tabular-nums">{Math.round(entry.value)}ms</span>
        </p>
      ))}
    </div>
  );
};

export default function KeystrokeWaveform({ waveformData }) {
  const data = waveformData.map((d, i) => ({ index: i + 1, ...d }));

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-cyber-muted">Waveform</p>
      <div className="h-44 rounded-xl bg-white/[0.02] border border-white/[0.06] p-2.5">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="holdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="flightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="index"
                tick={{ fill: '#8a8a96', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#8a8a96', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="hold" stroke="#a78bfa" fill="url(#holdGrad)" strokeWidth={2} name="Hold" dot={false} />
              <Area type="monotone" dataKey="flight" stroke="#22d3ee" fill="url(#flightGrad)" strokeWidth={2} name="Flight" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-cyber-muted/60 text-xs">No data yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
