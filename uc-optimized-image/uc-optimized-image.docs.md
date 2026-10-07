Angular's `NgOptimizedImage` with a fade-in once the image has loaded, so it appears
smoothly instead of painting in pieces while it downloads.

```html
<img ucOptimizedImage ngSrc="/photos/harbour.jpg" width="800" height="533" alt="The old harbour" />
```

Use it instead of `ngSrc` alone: every `NgOptimizedImage` input works the same way
(`ngSrc`, `ngSrcset`, `sizes`, `width`, `height`, `fill`, `loading`, `priority`,
`placeholder`, `placeholderConfig`, `loaderParams`, `decoding`,
`disableOptimizedSrcset`), and an image loader provided for `NgOptimizedImage`
applies too. Do not also import `NgOptimizedImage` in the same component.

`width` and `height`, or `fill`, still reserve the image's space before it
arrives, so nothing around it moves; only its opacity animates.

## When it does not fade

- **`priority`**: shown at once. The priority image is usually the largest on the
  page, and a browser does not count an image as painted while it is transparent,
  which would delay that measurement (Largest Contentful Paint).
- **`placeholder`**: keeps `NgOptimizedImage`'s own blurred placeholder, which is
  drawn on the image itself and would be hidden by a fade.
- **Reduced motion**: with `prefers-reduced-motion: reduce`, the image appears
  without animating.
- **Failed images** are shown as well, so their alt text is not left invisible.

## Theming

| Variable | Default |
|---|---|
| `--uc-optimized-image-duration` | `0.4s` |
| `--uc-optimized-image-easing` | `ease-out` |

The image gets the `uc-optimized-image` class, and `uc-optimized-image--loaded`
once it has loaded, for any styles of your own.
