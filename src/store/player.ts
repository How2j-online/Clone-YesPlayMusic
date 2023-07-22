import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { TrackSongItem } from "@/service/common";

interface PlayerT {
  enabled: boolean;
  progress: number;
  repeatMode: "off" | "on" | "one" | "shuffle";
  volume: number;
  muted: boolean;
  currentTrackDuration?: number;
  shuffle: boolean;
  reversed: boolean;
  isCurrentTrackLiked?: boolean;
  isPersonalFM?: boolean;
}
export const usePlayerStore = defineStore(
  "player",
  () => {
    // state ref reactive
    const playerPlaying = ref<boolean>(false);
    const showLyrics = ref<boolean>(false);
    // 当前播放的歌曲
    const currentTrack = ref<Partial<TrackSongItem>>({
      al: {
        id: 0,
        name: "",
        picUrl: "",
        pic_str: "",
        pic: 0,
        tns: []
      }
    });
    // 当前播放列表
    const currentTrackList = ref<number[]>([]);

    const playerToolInfo = reactive<PlayerT>({
      progress: 0, // 当前播放歌曲的进度
      volume: 0.1, // 0 to 1 音量
      currentTrackDuration: 0, // 当前播放歌曲的总时长
      repeatMode: "off", // off | on | one 重复模式
      shuffle: false, // true | false 随机播放
      muted: false, // true | false 是否静音
      reversed: false, // true | false 是否倒序播放
      enabled: false
    });
    // getters computed

    // actions methods functions
    const changeShowLyrics = () => {
      showLyrics.value = !showLyrics.value;
    };
    const updateCurrentTrack = (track: TrackSongItem) => {
      currentTrack.value = track;
    };
    const updateCurrentTrackList = (list: number[]) => {
      currentTrackList.value = list;
    };

    const setPlayerData = (data: Partial<PlayerT>) => {
      Object.assign(playerToolInfo, data);
    };

    const updateProgress = (progress: number) => {
      playerToolInfo.progress = progress;
    };
    const updatePlaying = (playing: boolean) => {
      playerPlaying.value = playing;
    };

    return {
      playerPlaying,
      showLyrics,
      currentTrack,
      playerToolInfo,
      currentTrackList,
      setPlayerData,
      updateProgress,
      updatePlaying,
      changeShowLyrics,
      updateCurrentTrack,
      updateCurrentTrackList
    };
  },
  {
    persist: {
      paths: ["playerToolInfo", "currentTrackList", "currentTrack"]
    }
  }
);
