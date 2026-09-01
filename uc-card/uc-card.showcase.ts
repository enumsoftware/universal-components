import { defineShowcase, text } from "../workbench/core";
import { CardPreview } from "./examples/card-preview";
import { CardGridExample } from "./examples/card-grid";
import { CardInFlexRowExample } from "./examples/card-in-flex-row";
import { HugContentExample } from "./examples/hug-content";
import { SizingExample } from "./examples/sizing";

export default defineShowcase({
  id: "components/card",
  group: "Components",
  title: "Card",
  layout: "padded",
  component: CardPreview,
  knobs: {
    content: text("Card content preview"),
  },
  examples: [
    {
      name: "Sizing",
      description:
        "The card fills its container; anything narrower comes from `uc-w-*` rather than a card input.",
      component: SizingExample,
    },
    {
      name: "Hug The Content",
      description:
        "`uc-w-fit` is what opts a card out of the width its container would otherwise hand it.",
      component: HugContentExample,
    },
    {
      name: "Card Grid",
      description:
        'What the old `fit="fill"` was for, with nothing to declare: tracks size the cards, stretch evens the heights.',
      component: CardGridExample,
    },
    {
      name: "In A Flex Row",
      description:
        "The one place a card does not fill on its own - `uc-flex-1` for equal shares, `uc-grow` for the slack.",
      component: CardInFlexRowExample,
    },
  ],
});
