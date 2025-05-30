
'use client';

import AppShell from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { HistoricalChart } from '@/components/history/HistoricalChart';
import type { HistoricalDataPoint } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TimeRange = 'hour' | 'today' | 'week';

// Mock data generation
const generateMockData = (range: TimeRange): HistoricalDataPoint[] => {
  const now = new Date();
  let count = 0;
  let startTime: Date;

  switch (range) {
    case 'hour':
      count = 12; // 12 points for last hour (e.g., every 5 mins)
      startTime = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case 'today':
      count = 24; // 24 points for today (e.g., hourly)
      startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      count = 7; // 7 points for last week (e.g., daily average)
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    default:
      return [];
  }

  return Array.from({ length: count }, (_, i) => {
    const time = new Date(startTime.getTime() + (i * ( (range === 'hour' ? 5*60*1000 : range === 'today' ? 60*60*1000 : 24*60*60*1000) )));
    return {
      time: time.toISOString(),
      voltage: 220 + Math.random() * 20, // 220-240V
      power: range === 'week' ? (500 + Math.random() * 1000) : (200 + Math.random() * 1000), // 200-1200W
      irradiance: range === 'week' ? (300 + Math.random() * 500) : (100 + Math.random() * 800), // 100-900W/m^2
      temperature: 15 + Math.random() * 20, // 15-35C
    };
  });
};


const dataTypes: Array<{ key: keyof Omit<HistoricalDataPoint, 'time'>; label: string }> = [
  { key: 'power', label: 'Power' },
  { key: 'voltage', label: 'Voltage' },
  { key: 'irradiance', label: 'Irradiance' },
  { key: 'temperature', label: 'Temperature' },
];

const timeRangeDetails: Record<TimeRange, { label: string; description: string }> = {
  hour: { label: "Last Hour", description: "Shows data from the last 60 minutes." },
  today: { label: "Today", description: "Shows data from midnight until now." },
  week: { label: "Last 7 Days", description: "Shows data from the past week." }
};

export default function HistoryPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('today');

  const historicalData = useMemo(() => generateMockData(timeRange), [timeRange]);

  return (
    <AppShell>
      <PageHeader 
        title="Historical Data"
        description="Analyze past performance of your solar system."
      >
        <TooltipProvider>
          <div className="flex gap-2">
            {(Object.keys(timeRangeDetails) as TimeRange[]).map((range) => (
              <Tooltip key={range}>
                <TooltipTrigger asChild>
                  <Button
                    variant={timeRange === range ? 'default' : 'outline'}
                    onClick={() => setTimeRange(range)}
                    className="capitalize"
                  >
                    {timeRangeDetails[range].label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{timeRangeDetails[range].description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </PageHeader>

      <Tabs defaultValue="power" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
          {dataTypes.map(dt => (
            <TabsTrigger key={dt.key} value={dt.key}>{dt.label}</TabsTrigger>
          ))}
        </TabsList>
        {dataTypes.map(dt => (
          <TabsContent key={dt.key} value={dt.key}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{dt.label} - {timeRangeDetails[timeRange].label}</CardTitle>
              </CardHeader>
              <CardContent>
                <HistoricalChart data={historicalData} dataType={dt.key} timeRangeLabel={timeRangeDetails[timeRange].label} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </AppShell>
  );
}

