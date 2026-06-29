import type { Meta, StoryObj } from '@storybook/angular';
import { UcBarChart } from './uc-bar-chart';
import type { ChartDataPoint } from './chart.models';

const sampleData: ChartDataPoint[] = [
  { label: 'January', value: 420, percentage: 42 },
  { label: 'February', value: 380, percentage: 38 },
  { label: 'March', value: 610, percentage: 61 },
  { label: 'April', value: 290, percentage: 29 },
  { label: 'May', value: 510, percentage: 51 },
  { label: 'June', value: 730, percentage: 73 },
];

const meta: Meta<UcBarChart> = {
  title: 'Components/Charts/Bar Chart',
  component: UcBarChart,
  args: {
    data: sampleData,
    height: 200,
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
