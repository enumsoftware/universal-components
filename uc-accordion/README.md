# UcAccordion Component

A generic, reusable accordion component with support for content projection.

## Features

- **Content Projection**: Define accordion items through `<ng-content>`
- **Customizable Headers**: Use simple titles or custom header templates
- **Smooth Animations**: Built-in expand/collapse animations
- **Accessible**: ARIA attributes and keyboard-friendly
- **Standalone Component**: Works with modern Angular standalone API
- **Signal-based State**: Uses Angular signals for reactive state management
- **CSS Variables**: Fully themeable with CSS custom properties

## Usage

### Basic Example

```typescript
import { Component } from '@angular/core';
import { UcAccordion } from './uc-accordion/uc-accordion';
import { UcAccordionItem } from './uc-accordion/uc-accordion-item';

@Component({
  selector: 'app-example',
  
  imports: [UcAccordion, UcAccordionItem],
  template: `
    <uc-accordion>
      <uc-accordion-item title="Item 1">
        <ng-template #content>
          <p>Content for item 1</p>
        </ng-template>
      </uc-accordion-item>
      <uc-accordion-item title="Item 2">
        <ng-template #content>
          <p>Content for item 2</p>
        </ng-template>
      </uc-accordion-item>
    </uc-accordion>
  `,
})
export class ExampleComponent {}
```

### Custom Header Template

```html
<uc-accordion>
  <uc-accordion-item>
    <ng-template #header>
      <div class="custom-header">
        <strong>Custom Header</strong>
      </div>
    </ng-template>
    <ng-template #content>
      <p>Content goes here</p>
    </ng-template>
  </uc-accordion-item>
</uc-accordion>
```

## API

### UcAccordion

#### Inputs

None (uses content projection)

#### Outputs

- `itemChanged: EventEmitter<{ item: UcAccordionItem; isOpen: boolean }>` - Emitted when an accordion item is toggled

### UcAccordionItem

#### Inputs UcAccordionItem

- `title: string` - The title displayed in the accordion header (optional if using custom header template)

#### Template References

- `#header` - Custom header template (optional)
- `#content` - Content template (required)

#### Outputs UcAccordionItem

- `itemToggled: EventEmitter<boolean>` - Emitted when the item is toggled, with the new open state

## Theming

The component uses CSS custom properties for theming. You can customize the following variables:

```css
--accordion-gap: 0.5rem;
--accordion-border: 1px solid var(--border-color, #e5e7eb);
--accordion-border-radius: 0.375rem;
--accordion-padding: 1rem;
--accordion-header-background: #f9fafb;
--accordion-header-hover-background: #f3f4f6;
--accordion-title-font-size: 1rem;
--accordion-title-font-weight: 500;
--accordion-title-color: #1f2937;
--accordion-icon-color: #6b7280;
--accordion-content-padding: 1rem;
--accordion-content-background: #ffffff;
--accordion-content-color: #4b5563;
--accordion-content-font-size: 0.875rem;
--accordion-content-line-height: 1.5;
--focus-color: #3b82f6;
```

## Accessibility

- ARIA attributes for expanded/collapsed state
- Keyboard accessible (clickable headers are interactive)
- Focus management with visible focus indicators
- Semantic HTML structure
