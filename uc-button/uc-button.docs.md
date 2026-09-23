The primary action control. It owns nothing but its own presentation - loading
and disabled state are inputs, so the caller decides when the button is busy.

## Content projection

Content projected into `[ucButtonPrefix]` and `[ucButtonSuffix]` sits *inside*
the label, so icons stay aligned with the text rather than with the button box.

```html
<uc-button text="Save">
  <i ucButtonPrefix class="ph-bold ph-floppy-disk"></i>
</uc-button>
```

## Loading

The consumer owns the loading state, so a derived signal can be bound straight
in - `[loading]="resource.isLoading()"`. Leaving `loadingText` unset keeps the
button at its resting width; setting it swaps the label, which reflows.

## Toggle

Set `isToggleEnabled` to turn the button into a toggle. It then sets
`aria-pressed` and flips `pressed` on click. Bind `pressed` two-way to let the
button flip itself, or one-way when the host owns the state.

```html
<uc-button text="Bold" isToggleEnabled [(pressed)]="bold" />
```

A toggle ignores `variant`: off is an outline and on is a primary fill, themed
with the `--uc-button-toggle-*` tokens.

Keep `text` the same in both states, since screen readers announce the pressed
state for you. Use a toggle only with `type="button"`, not `submit` or `reset`.
