import type { Meta, StoryObj } from '@storybook/angular';
import { UcLineChart } from './uc-line-chart';
import type { UcLineChartSeries } from './uc-line-chart.model';

const sampleData: UcLineChartSeries[] = [
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

const multiSeriesData: UcLineChartSeries[] = [
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

const meta: Meta<UcLineChart> = {
  title: 'Components/Charts/Line Chart',
  component: UcLineChart,
  args: {
    data: sampleData,
    height: 200,
  },
};

export default meta;
type Story = StoryObj<UcLineChart>;

export const Default: Story = {};

export const MultiSeries: Story = {
  args: {
    data: multiSeriesData,
  },
};

export const Tall: Story = {
  args: {
    height: 350,
  },
};

export const WithCustomColors: Story = {
  args: {
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
};
