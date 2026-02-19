import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'uc-divider',
  imports: [NgClass],
  templateUrl: './uc-divider.html',
  styleUrl: './uc-divider.scss',
})
export class UcDivider {
  inverse = input<boolean>(false);
  vertical = input<boolean>(false);
}
