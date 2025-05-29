'use client';

import type { ChartData, HistoricalDataPoint } from '@/lib/types';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ReferenceLine } from 'recharts';
import { useMemo } from 'react';

interface HistoricalChartProps {
  data: HistoricalDataPoint[];
  dataType: keyof Omit<HistoricalDataPoint, 'time'>; // e.g., 'voltage', 'power'
  timeRangeLabel: string;
}

const chartColorMap: Record<string, string> = {
  voltage: "hsl(var(--chart-1))", // Blue
  power: "hsl(var(--chart-2))",   // Green
  irradiance: "hsl(var(--chart-4))", // Yellow/Orange
  temperature: "hsl(var(--chart-5))", // Reddish
};

const unitMap: Record<keyof Omit<HistoricalDataPoint, 'time'>, string> = {
  voltage: 'V',
  power: 'W',
  irradiance: 'W/m²',
  temperature: '°C',
};

export function HistoricalChart({ data, dataType, timeRangeLabel }: HistoricalChartProps) {
  const chartConfig = useMemo(() => ({
    [dataType]: {
      label: `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} (${unitMap[dataType]})`,
      color: chartColorMap[dataType] || "hsl(var(--chart-1))",
    },
  }) as ChartConfig, [dataType]);

  const transformedData: ChartData[] = useMemo(() => 
    data.map(item => ({
      name: new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      [dataType]: item[dataType],
    })), [data, dataType]);
  
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground bg-card rounded-lg shadow-sm">
        No data available for {timeRangeLabel}.
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <LineChart
        accessibilityLayer
        data={transformedData}
        margin={{
          top: 20,
          right: 20,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          // Consider formatting ticks for longer time ranges
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={['auto', 'auto']} // Or calculate min/max with padding
          label={{ value: unitMap[dataType], angle: -90, position: 'insideLeft', offset: -5, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey={dataType}
          type="monotone"
          stroke={`var(--color-${dataType})`}
          strokeWidth={2.5}
          dot={false}
        />
        {/* Example ReferenceLine for average */}
        {/* <ReferenceLine y={500} label="Average" stroke="red" strokeDasharray="3 3" /> */}
      </LineChart>
    </ChartContainer>
  );
}
