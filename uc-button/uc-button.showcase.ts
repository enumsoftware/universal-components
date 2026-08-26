import { bool, defineShowcase, select, text } from "../workbench/core";
import {
  BUTTON_ALIGN_OPTIONS,
  BUTTON_SIZE_OPTIONS,
  BUTTON_TYPE_OPTIONS,
  BUTTON_VARIANT_OPTIONS,
  UcButton,
} from "./uc-button";
import { ConsumerOwnedSignalExample } from "./examples/consumer-owned-signal";
import { LoadingVariantsExample } from "./examples/loading-variants";
import { TableActionPrimaryExample, TableActionSecondaryExample } from "./examples/table-actions";
import { WithPrefixAndSuffixIconsExample } from "./examples/with-prefix-and-suffix-icons";
import { WithPrefixIconExample } from "./examples/with-prefix-icon";
import { WithSuffixIconExample } from "./examples/with-suffix-icon";

export default defineShowcase({
  id: "components/button",
  group: "Components",
  title: "Button",
  component: UcButton,
  docs: [
    "The primary action control. It owns nothing but its own presentation - loading and",
    "disabled state are inputs, so the caller decides when the button is busy.",
    "",
    "Content projected into `[ucButtonPrefix]` and `[ucButtonSuffix]` sits inside the label,",
    "so icons stay aligned with the text rather than the button box.",
  ].join("\n"),
  knobs: {
    text: text("Click Me"),
    variant: select(BUTTON_VARIANT_OPTIONS, "primary"),
    size: select(BUTTON_SIZE_OPTIONS, "medium"),
    align: select(BUTTON_ALIGN_OPTIONS, "center"),
    type: select(BUTTON_TYPE_OPTIONS, "button"),
    disabled: bool(false),
    loading: bool(false),
    loadingText: text(undefined, {
      placeholder: "Leave empty to keep the resting width",
    }),
  },
  examples: [
    { name: "Small", props: { size: "small", text: "Compact" } },
    { name: "Big", props: { size: "big", text: "Larger Action" } },
    {
      name: "Secondary",
      props: { variant: "secondary", text: "Secondary Action" },
    },
    { name: "Error", props: { variant: "error", text: "Delete" } },
    { name: "With Prefix Icon", component: WithPrefixIconExample },
    { name: "With Suffix Icon", component: WithSuffixIconExample },
    {
      name: "With Prefix And Suffix Icons",
      component: WithPrefixAndSuffixIconsExample,
    },
    {
      name: "Table Action Primary Equivalent",
      component: TableActionPrimaryExample,
    },
    {
      name: "Table Action Secondary Equivalent",
      component: TableActionSecondaryExample,
    },
    { name: "Loading", props: { text: "Save invoice", loading: true } },
    {
      name: "Loading With Text",
      description: "Setting `loadingText` swaps the label, which reflows the button.",
      props: { text: "Save invoice", loading: true, loadingText: "Saving…" },
    },
    {
      name: "Loading Small",
      props: { text: "Edit", size: "small", loading: true },
    },
    {
      name: "Loading Big",
      props: { text: "Larger Action", size: "big", loading: true },
    },
    { name: "Loading Variants", component: LoadingVariantsExample },
    {
      name: "Consumer Owned Signal",
      description: "Repeated clicks show the button refuses to re-emit while a request is in flight.",
      component: ConsumerOwnedSignalExample,
    },
  ],
});
