
'use client';

import AppShell from '@/components/layout/AppShell';
import { MetricCard } from '@/components/dashboard/MetricCard';
import type { Metric } from '@/lib/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { Zap, Activity, Bolt, Sun, Thermometer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/shared/Spinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Define the initial structure and default values for metrics
const initialMetricsSetup: Omit<Metric, 'value'>[] = [
  { id: 'voltage', label: 'Voltage', unit: 'V', icon: Zap },
  { id: 'current', label: 'Current', unit: 'A', icon: Activity },
  { id: 'power', label: 'Power', unit: 'W', icon: Bolt },
  { id: 'irradiance', label: 'Irradiance', unit: 'W/m²', icon: Sun },
  { id: 'temperature', label: 'Panel Temp.', unit: '°C', icon: Thermometer },
];

// Helper to create the full Metric array with default values
const getDefaultMetrics = (): Metric[] => {
  return initialMetricsSetup.map(m => ({ ...m, value: 0 })); // Default value set to 0
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [metricsData, setMetricsData] = useState<Metric[]>(getDefaultMetrics());
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      if (!authLoading) setLoadingMetrics(false);
      return;
    }

    setLoadingMetrics(true);
    const metricsDocRef = doc(db, 'dashboardMetrics', 'current');

    const unsubscribe = onSnapshot(metricsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Update metricsData based on the new data, keeping labels, units, icons
        setMetricsData(prevMetrics => 
          prevMetrics.map(metric => ({
            ...metric,
            value: data[metric.id] !== undefined ? data[metric.id] : metric.value, // Use new value or keep old/default
          }))
        );
        setError(null);
      } else {
        setError("Live metrics data not found. Ensure ESP32 is sending data to 'dashboardMetrics/current'. Displaying default values.");
        setMetricsData(getDefaultMetrics()); // Reset to default if doc doesn't exist
      }
      setLoadingMetrics(false);
    }, (err) => {
      console.error("Error fetching live metrics:", err);
      setError("Failed to load live metrics. Check console and Firestore rules for 'dashboardMetrics/current'.");
      setLoadingMetrics(false);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [user, authLoading]);

  if (authLoading || loadingMetrics) {
    return (
      <AppShell>
        <PageHeader 
          title="Real-Time Dashboard"
          description="Loading current performance metrics..."
        />
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <PageHeader 
          title="Real-Time Dashboard"
          description="Please log in to view live metrics."
        />
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to view this page.
          </AlertDescription>
        </Alert>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader 
        title="Real-Time Dashboard"
        description="Current performance metrics from your solar panels."
      />
      {error && (
         <Alert variant="destructive" className="mb-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Metrics Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {metricsData.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
      <div className="mt-8 p-6 bg-card rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-foreground mb-3">System Status</h2>
        <p className="text-muted-foreground">
          {error ? "System status may be affected by data errors." : 
           "All systems are currently operational. Your solar array is generating power optimally based on current weather conditions."
          }
        </p>
         <div className={`mt-4 h-2 w-full ${error ? 'bg-yellow-500' : 'bg-green-500'} rounded-full`} 
              title={error ? "System Status Warning" : "System Optimal"}>
         </div>
      </div>
    </AppShell>
  );
}
