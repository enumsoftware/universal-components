import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcImageList, type UcImageListItem } from './uc-image-list';

const ITEMS: UcImageListItem[] = [
  { id: 1, url: 'one.jpg', alt: 'One' },
  { id: 2, url: 'two.jpg', alt: 'Two' },
  { id: 3, url: 'three.jpg', alt: 'Three' },
];

describe('UcImageList', () => {
  let fixture: ComponentFixture<UcImageList>;
  let component: UcImageList;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UcImageList] }).compileComponents();

    fixture = TestBed.createComponent(UcImageList);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.componentRef.setInput('items', ITEMS);
    fixture.detectChanges();
  });

  function button(label: string): HTMLButtonElement {
    return element.querySelector(`[aria-label="${label}"]`) as HTMLButtonElement;
  }

  it('moves a photo forward with the move button', () => {
    button('Move photo 1 forward').click();

    expect(component.items().map((item) => item.id)).toEqual([2, 1, 3]);
  });

  it('cannot move the first photo back or the last photo forward', () => {
    expect(button('Move photo 1 back').disabled).toBe(true);
    expect(button('Move photo 3 forward').disabled).toBe(true);
  });

  it('removes a photo and reports it', () => {
    const removed: UcImageListItem[] = [];
    component.removed.subscribe((item) => removed.push(item));

    button('Remove photo 2').click();

    expect(component.items().map((item) => item.id)).toEqual([1, 3]);
    expect(removed.map((item) => item.id)).toEqual([2]);
  });

  it('hides the add tile when the maximum is reached', () => {
    fixture.componentRef.setInput('max', 3);
    fixture.detectChanges();

    expect(element.querySelector('.uc-image-list__add')).toBeNull();
    expect(element.querySelector('.uc-image-list__count')?.textContent?.trim()).toBe('3 of 3 photos');
  });
});
