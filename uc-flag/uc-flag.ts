import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uc-flag',
  imports: [],
  templateUrl: './uc-flag.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-flag.css',
})
export class UcFlag {
  countryCode = input.required<string | null>();
  countryCodeComputed = computed(() => {
    const code = this.countryCode();
    return code ?? 'xx';
  });
  size = input<string>('1em');
  circular = input<boolean>(false);
}
