import {
  Component,
  input,
  signal,
  output,
  contentChild,
  TemplateRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'uc-accordion-item',

  imports: [CommonModule],
  templateUrl: './uc-accordion-item.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-accordion-item.css',
})
export class UcAccordionItem {
  private static nextId = 0;

  title = input<string>('');
  isOpen = signal<boolean>(false);
  headerTemplate = contentChild('header', { read: TemplateRef });
  contentTemplate = contentChild('content', { read: TemplateRef });
  itemToggled = output<boolean>();
  readonly panelId = `uc-accordion-panel-${UcAccordionItem.nextId}`;
  readonly triggerId = `uc-accordion-trigger-${UcAccordionItem.nextId++}`;

  toggleOpen() {
    this.isOpen.update((v) => !v);
    this.itemToggled.emit(this.isOpen());
  }
}
