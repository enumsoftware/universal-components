import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

export const IMAGE_LIST_ITEM_STATUS_OPTIONS = ['uploading', 'ready', 'error'] as const;
export type ImageListItemStatus = (typeof IMAGE_LIST_ITEM_STATUS_OPTIONS)[number];

export interface UcImageListItem {
  id: string | number;
  url: string;
  alt: string;
  status?: ImageListItemStatus;
}

/**
 * Editable list of photos: add (file picker), remove, edit and reorder by drag or with the move
 * buttons (keyboard and screen reader friendly). The component does not upload anything itself;
 * it reports selected files and the host updates `items`.
 */
@Component({
  selector: 'uc-image-list',
  imports: [CdkDropList, CdkDrag],
  templateUrl: './uc-image-list.html',
  styleUrl: './uc-image-list.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcImageList {
  items = model<UcImageListItem[]>([]);
  max = input<number>(5);
  accept = input<string>('image/jpeg,image/png,image/webp');
  disabled = input<boolean>(false);
  editable = input<boolean>(true);
  addLabel = input<string>('Add photo');
  removeLabel = input<string>('Remove photo {index}');
  editLabel = input<string>('Edit photo {index}');
  moveBackLabel = input<string>('Move photo {index} back');
  moveForwardLabel = input<string>('Move photo {index} forward');
  countLabel = input<string>('{count} of {max} photos');

  filesSelected = output<File[]>();
  removed = output<UcImageListItem>();
  edit = output<UcImageListItem>();

  protected readonly remaining = computed<number>(() => Math.max(this.max() - this.items().length, 0));
  protected readonly canAdd = computed<boolean>(() => !this.disabled() && this.remaining() > 0);
  protected readonly countText = computed<string>(() =>
    this.countLabel().replace('{count}', String(this.items().length)).replace('{max}', String(this.max())),
  );

  protected label(template: string, index: number): string {
    return template.replace('{index}', String(index + 1));
  }

  protected onFilesChosen(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = Array.from(inputElement.files ?? []).slice(0, this.remaining());
    inputElement.value = '';

    if (files.length > 0) {
      this.filesSelected.emit(files);
    }
  }

  protected drop(event: CdkDragDrop<UcImageListItem[]>): void {
    this.move(event.previousIndex, event.currentIndex);
  }

  protected move(from: number, to: number): void {
    if (to < 0 || to >= this.items().length || from === to) {
      return;
    }

    const next = [...this.items()];
    moveItemInArray(next, from, to);
    this.items.set(next);
  }

  protected remove(item: UcImageListItem): void {
    this.items.update((items) => items.filter((existing) => existing.id !== item.id));
    this.removed.emit(item);
  }
}
