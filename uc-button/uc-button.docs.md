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
