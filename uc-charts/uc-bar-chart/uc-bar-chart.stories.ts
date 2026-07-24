import type { Meta, StoryObj } from '@storybook/angular';
import { UcBarChart } from './uc-bar-chart';
import type { UcBarChartDataPoint, UcBarChartSeries } from './uc-bar-chart.model';

const sampleData: UcBarChartDataPoint[] = [
  { label: 'January', value: 420, percentage: 42 },
  { label: 'February', value: 380, percentage: 38 },
  { label: 'March', value: 610, percentage: 61 },
  { label: 'April', value: 290, percentage: 29 },
  { label: 'May', value: 510, percentage: 51 },
  { label: 'June', value: 730, percentage: 73 },
];

const multiSeriesData: UcBarChartSeries[] = [
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

const meta: Meta<UcBarChart> = {
  title: 'Charts/Bar Chart',
  component: UcBarChart,
  args: {
    data: sampleData,
    height: 200,
    showLegend: true,
  },
};

export default meta;
type Story = StoryObj<UcBarChart>;

export const Default: Story = {};

export const Tall: Story = {
  args: {
    height: 350,
  },
};

export const FewItems: Story = {
  args: {
    data: [
      { label: 'Product A', value: 850, percentage: 85 },
      { label: 'Product B', value: 650, percentage: 65 },
      { label: 'Product C', value: 430, percentage: 43 },
    ],
  },
};

export const TimeSeries: Story = {
  args: {
    data: multiSeriesData,
  },
};

export const WithoutLegend: Story = {
  args: {
    showLegend: false,
  },
};
