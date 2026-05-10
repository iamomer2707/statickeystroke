import { motion } from 'framer-motion';
import clsx from 'clsx';

const keyboardRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export default function TypingHeatmap({ heatmapData }) {
  const maxCount = Math.max(...Object.values(heatmapData).map((d) => d.count), 1);

  const heatColor = (key) => {
    const data = heatmapData[key];
    if (!data) return 'rgba(255,255,255,0.03)';
    const intensity = data.count / maxCount;
    if (intensity > 0.7) return `rgba(244,114,182, ${0.25 + intensity * 0.5})`;
    if (intensity > 0.4) return `rgba(167,139,250, ${0.25 + intensity * 0.5})`;
    return `rgba(34,211,238, ${0.18 + intensity * 0.5})`;
  };

  const borderColor = (key) => {
    const data = heatmapData[key];
    if (!data) return 'rgba(255,255,255,0.06)';
    const intensity = data.count / maxCount;
    if (intensity > 0.7) return 'rgba(244,114,182,0.45)';
    if (intensity > 0.4) return 'rgba(167,139,250,0.45)';
    return 'rgba(34,211,238,0.4)';
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-cyber-muted">Typing heatmap</p>
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3.5 space-y-1.5">
        {keyboardRows.map((row, ri) => (
          <div
            key={ri}
            className="flex justify-center gap-1"
            style={{ paddingLeft: `${ri * 14}px` }}
          >
            {row.map((key) => {
              const data = heatmapData[key];
              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.12, zIndex: 10 }}
                  className="relative w-8 h-8 rounded-md flex items-center justify-center cursor-default group"
                  style={{
                    background: heatColor(key),
                    border: `1px solid ${borderColor(key)}`,
                  }}
                >
                  <span
                    className={clsx(
                      'text-[11px] font-medium uppercase tabular-nums',
                      data ? 'text-cyber-text' : 'text-cyber-muted/50',
                    )}
                  >
                    {key}
                  </span>
                  {data && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:block bg-cyber-card px-2 py-1 rounded-md text-[10px] font-mono text-cyber-text whitespace-nowrap border border-white/[0.10] z-20">
                      <div className="text-cyber-primary">×{data.count}</div>
                      <div className="text-cyber-muted">{Math.round(data.avgHold)}ms avg</div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
