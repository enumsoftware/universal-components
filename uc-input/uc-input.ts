import {
  Component,
  computed,
  contentChildren,
  Directive,
  input,
  model,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';

type UcInputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'datetime-local';

@Directive({
  selector: '[ucInputSuffix]',
})
export class UcInputSuffix {}

@Component({
  selector: 'uc-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './uc-input.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-input.css',
})
export class UcInput implements FormValueControl<string | number | null> {
  readonly id = input.required<string>();
  readonly label = input<string>('');
  readonly hideLabel = input<boolean>(false);
  readonly placeholder = input<string>('');
  readonly type = input<UcInputType>('text');
  readonly autocomplete = input<string>('off');
  readonly togglePassword = input<boolean>(false);

  value = model<string | number | null>(null);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  disabled = input<boolean>(false);
  disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  touched = model<boolean>(false);
  showErrorState = computed(() => this.invalid() && this.touched());

  private readonly projectedSuffix = contentChildren(UcInputSuffix, { descendants: true });
  private readonly passwordRevealed = signal<boolean>(false);

  readonly isPasswordToggle = computed<boolean>(
    () => this.togglePassword() && this.type() === 'password',
  );

  readonly hasProjectedSuffix = computed<boolean>(() => this.projectedSuffix().length > 0);

  readonly hasSuffix = computed<boolean>(
    () => this.hasProjectedSuffix() || this.isPasswordToggle(),
  );

  readonly effectiveType = computed<UcInputType>(() =>
    this.isPasswordToggle() && this.passwordRevealed() ? 'text' : this.type(),
  );

  readonly isPasswordRevealed = computed<boolean>(() => this.passwordRevealed());

  togglePasswordVisibility(): void {
    this.passwordRevealed.update((v) => !v);
  }
}
