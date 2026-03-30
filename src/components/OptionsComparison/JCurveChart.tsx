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
} from 'recharts';
import { formatCurrency } from '../../utils/format';
import type { OptionResult } from '../../hooks/useOptionsComparison';

interface Props {
  options: OptionResult[];
}

export default function JCurveChart({ options }: Props) {
  // Merge all monthly data into a single dataset keyed by month
  const mergedData = Array.from({ length: 36 }, (_, i) => {
    const month = i + 1;
    const point: Record<string, number> = { month };
    for (const opt of options) {
      const d = opt.monthlyData.find((m) => m.month === month);
      point[opt.key] = d?.cumulative ?? 0;
    }
    return point;
  });

  return (
    <div className="w-full h-72 md:h-80 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mergedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#a3a3a3', fontSize: 12 }}
            tickLine={{ stroke: '#262626' }}
            axisLine={{ stroke: '#262626' }}
            label={{ value: 'Months', position: 'insideBottom', offset: -2, fill: '#a3a3a3', fontSize: 12 }}
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
            wrapperStyle={{ fontSize: 12, color: '#a3a3a3' }}
          />
          <ReferenceLine y={0} stroke="#a3a3a3" strokeDasharray="3 3" />
          {options.map((opt) => (
            <Line
              key={opt.key}
              type="monotone"
              dataKey={opt.key}
              stroke={opt.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
