import lazy from "@/directive/lazy";
import type { App } from "vue";

export const setupGlobDirectives = (app: App) => {
  app.directive("imgLazy", lazy);
};
