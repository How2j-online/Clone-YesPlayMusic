import type { App } from "vue";
import { createI18n } from "vue-i18n";
import type { I18n, I18nOptions } from "vue-i18n";
import { useSettingStore } from "@/store/setting";

export const SUPPORT_LOCALES = ["en", "zh_CN"];
export let i18n: I18n;

export const createI18nOptions = async (): Promise<I18nOptions> => {
  const locale = "zh_CN";
  const defaultLocal = await import(`./lang/${locale}.ts`);
  const message = defaultLocal.default ?? {};
  setHtmlPageLang(locale);
  return {
    locale, // 设置默认显示的语言
    legacy: false,
    sync: true, // 如果在组件中使用了 Composition API，需要将 sync 设置为 true
    fallbackLocale: "en", // 当找不到对应语言的时候，默认显示英文
    globalInjection: false,
    messages: {
      [locale]: message
    }
  };
};

export function setHtmlPageLang(locale: string) {
  if (locale === "zh_CN") locale = "zh";
  (document.querySelector("html") as HTMLElement).setAttribute("lang", locale);
}

export const setupI18n = async (app: App) => {
  const options = await createI18nOptions();
  i18n = createI18n(options) as I18n;
  app.use(i18n);
};

export default i18n;
