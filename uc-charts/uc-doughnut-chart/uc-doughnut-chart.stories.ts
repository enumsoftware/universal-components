import type { Meta, StoryObj } from '@storybook/angular';
import { UcDoughnutChart } from './uc-doughnut-chart';
import type { UcDoughnutChartDataPoint } from './uc-doughnut-chart.model';

const sampleData: UcDoughnutChartDataPoint[] = [
  { label: 'Direct', value: 400, percentage: 40 },
  { label: 'Organic', value: 300, percentage: 30 },
  { label: 'Referral', value: 200, percentage: 20 },
  { label: 'Social', value: 100, percentage: 10 },
];

const meta: Meta<UcDoughnutChart> = {
  title: 'Charts/Doughnut Chart',
  component: UcDoughnutChart,
  args: {
    data: sampleData,
    size: 240,
  },
};

export default meta;
type Story = StoryObj<UcDoughnutChart>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    size: 360,
  },
};

export const CustomCenterText: Story = {
  args: {
    doughnutTitle: '1,000',
    doughnutSubtitle: 'visits',
  },
};

export const WithoutLegend: Story = {
  args: {
    showLegend: false,
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