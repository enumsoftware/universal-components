import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { vi } from 'vitest';
import { UcConfirmationDialog } from './uc-confirmation-dialog';

describe('UcConfirmationDialog', () => {
  let component: UcConfirmationDialog;
  let fixture: ComponentFixture<UcConfirmationDialog>;
  let dialogRefSpy: Pick<DialogRef<boolean>, 'close'>;

  beforeEach(async () => {
    dialogRefSpy = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [UcConfirmationDialog],
      providers: [
        {
          provide: DialogRef,
          useValue: dialogRefSpy,
        },
        {
          provide: DIALOG_DATA,
          useValue: {
            title: 'Delete API Key',
            message: 'Are you sure?',
            positiveButtonText: 'Delete',
            negativeButtonText: 'Cancel',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UcConfirmationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read data from dialog payload', () => {
    expect(component.title()).toBe('Delete API Key');
    expect(component.message()).toBe('Are you sure?');
    expect(component.positiveButtonText()).toBe('Delete');
    expect(component.negativeButtonText()).toBe('Cancel');
  });

  it('should close dialog with true on positive action', () => {
    component.positiveClicked();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false on negative action', () => {
    component.negativeClicked();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
