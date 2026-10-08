Styles a real `<a>` as a button-like link. It adds classes and a few
`aria-*`/`tabindex` attributes to the element you already wrote - it never
wraps it or replaces it - so the anchor stays a real anchor.

```html
<a ucAnchor href="/billing" variant="primary">Go to billing</a>
<a ucAnchor href="/account" variant="error">Delete account</a>
```

Because it is a real `<a>`, middle click, ctrl/cmd-click, "open in new tab" and
"copy link address" all keep working exactly as the browser already handles
them, with no code needed to support them. `href`, `target`, `rel`,
`download`, and router directives such as `routerLink`, stay on the element
exactly as written.

## Variants

`primary` and `error` match the matching `uc-button` variant, fixed at its
medium size - there is no `size` input.

## Disabled

Setting `disabled` removes the anchor's `href` entirely rather than just
dimming it, so there is no default action left to prevent: no navigation on
click, middle click, "open in new tab" or keyboard activation. It also sets
`aria-disabled="true"`, an explicit `role="link"` (lost along with `href`
otherwise), and `tabindex="0"` so assistive tech still reaches it and hears it
announced as unavailable, per the WAI-ARIA disabled-link pattern.

This only removes the default navigation action. A `(click)` handler bound
directly on the same element still runs, so prefer gating navigation in app
state (or omitting `href` until it is ready) over relying on `disabled` to
stop a handler like that.

Re-enabling restores the exact `href` the anchor was written with - nothing
is read from or written back to the `href` input, since there isn't one.
