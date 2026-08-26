import { Component, input, output } from "@angular/core";

import type { ResolvedKnob } from "../core";

export interface KnobChange {
  readonly name: string;
  readonly value: unknown;
}

/** The controls panel: one row per declared knob. */
@Component({
  selector: "wb-knob-panel",
  template: `
    @if (knobs().length === 0) {
      <p class="wb-empty">This showcase declares no knobs.</p>
    } @else {
      <dl class="wb-knobs">
        @for (entry of knobs(); track entry.name) {
          <div class="wb-knob">
            <dt>
              <label [attr.for]="'knob-' + entry.name">{{ entry.label }}</label>
              @if (entry.knob.description) {
                <span class="wb-knob-hint">{{ entry.knob.description }}</span>
              }
            </dt>
            <dd>
              @switch (entry.knob.kind) {
                @case ("boolean") {
                  <input
                    type="checkbox"
                    [id]="'knob-' + entry.name"
                    [checked]="asBoolean(values()[entry.name])"
                    (change)="emitChecked(entry.name, $event)"
                  />
                }
                @case ("number") {
                  <input
                    type="number"
                    [id]="'knob-' + entry.name"
                    [value]="asString(values()[entry.name])"
                    (input)="emitNumber(entry.name, $event)"
                  />
                }
                @case ("select") {
                  <select
                    [id]="'knob-' + entry.name"
                    [value]="selectedIndex(entry)"
                    (change)="emitOption(entry, $event)"
                  >
                    @for (option of options(entry); track $index) {
                      <option [value]="$index">{{ asLabel(option) }}</option>
                    }
                  </select>
                }
                @case ("color") {
                  <input
                    type="color"
                    [id]="'knob-' + entry.name"
                    [value]="asString(values()[entry.name]) || '#000000'"
                    (input)="emitText(entry.name, $event)"
                  />
                }
                @case ("object") {
                  <textarea
                    [id]="'knob-' + entry.name"
                    rows="4"
                    [value]="asJson(values()[entry.name])"
                    (change)="emitJson(entry.name, $event)"
                  ></textarea>
                }
                @default {
                  <input
                    type="text"
                    [id]="'knob-' + entry.name"
                    [placeholder]="placeholder(entry)"
                    [value]="asString(values()[entry.name])"
                    (input)="emitText(entry.name, $event)"
                  />
                }
              }
            </dd>
          </div>
        }
      </dl>
    }
  `,
  styles: `
    .wb-knobs {
      margin: 0;
      display: grid;
      gap: 0.75rem;
    }

    .wb-knob {
      display: grid;
      grid-template-columns: minmax(6rem, 10rem) 1fr;
      gap: 0.75rem;
      align-items: start;
    }

    dt {
      display: grid;
      gap: 0.15rem;
      font-size: 0.8125rem;
      padding-top: 0.3rem;
    }

    dd {
      margin: 0;
    }

    .wb-knob-hint {
      color: var(--wb-muted);
      font-size: 0.75rem;
    }

    input[type="text"],
    input[type="number"],
    select,
    textarea {
      width: 100%;
      font: inherit;
      font-size: 0.8125rem;
      padding: 0.3rem 0.45rem;
      border: 1px solid var(--wb-border);
      border-radius: 0.375rem;
      background: var(--wb-input-bg);
      color: inherit;
    }

    textarea {
      font-family: var(--wb-mono);
      resize: vertical;
    }

    .wb-empty {
      color: var(--wb-muted);
      font-size: 0.8125rem;
      margin: 0;
    }
  `,
})
export class WbKnobPanel {
  readonly knobs = input.required<readonly ResolvedKnob[]>();
  readonly values = input.required<Record<string, unknown>>();
  readonly changed = output<KnobChange>();

  protected asBoolean(value: unknown): boolean {
    return value === true;
  }

  protected asString(value: unknown): string {
    return value === undefined || value === null ? "" : String(value);
  }

  protected asLabel(value: unknown): string {
    return typeof value === "string" ? value : JSON.stringify(value);
  }

  protected asJson(value: unknown): string {
    return JSON.stringify(value ?? null, null, 2);
  }

  protected options(entry: ResolvedKnob): readonly unknown[] {
    return "options" in entry.knob ? entry.knob.options : [];
  }

  protected placeholder(entry: ResolvedKnob): string {
    return "placeholder" in entry.knob ? (entry.knob.placeholder ?? "") : "";
  }

  /** Options are addressed by index so non-string option values survive the round trip. */
  protected selectedIndex(entry: ResolvedKnob): string {
    const index = this.options(entry).indexOf(this.values()[entry.name]);

    return String(index === -1 ? 0 : index);
  }

  protected emitChecked(name: string, event: Event): void {
    this.changed.emit({
      name,
      value: (event.target as HTMLInputElement).checked,
    });
  }

  protected emitText(name: string, event: Event): void {
    this.changed.emit({
      name,
      value: (event.target as HTMLInputElement).value,
    });
  }

  protected emitNumber(name: string, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;

    this.changed.emit({ name, value: raw === "" ? undefined : Number(raw) });
  }

  protected emitOption(entry: ResolvedKnob, event: Event): void {
    const index = Number((event.target as HTMLSelectElement).value);

    this.changed.emit({ name: entry.name, value: this.options(entry)[index] });
  }

  protected emitJson(name: string, event: Event): void {
    const raw = (event.target as HTMLTextAreaElement).value;

    try {
      this.changed.emit({ name, value: JSON.parse(raw) });
    } catch {
      // Keep the last valid value while the JSON is mid-edit.
    }
  }
}
