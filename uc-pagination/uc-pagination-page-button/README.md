# UcPaginationPageButton

An individual page-navigation button used inside `UcPagination`. Can display a text label or a Phosphor icon.

## Usage

> Used internally by `UcPagination`. Direct use is only needed when building a custom pagination layout.

```typescript
import { UcPaginationPageButton } from '@enumsoftware/universal-components/uc-pagination/uc-pagination-page-button/uc-pagination-page-button';
```

## API

### Inputs

| Input           | Type                            | Default       | Description                                      |
|-----------------|---------------------------------|---------------|--------------------------------------------------|
| `label`         | `string`                        | `''`          | Text label shown on the button                   |
| `ariaLabel`     | `string`                        | `''`          | Accessible label                                 |
| `phosphorIcon`  | `string`                        | `''`          | Phosphor icon name (rendered instead of label)   |
| `phosphorWeight`| `string`                        | `'bold'`      | Phosphor icon weight                             |
| `variant`       | `PaginationPageButtonVariant`   | `'secondary'` | Visual style: `'primary'` or `'secondary'`       |
| `active`        | `boolean`                       | `false`       | Highlights the button as the current page        |
| `disabled`      | `boolean`                       | `false`       | Disables the button                              |

### Outputs

| Name      | Type   | Description                     |
|-----------|--------|---------------------------------|
| `clicked` | `void` | Emitted on a non-disabled click |
