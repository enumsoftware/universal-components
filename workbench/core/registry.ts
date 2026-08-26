import type { AnyShowcase } from './define-showcase';
import type { ShowcaseDocs } from './api';

/**
 * One row of the generated registry. `id`, `group` and `title` are lifted out
 * of the source at generation time so the sidebar can render the full tree
 * without importing - and therefore bundling - every showcase up front.
 *
 * Docs are a second, separate chunk: opening a showcase should not pull in its
 * prose and API table until the Docs tab is actually asked for.
 */
export interface RegistryEntry {
  readonly id: string;
  readonly group: string;
  readonly title: string;
  readonly order: number;
  readonly load: () => Promise<{ readonly default: AnyShowcase }>;
  readonly loadDocs: () => Promise<ShowcaseDocs>;
}
