# UcTooltip Directive

An attribute directive that shows a CDK overlay-based tooltip on hover/focus, with configurable position and margin.

## Features

- Attach to any element via `[ucTooltip]`
- 8 named positions with automatic viewport-aware fallback flipping
- Global default position/margin via `provideUcTooltipConfig()`
- Per-instance overrides via `[ucTooltipPosition]` and `[ucTooltipMargin]`
- RTL-aware horizontal placement (CDK logical `start`/`end` positioning)
- Shows on hover/focus, hides on mouseleave/blur/scroll

## Installation

Import directly from the library package:

```typescript
import { UcTooltip } from '@enumsoftware/universal-components';

@Component({
  imports: [UcTooltip],
  template: `...`,
})
export class ExampleComponent {}
```

## Basic Usage

```html
<uc-button [ucTooltip]="'Save changes'" [text]="'Save'"></uc-button>
```

## Global Configuration

Set app-wide defaults for position and margin using `provideUcTooltipConfig()` in your app providers:

```typescript
import { provideUcTooltipConfig } from '@enumsoftware/universal-components';

export const appConfig: ApplicationConfig = {
  providers: [provideUcTooltipConfig({ position: 'top', margin: '12px' })],
};
```

If not provided, the built-in defaults are `position: 'bottom'` and `margin: '8px'`.

## Per-Instance Overrides

Override the global default for a single tooltip:

```html
<uc-button [ucTooltip]="'Delete item'" [ucTooltipPosition]="'right'" [ucTooltipMargin]="'4px'"></uc-button>
```

## API

### UcTooltip

#### Inputs

- `ucTooltip: string` - The tooltip text content.
- `ucTooltipPosition: UcTooltipPosition | undefined` - Overrides the global default position for this instance.
- `ucTooltipMargin: string | undefined` - Overrides the global default margin (CSS length, e.g. `'8px'`, `'0.5rem'`) for this instance.

### UcTooltipPosition

```typescript
type UcTooltipPosition = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
```

### UcTooltipConfig

```typescript
interface UcTooltipConfig {
  position?: UcTooltipPosition;
  margin?: string;
}
```

### provideUcTooltipConfig(config: UcTooltipConfig)

Registers an `EnvironmentProviders` entry that sets the global default `position` and `margin`, merged over the built-in defaults.

## Positioning Behavior

Each position maps to a primary CDK `ConnectedPosition`, followed by a curated fallback order so the overlay can flip to another position if the primary one doesn't fit the viewport.

## Accessibility

- The host element receives `tabindex="0"` so it can receive focus for keyboard users.
- The tooltip is linked to the host via `aria-describedby`.
- The tooltip overlay has `pointer-events: none` and does not trap focus.

## Storybook

See the component stories in `uc-tooltip/uc-tooltip.stories.ts`.
