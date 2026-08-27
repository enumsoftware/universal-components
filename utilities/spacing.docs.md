Margin, padding and gap helpers built on a single spacing scale.

Every class resolves to a `--uc-space-*` custom property, so retuning the scale
in your app retunes every helper at once. Side suffixes use CSS logical
properties, which means `ms`/`me` follow the writing direction and flip
automatically in RTL layouts.

| Suffix | Property |
| --- | --- |
| `m` / `p` | `margin` / `padding` |
| `mx` / `px` | `margin-inline` / `padding-inline` |
| `my` / `py` | `margin-block` / `padding-block` |
| `mt` / `pt` | `margin-block-start` / `padding-block-start` |
| `mb` / `pb` | `margin-block-end` / `padding-block-end` |
| `ms` / `ps` | `margin-inline-start` / `padding-inline-start` |
| `me` / `pe` | `margin-inline-end` / `padding-inline-end` |
