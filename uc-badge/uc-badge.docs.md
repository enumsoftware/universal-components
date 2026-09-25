A small count or status dot on the corner of another element, modelled on Angular
Material's `matBadge`. It is a directive, so it goes on whatever it describes: a
button, an icon, an avatar.

```html
<uc-button text="Inbox" ucBadge="4" ucBadgeDescription="4 unread messages" />
<i class="ph ph-bell" [ucBadge]="unread()" [ucBadgeMax]="99"></i>
```

## Inputs

| Input | Default | |
|---|---|---|
| `ucBadge` | `null` | The text or count. An empty value hides the badge. |
| `ucBadgePosition` | `top-end` | `top-end`, `top-start`, `bottom-end` or `bottom-start`. Follows the text direction. |
| `ucBadgeSize` | `medium` | `small` is a dot without text, `medium` and `large` show the content. |
| `ucBadgeVariant` | `error` | `error`, `primary`, `success` or `neutral`. |
| `ucBadgeOverlap` | `true` | Overlap the host's corner; `false` puts the badge beside the host. |
| `ucBadgeMax` | `null` | Counts above it are shown as `max+`, such as `99+`. |
| `ucBadgeHidden` | `false` | Hides the badge. |
| `ucBadgeDisabled` | `false` | Greys the badge out. |
| `ucBadgeDescription` | `null` | What the badge means, for screen readers. |

## Placement

The badge is appended inside the host and positioned against it. A host with
`position: static` is made `relative`; any other position is left alone. The host
must be able to hold children, so put the badge on a wrapper rather than on an
`<img>` or `<input>`, and it must not clip its overflow.

## Accessibility

The badge itself is hidden from screen readers, because a bare "4" means nothing
out of context. Set `ucBadgeDescription` to say what it counts; it is attached to
the host with `aria-describedby`, and removed while the badge is hidden.

## Theming

Colours use `--uc-badge-error-background`, `--uc-badge-primary-background`,
`--uc-badge-success-background`, `--uc-badge-neutral-background` and
`--uc-badge-color`. Sizes use `--uc-badge-small-size`, `--uc-badge-medium-size`
and `--uc-badge-large-size`, with `--uc-badge-medium-font-size` and
`--uc-badge-large-font-size` for the text, and `--uc-badge-font-family` for its font.
