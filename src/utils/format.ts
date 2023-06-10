import locale from "@/locales/setupI18n";
export const formatPlayCount = (count: number) => {
  if (!count) return "";
  if (locale.global.locale === "zh-CN") {
    if (count > 100000000) {
      return `${Math.floor((count / 100000000) * 100) / 100}亿`; // 2.32 亿
    }
    if (count > 100000) {
      return `${Math.floor((count / 10000) * 10) / 10}万`; // 232.1 万
    }
    if (count > 10000) {
      return `${Math.floor((count / 10000) * 100) / 100}万`; // 2.3 万
    }
    return count;
  } else {
    if (count > 10000000) {
      return `${Math.floor((count / 1000000) * 10) / 10}M`; // 233.2M
    }
    if (count > 1000000) {
      return `${Math.floor((count / 1000000) * 100) / 100}M`; // 2.3M
    }
    if (count > 1000) {
      return `${Math.floor((count / 1000) * 100) / 100}K`; // 233.23K
    }
    return count;
  }
};
