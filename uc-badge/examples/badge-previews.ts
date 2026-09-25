import { Component, input } from '@angular/core';

import { UcButton } from '../../uc-button/uc-button';
import {
  BADGE_POSITION_OPTIONS,
  BADGE_SIZE_OPTIONS,
  BADGE_VARIANT_OPTIONS,
  UcBadge,
  type UcBadgePosition,
  type UcBadgeSize,
  type UcBadgeVariant,
} from '../uc-badge';

const ROW_STYLES = `
  :host {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    padding: 3rem 1rem;
  }

  .icon {
    font-size: 1.75rem;
    color: var(--uc-foreground-color);
  }
`;

/** The badge on a button and on an icon, driven by the knobs. */
@Component({
  selector: 'uc-badge-preview',
  imports: [UcBadge, UcButton],
  styles: ROW_STYLES,
  template: `
    <uc-button
      text="Inbox"
      [ucBadge]="content()"
      [ucBadgePosition]="position()"
      [ucBadgeSize]="size()"
      [ucBadgeVariant]="variant()"
      [ucBadgeOverlap]="overlap()"
      [ucBadgeHidden]="hidden()"
      [ucBadgeDisabled]="disabled()"
      [ucBadgeMax]="max()"
      [ucBadgeDescription]="description()"
    />
    <i
      class="icon ph ph-bell"
      [ucBadge]="content()"
      [ucBadgePosition]="position()"
      [ucBadgeSize]="size()"
      [ucBadgeVariant]="variant()"
      [ucBadgeOverlap]="overlap()"
      [ucBadgeHidden]="hidden()"
      [ucBadgeDisabled]="disabled()"
      [ucBadgeMax]="max()"
      [ucBadgeDescription]="description()"
    ></i>
  `,
})
export class BadgePreview {
  readonly content = input<string>('4');
  readonly position = input<UcBadgePosition>('top-end');
  readonly size = input<UcBadgeSize>('medium');
  readonly variant = input<UcBadgeVariant>('error');
  readonly overlap = input<boolean>(true);
  readonly hidden = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly max = input<number | null>(99);
  readonly description = input<string>('4 unread messages');
}

/** Every corner, overlapping and beside the host. */
@Component({
  selector: 'uc-badge-positions-example',
  imports: [UcBadge, UcButton],
  styles: ROW_STYLES,
  template: `
    @for (position of positions; track position) {
      <uc-button [text]="position" ucBadge="8" [ucBadgePosition]="position" />
    }
    @for (position of positions; track position) {
      <uc-button [text]="position" ucBadge="8" [ucBadgePosition]="position" [ucBadgeOverlap]="false" />
    }
  `,
})
export class BadgePositionsExample {
  protected readonly positions = BADGE_POSITION_OPTIONS;
}

/** `small` is a dot without text; `ucBadgeMax` caps a long count. */
@Component({
  selector: 'uc-badge-sizes-example',
  imports: [UcBadge],
  styles: ROW_STYLES,
  template: `
    @for (size of sizes; track size) {
      <i class="icon ph ph-envelope-simple" ucBadge="128" [ucBadgeMax]="99" [ucBadgeSize]="size"></i>
    }
  `,
})
export class BadgeSizesExample {
  protected readonly sizes = BADGE_SIZE_OPTIONS;
}

@Component({
  selector: 'uc-badge-variants-example',
  imports: [UcBadge],
  styles: ROW_STYLES,
  template: `
    @for (variant of variants; track variant) {
      <i class="icon ph ph-chat-circle" ucBadge="3" [ucBadgeVariant]="variant"></i>
    }
    <i class="icon ph ph-chat-circle" ucBadge="3" ucBadgeDisabled></i>
  `,
})
export class BadgeVariantsExample {
  protected readonly variants = BADGE_VARIANT_OPTIONS;
}
