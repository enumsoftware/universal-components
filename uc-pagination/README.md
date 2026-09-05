# UcPagination

A full-featured pagination bar that combines page navigation buttons with an optional page-size selector.

## Features

- **Page window**: Shows a sliding window of page buttons around the current page
- **First / previous / next / last** navigation buttons
- **Page size selector**: Optional dropdown to change items per page
- **Page info text**: Configurable template string (e.g. `Page 2 of 10`)
- **Configurable**: Show/hide page info and the page selector independently
- **Signal-based computed state**: Derived `totalPages`, disabled states, page window

## Usage

```typescript
import { UcPagination } from '@enumsoftware/universal-components';

@Component({
  imports: [UcPagination],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```html
<uc-pagination
  [currentPage]="page()"
  [totalItems]="total()"
  [pageSize]="size()"
  (pageChange)="page.set($event)"
  (pageSizeChange)="size.set($event)"
/>
```

### Custom page info template

```html
<uc-pagination
  [currentPage]="page()"
  [totalItems]="total()"
  [pageSize]="size()"
  pageInfoTemplate="{currentPage} / {totalPages}"
  (pageChange)="page.set($event)"
/>
```

## API

### Inputs

| Input               | Type       | Default                  | Description                                         |
|---------------------|------------|--------------------------|-----------------------------------------------------|
| `currentPage`       | `number`   | Required                 | Zero-based current page index                       |
| `totalItems`        | `number`   | Required                 | Total number of items                               |
| `pageSize`          | `number`   | Required                 | Items per page                                      |
| `pageSizeOptions`   | `number[]` | `[10, 25, 50, 100]`      | Available page size options                         |
| `showPageInfo`      | `boolean`  | `true`                   | Shows the page info text                            |
| `showPageSelector`  | `boolean`  | `true`                   | Shows the page size selector dropdown               |
| `pageInfoTemplate`  | `string`   | `'Page {currentPage} of {totalPages}'` | Template string with `{currentPage}` and `{totalPages}` tokens |

### Outputs

| Name             | Type     | Description                                  |
|------------------|----------|----------------------------------------------|
| `pageChange`     | `number` | Emits the new zero-based page index          |
| `pageSizeChange` | `number` | Emits the new page size                      |
