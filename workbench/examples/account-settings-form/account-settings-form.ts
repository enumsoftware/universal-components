import { Component, DestroyRef, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';

import { UcAvatar } from '../../../uc-avatar/uc-avatar';
import { UcButton } from '../../../uc-button/uc-button';
import { UcCard } from '../../../uc-card/uc-card';
import { UcCheckbox } from '../../../uc-checkbox/uc-checkbox';
import { UcDateTimePicker } from '../../../uc-date-time-picker/uc-date-time-picker';
import { UcDivider } from '../../../uc-divider/uc-divider';
import { UcIconButton } from '../../../uc-icon-button/uc-icon-button';
import { UcInput } from '../../../uc-input/uc-input';
import { UcPill } from '../../../uc-pill/uc-pill';
import { UcSelect, type SelectOption } from '../../../uc-select/uc-select';
import { UcTextarea } from '../../../uc-textarea/uc-textarea';
import { UcToggle } from '../../../uc-toggle/uc-toggle';
import { initialsFor } from '../shared/demo-utils';

/**
 * Doubles as the baseline for the "unsaved changes" comparison, so Save and
 * Reset both have a single source of truth for "what the server last saw".
 */
const INITIAL = {
  fullName: 'Ava Jensen',
  email: 'ava.jensen@example.com',
  role: 'admin',
  timezone: 'cet',
  birthday: '1994-03-12',
  bio: 'Product designer focused on building clear, accessible interfaces.',
  emailNotifications: true,
  smsAlerts: false,
  weeklyDigest: true,
  marketingConsent: false,
} as const;

const SAVED_PILL_DURATION_MS = 2000;

/**
 * A profile/settings form - the layout every one of these controls ends up in
 * in a real app, exercising the height-standardized uc-input, uc-select and
 * uc-date-time-picker side by side in the same grid row.
 */
@Component({
  selector: 'wb-account-settings-form-example',
  imports: [
    UcAvatar,
    UcButton,
    UcCard,
    UcCheckbox,
    UcDateTimePicker,
    UcDivider,
    UcIconButton,
    UcInput,
    UcPill,
    UcSelect,
    UcTextarea,
    UcToggle,
  ],
  templateUrl: './account-settings-form.html',
  styleUrl: './account-settings-form.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class WbAccountSettingsFormExample {
  readonly roleOptions: SelectOption[] = [
    { value: 'owner', label: 'Owner' },
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ];

  readonly timezoneOptions: SelectOption[] = [
    { value: 'pst', label: 'Pacific Time (PST)' },
    { value: 'cet', label: 'Central European Time (CET)' },
    { value: 'ist', label: 'India Standard Time (IST)' },
    { value: 'jst', label: 'Japan Standard Time (JST)' },
  ];

  readonly fullName = signal<string>(INITIAL.fullName);
  readonly email = signal<string>(INITIAL.email);
  readonly role = signal<string>(INITIAL.role);
  readonly timezone = signal<string>(INITIAL.timezone);
  readonly birthday = signal<string>(INITIAL.birthday);
  readonly bio = signal<string | null>(INITIAL.bio);
  readonly emailNotifications = signal<boolean>(INITIAL.emailNotifications);
  readonly smsAlerts = signal<boolean>(INITIAL.smsAlerts);
  readonly weeklyDigest = signal<boolean>(INITIAL.weeklyDigest);
  readonly marketingConsent = signal<boolean>(INITIAL.marketingConsent);

  readonly initials = computed(() => initialsFor(this.fullName() || 'A A'));

  private readonly snapshot = computed(() => ({
    fullName: this.fullName(),
    email: this.email(),
    role: this.role(),
    timezone: this.timezone(),
    birthday: this.birthday(),
    bio: this.bio(),
    emailNotifications: this.emailNotifications(),
    smsAlerts: this.smsAlerts(),
    weeklyDigest: this.weeklyDigest(),
    marketingConsent: this.marketingConsent(),
  }));

  private readonly baseline = signal(this.snapshot());

  readonly isDirty = computed(
    () => JSON.stringify(this.snapshot()) !== JSON.stringify(this.baseline()),
  );

  readonly savedJustNow = signal(false);

  private savedTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.savedTimeout));
  }

  save(): void {
    this.baseline.set(this.snapshot());
    this.savedJustNow.set(true);
    clearTimeout(this.savedTimeout);
    this.savedTimeout = setTimeout(() => this.savedJustNow.set(false), SAVED_PILL_DURATION_MS);
  }

  reset(): void {
    const base = this.baseline();

    this.fullName.set(base.fullName);
    this.email.set(base.email);
    this.role.set(base.role);
    this.timezone.set(base.timezone);
    this.birthday.set(base.birthday);
    this.bio.set(base.bio);
    this.emailNotifications.set(base.emailNotifications);
    this.smsAlerts.set(base.smsAlerts);
    this.weeklyDigest.set(base.weeklyDigest);
    this.marketingConsent.set(base.marketingConsent);
  }
}
