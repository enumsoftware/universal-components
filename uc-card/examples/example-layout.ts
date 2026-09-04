/**
 * Dashed frame the sizing examples sit in.
 *
 * Width helpers are only legible against a visible container edge - without the
 * frame a `uc-w-full` card and a default one look identical whenever the
 * content happens to be wide enough.
 */
export const CARD_EXAMPLE_FRAME_STYLES = `
  .frame {
    border: 1px dashed color-mix(in oklab, var(--primary-color) 55%, transparent);
    border-radius: 0.75rem;
    padding: 0.75rem;
  }

  .label {
    margin-block-end: 0.5rem;
    color: var(--paragraph-text-color);
    font-size: 0.8rem;
  }
`;
