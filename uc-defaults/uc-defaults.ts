import { EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders } from '@angular/core';

import type { UcBadgeVariant } from '../uc-badge/uc-badge';
import type { ButtonVariant } from '../uc-button/uc-button';
import type { UcDividerVariant } from '../uc-divider/uc-divider';
import type { IconButtonVariant } from '../uc-icon-button/uc-icon-button';
import type { InfoVariant } from '../uc-info/uc-info';
import type { PillVariant } from '../uc-pill/uc-pill';
import type { UcSegmentedToggleVariant } from '../uc-segmented-toggle/uc-segmented-toggle';
import type { SidebarButtonStyle } from '../uc-sidebar-button/uc-sidebar-button';
import type { UcTabsVariant } from '../uc-tabs/uc-tabs';

/**
 * App-wide defaults for the controls' variants. Every entry is optional: a control that is not
 * listed keeps its built-in default, and a variant set on an element always wins over this.
 */
export interface UcDefaults {
  badge?: { variant?: UcBadgeVariant };
  button?: { variant?: ButtonVariant };
  divider?: { variant?: UcDividerVariant };
  iconButton?: { variant?: IconButtonVariant };
  info?: { variant?: InfoVariant };
  pill?: { variant?: PillVariant };
  segmentedToggle?: { variant?: UcSegmentedToggleVariant };
  sidebarButton?: { style?: SidebarButtonStyle };
  tabs?: { variant?: UcTabsVariant };
}

export const UC_DEFAULTS = new InjectionToken<UcDefaults>('UC_DEFAULTS', {
  providedIn: 'root',
  factory: () => ({}),
});

/**
 * Sets which variant each control uses when the template does not choose one:
 *
 * ```ts
 * providers: [provideUcDefaults({ button: { variant: 'secondary' }, tabs: { variant: 'pills' } })]
 * ```
 *
 * Provided again in a lazy route, it is merged over the parent's defaults per control, so a route
 * only lists what it changes.
 */
export function provideUcDefaults(defaults: UcDefaults): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: UC_DEFAULTS,
      useFactory: () => mergeDefaults(inject(UC_DEFAULTS, { skipSelf: true, optional: true }) ?? {}, defaults),
    },
  ]);
}

function mergeDefaults(parent: UcDefaults, child: UcDefaults): UcDefaults {
  const merged: Record<string, object | undefined> = { ...parent };
  for (const [control, value] of Object.entries(child)) {
    merged[control] = { ...merged[control], ...value };
  }

  return merged as UcDefaults;
}
