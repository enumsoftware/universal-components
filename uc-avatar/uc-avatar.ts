import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { UcPhosphorIcon } from '../uc-phosphor-icon/uc-phosphor-icon';

@Component({
  selector: 'uc-avatar',
  imports: [UcPhosphorIcon],
  templateUrl: './uc-avatar.html',
  styleUrl: './uc-avatar.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcAvatar {
  imageUrl = input<string | null>(null);
  initials = input<string | null>(null);
  backgroundColor = input<string | null>(null);
  icon = input<string>('user');
  size = input<string>('2.5rem');
  alt = input<string>('');

  private readonly failedImageUrl = signal<string | null>(null);

  protected readonly displayedImageUrl = computed(() => {
    const imageUrl = this.imageUrl();
    return imageUrl && imageUrl !== this.failedImageUrl() ? imageUrl : null;
  });
  protected readonly displayedInitials = computed(() => this.initials()?.trim() ?? '');

  protected handleImageError(): void {
    this.failedImageUrl.set(this.imageUrl());
  }
}