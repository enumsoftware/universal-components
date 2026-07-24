export interface UcBarChartDataPoint {
  label: string;
  value: number;
  percentage?: number;
}

export interface UcBarChartSeries {
  name: string;
  data: UcBarChartDataPoint[];
  color?: string;
}

export type UcBarChartInput = UcBarChartDataPoint[] | UcBarChartSeries[];
