import type { AnyShowcase } from "./define-showcase";

/**
 * One row of the generated registry. `id`, `group` and `title` are lifted out
 * of the source at generation time so the sidebar can render the full tree
 * without importing - and therefore bundling - every showcase up front.
 */
export interface RegistryEntry {
  readonly id: string;
  readonly group: string;
  readonly title: string;
  readonly order: number;
  readonly load: () => Promise<{ readonly default: AnyShowcase }>;
}
