import { Component, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UcIconButton } from '../uc-icon-button/uc-icon-button';

@Component({
  selector: 'uc-file-picker',
  imports: [CommonModule, UcIconButton],
  templateUrl: './uc-file-picker.html',
  styleUrl: './uc-file-picker.scss',
  host: {
    class: 'uc-file-picker',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
  },
})
export class UcFilePicker {
  readonly id = input.required<string>();
  readonly label = input<string>('Choose file');
  readonly accept = input<string>('image/*,image/svg+xml');
  readonly helperText = input<string>('');
  readonly disabled = input<boolean>(false);

  readonly selectedFile = signal<File | null>(null);
  readonly previewUrl = signal<string | null>(null);
  readonly fileSelected = output<string | null>();
  readonly isDragging = signal<boolean>(false);

  readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  triggerSelect(): void {
    if (this.disabled()) {
      return;
    }

    const inputRef = this.fileInput();
    inputRef?.nativeElement.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0] ?? null;

    this.selectedFile.set(file);

    if (!file) {
      this.previewUrl.set(null);
      this.fileSelected.emit(null);
      return;
    }

    this.readFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (this.disabled()) {
      return;
    }
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (this.disabled()) {
      return;
    }

    this.isDragging.set(false);

    const file = event.dataTransfer?.files?.[0] ?? null;
    if (!file) {
      return;
    }

    this.selectedFile.set(file);
    this.readFile(file);
  }

  clearSelection(): void {
    if (this.disabled()) {
      return;
    }

    const inputRef = this.fileInput();
    if (inputRef) {
      inputRef.nativeElement.value = '';
    }

    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.fileSelected.emit(null);
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      this.previewUrl.set(result);
      this.fileSelected.emit(result);
    };
    reader.readAsDataURL(file);
  }
}
