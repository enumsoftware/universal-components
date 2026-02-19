# UC Table Pill

A compact pill component designed for table cells, displaying status, labels, or code snippets with semantic color variants.

## Usage

```html
<!-- Status display -->
<uc-table-pill [variant]="isActive ? 'valid' : 'error'">
  {{ isActive ? 'Active' : 'Inactive' }}
</uc-table-pill>

<!-- Code/API key display -->
<uc-table-pill variant="info"> {{ apiKey.maskedKey }} </uc-table-pill>

<!-- Info label -->
<uc-table-pill variant="info"> Pending </uc-table-pill>
```

## Inputs

| Name      | Type                           | Default  | Description                          |
| --------- | ------------------------------ | -------- | ------------------------------------ |
| `variant` | `'info' \| 'valid' \| 'error'` | `'info'` | The visual style variant of the pill |

## Variants

- **info**: Gray background, neutral for general information or code snippets
- **valid**: Green background, indicates success or active status
- **error**: Red background, indicates errors or inactive status
