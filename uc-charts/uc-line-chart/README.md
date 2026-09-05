# UcLineChart

A D3-powered multi-series line chart with an interactive legend, hover tooltips, and configurable interpolation.

## Features

- **Multi-series**: Pass multiple `UcLineChartSeries` objects
- **Interpolation modes**: `linear`, `cubic`, `cubic-monotone`
- **Interactive legend**: Toggle series visibility
- **Hover tooltips**: Nearest data point highlighted on mouseover
- **Configurable height** and legend visibility
- **Theme-aware**: Reads palette colours from CSS custom properties
- **Responsive**: ResizeObserver redraws on container size changes

## Usage

```typescript
import { UcLineChart } from '@enumsoftware/universal-components';

@Component({
  imports: [UcLineChart],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```typescript
series: UcLineChartSeries[] = [
  {
    name: 'Page views',
    data: [{ label: 'Mon', value: 120 }, { label: 'Tue', value: 95 }, { label: 'Wed', value: 140 }],
  },
];
```

```html
<uc-line-chart [data]="series" />
```

### Smooth curves

```html
<uc-line-chart [data]="series" interpolation="cubic-monotone" />
```

## API

### Inputs

| Input          | Type                      | Default     | Description                              |
|----------------|---------------------------|-------------|------------------------------------------|
| `data`         | `UcLineChartSeries[]`     | Required    | Array of series objects                  |
| `height`       | `number`                  | `200`       | Chart height in pixels                   |
| `showLegend`   | `boolean`                 | `true`      | Shows/hides the series legend            |
| `interpolation`| `UcLineChartInterpolation`| `'linear'`  | Curve type (alias: `interpolationMode`)  |

### Types

```typescript
interface UcLineChartDataPoint {
  label: string;
  value: number;
}

type UcLineChartInterpolation = 'linear' | 'cubic' | 'cubic-monotone';

interface UcLineChartSeries {
  name: string;
  data: UcLineChartDataPoint[];
  color?: string;
}
```
