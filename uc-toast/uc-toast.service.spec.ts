import { TestBed } from '@angular/core/testing';
import { UcToastService } from './uc-toast.service';

describe('UcToastService', () => {
  let service: UcToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(UcToastService);
  });

  afterEach(() => {
    service.clear();
    vi.useRealTimers();
  });

  it('adds a toast with the info variant by default', () => {
    service.show('Saved');

    expect(service.toasts()).toHaveLength(1);
    expect(service.toasts()[0].variant).toBe('info');
  });

  it('closes a toast after its duration', () => {
    service.show('Saved', { duration: 1000 });

    vi.advanceTimersByTime(1000);

    expect(service.toasts()).toHaveLength(0);
  });

  it('keeps errors open longer than other toasts', () => {
    service.success('Saved');
    service.error('Failed');

    vi.advanceTimersByTime(5000);

    expect(service.toasts().map((toast) => toast.variant)).toEqual(['error']);
  });

  it('keeps a toast with duration 0 until it is dismissed', () => {
    const id = service.show('Stay', { duration: 0 });

    vi.advanceTimersByTime(60000);
    expect(service.toasts()).toHaveLength(1);

    service.dismiss(id);
    expect(service.toasts()).toHaveLength(0);
  });
});
