import AppShell from '@/components/layout/AppShell';
import { MetricCard } from '@/components/dashboard/MetricCard';
import type { Metric } from '@/lib/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { Zap, Activity, Bolt, Sun, Thermometer } from 'lucide-react'; // Using Bolt for Power as Power icon is on/off

const metricsData: Metric[] = [
  { id: 'voltage', label: 'Voltage', value: 231.5, unit: 'V', icon: Zap },
  { id: 'current', label: 'Current', value: 5.2, unit: 'A', icon: Activity },
  { id: 'power', label: 'Power', value: 1198, unit: 'W', icon: Bolt },
  { id: 'irradiance', label: 'Irradiance', value: 780, unit: 'W/m²', icon: Sun },
  { id: 'temperature', label: 'Panel Temp.', value: 28.5, unit: '°C', icon: Thermometer },
  { id: 'vmp', label: 'Vmp (Max Power Voltage)', value: 38.5, unit: 'V', icon: Zap },
  { id: 'imp', label: 'Imp (Max Power Current)', value: 4.9, unit: 'A', icon: Activity },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader 
        title="Real-Time Dashboard"
        description="Current performance metrics from your solar panels."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {metricsData.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
      <div className="mt-8 p-6 bg-card rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-foreground mb-3">System Status</h2>
        <p className="text-muted-foreground">
          All systems are currently operational. Your solar array is generating power optimally based on current weather conditions.
        </p>
        {/* Placeholder for a small status indicator or summary chart */}
         <div className="mt-4 h-2 w-full bg-green-500 rounded-full" title="System Optimal"></div>
      </div>
    </AppShell>
  );
}
