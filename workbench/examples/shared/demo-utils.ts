/** A small, readable-on-both-themes palette for avatar initials. */
const AVATAR_PALETTE: readonly string[] = [
  '#473bf0',
  '#0f766e',
  '#b45309',
  '#be123c',
  '#0369a1',
  '#7c3aed',
  '#15803d',
  '#a21caf',
];

/** Deterministic so the same name always lands on the same color across renders. */
export function avatarColorFor(seed: string): string {
  let hash = 0;

  for (let index = 0; index < seed.length; index++) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length]!;
}

export function initialsFor(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
