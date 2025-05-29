import type { Metric } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  metric: Metric;
  className?: string;
}

export function MetricCard({ metric, className }: MetricCardProps) {
  const Icon = metric.icon;
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </CardTitle>
        {Icon && <Icon className="h-5 w-5 text-accent" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
          {metric.value}
          <span className="text-xl font-normal text-muted-foreground ml-1">{metric.unit}</span>
        </div>
        {/* Could add a small description or trend indicator here if needed */}
      </CardContent>
    </Card>
  );
}
