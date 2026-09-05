# UcHtmlContent

A Storybook documentation entry (no Angular component) that showcases the default prose styles applied automatically by `themes/theme.css`.

## Overview

`uc-html-content` is not an Angular component — it is a Storybook story (`html-content.stories.ts`) that demonstrates the built-in typographic defaults that apply to standard HTML elements once the theme stylesheet is imported.

Covered defaults include:

- Headings `<h1>`–`<h6>`
- Paragraphs and the `.uc-lead` utility class
- Inline elements: `<a>`, `<strong>`, `<em>`, `<mark>`, `<kbd>`, `<code>`
- Block-level: `<pre>`, `<blockquote>`, `<ul>`, `<ol>`, `<table>`
- Horizontal rule `<hr>`

Explicit utility classes (`uc-h1`–`uc-h6`, `uc-body`, `uc-muted`, `uc-code`, `uc-pre`, `uc-table`) are also available for use outside of prose contexts.

## Setup

No Angular import is required. Simply include the theme stylesheet in your app:

```css
@import '@enumsoftware/universal-components/themes/theme.css';
```

All matching HTML elements then receive the default styles automatically.

## Storybook

The story is available under **Foundations / HTML Content** in the Storybook.
