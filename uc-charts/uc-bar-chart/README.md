# UcBarChart

A D3-powered vertical bar chart that supports single-series and multi-series (grouped) data, an interactive legend, and hover tooltips.

## Features

- **Single and grouped series**: Pass `UcBarChartDataPoint[]` or `UcBarChartSeries[]`
- **Interactive legend**: Toggle individual series visibility
- **Hover tooltips**: Value + label shown on mouseover
- **Configurable height** and legend visibility
- **Theme-aware**: Reads palette colours from CSS custom properties
- **Responsive**: ResizeObserver redraws on container size changes

## Usage

```typescript
import { UcBarChart } from '@enumsoftware/universal-components';

@Component({
  imports: [UcBarChart],
  template: `...`,
})
export class MyComponent {}
```

### Single series

```typescript
data: UcBarChartDataPoint[] = [
  { label: 'Jan', value: 120 },
  { label: 'Feb', value: 95 },
  { label: 'Mar', value: 140 },
];
```

```html
<uc-bar-chart [data]="data" />
```

### Multi-series (grouped)

```typescript
data: UcBarChartSeries[] = [
  { name: 'Revenue', data: [{ label: 'Q1', value: 400 }, { label: 'Q2', value: 520 }] },
  { name: 'Costs',   data: [{ label: 'Q1', value: 300 }, { label: 'Q2', value: 310 }] },
];
```

```html
<uc-bar-chart [data]="data" [height]="300" />
```

## API

### Inputs

| Input        | Type               | Default | Description                             |
|--------------|--------------------|---------|-----------------------------------------|
| `data`       | `UcBarChartInput`  | Required| Chart data (single or multi-series)     |
| `height`     | `number`           | `200`   | Chart height in pixels                  |
| `showLegend` | `boolean`          | `true`  | Shows/hides the series legend           |

### Types

```typescript
interface UcBarChartDataPoint {
  label: string;
  value: number;
  percentage?: number;
}

interface UcBarChartSeries {
  name: string;
  data: UcBarChartDataPoint[];
  color?: string;
}

type UcBarChartInput = UcBarChartDataPoint[] | UcBarChartSeries[];
```
