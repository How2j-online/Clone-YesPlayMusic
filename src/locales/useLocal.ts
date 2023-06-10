import { i18n } from "@/locales/setupI18n";
import { useI18n } from "vue-i18n";

const setI18nLanguage = (locale: string) => {
  if (i18n.mode === "legacy") {
    i18n.global.locale = locale;
  } else {
    (i18n.global.locale as any).value = locale;
  }
};

export const useLocale = () => {
  const { t } = useI18n();
  const changeLocale = async (locale: string) => {
    const message = (await import(`@/locales/lang/${locale}.ts`)).default;
    if (!message) return;

    i18n.global.setLocaleMessage(locale, message);

    setI18nLanguage(locale);
    return locale;
  };

  return {
    t,
    changeLocale
  };
};
