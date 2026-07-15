export interface UcLineChartDataPoint {
  label: string;
  value: number;
}

export type UcLineChartInterpolation = 'linear' | 'cubic' | 'cubic-monotone';

export interface UcLineChartSeries {
  name: string;
  data: UcLineChartDataPoint[];
  color?: string;
}
