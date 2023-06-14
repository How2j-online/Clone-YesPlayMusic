import "vue-router";
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<NonNullable<unknown>, NonNullable<unknown>, never>;
  export default component;
}

declare module "vue-router" {
  interface RouteMeta {
    keepAlive?: boolean;
    savePosition?: boolean;
  }
}

declare module "@vue/runtime-core" {
  // 扩展全局变量的接口内容，需要扩展ComponentCustomProperties这个接口，不要乱改成别的
  interface ComponentCustomProperties {}
}

declare global {
  declare type Writable<T> = {
    [P in keyof T]: T[P];
  };

  // 键值对类型 用于声明对象, 例如: const obj: SimpleKeyValueObject = { key: value }
  declare interface SimpleKeyValueObject {
    [key: string]: any;
  }

  // 函数类型 用于声明函数, 例如: const fn: Fn = () => {}
  declare interface Fn<T = any, R = T> {
    (...arg: T[]): R;
  }
}
