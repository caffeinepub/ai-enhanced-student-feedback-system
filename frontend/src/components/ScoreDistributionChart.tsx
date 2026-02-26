import { useEffect, useRef, useState } from 'react';
import type { GeneratedFeedback } from '../backend';
import { BarChart3 } from 'lucide-react';

interface ScoreDistributionChartProps {
  feedbacks: GeneratedFeedback[];
}

const BUCKETS = [
  { label: '0–20', min: 0, max: 20 },
  { label: '21–40', min: 21, max: 40 },
  { label: '41–60', min: 41, max: 60 },
  { label: '61–80', min: 61, max: 80 },
  { label: '81–100', min: 81, max: 100 },
];

export default function ScoreDistributionChart({ feedbacks }: ScoreDistributionChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  if (feedbacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <BarChart3 size={36} className="mb-3 text-red-200" />
        <p className="font-medium text-au-navy">No submissions yet</p>
        <p className="text-sm mt-1">Score distribution will appear once students submit assignments.</p>
      </div>
    );
  }

  const counts = BUCKETS.map(({ min, max }) =>
    feedbacks.filter((f) => {
      const s = Number(f.score);
      return s >= min && s <= max;
    }).length
  );

  const maxCount = Math.max(...counts, 1);

  return (
    <div ref={ref} className="space-y-3">
      {BUCKETS.map(({ label }, i) => {
        const count = counts[i];
        const pct = Math.round((count / maxCount) * 100);
        const widthClass = visible ? `w-[${pct}%]` : 'w-0';

        return (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs font-medium text-au-navy w-14 shrink-0 text-right">
              {label}
            </span>
            <div className="flex-1 bg-red-50 rounded-full h-7 overflow-hidden relative">
              <div
                className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700 ease-out"
                style={{
                  width: visible ? `${Math.max(pct, count > 0 ? 8 : 0)}%` : '0%',
                  backgroundColor: '#C8102E',
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                {count > 0 && (
                  <span className="text-xs font-bold text-white">{count}</span>
                )}
              </div>
              {count === 0 && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  0
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground w-16 shrink-0">
              {count} {count === 1 ? 'student' : 'students'}
            </span>
          </div>
        );
      })}
      <p className="text-xs text-muted-foreground text-right pt-1">
        Total: {feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
