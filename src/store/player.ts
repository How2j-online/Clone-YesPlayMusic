import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { TracksItemType } from "@/service/playlist/type";
import { TrackSongItem } from "@/service/common";

interface PlayerT {
  enabled: boolean;
  progress?: number;
  playing?: boolean;
  repeatMode?: "off" | "on" | "one";
  volume?: number;
  muted?: boolean;
  currentTrackDuration?: number;
  shuffle?: boolean;
  reversed?: boolean;
  isCurrentTrackLiked?: boolean;
  currentTrack?: TracksItemType | null;
  isPersonalFM?: boolean;
}
export const usePlayerStore = defineStore(
  "player",
  () => {
    // state ref reactive
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

    const player = reactive<PlayerT>({
      progress: 0, // 当前播放歌曲的进度
      volume: 0.3, // 0 to 1 音量
      currentTrackDuration: 0, // 当前播放歌曲的总时长
      playing: false, // 是否正在播放
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
    const updateProgress = (progress: number) => {
      player.progress = progress;
    };
    const updatePlaying = (playing: boolean) => {
      player.playing = playing;
    };
    const updateCurrentTrackDuration = (duration: number) => {
      player.currentTrackDuration = duration;
    };
    const updateRepeatMode = (mode: "off" | "on" | "one") => {
      player.repeatMode = mode;
    };

    return {
      showLyrics,
      currentTrack,
      player,
      currentTrackList,
      updateProgress,
      updatePlaying,
      changeShowLyrics,
      updateCurrentTrackDuration,
      updateCurrentTrack,
      updateRepeatMode
    };
  },
  { persist: true }
);
