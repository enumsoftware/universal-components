# UcDoughnutChart

A D3-powered doughnut (donut) chart with an interactive legend, hover tooltips, and an optional centre title.

## Features

- **Interactive legend**: Toggle slice visibility
- **Hover tooltips**: Shows label, value, and percentage on mouseover
- **Centre title/subtitle**: Optional text rendered inside the doughnut hole
- **Configurable size** and legend visibility
- **Theme-aware**: Reads palette colours from CSS custom properties
- **Responsive**: ResizeObserver redraws on container size changes

## Usage

```typescript
import { UcDoughnutChart } from '@enumsoftware/universal-components';

@Component({
  imports: [UcDoughnutChart],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```typescript
data: UcDoughnutChartDataPoint[] = [
  { label: 'Chrome', value: 62, percentage: 62 },
  { label: 'Safari', value: 20, percentage: 20 },
  { label: 'Firefox', value: 18, percentage: 18 },
];
```

```html
<uc-doughnut-chart [data]="data" />
```

### With centre title

```html
<uc-doughnut-chart [data]="data" doughnutTitle="Total" doughnutSubtitle="100 users" />
```

## API

### Inputs

| Input              | Type                         | Default     | Description                                |
|--------------------|------------------------------|-------------|--------------------------------------------|
| `data`             | `UcDoughnutChartDataPoint[]` | Required    | Array of data points                       |
| `size`             | `number`                     | `240`       | Diameter of the chart in pixels            |
| `showLegend`       | `boolean`                    | `true`      | Shows/hides the legend                     |
| `doughnutTitle`    | `string \| undefined`        | `undefined` | Primary text shown in the doughnut hole    |
| `doughnutSubtitle` | `string \| undefined`        | `undefined` | Secondary text shown in the doughnut hole  |

### Types

```typescript
interface UcDoughnutChartDataPoint {
  label: string;
  value: number;
  percentage: number;
}
```
