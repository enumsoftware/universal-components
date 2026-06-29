import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { UcAccordion } from './uc-accordion';
import { UcAccordionItem } from './uc-accordion-item';

const meta: Meta<UcAccordion> = {
  title: 'Components/Accordion',
  component: UcAccordion,
  decorators: [
    moduleMetadata({
      imports: [UcAccordionItem],
    }),
  ],
  render: () => ({
    props: {},
    template: `
      <uc-accordion>
        <uc-accordion-item [title]="'First Item'">
          <ng-template #content>Content for the first accordion item.</ng-template>
        </uc-accordion-item>
        <uc-accordion-item [title]="'Second Item'">
          <ng-template #content>Content for the second accordion item.</ng-template>
        </uc-accordion-item>
        <uc-accordion-item [title]="'Third Item'">
          <ng-template #content>Content for the third accordion item.</ng-template>
        </uc-accordion-item>
      </uc-accordion>
    `,
  }),
};

export default meta;
type Story = StoryObj<UcAccordion>;

export const Default: Story = {};
