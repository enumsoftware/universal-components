# UcTooltipComponent

The internal overlay component rendered by the `UcTooltip` directive. It is not intended for direct use.

## Overview

`UcTooltipComponent` is created programmatically by `UcTooltip` via Angular CDK's `ComponentPortal`. It receives its text content through the directive after instantiation rather than through `@Input()`.

## Properties

| Property | Type     | Description                                    |
|----------|----------|------------------------------------------------|
| `text`   | `string` | Tooltip text; set by the `UcTooltip` directive |
| `id`     | `string` | Auto-incremented unique id used for `aria-describedby` wiring |

## See also

- [`UcTooltip` directive](../README.md) — the public API for attaching tooltips to elements.
