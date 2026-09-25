Every control with variants has a built-in default, such as `primary` for
`uc-button`. An app can change those defaults once, in its providers, instead of
setting `variant` on every element.

```ts
import { provideUcDefaults } from '@enumsoftware/universal-components';

export const appConfig: ApplicationConfig = {
  providers: [
    provideUcDefaults({
      button: { variant: 'secondary' },
      tabs: { variant: 'pills' },
      segmentedToggle: { variant: 'pills' },
    }),
  ],
};
```

Every entry is optional. A control that is not listed keeps its built-in default,
and a variant set on an element always wins:

```html
<uc-button text="Cancel" />                    <!-- secondary, from the defaults -->
<uc-button text="Save" variant="primary" />   <!-- primary, set on the element -->
```

## Controls

| Key | Control | Input | Options | Built-in default |
|---|---|---|---|---|
| `badge` | `ucBadge` | `variant` | `error`, `primary`, `success`, `neutral` | `error` |
| `button` | `uc-button` | `variant` | `primary`, `secondary`, `text`, `error`, `link` | `primary` |
| `divider` | `uc-divider` | `variant` | `default`, `inverse` | `default` |
| `iconButton` | `uc-icon-button` | `variant` | `primary`, `secondary`, `icon`, `error` | `primary` |
| `info` | `uc-info` | `variant` | `info`, `warning`, `error` | `info` |
| `pill` | `uc-pill` | `variant` | `default`, `info`, `valid`, `error` | `default` |
| `segmentedToggle` | `uc-segmented-toggle` | `variant` | `default`, `pills` | `default` |
| `sidebarButton` | `uc-sidebar-button` | `style` | `primary`, `secondary` | `primary` |
| `tabs` | `uc-tabs` | `variant` | `underline`, `pills` | `underline` |

`badge` sets the directive's `ucBadgeVariant` input. The keys, inputs and options
are typed through `UcDefaults`, so a misspelled key or variant fails to compile.

## Per route

`provideUcDefaults()` also works in a lazy route's `providers`. There it is merged
over the app's defaults per control, so the route lists only what it changes:

```ts
{
  path: 'admin',
  providers: [provideUcDefaults({ button: { variant: 'text' } })],
  loadChildren: () => import('./admin/admin.routes'),
}
```

Inside `admin`, buttons default to `text` and tabs keep `pills` from the app.
Components outside the route, such as the app shell, keep the app's defaults.
