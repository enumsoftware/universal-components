import type { Meta, StoryObj } from '@storybook/angular';
import { UcPieChart } from './uc-pie-chart';
import type { UcPieChartDataPoint } from './uc-pie-chart.model';

const sampleData: UcPieChartDataPoint[] = [
  { label: 'Direct', value: 400, percentage: 40 },
  { label: 'Organic', value: 300, percentage: 30 },
  { label: 'Referral', value: 200, percentage: 20 },
  { label: 'Social', value: 100, percentage: 10 },
];

const meta: Meta<UcPieChart> = {
  title: 'Components/Charts/Pie Chart',
  component: UcPieChart,
  args: {
    data: sampleData,
    size: 240,
  },
};

export default meta;
type Story = StoryObj<UcPieChart>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    size: 360,
  },
};

export const TwoSegments: Story = {
  args: {
    data: [
      { label: 'Completed', value: 70, percentage: 70 },
      { label: 'Remaining', value: 30, percentage: 30 },
    ],
  },
};
