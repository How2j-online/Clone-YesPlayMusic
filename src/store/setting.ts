import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";

interface LyricsSetting {
  lyricsBackground: "blur" | "dynamic" | true | false;
  showLyricsTime: boolean;
  showLyricsTranslation: boolean;
  lyricFontSize: number;
}

export const useSettingStore = defineStore("setting", () => {
  // state ref reactive
  const theme = ref<boolean>(false);
  const enableReversedMode = ref<boolean>(true);
  const lang = ref<string>("zh_CN");
  const appearance = ref<string>("auto");

  watch(appearance, value => {
    theme.value = value === "auto" || value === "light";
  });

  const lyricsSetting = reactive<LyricsSetting>({
    lyricsBackground: "blur",
    showLyricsTime: false,
    showLyricsTranslation: true,
    lyricFontSize: 22
  });

  // actions methods functions

  const changeTheme = (value: boolean) => {
    theme.value = value;
  };
  const changeAppearance = (value: string) => {
    appearance.value = value;
    if (value === "auto" || value === undefined) {
      value = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.body.setAttribute("data-theme", value);
    // document.querySelector('meta[name="theme-color"]').setAttribute("content", value === "dark" ? "#222" : "#fff");
  };
  const changeLang = async (value: string) => {
    lang.value = value;
  };
  const setLyricsSetting = (value: object) => {
    Object.assign(lyricsSetting, value);
  };

  return {
    theme,
    enableReversedMode,
    lyricsSetting,
    lang,
    appearance,
    changeTheme,
    setLyricsSetting,
    changeAppearance,
    changeLang
  };
});
