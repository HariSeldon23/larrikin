import { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  ReferenceDot,
} from 'recharts';
import { formatCurrency } from '../../utils/format';
import type { OptionResult } from '../../hooks/useOptionsComparison';

interface Props {
  options: OptionResult[];
}

export default function JCurveChart({ options }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Observe when chart enters viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  // Stagger line animations
  useEffect(() => {
    if (!isVisible) return;
    // Phase 0: status quo, Phase 1: first option, Phase 2: second option
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i <= options.length; i++) {
      timers.push(setTimeout(() => setAnimationPhase(i + 1), i * 600));
    }
    return () => timers.forEach(clearTimeout);
  }, [isVisible, options.length]);

  // Merge all monthly data
  const mergedData = Array.from({ length: 36 }, (_, i) => {
    const month = i + 1;
    const point: Record<string, number> = { month };
    for (const opt of options) {
      const d = opt.monthlyData.find((m) => m.month === month);
      point[opt.key] = d?.cumulative ?? 0;
    }
    return point;
  });

  // Find crossover points (where cumulative goes from negative to positive)
  const crossoverPoints: { key: string; month: number; color: string }[] = [];
  for (const opt of options) {
    if (opt.key === 'status-quo') continue;
    for (let i = 1; i < opt.monthlyData.length; i++) {
      if (opt.monthlyData[i - 1].cumulative < 0 && opt.monthlyData[i].cumulative >= 0) {
        crossoverPoints.push({ key: opt.key, month: opt.monthlyData[i].month, color: opt.color });
        break;
      }
    }
  }

  return (
    <div ref={containerRef}>
      {/* Break out of max-w-3xl container */}
      <div className="-mx-6 md:-mx-12 lg:-mx-24 px-2">
        <div className="w-full h-80 md:h-96 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedData} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#a3a3a3', fontSize: 12 }}
                tickLine={{ stroke: '#262626' }}
                axisLine={{ stroke: '#262626' }}
                label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: '#a3a3a3', fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: '#a3a3a3', fontSize: 12 }}
                tickLine={{ stroke: '#262626' }}
                axisLine={{ stroke: '#262626' }}
                tickFormatter={(v: number) => {
                  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(0)}k`;
                  return `$${v}`;
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#141414',
                  border: '1px solid #262626',
                  color: '#f5f5f5',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13,
                }}
                formatter={(value, name) => {
                  const option = options.find((o) => o.key === name);
                  return [formatCurrency(Number(value)), option?.label ?? String(name)];
                }}
                labelFormatter={(label) => `Month ${label}`}
              />
              <Legend
                formatter={(value: string) => {
                  const option = options.find((o) => o.key === value);
                  return option?.label ?? value;
                }}
                wrapperStyle={{ fontSize: 12, color: '#a3a3a3', paddingTop: 8 }}
              />
              <ReferenceLine y={0} stroke="#a3a3a3" strokeWidth={1.5} strokeDasharray="6 4" />

              {options.map((opt, i) => (
                <Line
                  key={opt.key}
                  type="monotone"
                  dataKey={opt.key}
                  stroke={opt.color}
                  strokeWidth={opt.key === 'status-quo' ? 1.5 : 2.5}
                  strokeDasharray={opt.key === 'status-quo' ? '4 4' : undefined}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                  isAnimationActive={isVisible}
                  animationBegin={i * 600}
                  animationDuration={1200}
                  animationEasing="ease-out"
                  hide={animationPhase <= i}
                />
              ))}

              {/* Crossover pulse dots */}
              {crossoverPoints.map((cp) => (
                <ReferenceDot
                  key={cp.key}
                  x={cp.month}
                  y={0}
                  r={6}
                  fill={cp.color}
                  stroke="#f5f5f5"
                  strokeWidth={2}
                >
                </ReferenceDot>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Crossover callout pills */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {crossoverPoints.map((cp) => {
          const opt = options.find((o) => o.key === cp.key);
          return (
            <div
              key={cp.key}
              className="inline-flex items-center gap-2 px-4 py-2 border text-sm"
              style={{ borderColor: cp.color + '60', backgroundColor: cp.color + '10' }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: cp.color }}
              />
              <span className="text-text-muted">
                {opt?.label} pays for itself in{' '}
                <span className="text-text-primary font-bold font-mono">Month {cp.month}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
