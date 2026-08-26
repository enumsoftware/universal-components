import type { Routes } from "@angular/router";

import { SHOWCASE_REGISTRY } from "./generated/registry";
import { WbShowcaseView } from "./shell/showcase-view";

const first = SHOWCASE_REGISTRY[0]?.id ?? "";

/**
 * One route per registry entry, with the entry itself on `data` so
 * `withComponentInputBinding()` can bind it straight to the view's `entry`
 * input. The showcase module behind `entry.load()` stays a lazy chunk.
 */
export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: first },
  ...SHOWCASE_REGISTRY.map((entry) => ({
    path: entry.id,
    component: WbShowcaseView,
    data: { entry },
    title: `${entry.title} · Workbench`,
  })),
  { path: "**", redirectTo: first },
];
