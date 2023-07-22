import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useSettingStore = defineStore("setting", () => {
  // state ref reactive
  const theme = ref<boolean>(false);
  const enableReversedMode = ref<boolean>(true);

  // getters computed

  // actions methods functions

  const changeTheme = () => {
    theme.value = !theme.value;
  };

  return {
    theme,
    enableReversedMode,
    changeTheme
  };
});
