/**
 * Shape of the generated API table.
 *
 * Declared here rather than imported from `scripts/`, which lives under its own
 * tsconfig and is excluded from every app build. The generator emits data
 * matching this contract - keep the two in step.
 */
export type ApiKind = 'input' | 'model' | 'output';

export interface ApiMember {
  readonly name: string;
  readonly kind: ApiKind;
  readonly required: boolean;
  readonly type: string;
  readonly defaultValue: string | null;
  readonly alias: string | null;
  readonly description: string;
}

/** Compiled docs for one showcase, loaded on demand when the Docs tab opens. */
export interface ShowcaseDocs {
  /** Markdown compiled to HTML at build time. */
  readonly html: string;
  readonly api: readonly ApiMember[];
}
