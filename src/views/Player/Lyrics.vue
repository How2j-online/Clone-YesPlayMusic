<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, toRaw, watch } from "vue";
import type { ParsedLyricsType } from "@/utils/lyrics";
import ButtonIcon from "@/components/ButtonIcon.vue";
import { useLocale } from "@/locales/useLocal";
import SvgIcon from "@/components/SvgIcon.vue";
import HSlider from "@/components/Slider/HSlider.vue";
import { formatTrackTime } from "@/utils/format";
import { getImgColor } from "@/utils";
import * as Color from "color";
import { usePlayerStore } from "@/store/player";
import { useSettingStore } from "@/store/setting";
import { storeToRefs } from "pinia";
import PlayerTool from "@/utils/player-tool";
import { getTrackLyric } from "@/service/player/track";
import { lyricParser } from "@/utils/lyrics";

const playerStore = usePlayerStore();
const settingStore = useSettingStore();

const { currentTrack, playerToolInfo, playerPlaying, showLyrics, currentTrackLyricsInfo } = storeToRefs(playerStore);
const { lyricsSetting: settings } = storeToRefs(settingStore);
const { t } = useLocale();
const playerTool = new PlayerTool();
const lyricAlys = ref<ParsedLyricsType[]>([]); // 歌词数据
const tLyricAlys = ref<ParsedLyricsType[]>([]); // 翻译歌词数据
const getLyric = () => {
  if (!currentTrack.value.id) return;
  getTrackLyric(currentTrack.value.id).then(res => {
    let { lyric, tLyric } = lyricParser(res);
    lyric.filter(l => !/^作([词曲])\s*([:：])\s*无$/.exec(l.content)); // 过滤掉作词作曲无的歌词
    let includeAM = lyric.length <= 10 && lyric.map(l => l.content).includes("纯音乐，请欣赏"); // 纯音乐
    if (includeAM) {
      let reg = /^作([词曲])\s*([:：])\s*/;
      let author = currentTrack.value?.ar[0]?.name;
      lyric = lyric.filter(l => {
        let regExpArr = l.content.match(reg);
        return !regExpArr || l.content.replace(regExpArr[0], "") !== author;
      });
    }
    if (lyric.length === 1 && includeAM) {
      lyricAlys.value = [];
      tLyricAlys.value = [];
    } else {
      lyricAlys.value = lyric;
      tLyricAlys.value = tLyric;
    }
  });
}; // 获取歌词
getLyric();

const noLyric = computed(() => {
  return lyricAlys.value.length === 0;
});

const theme = ref<string>("dark");
const date = ref<string>("00:00");

const bgImageUrl = computed(() => {
  return currentTrack.value.al.picUrl;
});
const imageUrl = computed(() => {
  return currentTrack.value.al.picUrl;
});
const background = computed(async () => {
  const color = await getImgColor(imageUrl.value);
  const color2 = Color.rgb(color).lighten(0.28).rotate(-30).rgb().string();
  return `linear-gradient(to top left, ${color}, ${color2})`;
});
// 声音
const volume = computed(() => {
  return playerToolInfo.value.volume;
});
watch(volume, value => {
  playerTool.changeVolume(value);
});

const handleSliderDrag = (value: number) => {
  playerTool.changeProgress(value);
};

// 循环按钮 title
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

// 歌词滚动
const highlightLyricIndex = ref<number>(toRaw(currentTrackLyricsInfo.value.lyricLineIndex));
const lyricsInterval = ref<ReturnType<typeof setInterval>>();
const setLyricsInterval = () => {
  lyricsInterval.value = setInterval(() => {
    const progress = playerToolInfo.value.progress;
    let oldHighlightLyricIndex = highlightLyricIndex.value;
    highlightLyricIndex.value = lyricAlys.value.findIndex((l, index) => {
      const nextLyric = lyricAlys.value[index + 1];
      return progress >= l.time && (nextLyric ? progress < nextLyric.time : true);
    });
    if (oldHighlightLyricIndex !== highlightLyricIndex.value) {
      playerStore.updateLyricsIndex(highlightLyricIndex.value);
      const lyricLineEl = document.getElementById(`line${highlightLyricIndex.value}`);
      const mainEl = document.querySelector("main");
      // setLyricsScroll(lyricLineEl as HTMLDivElement);
      if (lyricLineEl && lyricLineEl.offsetTop > mainEl?.clientHeight / 2) {
        lyricLineEl.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      } else {
        const lyricLine1El = document.getElementById("line-1");
        if (lyricLine1El) {
          lyricLine1El.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    }
  }, 50);
};
// TODO: 歌词颜色填充动态变化，时间间隔问题待优化
const setLyricsScroll = (el: HTMLDivElement) => {
  const spanEl = el.querySelectorAll("span");
  let styleSheet = document.styleSheets[0]; // 假设样式表是第一个样式表
  let animationStyle = "@keyframes scan { 0% { background-size:0 100%; } 100% { background-size:100% 100%; } }";
  styleSheet.insertRule(animationStyle, styleSheet.cssRules.length);
  const animationTime = lyricAlys.value[highlightLyricIndex.value + 1].time - lyricAlys.value[highlightLyricIndex.value].time;
  spanEl.forEach(el => {
    el.style.animation = `scan ${animationTime}s linear backwards`;
  });
};
const showTranslationLyrics = ref<boolean>(false); // 是否显示翻译歌词
const switchTranslationLyrics = () => {
  showTranslationLyrics.value = !showTranslationLyrics.value;
  setLyricsLine();
};
const setLyricsLine = () => {
  const lyricsLineEl = document.querySelector(`#line${highlightLyricIndex.value}`);
  nextTick(() => {
    lyricsLineEl?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
};

watch([showLyrics, playerPlaying], ([newShowLyrics, newPlaying]) => {
  if (newShowLyrics) {
    setLyricsLine();
  }
  if (newShowLyrics && newPlaying) {
    setLyricsInterval();
  } else {
    if (lyricsInterval.value) {
      clearInterval(lyricsInterval.value);
    }
  }
});

const lyricWithTranslation = computed(() => {
  let ret: { time: number; content: string; contents: string[] }[] = [];
  const lyricFiltered = lyricAlys.value.filter(({ content }) => Boolean(content));
  if (lyricFiltered.length) {
    lyricFiltered.forEach(({ rawTime, time, content }) => {
      const lyricItem = { time, content, contents: [content] };
      const sameTimeTLyric = tLyricAlys.value.find(({ rawTime: tLyricRawTime }) => {
        return tLyricRawTime === rawTime;
      });
      if (sameTimeTLyric) {
        const { content: tLyricContent } = sameTimeTLyric;
        if (tLyricContent) {
          lyricItem.contents.push(tLyricContent);
        }
      }
      ret.push(lyricItem);
    });
  } else {
    ret = lyricFiltered.map(({ time, content }) => {
      return {
        time,
        content,
        contents: [content]
      };
    });
  }
  return ret;
});

const artist = computed(() => {
  return currentTrack.value?.ar ? currentTrack.value?.ar[0] : { id: 0, name: "unknown" };
});
const album = ref({ id: 0, name: "album" });
const hasList = () => {
  return true;
};
const getListPath = () => {
  return "/library";
};
const mute = () => {
  console.log("mute");
};

const likeATrack = (id: number) => {
  console.log("likeAtrack");
};

const addToPlaylist = () => {
  console.log("addToPlaylist");
};
const switchRepeatMode = () => {
  playerTool.changeRepeatMode();
};

const switchShuffle = () => {
  console.log("switchShuffle");
};
const lyricFontSize = computed(() => {
  return {
    fontSize: `${settings.value.lyricFontSize || 28}px`
  };
});
// 歌词点击
const clickLyricLine = (value: number, startPlay: boolean = false) => {
  let jumpFlag = false;
  lyricAlys.value.filter(item => {
    if (item.content === "纯音乐，请欣赏") {
      jumpFlag = true;
    }
  });
  if (!jumpFlag) {
    playerTool.changeProgress(value + 0.3);
    highlightLyricIndex.value = lyricAlys.value.findIndex(ly => ly.time === value);
    setLyricsLine();
  }
};

const toggleLyrics = () => {
  playerStore.changeShowLyrics();
};
const moveToFMTrash = () => {
  console.log("moveToFMTrash");
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
</script>

<template>
  <transition name="slide-up">
    <div class="lyrics-page" :class="{ 'no-lyric': noLyric }" :data-theme="theme">
      <div
        v-if="settings.lyricsBackground === 'blur' || settings.lyricsBackground === 'dynamic'"
        class="lyrics-background"
        :class="{
          'dynamic-background': settings.lyricsBackground === 'dynamic'
        }"
      >
        <div class="top-right" :style="{ backgroundImage: `url(${bgImageUrl})` }" />
        <div class="bottom-left" :style="{ backgroundImage: `url(${bgImageUrl})` }" />
      </div>
      <div v-if="settings.lyricsBackground === true" class="gradient-background" :style="{ background }"></div>

      <div class="left-side">
        {{ settings.lyricsBackground }}
        <div>
          <div v-if="settings.showLyricsTime" class="date">
            {{ date }}
          </div>
          <div class="cover">
            <div class="cover-container">
              <!--suppress VueUnrecognizedDirective -->
              <img :src="imageUrl" alt="image" />
              <div class="shadow" :style="{ backgroundImage: `url(${imageUrl})` }"></div>
            </div>
          </div>
          <div class="controls">
            <div class="top-part">
              <div class="track-info">
                <div class="title" :title="currentTrack.name">
                  <router-link v-if="hasList()" :to="`${getListPath()}`" @click.native="toggleLyrics"
                    >{{ currentTrack.name }}
                  </router-link>
                  <span v-else>
                    {{ currentTrack.name }}
                  </span>
                </div>
                <div class="subtitle">
                  <router-link v-if="artist.id !== 0" :to="`/artist/${artist.id}`" @click.native="toggleLyrics"
                    >{{ artist.name }}
                  </router-link>
                  <span v-else>
                    {{ artist.name }}
                  </span>
                  <span v-if="album.id !== 0">
                    -
                    <router-link :to="`/album/${album.id}`" :title="album.name" @click.native="toggleLyrics"
                      >{{ album.name }}
                    </router-link>
                  </span>
                </div>
              </div>
              <div class="top-right">
                <div class="volume-control">
                  <button-icon :title="t('player.mute')" @click.native="mute">
                    <svg-icon class="svg-icon" v-show="volume > 0.5" name="volume" />
                    <svg-icon class="svg-icon" v-show="volume === 0" name="volume-mute" />
                    <svg-icon class="svg-icon" v-show="volume <= 0.5 && volume !== 0" name="volume-half" />
                  </button-icon>
                  <div class="volume-bar">
                    <HSlider
                      v-model="playerToolInfo.volume"
                      :min="0"
                      :max="1"
                      :interval="0.01"
                      :duration="0"
                      tooltip="none"
                      :dot-size="12"
                      :dot-style="{ backgroundColor: '#fff' }"
                      :process-style="{ backgroundColor: '#fff' }"
                      :rail-style="{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }"
                    ></HSlider>
                  </div>
                </div>
                <div class="buttons">
                  <button-icon :title="t('player.like')" @click.native="likeATrack(currentTrack.id)">
                    <svg-icon class="svg-icon" :name="playerToolInfo.isCurrentTrackLiked ? 'heart-solid' : 'heart'" />
                  </button-icon>
                  <button-icon :title="t('contextMenu.addToPlaylist')" @click.native="addToPlaylist">
                    <svg-icon class="svg-icon" name="plus" />
                  </button-icon>
                  <!-- <button-icon @click.native="openMenu" title="Menu"
                    ><svg-icon icon-class="more"
                  /></button-icon> -->
                </div>
              </div>
            </div>
            <div class="progress-bar">
              <span>{{ formatTrackTime(playerToolInfo.progress) }}</span>
              <div class="slider">
                <HSlider
                  v-model="playerToolInfo.progress"
                  :min="0"
                  :max="playerToolInfo.currentTrackDuration"
                  :interval="0.5"
                  :drag-on-click="true"
                  :duration="0"
                  :dot-size="12"
                  :height="5"
                  @on-drag-end="handleSliderDrag"
                  :tooltip-formatter="formatTrackTime"
                  :lazy="true"
                  :silent="true"
                  :dot-style="{ backgroundColor: '#fff' }"
                  :process-style="{ backgroundColor: '#fff' }"
                  :rail-style="{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }"
                ></HSlider>
              </div>
              <span>{{ formatTrackTime(playerToolInfo.currentTrackDuration) }}</span>
            </div>
            <div class="media-controls">
              <button-icon
                v-show="!playerToolInfo.isPersonalFM"
                :title="repeatTitle"
                :class="{ active: playerToolInfo.repeatMode !== 'off' }"
                @click.native="switchRepeatMode"
              >
                <svg-icon
                  class="svg-icon"
                  v-show="playerToolInfo.repeatMode === 'on' || playerToolInfo.repeatMode === 'off'"
                  name="repeat"
                />
                <svg-icon class="svg-icon" v-show="playerToolInfo.repeatMode === 'one'" name="repeat-1" />
                <svg-icon name="shuffle" v-show="playerToolInfo.repeatMode === 'shuffle'" class="svg-icon" />
              </button-icon>
              <div class="middle">
                <button-icon v-show="!playerToolInfo.isPersonalFM" :title="t('player.previous')" @click.native="playPrevTrack">
                  <svg-icon class="svg-icon" name="previous" />
                </button-icon>
                <button-icon v-show="playerToolInfo.isPersonalFM" title="不喜欢" @click.native="moveToFMTrash">
                  <svg-icon class="svg-icon" name="thumbs-down" />
                </button-icon>
                <button-icon id="play" :title="t(playerPlaying ? 'player.pause' : 'player.play')" @click.native="playOrPause">
                  <svg-icon class="svg-icon" :name="playerPlaying ? 'pause' : 'play'" />
                </button-icon>
                <button-icon :title="t('player.next')" @click.native="playNextTrack">
                  <svg-icon class="svg-icon" name="next" />
                </button-icon>
              </div>
              <button-icon
                v-if="settings.showLyricsTranslation"
                :title="t('player.translationLyrics')"
                :class="{ active: showTranslationLyrics }"
                @click.native="switchTranslationLyrics"
              >
                <svg-icon class="svg-icon" name="translation" />
              </button-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="right-side">
        <transition name="slide-fade">
          <div v-show="!noLyric" ref="lyricsContainer" class="lyrics-container" :style="lyricFontSize">
            <div id="line-1" class="line"></div>
            <div
              v-for="(line, index) in lyricWithTranslation"
              :id="`line${index}`"
              :key="index"
              class="line user-select-none"
              :class="{
                highlight: highlightLyricIndex === index
              }"
              @click="clickLyricLine(line.time)"
              @dblclick="clickLyricLine(line.time, true)"
            >
              <div class="content">
                <span v-if="line.contents[0]">{{ line.contents[0] }}</span>
                <br />
                <span v-if="line.contents[1] && showTranslationLyrics" class="translation">{{ line.contents[1] }}</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="close-button" @click="toggleLyrics">
        <button>
          <svg-icon class="svg-icon" name="arrow-down" />
        </button>
      </div>
    </div>
  </transition>
</template>

<style lang="less" scoped>
.lyrics-page {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
  background: var(--color-body-bg);
  display: flex;
  clip: rect(auto, auto, auto, auto);
}

.lyrics-background {
  --contrast-lyrics-background: 75%;
  --brightness-lyrics-background: 150%;
}

[data-theme="dark"] .lyrics-background {
  --contrast-lyrics-background: 125%;
  --brightness-lyrics-background: 50%;
}

.lyrics-background {
  filter: blur(50px) contrast(var(--contrast-lyrics-background)) brightness(var(--brightness-lyrics-background));
  position: absolute;
  height: 100vh;
  width: 100vw;
  .top-right,
  .bottom-left {
    z-index: 0;
    width: 140vw;
    height: 140vw;
    opacity: 0.6;
    position: absolute;
    background-size: cover;
  }

  .top-right {
    right: 0;
    top: 0;
    mix-blend-mode: luminosity;
  }

  .bottom-left {
    left: 0;
    bottom: 0;
    animation-direction: reverse;
    animation-delay: 10s;
  }
}

.dynamic-background > div {
  animation: rotate 150s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.gradient-background {
  position: absolute;
  height: 100vh;
  width: 100vw;
}

.left-side {
  flex: 1;
  display: flex;
  justify-content: center;
  margin-right: 22px;
  margin-top: 24px;
  align-items: center;
  transition: all 0.5s;
  z-index: 1;

  .date {
    max-width: 54vh;
    margin: 24px 0;
    color: var(--color-text);
    text-align: center;
    font-size: 4rem;
    font-weight: 600;
    opacity: 0.88;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .controls {
    max-width: 54vh;
    margin-top: 24px;
    color: var(--color-text);

    .title {
      margin-top: 8px;
      font-size: 1.4rem;
      font-weight: 600;
      opacity: 0.88;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    .subtitle {
      margin-top: 4px;
      font-size: 1rem;
      opacity: 0.58;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    .top-part {
      display: flex;
      justify-content: space-between;

      .top-right {
        display: flex;
        justify-content: space-between;

        .volume-control {
          margin: 0 10px;
          display: flex;
          align-items: center;
          .volume-bar {
            width: 84px;
          }
        }

        .buttons {
          display: flex;
          align-items: center;

          button {
            margin: 0 0 0 4px;
          }

          .svg-icon {
            height: 18px;
            width: 18px;
          }
        }
      }
    }

    .progress-bar {
      margin-top: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .slider {
        width: 100%;
        flex-grow: revert;
        padding: 0 10px;
      }

      span {
        font-size: 15px;
        opacity: 0.58;
        min-width: 28px;
      }
    }

    .media-controls {
      display: flex;
      justify-content: center;
      margin-top: 18px;
      align-items: center;

      button {
        margin: 0;
      }

      .svg-icon {
        opacity: 0.38;
        height: 16px;
        width: 16px;
      }

      .active .svg-icon {
        opacity: 0.88;
      }

      .middle {
        padding: 0 16px;
        display: flex;
        align-items: center;

        button {
          margin: 0 8px;
        }

        button#play .svg-icon {
          height: 28px;
          width: 28px;
          padding: 2px;
        }

        .svg-icon {
          opacity: 0.88;
          height: 22px;
          width: 22px;
        }
      }
    }
  }
}

.cover {
  position: relative;

  .cover-container {
    position: relative;
  }

  img {
    border-radius: 0.75em;
    width: 54vh;
    height: 54vh;
    user-select: none;
    object-fit: cover;
  }

  .shadow {
    position: absolute;
    top: 12px;
    height: 54vh;
    width: 54vh;
    filter: blur(16px) opacity(0.6);
    transform: scale(0.92, 0.96);
    z-index: -1;
    background-size: cover;
    border-radius: 0.75em;
  }
}

.right-side {
  flex: 1;
  font-weight: 600;
  color: var(--color-text);
  margin-right: 24px;
  z-index: 0;
  height: 86vh;
  margin-top: auto;
  margin-bottom: auto;

  .lyrics-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 32px;
    max-width: 460px;
    overflow-y: auto;
    transition: 0.5s;
    scrollbar-width: none; // firefox
    //noinspection CssInvalidPropertyValue
    -webkit-mask-image: linear-gradient(
      180deg,
      hsla(0, 0%, 100%, 0) 0,
      hsla(0, 0%, 100%, 0.6) 15%,
      #fff 25%,
      #fff 75%,
      hsla(0, 0%, 100%, 0.6) 85%,
      hsla(0, 0%, 100%, 0)
    );
    .line {
      margin: 2px 0;
      padding: 12px 18px;
      transition: 0.5s;
      border-radius: 12px;

      &:hover {
        background: var(--color-secondary-bg-for-transparent);
      }

      .content {
        transform-origin: center left;
        transform: scale(0.95);
        transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);

        span {
          background-color: rgba(255, 255, 255, 0.4);
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-size: 0 100%;
          background-image: -webkit-linear-gradient(left, #fff, #fff);

          cursor: default;
          font-size: 1em;
          transition: background-color 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        span.translation {
          background-color: rgba(255, 255, 255, 0.4);
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-size: 0 100%;
          background-image: -webkit-linear-gradient(left, #fff, #fff);

          font-size: 0.925em;
        }
      }
    }

    .line#line-1:hover {
      background: unset;
    }

    .translation {
      margin-top: 0.1em;
    }

    .highlight div.content {
      transform: scale(1.1);
      span {
        background-color: rgba(255, 255, 255, 0.4);
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 100% 100%;
        background-image: -webkit-linear-gradient(left, #fff, #fff);
        //opacity: 0.98;
        display: inline-block;
      }

      span.translation {
        background-color: rgba(255, 255, 255, 0.4);
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 100% 100%;
        background-image: -webkit-linear-gradient(left, #fff, #fff);
        //opacity: 0.65;
      }
    }
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .lyrics-container .line:first-child {
    padding-top: 12vh;
  }

  .lyrics-container .line:last-child {
    margin-bottom: calc(50vh - 128px);
  }
}

.close-button {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 300;
  border-radius: 0.75rem;
  height: 44px;
  width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.28;
  transition: 0.2s;

  .svg-icon {
    color: var(--color-text);
    padding-top: 5px;
    height: 22px;
    width: 22px;
  }

  &:hover {
    background: var(--color-secondary-bg-for-transparent);
    opacity: 0.88;
  }
}

.lyrics-page.no-lyric {
  .left-side {
    transition: all 0.5s;
    transform: translateX(27vh);
    margin-right: 0;
  }
}

@media (max-aspect-ratio: 10/9) {
  .left-side {
    display: none;
  }
  .right-side .lyrics-container {
    max-width: 100%;
  }
}

@media screen and (min-width: 1200px) {
  .right-side .lyrics-container {
    max-width: 600px;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s;
}

.slide-up-enter, .slide-up-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(100%);
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.2, 0.2, 0, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(27vh);
  opacity: 0;
}
</style>
