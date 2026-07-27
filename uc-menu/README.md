# UcMenu

Material-style dropdown menu primitives for Angular standalone apps.

## Usage

```html
<uc-button [text]="'Actions'" [ucMenuTriggerFor]="menu"></uc-button>

<uc-menu #menu="ucMenu">
  <uc-menu-item text="View profile" icon="ph ph-user"></uc-menu-item>
  <uc-menu-item text="Settings" icon="ph ph-gear"></uc-menu-item>
  <uc-menu-item text="Disabled action" icon="ph ph-trash" [disabled]="true"></uc-menu-item>
</uc-menu>
```

- Add `ucMenuTriggerFor` to any clickable trigger element.
- Use `uc-menu-item` for quick, pre-styled menu actions.
- For fully custom markup, use `ucMenuItem` on your own focusable element.
- Mark disabled custom items with `ucMenuItemDisabled` and native `disabled` where applicable.
