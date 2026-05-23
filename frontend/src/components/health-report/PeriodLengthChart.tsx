'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatChartDate } from '@/lib/date-format';

export interface PeriodLengthChartProps {
  data: { date: string; value: number }[];
}

interface ChartPoint {
  date: string;
  value: number;
  label: string;
}

export function PeriodLengthChart({ data }: PeriodLengthChartProps) {
  const chartData: ChartPoint[] = data.map((point) => ({
    ...point,
    label: formatChartDate(point.date),
  }));

  const activePoints = chartData.filter((p) => p.value > 0);

  return (
    <div className="rounded-card bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <h3 className="text-sm font-bold text-text-primary">Period Length</h3>
      <p className="mt-1 text-xs text-text-secondary">
        Monthly period pattern (0–7 days) and flow intensity
      </p>

      <div className="mt-4 h-56 min-w-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={activePoints.length > 0 ? activePoints : chartData}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[0, 3, 6, 10]}
              tick={{ fontSize: 10, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: 12,
              }}
              formatter={(value) => [`${value ?? 0}`, 'Intensity']}
              labelFormatter={(label) => String(label)}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#E91E8C"
              strokeWidth={3}
              dot={{ fill: '#E91E8C', strokeWidth: 0, r: 5 }}
              activeDot={{ r: 7, fill: '#E91E8C' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-xs text-text-secondary">
        ⓘ Higher peaks indicate stronger symptoms. Flow overlay (pink) shows
        heavier days.
      </p>
    </div>
  );
}
