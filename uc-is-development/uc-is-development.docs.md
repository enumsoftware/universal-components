A structural directive that renders its content only in development builds:
`ng serve`, or any build without optimization. Production builds render nothing
in its place.

```html
<uc-select *ucIsDevelopment label="Fill test account" [options]="devAccountOptions" (valueChange)="fill($event)" />
```

It decides at runtime whether to render, so it hides UI but does not remove
code: the template and the component still ship in the production bundle. Keep
anything secret, such as test account passwords, out of the component itself.
