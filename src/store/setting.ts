import { defineStore } from "pinia";
import { reactive, ref } from "vue";

interface LyricsSetting {
  lyricsBackground: "blur" | "dynamic";
}

export const useSettingStore = defineStore("setting", () => {
  // state ref reactive
  const theme = ref<boolean>(false);
  const enableReversedMode = ref<boolean>(true);
  const lang = ref<string>("zh_CN");

  const lyricsSetting = reactive({
    lyricsBackground: "dynamic",
    showLyricsTime: false,
    showLyricsTranslation: true,
    lyricFontSize: 22
  });

  // getters computed

  // actions methods functions

  const changeTheme = () => {
    theme.value = !theme.value;
  };

  return {
    theme,
    enableReversedMode,
    lyricsSetting,
    lang,
    changeTheme
  };
});
