import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UcSelect, SelectOption } from './uc-select';

// Define User interface outside the component
interface User {
  id: number;
  name: string;
}

/**
 * Example usage of the UcSelectComponent
 *
 * This example demonstrates:
 * - Basic select with string values
 * - Select with icons
 * - Select with disabled options
 * - Two-way binding
 * - Error state handling
 */
@Component({
  selector: 'app-uc-select-example',

  imports: [CommonModule, UcSelect],
  template: `
    <div class="example-container">
      <!-- Example 1: Basic Select -->
      <section>
        <h2>Basic Select</h2>
        <uc-select
          id="country"
          label="Select Country"
          placeholder="Choose a country..."
          [options]="countryOptions"
          [(value)]="selectedCountry"
        />
        @if (selectedCountry) {
          <p>Selected: {{ selectedCountry }}</p>
        }
      </section>

      <!-- Example 2: Select with Icons -->
      <section>
        <h2>Select with Icons</h2>
        <uc-select
          id="status"
          label="Select Status"
          [options]="statusOptions"
          [(value)]="selectedStatus"
        />
        @if (selectedStatus) {
          <p>Selected Status: {{ selectedStatus }}</p>
        }
      </section>

      <!-- Example 3: Select with Disabled Options -->
      <section>
        <h2>Select with Disabled Options</h2>
        <uc-select
          id="priority"
          label="Select Priority"
          [options]="priorityOptions"
          [(value)]="selectedPriority"
        />
        @if (selectedPriority) {
          <p>Selected Priority: {{ selectedPriority }}</p>
        }
      </section>

      <!-- Example 4: Disabled Select -->
      <section>
        <h2>Disabled Select</h2>
        <uc-select
          id="disabled-select"
          label="This is disabled"
          placeholder="Cannot select..."
          [options]="countryOptions"
          [disabled]="true"
        />
      </section>

      <!-- Example 5: Select with Error State -->
      <section>
        <h2>Select with Error State</h2>
        <uc-select
          id="required-select"
          label="Required Field"
          placeholder="This field is required"
          [options]="countryOptions"
          [(value)]="selectedRequired"
          [invalid]="showError"
        />
        <button (click)="validateSelect()">Validate</button>
      </section>

      <!-- Example 6: Select with Complex Types -->
      <section>
        <h2>Select with Complex Types (Objects)</h2>
        <uc-select id="user" label="Select User" [options]="userOptions" [(value)]="selectedUser" />
        @if (selectedUser) {
          <p>Selected User: {{ selectedUser.name }} (ID: {{ selectedUser.id }})</p>
        }
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .example-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 2rem;
      }

      section {
        border: 1px solid #ddd;
        padding: 1.5rem;
        border-radius: 8px;
      }

      h2 {
        margin-top: 0;
        font-size: 1.25rem;
      }

      p {
        margin: 0.5rem 0 0 0;
        font-size: 0.9rem;
        color: #666;
      }

      button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background-color: #0066cc;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:hover {
        background-color: #0052a3;
      }
    `,
  ],
})
export class UcSelectExampleComponent {
  // Example 1: Basic select
  countryOptions: SelectOption<string>[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
  ];
  selectedCountry: string | null = null;

  // Example 2: Select with icons
  statusOptions: SelectOption<string>[] = [
    { value: 'active', label: 'Active', icon: '✓' },
    { value: 'inactive', label: 'Inactive', icon: '✕' },
    { value: 'pending', label: 'Pending', icon: '⏳' },
    { value: 'archived', label: 'Archived', icon: '📦' },
  ];
  selectedStatus: string | null = null;

  // Example 3: Select with disabled options
  priorityOptions: SelectOption<string>[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High', disabled: true },
    { value: 'critical', label: 'Critical', disabled: true },
  ];
  selectedPriority: string | null = null;

  // Example 5: Select with error validation
  selectedRequired: string | null = null;
  showError = false;

  // Example 6: Complex object selection
  userOptions: SelectOption<User>[] = [
    { value: { id: 1, name: 'John Doe' }, label: 'John Doe' },
    { value: { id: 2, name: 'Jane Smith' }, label: 'Jane Smith' },
    { value: { id: 3, name: 'Bob Johnson' }, label: 'Bob Johnson' },
  ];
  selectedUser: User | null = null;

  validateSelect(): void {
    this.showError = true;
    if (this.selectedRequired !== null) {
      this.showError = false;
      alert('Validation passed!');
    }
  }
}
