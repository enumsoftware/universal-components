import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { UcAccordionItem } from '../uc-accordion/uc-accordion-item';
import { UcButton } from '../uc-button/uc-button';
import { UcButtonToggle } from '../uc-button-toggle/uc-button-toggle';
import { UcButtonToggleItem } from '../uc-button-toggle/uc-button-toggle-item';
import { UcIconButton } from '../uc-icon-button/uc-icon-button';
import { UcInput, UcInputSuffix } from '../uc-input/uc-input';

export type UcImageEditorDialogData = {
  file: File;
  title?: string;
};

type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CropCorner = 'north-west' | 'north-east' | 'south-east' | 'south-west';

type Point = {
  x: number;
  y: number;
};

type AspectRatio = 'free' | '1:1' | '16:9' | '9:16';

const MAX_WORKING_DIMENSION = 4096;
const HANDLE_RADIUS_PX = 8;
const HANDLE_HIT_RADIUS_PX = 18;

@Component({
  selector: 'uc-image-editor-dialog',
  imports: [
    UcAccordionItem,
    UcButton,
    UcButtonToggle,
    UcButtonToggleItem,
    UcIconButton,
    UcInput,
    UcInputSuffix,
  ],
  templateUrl: './uc-image-editor-dialog.html',
  styleUrl: './uc-image-editor-dialog.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcImageEditorDialog {
  private static nextId = 0;

  readonly instanceId = `uc-image-editor-dialog-${UcImageEditorDialog.nextId++}`;
  readonly titleId = `${this.instanceId}-title`;
  readonly title = signal('Edit image');
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly crop = signal<CropRect>({ x: 0, y: 0, width: 0, height: 0 });
  readonly canvasCursor = signal('crosshair');
  readonly aspectRatio = signal<AspectRatio>('free');

  readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  readonly canvasShell = viewChild.required<ElementRef<HTMLDivElement>>('canvasShell');

  private readonly data = inject<UcImageEditorDialogData>(DIALOG_DATA);
  private readonly dialogRef = inject<DialogRef<File | null>>(DialogRef);
  private workingCanvas: HTMLCanvasElement | null = null;
  private dragMode: 'new' | 'resize' | 'move' | null = null;
  private dragOrigin: Point | null = null;
  private moveOffset: Point | null = null;
  private objectUrl: string | null = null;

  constructor() {
    if (this.data.title) {
      this.title.set(this.data.title);
    }

    afterNextRender(() => this.loadImage());
  }

  rotate(degrees: -90 | 90): void {
    const source = this.workingCanvas;
    if (!source) {
      return;
    }

    const rotated = document.createElement('canvas');
    rotated.width = source.height;
    rotated.height = source.width;
    const context = rotated.getContext('2d');
    if (!context) {
      return;
    }

    context.translate(rotated.width / 2, rotated.height / 2);
    context.rotate((degrees * Math.PI) / 180);
    context.drawImage(source, -source.width / 2, -source.height / 2);
    this.replaceWorkingCanvas(rotated);
  }

  flip(horizontal: boolean): void {
    const source = this.workingCanvas;
    if (!source) {
      return;
    }

    const flipped = document.createElement('canvas');
    flipped.width = source.width;
    flipped.height = source.height;
    const context = flipped.getContext('2d');
    if (!context) {
      return;
    }

    context.translate(horizontal ? source.width : 0, horizontal ? 0 : source.height);
    context.scale(horizontal ? -1 : 1, horizontal ? 1 : -1);
    context.drawImage(source, 0, 0);
    this.replaceWorkingCanvas(flipped);
  }

  onPointerDown(event: PointerEvent): void {
    if (!this.workingCanvas) {
      return;
    }

    const point = this.toCanvasPoint(event);
    const corner = this.cornerAt(event);
    if (corner) {
      this.dragMode = 'resize';
      this.dragOrigin = this.oppositeCorner(corner);
    } else if (this.isInsideCrop(point)) {
      const crop = this.crop();
      this.dragMode = 'move';
      this.moveOffset = { x: point.x - crop.x, y: point.y - crop.y };
      this.canvasCursor.set('grabbing');
    } else {
      this.dragMode = 'new';
      this.dragOrigin = point;
      this.crop.set({ x: point.x, y: point.y, width: 0, height: 0 });
    }
    this.canvasShell().nativeElement.setPointerCapture(event.pointerId);
    this.render();
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.dragMode) {
      this.updateCursor(event);
      return;
    }

    const point = this.toCanvasPoint(event);
    if (this.dragMode === 'move') {
      this.moveCrop(point);
      this.render();
      return;
    }

    if (!this.dragOrigin) {
      return;
    }

    this.crop.set(this.rectFromPoints(this.dragOrigin, point));
    this.render();
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.dragMode) {
      return;
    }

    this.canvasShell().nativeElement.releasePointerCapture(event.pointerId);
    const shouldReset = this.dragMode !== 'move' && (this.crop().width < 2 || this.crop().height < 2);
    this.dragMode = null;
    this.dragOrigin = null;
    this.moveOffset = null;
    if (shouldReset) {
      this.clearCrop();
    }
    this.updateCursor(event);
  }

  onPointerLeave(): void {
    if (!this.dragMode) {
      this.canvasCursor.set('crosshair');
    }
  }

  updateCrop(field: keyof CropRect, inputValue: string | number | null): void {
    const value = Number(inputValue);
    if (!Number.isFinite(value) || !this.workingCanvas) {
      return;
    }

    const current = this.crop();
    const next = { ...current, [field]: Math.round(value) };
    next.x = Math.max(0, Math.min(next.x, this.workingCanvas.width - 1));
    next.y = Math.max(0, Math.min(next.y, this.workingCanvas.height - 1));
    next.width = Math.max(1, Math.min(next.width, this.workingCanvas.width - next.x));
    next.height = Math.max(1, Math.min(next.height, this.workingCanvas.height - next.y));
    this.crop.set(this.constrainCropSize(next, field));
    this.render();
  }

  setAspectRatio(value: string): void {
    if (!this.isAspectRatio(value)) {
      return;
    }

    this.aspectRatio.set(value);
    const ratio = this.selectedRatio();
    if (ratio && this.workingCanvas && this.hasCrop()) {
      this.crop.set(
        this.fitRectToRatio(
          { x: 0, y: 0, width: this.workingCanvas.width, height: this.workingCanvas.height },
          ratio,
        ),
      );
    }
    this.render();
  }

  clearCrop(): void {
    this.crop.set({ x: 0, y: 0, width: 0, height: 0 });
    this.render();
  }

  hasCrop(): boolean {
    return this.crop().width >= 2 && this.crop().height >= 2;
  }

  cornerLeft(corner: CropCorner): string {
    if (!this.workingCanvas) {
      return '0%';
    }

    return `${(this.cropCorners()[corner].x / this.workingCanvas.width) * 100}%`;
  }

  cornerTop(corner: CropCorner): string {
    if (!this.workingCanvas) {
      return '0%';
    }

    return `${(this.cropCorners()[corner].y / this.workingCanvas.height) * 100}%`;
  }

  apply(): void {
    const source = this.workingCanvas;
    const crop = this.crop();
    if (!source || crop.width < 1 || crop.height < 1) {
      return;
    }

    const output = document.createElement('canvas');
    output.width = Math.round(crop.width);
    output.height = Math.round(crop.height);
    const context = output.getContext('2d');
    if (!context) {
      this.errorMessage.set('The edited image could not be created.');
      return;
    }

    context.drawImage(
      source,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      output.width,
      output.height,
    );

    const type = this.outputType();
    output.toBlob((blob) => {
      if (!blob) {
        this.errorMessage.set('The edited image could not be created.');
        return;
      }

      this.dialogRef.close(
        new File([blob], this.outputName(type), {
          type,
          lastModified: Date.now(),
        }),
      );
    }, type, 0.92);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  private loadImage(): void {
    this.objectUrl = URL.createObjectURL(this.data.file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, MAX_WORKING_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
      this.replaceWorkingCanvas(canvas);
      this.loading.set(false);
      this.revokeObjectUrl();
    };
    image.onerror = () => {
      this.loading.set(false);
      this.errorMessage.set('The selected image could not be loaded.');
      this.revokeObjectUrl();
    };
    image.src = this.objectUrl;
  }

  private replaceWorkingCanvas(canvas: HTMLCanvasElement): void {
    this.workingCanvas = canvas;
    const displayCanvas = this.canvas().nativeElement;
    displayCanvas.width = canvas.width;
    displayCanvas.height = canvas.height;
    this.clearCrop();
  }

  private render(): void {
    const source = this.workingCanvas;
    if (!source) {
      return;
    }

    const canvas = this.canvas().nativeElement;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const crop = this.crop();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(source, 0, 0);
    if (!this.hasCrop()) {
      return;
    }

    context.fillStyle = 'rgba(0, 0, 0, 0.55)';
    context.fillRect(0, 0, canvas.width, crop.y);
    context.fillRect(0, crop.y + crop.height, canvas.width, canvas.height - crop.y - crop.height);
    context.fillRect(0, crop.y, crop.x, crop.height);
    context.fillRect(crop.x + crop.width, crop.y, canvas.width - crop.x - crop.width, crop.height);
    context.strokeStyle = '#ffffff';
    context.lineWidth = Math.max(2, Math.min(canvas.width, canvas.height) / 300);
    context.setLineDash([10, 8]);
    context.strokeRect(crop.x, crop.y, crop.width, crop.height);
    context.setLineDash([]);
  }

  private toCanvasPoint(event: PointerEvent): Point {
    const canvas = this.canvas().nativeElement;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(canvas.width, ((event.clientX - bounds.left) / bounds.width) * canvas.width)),
      y: Math.max(0, Math.min(canvas.height, ((event.clientY - bounds.top) / bounds.height) * canvas.height)),
    };
  }

  private rectFromPoints(start: Point, end: Point): CropRect {
    const rect = {
      x: Math.round(Math.min(start.x, end.x)),
      y: Math.round(Math.min(start.y, end.y)),
      width: Math.round(Math.abs(end.x - start.x)),
      height: Math.round(Math.abs(end.y - start.y)),
    };
    const ratio = this.selectedRatio();
    if (!ratio) {
      return rect;
    }

    const width = Math.min(rect.width, rect.height * ratio);
    const height = width / ratio;
    return {
      x: Math.round(end.x < start.x ? start.x - width : start.x),
      y: Math.round(end.y < start.y ? start.y - height : start.y),
      width: Math.round(width),
      height: Math.round(height),
    };
  }

  private isAspectRatio(value: string): value is AspectRatio {
    return value === 'free' || value === '1:1' || value === '16:9' || value === '9:16';
  }

  private selectedRatio(): number | null {
    const ratios: Record<AspectRatio, number | null> = {
      free: null,
      '1:1': 1,
      '16:9': 16 / 9,
      '9:16': 9 / 16,
    };
    return ratios[this.aspectRatio()];
  }

  private fitRectToRatio(rect: CropRect, ratio: number): CropRect {
    const width = Math.min(rect.width, rect.height * ratio);
    const height = width / ratio;
    return {
      x: Math.round(rect.x + (rect.width - width) / 2),
      y: Math.round(rect.y + (rect.height - height) / 2),
      width: Math.max(1, Math.round(width)),
      height: Math.max(1, Math.round(height)),
    };
  }

  private constrainCropSize(crop: CropRect, changedField: keyof CropRect): CropRect {
    const ratio = this.selectedRatio();
    if (!ratio || !this.workingCanvas) {
      return crop;
    }

    const maxWidth = this.workingCanvas.width - crop.x;
    const maxHeight = this.workingCanvas.height - crop.y;
    const requestedWidth = changedField === 'height' ? crop.height * ratio : crop.width;
    const width = Math.min(requestedWidth, maxWidth, maxHeight * ratio);
    return {
      ...crop,
      width: Math.max(1, Math.round(width)),
      height: Math.max(1, Math.round(width / ratio)),
    };
  }

  private cropCorners(): Record<CropCorner, Point> {
    const crop = this.crop();
    return {
      'north-west': { x: crop.x, y: crop.y },
      'north-east': { x: crop.x + crop.width, y: crop.y },
      'south-east': { x: crop.x + crop.width, y: crop.y + crop.height },
      'south-west': { x: crop.x, y: crop.y + crop.height },
    };
  }

  private cornerAt(event: PointerEvent): CropCorner | null {
    const canvas = this.canvas().nativeElement;
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) {
      return null;
    }

    const point = this.toCanvasPoint(event);
    const hitRadiusX = HANDLE_HIT_RADIUS_PX * (canvas.width / bounds.width);
    const hitRadiusY = HANDLE_HIT_RADIUS_PX * (canvas.height / bounds.height);

    for (const [corner, position] of Object.entries(this.cropCorners()) as [CropCorner, Point][]) {
      const distance = Math.hypot(
        (point.x - position.x) / hitRadiusX,
        (point.y - position.y) / hitRadiusY,
      );
      if (distance <= 1) {
        return corner;
      }
    }

    return null;
  }

  private oppositeCorner(corner: CropCorner): Point {
    const corners = this.cropCorners();
    const opposite: Record<CropCorner, CropCorner> = {
      'north-west': 'south-east',
      'north-east': 'south-west',
      'south-east': 'north-west',
      'south-west': 'north-east',
    };
    return corners[opposite[corner]];
  }

  private updateCursor(event: PointerEvent): void {
    const corner = this.cornerAt(event);
    if (corner === 'north-west' || corner === 'south-east') {
      this.canvasCursor.set('nwse-resize');
      return;
    }
    if (corner === 'north-east' || corner === 'south-west') {
      this.canvasCursor.set('nesw-resize');
      return;
    }
    if (this.isInsideCrop(this.toCanvasPoint(event))) {
      this.canvasCursor.set('grab');
      return;
    }
    this.canvasCursor.set('crosshair');
  }

  private isInsideCrop(point: Point): boolean {
    const crop = this.crop();
    return (
      point.x >= crop.x &&
      point.x <= crop.x + crop.width &&
      point.y >= crop.y &&
      point.y <= crop.y + crop.height
    );
  }

  private moveCrop(point: Point): void {
    if (!this.workingCanvas || !this.moveOffset) {
      return;
    }

    const crop = this.crop();
    this.crop.set({
      ...crop,
      x: Math.round(
        Math.max(0, Math.min(point.x - this.moveOffset.x, this.workingCanvas.width - crop.width)),
      ),
      y: Math.round(
        Math.max(0, Math.min(point.y - this.moveOffset.y, this.workingCanvas.height - crop.height)),
      ),
    });
  }

  private outputType(): string {
    return ['image/jpeg', 'image/png', 'image/webp'].includes(this.data.file.type)
      ? this.data.file.type
      : 'image/png';
  }

  private outputName(type: string): string {
    if (type === this.data.file.type) {
      return this.data.file.name;
    }

    return `${this.data.file.name.replace(/\.[^.]+$/, '') || 'image'}.png`;
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}