export interface UcLineChartDataPoint {
  label: string;
  value: number;
}

export interface UcLineChartSeries {
  name: string;
  data: UcLineChartDataPoint[];
  color?: string;
}
