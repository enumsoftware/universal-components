import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dialog } from '@angular/cdk/dialog';
import { Subject } from 'rxjs';
import { UcFilePicker } from './uc-file-picker';

describe('UcFilePicker', () => {
  let component: UcFilePicker;
  let fixture: ComponentFixture<UcFilePicker>;
  let dialogClosed: Subject<File | null | undefined>;
  let dialogOpen: ReturnType<typeof vi.fn>;

  const makeFile = (sizeBytes: number, name = 'logo.png', type = 'image/png'): File =>
    new File(['a'.repeat(sizeBytes)], name, { type });

  const dropFile = (file: File): void => {
    component.onDrop({
      preventDefault: () => undefined,
      dataTransfer: { files: [file] },
    } as unknown as DragEvent);
  };

  beforeEach(async () => {
    dialogClosed = new Subject<File | null | undefined>();
    dialogOpen = vi.fn(() => ({ closed: dialogClosed.asObservable() }));

    await TestBed.configureTestingModule({
      imports: [UcFilePicker],
      providers: [{ provide: Dialog, useValue: { open: dialogOpen } }],
    }).compileComponents();

    fixture = TestBed.createComponent(UcFilePicker);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'file-picker-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reject a file larger than maxFileSizeBytes', () => {
    fixture.componentRef.setInput('maxFileSizeBytes', 1024);
    fixture.detectChanges();

    dropFile(makeFile(2048));

    expect(component.errorMessage()).toBe('File is too large. Maximum size is 1.0 KB.');
    expect(component.selectedFile()).toBeNull();
    expect(component.previewUrl()).toBeNull();
  });

  it('should render the size error message', () => {
    fixture.componentRef.setInput('maxFileSizeBytes', 1024);
    fixture.detectChanges();

    dropFile(makeFile(2048));
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.uc-file-picker__error');
    expect(error).toBeTruthy();
    expect(error.textContent).toContain('Maximum size is 1.0 KB.');
  });

  it('should emit null when a file is rejected for size', () => {
    fixture.componentRef.setInput('maxFileSizeBytes', 1024);
    fixture.detectChanges();

    const selected: (string | null)[] = [];
    const changed: (File | null)[] = [];
    component.fileSelected.subscribe((value) => selected.push(value));
    component.fileChanged.subscribe((value) => changed.push(value));

    dropFile(makeFile(2048));

    expect(selected).toEqual([null]);
    expect(changed).toEqual([null]);
  });

  it('should accept a file within maxFileSizeBytes', () => {
    fixture.componentRef.setInput('maxFileSizeBytes', 4096);
    fixture.detectChanges();

    const file = makeFile(1024);
    dropFile(file);

    expect(component.errorMessage()).toBeNull();
    expect(component.selectedFile()).toBe(file);
  });

  it('should accept any size when no limit is set', () => {
    dropFile(makeFile(8192));

    expect(component.errorMessage()).toBeNull();
    expect(component.selectedFile()).not.toBeNull();
  });

  it('should clear a previous size error on a subsequent valid file', () => {
    fixture.componentRef.setInput('maxFileSizeBytes', 1024);
    fixture.detectChanges();

    dropFile(makeFile(2048));
    expect(component.errorMessage()).not.toBeNull();

    dropFile(makeFile(512));
    expect(component.errorMessage()).toBeNull();
  });

  it('should format the limit in MB for megabyte-sized values', () => {
    fixture.componentRef.setInput('maxFileSizeBytes', 5 * 1024 * 1024);
    fixture.detectChanges();

    dropFile(makeFile(6 * 1024 * 1024));

    expect(component.errorMessage()).toBe('File is too large. Maximum size is 5.0 MB.');
  });

  it('should open the image editor before selecting an image when enabled', () => {
    fixture.componentRef.setInput('editImages', true);
    fixture.detectChanges();

    const original = makeFile(512);
    dropFile(original);

    expect(dialogOpen).toHaveBeenCalledOnce();
    expect(component.selectedFile()).toBeNull();

    const edited = makeFile(256, 'edited.png');
    dialogClosed.next(edited);

    expect(component.selectedFile()).toBe(edited);
  });

  it('should bypass the image editor for non-image files', () => {
    fixture.componentRef.setInput('editImages', true);
    fixture.detectChanges();

    const document = makeFile(512, 'document.pdf', 'application/pdf');
    dropFile(document);

    expect(dialogOpen).not.toHaveBeenCalled();
    expect(component.selectedFile()).toBe(document);
  });

  it('should leave the current selection unchanged when editing is cancelled', () => {
    fixture.componentRef.setInput('editImages', true);
    fixture.detectChanges();

    dropFile(makeFile(512));
    dialogClosed.next(null);

    expect(component.selectedFile()).toBeNull();
  });
});
