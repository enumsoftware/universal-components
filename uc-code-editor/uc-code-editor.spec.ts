import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcCodeEditor } from './uc-code-editor';

describe('UcCodeEditor', () => {
  let component: UcCodeEditor;
  let fixture: ComponentFixture<UcCodeEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcCodeEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(UcCodeEditor);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'code-editor-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label when provided and hideLabel is false', () => {
    fixture.componentRef.setInput('label', 'Snippet');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label.uc-code-editor-label');

    expect(label?.textContent).toContain('Snippet');
    expect(label?.id).toBe('code-editor-1-label');
  });

  it('should not render the label when hideLabel is true', () => {
    fixture.componentRef.setInput('label', 'Snippet');
    fixture.componentRef.setInput('hideLabel', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label.uc-code-editor-label')).toBeNull();
  });

  it('should derive the language badge text from the language input', () => {
    fixture.componentRef.setInput('language', 'csharp');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('uc-pill');

    expect(badge?.textContent).toContain('C#');
  });

  it('should let a caller override the language badge text', () => {
    fixture.componentRef.setInput('language', 'csharp');
    fixture.componentRef.setInput('languageLabel', 'C# 12');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('uc-pill');

    expect(badge?.textContent).toContain('C# 12');
  });

  it('should hide the language badge when showLanguageBadge is false', () => {
    fixture.componentRef.setInput('showLanguageBadge', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('uc-pill')).toBeNull();
  });

  it('should default to edit mode and switch to preview when the mode input changes', () => {
    expect(component.mode()).toBe('edit');
    expect(component.isPreview()).toBe(false);

    fixture.componentRef.setInput('mode', 'preview');
    fixture.detectChanges();

    expect(component.mode()).toBe('preview');
    expect(component.isPreview()).toBe(true);
    expect(component.isReadOnly()).toBe(true);
  });

  it('should treat disabled and readonly as read-only even in edit mode', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(component.isReadOnly()).toBe(true);
  });

  it('should render validation errors when invalid and touched', () => {
    fixture.componentRef.setInput('invalid', true);
    component.touched.set(true);
    fixture.componentRef.setInput('errors', [{ kind: 'required', message: 'A snippet is required' }]);
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('.uc-code-editor-error-message');

    expect(message?.textContent).toContain('A snippet is required');
  });
});
