import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'uc-flag',
  imports: [],
  templateUrl: './uc-flag.html',
  styleUrl: './uc-flag.scss',
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
