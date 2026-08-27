import { bool, defineShowcase, number, object, select } from '../../workbench/core';
import { UcLineChart } from './uc-line-chart';
import type { UcLineChartInterpolation, UcLineChartSeries } from './uc-line-chart.model';

const INTERPOLATIONS: UcLineChartInterpolation[] = ['linear', 'cubic', 'cubic-monotone'];

const SAMPLE_DATA: UcLineChartSeries[] = [
  {
    name: 'Series 1',
    data: [
      { label: 'January', value: 420 },
      { label: 'February', value: 380 },
      { label: 'March', value: 610 },
      { label: 'April', value: 290 },
      { label: 'May', value: 510 },
      { label: 'June', value: 730 },
    ],
  },
];

const MULTI_SERIES_DATA: UcLineChartSeries[] = [
  {
    name: 'Product A',
    data: [
      { label: 'Jan', value: 420 },
      { label: 'Feb', value: 380 },
      { label: 'Mar', value: 610 },
      { label: 'Apr', value: 290 },
      { label: 'May', value: 510 },
      { label: 'Jun', value: 730 },
    ],
  },
  {
    name: 'Product B',
    data: [
      { label: 'Jan', value: 300 },
      { label: 'Feb', value: 450 },
      { label: 'Mar', value: 520 },
      { label: 'Apr', value: 380 },
      { label: 'May', value: 600 },
      { label: 'Jun', value: 650 },
    ],
  },
  {
    name: 'Product C',
    data: [
      { label: 'Jan', value: 500 },
      { label: 'Feb', value: 480 },
      { label: 'Mar', value: 440 },
      { label: 'Apr', value: 520 },
      { label: 'May', value: 420 },
      { label: 'Jun', value: 580 },
    ],
  },
];

export default defineShowcase({
  id: 'charts/line-chart',
  group: 'Charts',
  title: 'Line Chart',
  layout: 'padded',
  component: UcLineChart,
  knobs: {
    data: object(SAMPLE_DATA),
    height: number(200, { min: 100, max: 600 }),
    showLegend: bool(true),
    interpolationMode: select(INTERPOLATIONS, 'linear'),
  },
  examples: [
    { name: 'Multi Series', props: { data: MULTI_SERIES_DATA } },
    { name: 'Tall', props: { height: 350 } },
    {
      name: 'With Custom Colors',
      props: {
        data: [
          {
            name: 'Revenue',
            color: '#10b981',
            data: [
              { label: 'Jan', value: 1200 },
              { label: 'Feb', value: 1400 },
              { label: 'Mar', value: 1800 },
              { label: 'Apr', value: 1600 },
              { label: 'May', value: 2000 },
            ],
          },
        ],
      },
    },
    { name: 'Without Legend', props: { showLegend: false } },
  ],
});
