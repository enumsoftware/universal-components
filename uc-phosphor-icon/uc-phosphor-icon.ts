import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export const PHOSPHOR_ICON_WEIGHT_OPTIONS = [
  'regular',
  'thin',
  'light',
  'bold',
  'fill',
  'duotone',
] as const;

export type PhosphorIconWeight = (typeof PHOSPHOR_ICON_WEIGHT_OPTIONS)[number];

@Component({
  selector: 'uc-phosphor-icon',
  imports: [],
  templateUrl: './uc-phosphor-icon.html',
  styleUrl: './uc-phosphor-icon.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcPhosphorIcon {
  icon = input.required<string>();
  weight = input<PhosphorIconWeight>('regular');

  iconClass = computed(() => {
    const weightClass = this.weight() === 'regular' ? '' : `ph-${this.weight()}`;
    return ['uc-phosphor-icon', 'ph', weightClass, `ph-${this.icon()}`].filter(Boolean).join(' ');
  });
}
