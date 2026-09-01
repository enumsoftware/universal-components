/**
 * Shared layout for the examples that show a whole axis of the button at once.
 *
 * One row on desktop, one stacked column on mobile - kept in a single constant
 * so the examples cannot drift apart on gap or breakpoint. `767px` is the
 * mobile breakpoint the components themselves use.
 */
export const BUTTON_EXAMPLE_ROW_STYLES = `
  :host {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
  }

  @media (max-width: 767px) {
    :host {
      flex-direction: column;
      /*
       * uc-button is an inline-flex host wrapping a full-width button, so
       * stretching the host is what gives the usual full-width mobile stack.
       */
      align-items: stretch;
    }
  }
`;
