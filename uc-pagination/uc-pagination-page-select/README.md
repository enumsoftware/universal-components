# UcPaginationPageSelect

A page-size selector dropdown used inside `UcPagination`. Renders as a CDK overlay-based combobox.

## Usage

> Used internally by `UcPagination`. Direct use is only needed when building a custom pagination layout.

```typescript
import { UcPaginationPageSelect } from '@enumsoftware/universal-components/uc-pagination/uc-pagination-page-select/uc-pagination-page-select';
```

## API

### Inputs

| Input          | Type       | Default              | Description                                         |
|----------------|------------|----------------------|-----------------------------------------------------|
| `selectedSize` | `number`   | Required             | Currently selected items-per-page value             |
| `sizes`        | `number[]` | `[10, 25, 50, 100]`  | Available size options (duplicates and non-integers are removed) |

### Outputs

| Name           | Type     | Description                          |
|----------------|----------|--------------------------------------|
| `sizeSelected` | `number` | Emits the new page size when changed |
