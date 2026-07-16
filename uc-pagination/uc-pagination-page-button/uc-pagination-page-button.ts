import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export const PAGINATION_PAGE_BUTTON_VARIANTS = ['primary', 'secondary'] as const;
export type PaginationPageButtonVariant = (typeof PAGINATION_PAGE_BUTTON_VARIANTS)[number];

@Component({
  selector: 'uc-pagination-page-button',
  templateUrl: './uc-pagination-page-button.html',
  styleUrl: './uc-pagination-page-button.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcPaginationPageButton {
  label = input<string>('');
  ariaLabel = input<string>('');
  phosphorIcon = input<string>('');
  phosphorWeight = input<string>('bold');
  variant = input<PaginationPageButtonVariant>('secondary');
  active = input<boolean>(false);
  disabled = input<boolean>(false);

  clicked = output<void>();

  onClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }

    this.clicked.emit();
  }
}
