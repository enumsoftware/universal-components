import { bool, defineShowcase, number, object } from '../../workbench/core';
import { UcBarChart } from './uc-bar-chart';
import type { UcBarChartDataPoint, UcBarChartSeries } from './uc-bar-chart.model';

const SAMPLE_DATA: UcBarChartDataPoint[] = [
  { label: 'January', value: 420, percentage: 42 },
  { label: 'February', value: 380, percentage: 38 },
  { label: 'March', value: 610, percentage: 61 },
  { label: 'April', value: 290, percentage: 29 },
  { label: 'May', value: 510, percentage: 51 },
  { label: 'June', value: 730, percentage: 73 },
];

const MULTI_SERIES_DATA: UcBarChartSeries[] = [
  {
    name: 'Revenue',
    data: [
      { label: 'Jan', value: 420, percentage: 42 },
      { label: 'Feb', value: 380, percentage: 38 },
      { label: 'Mar', value: 610, percentage: 61 },
      { label: 'Apr', value: 290, percentage: 29 },
      { label: 'May', value: 510, percentage: 51 },
      { label: 'Jun', value: 730, percentage: 73 },
    ],
  },
  {
    name: 'Cost',
    data: [
      { label: 'Jan', value: 280, percentage: 28 },
      { label: 'Feb', value: 260, percentage: 26 },
      { label: 'Mar', value: 400, percentage: 40 },
      { label: 'Apr', value: 230, percentage: 23 },
      { label: 'May', value: 330, percentage: 33 },
      { label: 'Jun', value: 460, percentage: 46 },
    ],
  },
];

export default defineShowcase({
  id: 'charts/bar-chart',
  group: 'Charts',
  title: 'Bar Chart',
  layout: 'padded',
  component: UcBarChart,
  knobs: {
    data: object(SAMPLE_DATA),
    height: number(200, { min: 100, max: 600 }),
    showLegend: bool(true),
  },
  examples: [
    { name: 'Tall', props: { height: 350 } },
    {
      name: 'Few Items',
      props: {
        data: [
          { label: 'Product A', value: 850, percentage: 85 },
          { label: 'Product B', value: 650, percentage: 65 },
          { label: 'Product C', value: 430, percentage: 43 },
        ],
      },
    },
    { name: 'Time Series', props: { data: MULTI_SERIES_DATA } },
    { name: 'Without Legend', props: { showLegend: false } },
  ],
});
