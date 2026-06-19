import {
  Component,
  ElementRef,
  computed,
  input,
  output,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UcIconButton } from '../uc-icon-button/uc-icon-button';

@Component({
  selector: 'uc-file-picker',
  imports: [CommonModule, UcIconButton],
  templateUrl: './uc-file-picker.html',
  styleUrl: './uc-file-picker.css',
  changeDetection: ChangeDetectionStrategy.Eager,
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
  readonly maxFileSizeBytes = input<number | null>(null);

  readonly selectedFile = signal<File | null>(null);
  readonly previewUrl = signal<string | null>(null);
  readonly fileSelected = output<string | null>();
  readonly fileChanged = output<File | null>();
  readonly isDragging = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

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
    this.processSelectedFile(file, input);
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
    this.processSelectedFile(file);
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
    this.errorMessage.set(null);
    this.fileSelected.emit(null);
    this.fileChanged.emit(null);
  }

  private processSelectedFile(file: File | null, input?: HTMLInputElement | null): void {
    this.errorMessage.set(null);
    this.selectedFile.set(file);

    if (!file) {
      this.previewUrl.set(null);
      this.fileSelected.emit(null);
      this.fileChanged.emit(null);
      return;
    }

    const maxFileSizeBytes = this.maxFileSizeBytes();
    if (maxFileSizeBytes && file.size > maxFileSizeBytes) {
      this.selectedFile.set(null);
      this.previewUrl.set(null);
      this.errorMessage.set(
        `File is too large. Maximum size is ${this.formatBytes(maxFileSizeBytes)}.`,
      );
      if (input) {
        input.value = '';
      }
      this.fileSelected.emit(null);
      this.fileChanged.emit(null);
      return;
    }

    this.readFile(file);
  }

  private formatBytes(bytes: number): string {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${bytes} B`;
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      this.previewUrl.set(result);
      this.fileChanged.emit(file);
      this.fileSelected.emit(result);
    };
    reader.onerror = () => {
      this.errorMessage.set('Failed to read the selected file.');
      this.previewUrl.set(null);
      this.fileChanged.emit(null);
      this.fileSelected.emit(null);
    };
    reader.readAsDataURL(file);
  }
}
