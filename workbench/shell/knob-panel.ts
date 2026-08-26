import { Component, computed, input, output } from "@angular/core";

import { UcCheckbox } from "../../uc-checkbox/uc-checkbox";
import { UcColorPicker } from "../../uc-color-picker/uc-color-picker";
import { UcInput } from "../../uc-input/uc-input";
import { UcSelect, type SelectOption } from "../../uc-select/uc-select";
import { UcTextarea } from "../../uc-textarea/uc-textarea";
import type { ResolvedKnob } from "../core";

export interface KnobChange {
  readonly name: string;
  readonly value: unknown;
}

/**
 * The controls panel, built from the library's own form controls.
 *
 * Values live in a single map on the parent keyed by knob name, so every
 * control binds one way with an explicit change handler rather than `[(value)]`.
 */
@Component({
  selector: "wb-knob-panel",
  imports: [UcCheckbox, UcColorPicker, UcInput, UcSelect, UcTextarea],
  templateUrl: "./knob-panel.html",
  styleUrl: "./knob-panel.css",
})
export class WbKnobPanel {
  readonly knobs = input.required<readonly ResolvedKnob[]>();
  readonly values = input.required<Record<string, unknown>>();
  readonly changed = output<KnobChange>();

  /**
   * Options are addressed by index so option values that are not strings -
   * numbers, objects - survive the round trip through the select.
   */
  protected readonly optionsByKnob = computed(() => {
    const map = new Map<string, SelectOption<string>[]>();

    for (const entry of this.knobs()) {
      map.set(
        entry.name,
        rawOptions(entry).map((option, index) => ({ value: String(index), label: labelFor(option) })),
      );
    }

    return map;
  });

  protected optionsFor(entry: ResolvedKnob): SelectOption<string>[] {
    return this.optionsByKnob().get(entry.name) ?? [];
  }

  protected selectedIndex(entry: ResolvedKnob): string {
    const index = rawOptions(entry).indexOf(this.values()[entry.name]);

    return String(index === -1 ? 0 : index);
  }

  protected controlId(entry: ResolvedKnob): string {
    return `knob-${entry.name}`;
  }

  protected asBoolean(value: unknown): boolean {
    return value === true;
  }

  protected asText(value: unknown): string {
    return value === undefined || value === null ? "" : String(value);
  }

  protected asNumber(value: unknown): number | null {
    return typeof value === "number" ? value : null;
  }

  protected asColor(value: unknown): string {
    return typeof value === "string" && value !== "" ? value : "#000000";
  }

  protected asJson(value: unknown): string {
    return JSON.stringify(value ?? null, null, 2);
  }

  protected placeholder(entry: ResolvedKnob): string {
    return "placeholder" in entry.knob ? (entry.knob.placeholder ?? "") : "";
  }

  protected emit(name: string, value: unknown): void {
    this.changed.emit({ name, value });
  }

  protected emitText(name: string, value: string | number | null): void {
    this.changed.emit({ name, value: value === null ? "" : String(value) });
  }

  protected emitNumber(name: string, value: string | number | null): void {
    if (value === null || value === "") {
      this.changed.emit({ name, value: undefined });
      return;
    }

    this.changed.emit({ name, value: Number(value) });
  }

  protected emitOption(entry: ResolvedKnob, index: string | null): void {
    if (index === null) {
      return;
    }

    this.changed.emit({ name: entry.name, value: rawOptions(entry)[Number(index)] });
  }

  protected emitJson(name: string, raw: string | null): void {
    try {
      this.changed.emit({ name, value: JSON.parse(raw ?? "null") });
    } catch {
      // Keep the last valid value while the JSON is mid-edit.
    }
  }
}

function rawOptions(entry: ResolvedKnob): readonly unknown[] {
  return "options" in entry.knob ? entry.knob.options : [];
}

function labelFor(option: unknown): string {
  return typeof option === "string" ? option : JSON.stringify(option);
}
