export type Metric = {
  id: string;
  label: string;
  value: string | number;
  unit: string;
  icon: React.ElementType;
};

export type HistoricalDataPoint = {
  time: string; // Could be ISO string or formatted date/time
  voltage: number;
  power: number;
  irradiance: number;
  temperature: number;
};

export type ChartData = {
  name: string; // Typically time for X-axis
  [key: string]: number | string; // For Y-axis values (e.g., voltage, power)
};
