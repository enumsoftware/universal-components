import {
  Component,
  input,
  signal,
  output,
  contentChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'uc-accordion-item',
  
  imports: [CommonModule],
  templateUrl: './uc-accordion-item.html',
  styleUrl: './uc-accordion-item.css',
})
export class UcAccordionItem {
  title = input<string>('');
  isOpen = signal<boolean>(false);
  headerTemplate = contentChild('header', { read: TemplateRef });
  contentTemplate = contentChild('content', { read: TemplateRef });
  itemToggled = output<boolean>();

  toggleOpen() {
    this.isOpen.update((v) => !v);
    this.itemToggled.emit(this.isOpen());
  }
}
