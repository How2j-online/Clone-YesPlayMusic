import { Howl } from "howler";

import { TrackSongItem } from "@/service/common";
import { usePlayerStore } from "@/store/player";
import { getTrackDetail, getTrackUrl } from "@/service/player/track";
import { getPlaylistDetail } from "@/service/playlist";

let playerStore: ReturnType<typeof usePlayerStore>;
const initPlayerStore = () => {
  playerStore = usePlayerStore();
};

const getLocalMusic = (path: string) => {
  return new Promise<string>(resolve => {
    fetch(path)
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const blob = new Blob([buffer], { type: "audio/mp3" });
        const src = URL.createObjectURL(blob);
        resolve(src);
      });
  });
};

class PlayerTool {
  private static instance: PlayerTool;
  // 播发器的状态
  private _enabled: boolean = false; // 是否启用Player
  private _volumeBeforeMuted: number = 1; // 用于保存静音前的音量
  _personalFMLoading: boolean = false; // 是否正在私人FM中加载新的track
  _personalFMNextLoading: boolean = false; // 是否正在缓存私人FM的下一首歌曲
  reversed: boolean = false; // 倒序播放
  trackSwitchAutoPlay: boolean = true; // 切换歌曲时是否自动播放

  playing: boolean = false; // 是否正在播放
  progress: number = 0; // 当前播放歌曲的进度
  repeatMode: "off" | "on" | "one" | "shuffle" = "off"; // off | on | one 重复模式
  shuffle: boolean = false; // true | false 随机播放
  volume: number = 0.5; // 0 to 1 音量

  // 播发器的信息
  private timerProgress: ReturnType<typeof setInterval>; // 用于保存进度条的定时器
  private currentTrackIndex: number = 0; // 当前播放歌曲在播放列表里的index
  private tracks: Partial<number[]> = []; // 播放列表
  currentTrack: Partial<TrackSongItem> = {}; // 当前播放歌曲的详细信息
  private muted: boolean; // 是否静音

  private _shuffledList: number[] = []; // 被随机打乱的播放列表，随机播放模式下会使用此播放列表
  private _shuffledCurrent: number = 0; // 当前播放歌曲在随机列表里面的index
  private _playlistSource: { type: string; id: number }; // 当前播放列表的信息
  private readonly _isPersonalFM: boolean = false; // 是否是私人FM模式
  private _personalFMTrack: { id: number } = { id: 0 }; // 私人FM当前歌曲
  private _personalFMNextTrack: { id: number } = { id: 0 }; // 私人FM下一首歌曲信息（为了快速加载下一首）
  private _howler: Howl; // howler实例

  createdBlobRecords: any[]; // 用于保存已经创建的blobUrl，用于释放内存

  constructor() {
    if (!PlayerTool.instance) {
      initPlayerStore();
      // 初始化播放信息
      this._enabled = playerStore.playerToolInfo.enabled;
      this.volume = playerStore.playerToolInfo.volume;
      this.progress = playerStore.playerToolInfo.progress;
      this.repeatMode = playerStore.playerToolInfo.repeatMode;
      this.tracks = playerStore.currentTrackList;
      this.reversed = playerStore.playerToolInfo.reversed;
      this.currentTrack = playerStore.currentTrack;

      this._howler = null;
      Object.defineProperty(this, "_howler", {
        enumerable: false
      });

      this._init();
      PlayerTool.instance = this;
    }
    return PlayerTool.instance;
  }

  get isCurrentTrackLiked() {
    return true;
  }

  // 是否为私人FM模式
  get isPersonalFM() {
    return this._isPersonalFM;
  }

  // 获取当前播放歌曲的id
  get currentTrackID() {
    return this.currentTrack?.id;
  }

  // 获取当前播放歌曲的总时长
  get currentTrackDuration() {
    const trackDuration = this.currentTrack.dt || 1000;
    let duration = ~~(trackDuration / 1000);
    return duration > 1 ? duration : duration;
  }

  // -----------------内部方法-----------------

  // 初始化
  _init() {
    // 初始化播放器 本地获取播放列表
    if (this._enabled) {
      // 恢复当前播放歌曲
      this._replaceCurrentTrack(this.currentTrackID, false, () => {
        this.changeProgress(this.progress);
      });
      this.currentTrackIndex = this.tracks.indexOf(this.currentTrackID);
    }
  }

  // 创建howler实例
  _setPlayAudioSource(source: string, autoplay = true) {
    Howler.autoUnlock = false;
    Howler.unload();
    this._howler = new Howl({
      src: [source],
      html5: true,
      autoplay: false,
      preload: true,
      format: ["mp3", "flac"],
      onend: () => {
        this._nextTrackCallback();
      }
    });
    this._howler.on("play", () => {
      // 获取总时长
      const duration = this._howler.duration();

      // 开启定时器，每隔一段时间获取播放进度
      this.timerProgress = setInterval(() => {
        // 获取当前播放时间
        const currentTime = this._howler.seek();
        // 计算播放进度（以百分比表示）
        playerStore.updateProgress(Number.parseFloat(currentTime.toFixed(1)));
        // 打印播放进度
        // 检查是否已经播放完毕
        if (currentTime >= duration) {
          clearInterval(this.timerProgress);
        }
      }, 100);
    });
    this._howler.on("pause", () => {
      clearInterval(this.timerProgress);
    });

    this.changeVolume(this.volume);

    if (autoplay) {
      this.changeProgress(0);
      this.play();
    }
  }

  // 播放下一首歌曲的回调
  _nextTrackCallback() {
    clearInterval(this.timerProgress);
    this._setPlaying(false);
    playerStore.updateProgress(0);
    this._nextTrack(this.isPersonalFM);
  }

  // 播放下一首歌曲
  _nextTrack(isFM: boolean) {
    if (this.repeatMode === "one") {
      // 单曲循环
      this._replaceCurrentTrack(this.currentTrackID);
    } else {
      this.playNextTrack();
    }
  }

  // 获取下一首歌曲
  _getNextTrack() {
    this.progress = 0;
    playerStore.updateProgress(0);
    const next = this.reversed ? this.currentTrackIndex - 1 : this.currentTrackIndex + 1;
    if (this.repeatMode === "on") {
      if (this.reversed && this.currentTrackIndex === 0) {
        // 倒序模式，当前歌曲是第一首，则重新播放列表最后一首
        return [this.tracks[this.tracks.length - 1], this.tracks.length - 1];
      } else if (!this.reversed && this.tracks.length === this.currentTrackIndex + 1) {
        // 正序模式，当前歌曲是最后一首，则重新播放第一首
        return [this.tracks[0], 0];
      }
    } else if (this.repeatMode === "shuffle") {
      // 随机播放
      return this._getShuffledNextTrack();
    }

    return [this.tracks[next], next];
  }

  _getShuffledNextTrack() {
    const shuffledTrackIndex = Math.floor(Math.random() * this.tracks.length);
    do {
      this._shuffledCurrent = Math.floor(Math.random() * this.tracks.length);
    } while (this._shuffledCurrent === shuffledTrackIndex);
    return [this.tracks[this._shuffledCurrent], this._shuffledCurrent];
  }

  // 获取上一首歌曲
  _getPrevTrack() {
    this.progress = 0;
    playerStore.updateProgress(0);
    const prev = this.reversed ? this.currentTrackIndex + 1 : this.currentTrackIndex - 1;
    if (this.repeatMode === "on") {
      if (this.reversed && this.currentTrackIndex === this.tracks.length - 1) {
        // 倒序模式，当前歌曲是最后一首，则重新播放列表第一首
        return [this.tracks[0], 0];
      } else if (!this.reversed && this.currentTrackIndex === 0) {
        // 正序模式，当前歌曲是第一首，则重新播放最后一首
        return [this.tracks[this.tracks.length - 1], this.tracks.length - 1];
      }
    } else if (this.repeatMode === "shuffle") {
      // 随机播放
      return this._getShuffledNextTrack();
    }
    return [this.tracks[prev], prev];
  }

  // 替换当前播放歌曲
  _replaceCurrentTrack(id: number, autoplay: boolean = true, replaceCallback?: () => void) {
    // 获取歌曲详情
    getTrackDetail(id).then(data => {
      this.currentTrack = data.songs[0]; // 更新当前播放歌曲的信息
      // store 操作
      playerStore.updateCurrentTrack(data.songs[0]); // 更新store中当前播放歌曲的信息
      playerStore.setPlayerData({ currentTrackDuration: this.currentTrackDuration }); // 更新store中当前播放歌曲的总时长
      // 获取歌曲url
      getTrackUrl(id).then(data => {
        // this._setPlayAudioSource(data, autoplay);
        // 获取歌曲
        getLocalMusic(data as string).then(data => {
          // this.currentTrack = 更新歌曲信息
          this._setPlayAudioSource(data, autoplay);
          replaceCallback && replaceCallback();
        });
      });
    });
  }

  // 设置播放状态
  _setPlaying(isPlaying: boolean) {
    playerStore.updatePlaying(isPlaying);
  }

  // 获取歌单详情
  _getPlayListTracks(tracksId: number, autoPlayId: number) {
    getPlaylistDetail(tracksId).then(data => {
      const tracksIdS = data.playlist.tracks.map((item: TrackSongItem) => item.id);
      this.replaceTracksList(tracksId, tracksIdS, "playlist", autoPlayId);
    });
  }

  // --------------------外部调用--------------------
  // 播放
  play() {
    if (this._howler?.playing()) return;
    this._howler?.play();
    this._setPlaying(true);
    this._howler?.once("play", () => {
      this._howler?.fade(0, this.volume, 200);
    });
  }

  // 暂停
  pause() {
    this._howler?.fade(this.volume, 0, 200);
    this._howler?.once("fade", () => {
      this._howler?.pause();
      this._setPlaying(false);
    });
  }

  // 播放或暂停
  playOrPause() {
    if (this._howler?.playing()) {
      this.pause();
    } else {
      this.play();
    }
  }

  // 修改音量
  changeVolume(volume: number) {
    this.volume = volume;
    this._howler?.volume(volume);
  }

  // 修改播放进度
  changeProgress(progress: number) {
    this._howler?.seek(progress);
    playerStore.updateProgress(progress);
  }

  // 切换播放模式
  changeRepeatMode() {
    const repeatModeList: ("off" | "one" | "on" | "shuffle")[] = ["off", "on", "one", "shuffle"];
    const index = repeatModeList.indexOf(this.repeatMode);
    this.repeatMode = repeatModeList[(index + 1) % 4];
    playerStore.setPlayerData({ repeatMode: this.repeatMode });
  }

  // 倒序播放开启
  changeReversed() {
    this.reversed = !this.reversed;
    playerStore.setPlayerData({ reversed: this.reversed });
  }

  // 播放上一首歌曲
  playPrevTrack() {
    if (this.tracks.length === 0) return;
    const [trackID, index] = this._getPrevTrack();
    if (trackID === undefined) {
      this._howler?.stop();
      this._setPlaying(false);
      return;
    }

    this.currentTrackIndex = index;
    const isAutoPlay = this.repeatMode !== "off" && this.trackSwitchAutoPlay;
    this._replaceCurrentTrack(trackID, isAutoPlay);
  }

  // 播放下一首歌曲
  playNextTrack() {
    if (this.tracks.length === 0) return;
    const [trackID, index] = this._getNextTrack();
    if (trackID === undefined) {
      this._howler?.stop();
      this._setPlaying(false);
      return;
    }
    this.currentTrackIndex = index;
    const isAutoPlay = this.repeatMode !== "off" && this.trackSwitchAutoPlay;

    this._replaceCurrentTrack(trackID, isAutoPlay);
  }

  // 替换播放列表
  replaceTracksList(tracksSourceID: number, tracksId: number[], type: string, autoPlayId: number = 0) {
    this.tracks = tracksId;
    if (this._playlistSource?.type !== type || this._playlistSource?.id !== tracksSourceID) {
      this._playlistSource = { type, id: tracksSourceID };
      playerStore.updateCurrentTrackList(tracksId);
      this.currentTrackIndex = 0;
    }
    if (!this._enabled) {
      this._enabled = true;
      playerStore.setPlayerData({ enabled: true });
    }
    if (autoPlayId === 0) {
      this._replaceCurrentTrack(tracksId[0]);
    } else {
      this.currentTrackIndex = tracksId.indexOf(autoPlayId);
      this._replaceCurrentTrack(autoPlayId, true);
    }
  }

  // 播放列表
  playTracksList(tracksSourceID: number, type: string, autoPlayId: number = 0) {
    if (type === "playlist") {
      this._getPlayListTracks(tracksSourceID, autoPlayId);
    }
  }

  // 添加歌曲到播放列表
  addTrackToTracksList(tracksSourceID: number, type: string, trackId: number) {}
}

export default PlayerTool;
