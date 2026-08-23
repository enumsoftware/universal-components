# Charts

This directory contains three D3-powered chart components:

| Component | Selector | Description |
|-----------|----------|-------------|
| [UcBarChart](uc-bar-chart/README.md) | `<uc-bar-chart>` | Grouped or single-series vertical bar chart |
| [UcLineChart](uc-line-chart/README.md) | `<uc-line-chart>` | Single or multi-series line chart |
| [UcDoughnutChart](uc-doughnut-chart/README.md) | `<uc-doughnut-chart>` | Doughnut / donut chart with optional title |

All charts are standalone Angular components and are theme-aware (they read CSS custom property palette values).

## Import

```typescript
import { UcBarChart } from '@enumsoftware/universal-components/uc-charts/uc-bar-chart/uc-bar-chart';
import { UcLineChart } from '@enumsoftware/universal-components/uc-charts/uc-line-chart/uc-line-chart';
import { UcDoughnutChart } from '@enumsoftware/universal-components/uc-charts/uc-doughnut-chart/uc-doughnut-chart';
```

Or via the public API barrel:

```typescript
import { UcBarChart, UcLineChart, UcDoughnutChart } from '@enumsoftware/universal-components';
```
