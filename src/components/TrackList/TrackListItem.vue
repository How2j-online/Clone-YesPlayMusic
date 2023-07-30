<template>
  <div
    class="track"
    :class="trackClass"
    :style="trackStyle"
    :title="showUnavailableSongInGreyStyle ? track.reason : ''"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!--suppress HtmlUnknownAttribute, VueUnrecognizedDirective -->
    <img alt="封面" v-if="!isAlbum" src="" :lazy="imgUrl" v-img-lazy :class="{ hover: focus }" @click="goToAlbum" />
    <div v-if="showOrderNumber" class="no">
      <button v-show="focus && playable && !isPlaying" @click="playTrack">
        <svg-icon class="svg-icon" name="play" style="height: 14px; width: 14px"></svg-icon>
      </button>
      <span v-show="(!focus || !playable) && !isPlaying">{{ trackNo }}</span>
      <button v-show="isPlaying">
        <svg-icon class="svg-icon" name="volume" style="height: 16px; width: 16px"></svg-icon>
      </button>
    </div>
    <div class="title-and-artist">
      <div class="container">
        <div class="title">
          {{ track.name }}
          <span v-if="isSubTitle" :title="subTitle" class="sub-title"> ({{ subTitle }}) </span>
          <span v-if="isAlbum" class="featured">
            <ArtistsInLine :artists="track.ar" :exclude="albumObject.artist.name" prefix="-"
          /></span>
          <span v-if="isAlbum && track.mark === 1318912" class="explicit-symbol"><ExplicitSymbol /></span>
        </div>
        <div v-if="!isAlbum" class="artist">
          <span v-if="track.mark === 1318912" class="explicit-symbol before-artist"><ExplicitSymbol :size="15" /></span>
          <ArtistsInLine :artists="artists" />
        </div>
      </div>
      <div></div>
    </div>

    <div v-if="showAlbumName" class="album">
      <router-link v-if="album && album.id" :to="`/album/${album.id}`">{{ album.name }}</router-link>
      <div></div>
    </div>

    <div v-if="showLikeButton" class="actions">
      <button @click="likeThisSong">
        <svg-icon
          name="heart"
          class="svg-icon"
          :style="{
            visibility: focus && !isLiked ? 'visible' : 'hidden'
          }"
        ></svg-icon>
        <svg-icon v-show="isLiked" class="svg-icon" name="heart-solid"></svg-icon>
      </button>
    </div>
    <div v-if="showTrackTime" class="time">
      {{ formatTime(track.dt) }}
    </div>

    <div v-if="track.playCount" class="count">{{ track.playCount }}</div>
  </div>
</template>

<script lang="ts" setup>
import ArtistsInLine from "@/components/ArtistsInLine.vue";
import ExplicitSymbol from "@/components/ExplicitSymbol.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import { computed, inject, reactive, ref, watch } from "vue";
import { RCTProvideKey } from "@/global/key";
import { TracksItemType } from "@/service/playlist/type";
import { formatTime } from "@/utils/format";
import { usePlayerStore } from "@/store/player";

const props = withDefaults(
  defineProps<{
    tackProp: TracksItemType;
    trackNo: number;
    highlightPlayingTrack: boolean;
    type: string;
  }>(),
  {
    highlightPlayingTrack: true
  }
);

const trackStyle = ref("");
const playerStore = usePlayerStore();
const showUnavailableSongInGreyStyle = ref(false);

// 歌曲信息
const track = computed<TracksItemType>(() => {
  // return props.type === "cloudDisk" ? props.tackProp.simpleSong : props.tackProp;
  return props.tackProp;
});

const playable = computed(() => {
  return track.value.privilege?.pl > 0 || track.value?.playable;
});

// 歌曲图片
const imgUrl = computed(() => {
  // let image =
  //   track.value.al.picUrl ?? track.value.album?.picUrl ?? "https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg";
  let image = track.value.al.picUrl ?? "https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg";

  return image + "?param=224y224";
});
// class切换
const parentRightClickedTrack = inject(RCTProvideKey);
const hover = ref(false);
const isPlaying = computed(() => {
  return playerStore.currentTrack.id === track.value.id;
});
const trackClass = computed(() => {
  let trackClassList: string[] = [props.type];
  if (!playable.value && showUnavailableSongInGreyStyle.value) {
    trackClassList.push("disable");
  }
  if (isPlaying.value && props.highlightPlayingTrack) {
    trackClassList.push("playing");
  }
  if (focus.value) {
    trackClassList.push("focus");
  }
  return trackClassList;
});
// 右键菜单是否打开
const isMenuOpened = computed(() => {
  return parentRightClickedTrack.value.id === track.value.id;
});
// 是否聚焦
const focus = computed(() => {
  return (hover.value && parentRightClickedTrack.value.id === 0) || isMenuOpened.value;
});
// 专辑信息
const album = computed(() => {
  return track.value.album || track.value.al || track.value?.simpleSong?.al;
});
// 是否显示时间
const showTrackTime = computed(() => props.type !== "trackList");
// 是否显示专辑名
const showAlbumName = computed(() => props.type !== "album" && props.type !== "trackList");

//TODO: 专辑信息
const albumObject = reactive({
  id: 0,
  name: "",
  artist: {
    id: 0,
    name: ""
  }
});

const isAlbum = computed(() => props.type === "album");
const showOrderNumber = computed(() => props.type === "album");
const isSubTitle = computed(() => props.type === "album");
const subTitle = computed(() => {
  return "专辑";
});
const artists = computed(() => {
  return props.tackProp.ar;
});

const showLikeButton = computed(() => props.type === "song");
const isLiked = computed(() => {
  return false;
});

const goToAlbum = () => {
  console.log("goToAlbum");
};
const playTrack = () => {
  console.log("playTrack");
};
const likeThisSong = () => {
  console.log("likeThisSong");
};
</script>

<style lang="less" scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background: transparent;
  border-radius: 25%;
  transition: transform 0.2s;
  .svg-icon {
    height: 16px;
    width: 16px;
    color: var(--color-primary);
  }
  &:hover {
    transform: scale(1.12);
  }
  &:active {
    transform: scale(0.96);
  }
}

.track {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 12px;
  user-select: none;

  .no {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    margin: 0 20px 0 10px;
    width: 12px;
    color: var(--color-text);
    cursor: default;
    span {
      opacity: 0.58;
    }
  }

  .explicit-symbol {
    opacity: 0.28;
    color: var(--color-text);
    .svg-icon {
      margin-bottom: -3px;
    }
  }

  .explicit-symbol.before-artist {
    .svg-icon {
      margin-bottom: -3px;
    }
  }

  img {
    border-radius: 8px;
    height: 46px;
    width: 46px;
    margin-right: 20px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    cursor: pointer;
  }

  img.hover {
    filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25));
  }

  .title-and-artist {
    flex: 1;
    display: flex;
    .container {
      display: flex;
      flex-direction: column;
    }
    .title {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-text);
      cursor: default;
      padding-right: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
      .featured {
        margin-right: 2px;
        font-weight: 500;
        font-size: 14px;
        opacity: 0.72;
      }
      .sub-title {
        color: #7a7a7a;
        opacity: 0.7;
        margin-left: 4px;
      }
    }
    .artist {
      margin-top: 2px;
      font-size: 13px;
      opacity: 0.68;
      color: var(--color-text);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      a {
        span {
          margin-right: 3px;
          opacity: 0.8;
        }
        &:hover {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
  .album {
    flex: 1;
    display: flex;
    font-size: 16px;
    opacity: 0.88;
    color: var(--color-text);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .time,
  .count {
    font-size: 16px;
    width: 50px;
    cursor: default;
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
    font-variant-numeric: tabular-nums;
    opacity: 0.88;
    color: var(--color-text);
  }
  .count {
    font-weight: bold;
    font-size: 22px;
    line-height: 22px;
  }
}

.track.focus {
  transition: all 0.3s;
  background: var(--color-secondary-bg);
}

.track.disable {
  img {
    filter: grayscale(1) opacity(0.6);
  }
  .title,
  .artist,
  .album,
  .time,
  .no,
  .featured {
    opacity: 0.28 !important;
  }
  &:hover {
    background: none;
  }
}

.track.track-list {
  img {
    height: 36px;
    width: 36px;
    border-radius: 6px;
    margin-right: 14px;
    cursor: pointer;
  }
  .title {
    font-size: 16px;
  }
  .artist {
    font-size: 12px;
  }
}

.track.album {
  height: 32px;
}

.actions {
  width: 80px;
  display: flex;
  justify-content: flex-end;
}

.track.playing {
  background: var(--color-primary-bg);
  color: var(--color-primary);
  .title,
  .album,
  .time,
  .title-and-artist .sub-title {
    color: var(--color-primary);
  }
  .title .featured,
  .artist,
  .explicit-symbol,
  .count {
    color: var(--color-primary);
    opacity: 0.88;
  }
  .no span {
    color: var(--color-primary);
    opacity: 0.78;
  }
}
</style>
