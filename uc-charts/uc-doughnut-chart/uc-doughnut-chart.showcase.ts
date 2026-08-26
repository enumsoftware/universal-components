import { bool, defineShowcase, number, object, text } from '../../workbench/core';
import { UcDoughnutChart } from './uc-doughnut-chart';
import type { UcDoughnutChartDataPoint } from './uc-doughnut-chart.model';

const SAMPLE_DATA: UcDoughnutChartDataPoint[] = [
  { label: 'Direct', value: 400, percentage: 40 },
  { label: 'Organic', value: 300, percentage: 30 },
  { label: 'Referral', value: 200, percentage: 20 },
  { label: 'Social', value: 100, percentage: 10 },
];

export default defineShowcase({
  id: 'charts/doughnut-chart',
  group: 'Charts',
  title: 'Doughnut Chart',
  layout: 'padded',
  component: UcDoughnutChart,
  knobs: {
    data: object(SAMPLE_DATA),
    size: number(240, { min: 120, max: 480 }),
    showLegend: bool(true),
    doughnutTitle: text(undefined),
    doughnutSubtitle: text(undefined),
  },
  examples: [
    { name: 'Large', props: { size: 360 } },
    { name: 'Custom Center Text', props: { doughnutTitle: '1,000', doughnutSubtitle: 'visits' } },
    { name: 'Without Legend', props: { showLegend: false } },
    {
      name: 'Two Segments',
      props: {
        data: [
          { label: 'Completed', value: 70, percentage: 70 },
          { label: 'Remaining', value: 30, percentage: 30 },
        ],
      },
    },
  ],
});
