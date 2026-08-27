/**
 * Serialises playground state into the query string so a link carries what you
 * were actually looking at: which knobs you changed.
 *
 * Only knobs that differ from their declared default are written. The common
 * case - open a showcase, share it - produces a bare URL, and a link stays
 * readable when one or two things were tweaked.
 */

/** `null` when nothing differs from the defaults, so the param can be dropped. */
export function encodeArgs(values: Record<string, unknown>, defaults: Record<string, unknown>): string | null {
  const changed: Record<string, unknown> = {};

  for (const [name, value] of Object.entries(values)) {
    if (!sameValue(value, defaults[name])) {
      changed[name] = value;
    }
  }

  return Object.keys(changed).length === 0 ? null : JSON.stringify(changed);
}

/** Never throws: a hand-edited or truncated param falls back to the defaults. */
export function decodeArgs(raw: string | null): Record<string, unknown> {
  if (raw === null || raw === '') {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    return isPlainObject(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Structural comparison via JSON, which is exactly the fidelity the query
 * string round trips anyway - a value that cannot be told apart in JSON cannot
 * be represented in the URL either.
 */
function sameValue(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true;
  }

  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
