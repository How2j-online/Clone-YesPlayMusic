<script lang="ts" setup>
import ButtonIcon from "@/components/ButtonIcon.vue";
import HSlider from "@/components/Slider/HSlider.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import { computed, watch } from "vue";
import { resizeImage } from "@/utils/format";
import { useLocale } from "@/locales/useLocal";
import { usePlayerStore } from "@/store/player";
import { storeToRefs } from "pinia";
import PlayerTool from "@/utils/player-tool";
import { useSettingStore } from "@/store/setting";

const playerTool = new PlayerTool();
const { t } = useLocale();

const playerStore = usePlayerStore();
const { playerToolInfo, currentTrack, playerPlaying } = storeToRefs(playerStore);

const settingStore = useSettingStore();
const { theme } = storeToRefs(settingStore);

// 格式化音轨时间
const formatTrackTime = (value: number) => {
  if (!value) return "";
  let min = ~~(value / 60);
  let sec = (~~(value % 60)).toString().padStart(2, "0");
  return `${min}:${sec}`;
};
// 循环title
const repeatTitle = computed(() => {
  switch (playerToolInfo.value.repeatMode) {
    case "off":
      return t("player.noRepeat");
    case "on":
      return t("player.repeat");
    case "one":
      return t("player.repeatTrack");
    case "shuffle":
      return t("player.shuffle");
  }
});
// 播放器音量
const volume = computed(() => {
  return playerToolInfo.value.volume;
});
watch(volume, value => {
  playerTool.changeVolume(value);
});

// 打开歌词页面
const toggleLyrics = () => {
  playerStore.changeShowLyrics();
};

const audioSource = computed(() => {
  return currentTrack.value?.name;
});

// 是否有播放列表
const hasList = () => {
  return false;
};
// 打开播放列表
const goToList = () => {};

const goToArtist = (id: number) => {
  console.log(id, 90);
};
const likeATrack = (id: number) => {
  console.log(id);
  console.log("likeATrack");
};
const playPrevTrack = () => {
  playerTool.playPrevTrack();
};
const playNextTrack = () => {
  playerTool.playNextTrack();
};

const playOrPause = () => {
  playerTool.playOrPause();
};
const moveToFMTrash = () => {
  console.log("moveToFMTrash");
};
// 切换音乐循环模式
const switchRepeatMode = () => {
  playerTool.changeRepeatMode();
};
const switchShuffle = () => {
  console.log("switchShuffle");
};
const switchReversed = () => {
  playerTool.changeReversed();
};
const mute = () => {
  console.log("mute");
};
const goToNextTracksPage = () => {
  console.log("goToNextTracksPage");
};

const goToAlbum = () => {
  console.log("goToAlbum");
};

const handleSliderDrag = (value: number) => {
  playerTool.changeProgress(value);
};
</script>

<template>
  <div class="player">
    <div class="progress-bar">
      <HSlider
        v-model="playerToolInfo.progress"
        :dot-size="12"
        :drag-on-click="true"
        :duration="0"
        :interval="0.5"
        :height="3"
        :lazy="true"
        :max="playerToolInfo.currentTrackDuration"
        :min="0"
        :silent="true"
        @on-drag-end="handleSliderDrag"
        :tooltip-formatter="formatTrackTime"
        :dot-style="{ backgroundColor: '#fff' }"
        :process-style="{ backgroundColor: '#335eea' }"
        :rail-style="{ backgroundColor: '#e8e8e8' }"
      ></HSlider>
    </div>
    <div class="controls" @click="toggleLyrics">
      <div class="playing">
        <div class="container" @click.stop>
          <img :src="currentTrack.al && resizeImage(currentTrack.al.picUrl, 224)" alt="image" @click="goToAlbum" />
          <div :title="audioSource" class="track-info">
            <div :class="['name', { 'has-list': hasList() }]" @click="hasList() && goToList()">
              {{ currentTrack.name }}
            </div>
            <div class="artist">
              <span v-for="(ar, index) in currentTrack.ar" :key="ar.id" @click="ar.id && goToArtist(ar.id)">
                <span :class="{ ar: ar.id }"> {{ ar.name }} </span><span v-if="index !== currentTrack.ar.length - 1">, </span>
              </span>
            </div>
          </div>
          <div class="like-button">
            <button-icon
              :title="playerToolInfo.isCurrentTrackLiked ? t('player.unlike') : t('player.like')"
              @click.native="likeATrack(currentTrack.id)"
            >
              <svg-icon v-show="!playerToolInfo.isCurrentTrackLiked" class="svg-icon" name="heart"></svg-icon>
              <svg-icon v-show="playerToolInfo.isCurrentTrackLiked" class="svg-icon" name="heart-solid"></svg-icon>
            </button-icon>
          </div>
        </div>
        <div class="blank"></div>
      </div>
      <div class="middle-control-buttons">
        <div class="blank"></div>
        <div class="container" @click.stop>
          <button-icon v-show="!playerToolInfo.isPersonalFM" :title="t('player.previous')" @click.native="playPrevTrack">
            <svg-icon class="svg-icon" name="previous" />
          </button-icon>
          <button-icon v-show="playerToolInfo.isPersonalFM" title="不喜欢" @click.native="moveToFMTrash">
            <svg-icon name="thumbs-down" class="svg-icon" />
          </button-icon>
          <button-icon :title="t(playerPlaying ? 'player.pause' : 'player.play')" class="play" @click.native="playOrPause">
            <svg-icon :name="playerPlaying ? 'pause' : 'play'" class="svg-icon" />
          </button-icon>
          <button-icon :title="t('player.next')" @click.native="playNextTrack">
            <svg-icon name="next" class="svg-icon" />
          </button-icon>
        </div>
        <div class="blank"></div>
      </div>
      <div class="right-control-buttons">
        <div class="blank"></div>
        <div class="container" @click.stop>
          <!--展开播发列表-->
          <button-icon
            :class="{
              active: $route.name === 'next',
              disabled: playerToolInfo.isPersonalFM
            }"
            :title="t('player.nextUp')"
            @click.native="goToNextTracksPage"
          >
            <svg-icon name="list" class="svg-icon" />
          </button-icon>
          <!--循环状态-->
          <button-icon
            :class="{
              active: playerToolInfo.repeatMode !== 'off',
              disabled: playerToolInfo.isPersonalFM
            }"
            :title="repeatTitle"
            @click.native="switchRepeatMode"
          >
            <svg-icon
              v-show="playerToolInfo.repeatMode === 'on' || playerToolInfo.repeatMode === 'off'"
              name="repeat"
              class="svg-icon"
            />
            <svg-icon v-show="playerToolInfo.repeatMode === 'one'" name="repeat-1" class="svg-icon" />
            <svg-icon v-show="playerToolInfo.repeatMode === 'shuffle'" name="shuffle" class="svg-icon" />
          </button-icon>
          <!--倒序播放-->
          <button-icon
            v-if="true"
            :class="{ active: playerToolInfo.reversed, disabled: playerToolInfo.isPersonalFM }"
            :title="t('player.reversed')"
            @click.native="switchReversed"
          >
            <svg-icon name="sort-up" class="svg-icon" />
          </button-icon>

          <div class="volume-control">
            <button-icon :title="t('player.mute')" @click.native="mute">
              <svg-icon v-show="volume > 0.5" name="volume" class="svg-icon" />
              <svg-icon v-show="volume === 0" name="volume-mute" class="svg-icon" />
              <svg-icon v-show="volume <= 0.5 && volume !== 0" name="volume-half" class="svg-icon" />
            </button-icon>
            <div class="volume-bar">
              <HSlider
                v-model="playerToolInfo.volume"
                :dot-size="12"
                :drag-on-click="true"
                :duration="0"
                :interval="0.01"
                :max="1"
                :min="0"
                tooltip="none"
                :process-style="{ backgroundColor: '#2e2e2e' }"
                :rail-style="{ backgroundColor: '#e7e7e7' }"
              ></HSlider>
            </div>
          </div>

          <button-icon class="lyrics-button" style="margin-left: 12px" title="歌词" @click.native="toggleLyrics">
            <svg-icon name="arrow-up" class="svg-icon" />
          </button-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.player {
  z-index: var(--z-index-play);
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 64px;
  backdrop-filter: saturate(180%) blur(30px);
  // background-color: rgba(255, 255, 255, 0.86);
  background-color: var(--color-navbar-bg);
}

@supports (-moz-appearance: none) {
  .player {
    background-color: var(--color-body-bg);
  }
}

.progress-bar {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: var(--z-index-play);
}

.controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 100%;
  padding-right: 10vw;
  padding-left: 10vw;
}

@media (max-width: 1336px) {
  .controls {
    padding: 0 5vw;
  }
}

.blank {
  flex-grow: 1;
}

.playing {
  display: flex;
}

.playing .container {
  display: flex;
  align-items: center;

  img {
    height: 46px;
    border-radius: 5px;
    box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.16);
    cursor: pointer;
    user-select: none;
  }

  .track-info {
    height: 46px;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .name {
      font-weight: 600;
      font-size: 16px;
      opacity: 0.88;
      color: var(--color-text);
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }

    .has-list {
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .artist {
      font-size: 12px;
      opacity: 0.58;
      color: var(--color-text);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;

      span.ar {
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.middle-control-buttons {
  display: flex;
}

.middle-control-buttons .container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 8px;

  .button-icon {
    margin: 0 8px;
  }

  .play {
    height: 42px;
    width: 42px;

    .svg-icon {
      width: 24px;
      height: 24px;
    }
  }
}

.right-control-buttons {
  display: flex;
}

.right-control-buttons .container {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .expand {
    margin-left: 24px;

    .svg-icon {
      height: 24px;
      width: 24px;
    }
  }

  .active .svg-icon {
    color: var(--color-primary);
  }

  .volume-control {
    margin-left: 4px;
    display: flex;
    align-items: center;

    .volume-bar {
      width: 84px;
    }
  }
}

.like-button {
  margin-left: 16px;
}

.button-icon.disabled {
  cursor: default;
  opacity: 0.38;

  &:hover {
    background: none;
  }

  &:active {
    transform: unset;
  }
}
</style>
