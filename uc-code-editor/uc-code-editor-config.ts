import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

export interface UcCodeEditorConfig {
  /**
   * Where the app serves Monaco's editor worker, which ships with the package as
   * `dist/uc-code-editor/editor.worker.js`. Resolved against the page's base URL, so a relative path
   * follows the app's `<base href>`.
   */
  workerUrl?: string;
}

const UC_CODE_EDITOR_DEFAULT_CONFIG: Required<UcCodeEditorConfig> = {
  workerUrl: 'uc-code-editor/editor.worker.js',
};

export const UC_CODE_EDITOR_CONFIG = new InjectionToken<Required<UcCodeEditorConfig>>('UC_CODE_EDITOR_CONFIG', {
  providedIn: 'root',
  factory: () => UC_CODE_EDITOR_DEFAULT_CONFIG,
});

/** Only needed when the app serves the worker somewhere other than `uc-code-editor/editor.worker.js`. */
export function provideUcCodeEditorConfig(config: UcCodeEditorConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: UC_CODE_EDITOR_CONFIG, useValue: { ...UC_CODE_EDITOR_DEFAULT_CONFIG, ...config } },
  ]);
}
