import { bootstrapApplication } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'storybook-host',
  template: 'Storybook host',
  changeDetection: ChangeDetectionStrategy.Eager,
})
class StorybookHost {}

bootstrapApplication(StorybookHost).catch((error) => {
  console.error(error);
});
