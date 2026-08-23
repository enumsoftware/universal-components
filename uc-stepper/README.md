# UcStepper

A step-by-step wizard component built on Angular CDK's `CdkStepper`. Uses `UcStep` as the step container.

## Features

- **CDK Stepper**: Extends `CdkStepper` for full keyboard navigation and step state management
- **Step states**: `STEP_STATE` values (`number`, `edit`, `done`, `error`) drive step indicators
- **Content projection**: Each step's content is defined inside a `<uc-step>` component
- **Accessible**: ARIA roles and keyboard navigation inherited from CDK

## Usage

```typescript
import { UcStepper, UcStep } from '@enumsoftware/universal-components';

@Component({
  imports: [UcStepper, UcStep],
  template: `...`,
})
export class MyComponent {}
```

> `UcStep` is the `CdkStep`-based container for each individual step.

### Basic three-step wizard

```html
<uc-stepper #stepper>
  <uc-step label="Personal info">
    <p>Enter your name and email.</p>
    <button (click)="stepper.next()">Next</button>
  </uc-step>

  <uc-step label="Address">
    <p>Enter your shipping address.</p>
    <button (click)="stepper.previous()">Back</button>
    <button (click)="stepper.next()">Next</button>
  </uc-step>

  <uc-step label="Review">
    <p>Review your order.</p>
    <button (click)="stepper.previous()">Back</button>
    <button (click)="onSubmit()">Submit</button>
  </uc-step>
</uc-stepper>
```

## API

### UcStepper

Extends Angular CDK `CdkStepper`. All CDK Stepper inputs and methods are available.

Key inherited API:

| Name           | Type      | Description                              |
|----------------|-----------|------------------------------------------|
| `selected`     | `CdkStep` | Currently selected step                  |
| `selectedIndex`| `number`  | Zero-based index of the selected step    |
| `linear`       | `boolean` | Prevents skipping ahead when `true`      |
| `next()`       | method    | Advances to the next step                |
| `previous()`   | method    | Goes back to the previous step           |
| `reset()`      | method    | Resets to the first step                 |

### UcStep

Extends Angular CDK `CdkStep`. Accepts `label`, `optional`, `completed`, `editable`, `hasError`, and `errorMessage` from CDK.

## Accessibility

Keyboard navigation (arrow keys, Tab, Enter) is handled by the underlying CDK implementation.
