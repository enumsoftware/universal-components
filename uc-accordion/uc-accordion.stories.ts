import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { UcAccordion } from "./uc-accordion";
import { UcAccordionItem } from "./uc-accordion-item";
import { UcPhosphorIcon } from "../uc-phosphor-icon/uc-phosphor-icon";
import { UcPill } from "../uc-pill/uc-pill";

const meta: Meta<UcAccordion> = {
  title: "Components/Accordion",
  component: UcAccordion,
  decorators: [
    moduleMetadata({
      imports: [UcAccordionItem],
    }),
  ],
  render: () => ({
    props: {},
    template: `
      <div style="width: 300px; min-height: 700px; margin: 20px auto;">
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
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<UcAccordion>;

export const Default: Story = {};

export const CustomHeader: Story = {
  decorators: [
    moduleMetadata({
      imports: [UcAccordionItem, UcPhosphorIcon, UcPill],
    }),
  ],
  render: () => ({
    props: {},
    template: `
      <div style="width: 300px; min-height: 700px; margin: 20px auto;">
        <uc-accordion>
          <uc-accordion-item [title]="'Plain title item'">
            <ng-template #content>This item has no custom header, so it falls back to the plain title.</ng-template>
          </uc-accordion-item>
          <uc-accordion-item>
            <ng-template #header>
              <uc-phosphor-icon icon="rocket-launch" style="margin-right: 0.5rem;"></uc-phosphor-icon>
              <span style="flex: 1;">Custom header with icon</span>
              <uc-pill [text]="'New'" variant="info" size="compact"></uc-pill>
            </ng-template>
            <ng-template #content>The header above is fully projected content (icon + title + pill), not just the title input.</ng-template>
          </uc-accordion-item>
          <uc-accordion-item [title]="'Another plain item'">
            <ng-template #content>Plain and custom headers can be mixed within the same accordion.</ng-template>
          </uc-accordion-item>
        </uc-accordion>
      </div>
    `,
  }),
};
