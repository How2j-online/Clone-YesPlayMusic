import { defineStore } from "pinia";
import { ref } from "vue";
import { PlayerItem } from "@/service/home/type";
export const usePlayerStore = defineStore("player", () => {
  // state ref reactive
  const dailyTracks = ref([]);
  // getters computed

  // actions methods functions
  const updateDailyTracks = (tracks: PlayerItem[]) => {
    dailyTracks.value = tracks;
  };

  return {
    dailyTracks,
    updateDailyTracks
  };
});
