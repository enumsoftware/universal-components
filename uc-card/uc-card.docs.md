A surface with the theme's background, radius, shadow and padding, and nothing
else. It projects whatever you put in it and lays it out as a column, so the
content decides what the card is.

## Sizing

The card declares no width of its own, so it fills whatever it is placed in -
the container, a grid track, a stretched flex item. Anything narrower is a
layout decision that belongs to the caller, so it comes from the utility layer
(see **Utilities / Overview**) rather than a card input:

```html
<uc-card>Fills its container</uc-card>
<uc-card class="uc-w-fit">Shrinks to its content</uc-card>
<uc-card class="uc-w-half">Half the container</uc-card>
<uc-card class="uc-md-w-fit">Fills below 768px, hugs its content above</uc-card>
```

This used to be a `fit` input with a `fit`/`fill` pair. A class does the same
job without an API, composes with the breakpoint variants the input never had
(`uc-md-w-fit`), and reaches the sizes it never covered - `uc-w-half`,
`uc-max-w-full`, `uc-h-full`.

`uc-card` sets `box-sizing: border-box` itself, so a width you hand it measures
the padded box and a card never overflows its container by its own padding.

## In a grid or a flex row

A grid track already hands the card a width, and grid items stretch to the row
height, so a row of cards is even without a single class on it - the tallest
card sets the height and the others follow:

```html
<div class="uc-grid-auto-fit uc-gap-4">
  <uc-card>…</uc-card>
  <uc-card>…</uc-card>
</div>
```

A flex row is the exception: a flex item is sized from its content, so cards in
a row need the flex helpers to share the space.

```html
<div class="uc-flex uc-gap-4">
  <uc-card class="uc-flex-1">Equal share</uc-card>
  <uc-card class="uc-flex-1">Equal share</uc-card>
</div>
```

## Spacing the content

The card is a flex column, so the same layer spaces what you project into it -
`uc-gap-*` on the card, alignment helpers on the card, and margin or padding
helpers on the children:

```html
<uc-card class="uc-gap-2">
  <strong>Revenue</strong>
  <span class="uc-mt-1">€ 12,480</span>
</uc-card>
```

## Theming

Each surface property reads a card-scoped custom property first and falls back
to the theme token, so one card can be restyled without touching the theme:

```html
<uc-card style="--uc-card-padding: 2rem; --uc-card-box-shadow: none">…</uc-card>
```

`--uc-card-background`, `--uc-card-border-radius`, `--uc-card-box-shadow` and
`--uc-card-padding` override `--card-background-color`, `--card-border-radius`,
`--card-box-shadow` and `--card-padding` respectively.
