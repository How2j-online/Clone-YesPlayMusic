import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    keepAlive?: boolean;
    savePosition?: boolean;
  }
}

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<
      NonNullable<unknown>,
      NonNullable<unknown>,
      never
  >;
  export default component;
}

