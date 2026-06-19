import {
  Component,
  signal,
  contentChildren,
  ContentChild,
  TemplateRef,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UcAccordionItem } from './uc-accordion-item';

@Component({
  selector: 'uc-accordion',

  imports: [CommonModule],
  templateUrl: './uc-accordion.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-accordion.css',
})
export class UcAccordion {
  items = contentChildren(UcAccordionItem);
  itemChanged = output<{ item: UcAccordionItem; isOpen: boolean }>();

  onItemToggle(item: UcAccordionItem, isOpen: boolean) {
    this.itemChanged.emit({ item, isOpen });
  }
}
