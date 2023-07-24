<script setup lang="ts">
defineOptions({
  name: "FMCard"
});

// TODO: 未完成
import ButtonIcon from "@/components/ButtonIcon.vue";
import ArtistsInLine from "@/components/ArtistsInLine.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import { useLocale } from "@/locales/useLocal";
import { onMounted, ref } from "vue";
import * as Color from "color";
import { getImgColor } from "@/utils";

const { t } = useLocale();
const background = ref("");
const isPlaying = true;
const resizeImage = (imgUrl: string, size = 512) => {
  if (!imgUrl) return "";
  let httpsImgUrl = imgUrl;
  if (imgUrl.slice(0, 5) !== "https") {
    httpsImgUrl = "https" + imgUrl.slice(4);
  }
  return `${httpsImgUrl}?param=${size}y${size}`;
};
const nextTrackCover = "https://p1.music.126.net/e3OHl1DchMHo8rr8XUOlrA==/109951166503049404.jpg?param=512y512";
const track = {
  name: "name",
  artists: [
    {
      id: 1,
      name: "artist"
    }
  ],
  album: {
    picUrl: "https://p1.music.126.net/e3OHl1DchMHo8rr8XUOlrA==/109951166503049404.jpg?param=512y512"
  }
};

const goToAlbum = () => {
  console.log("goToAlbum");
};
const moveToFMTrash = () => {
  console.log("moveToFMTrash");
};
const play = () => {
  console.log("play");
};
const next = () => {
  console.log("next");
};

onMounted(() => {
  getImgColor(nextTrackCover).then(color => {
    const color2 = Color.rgb(color).lighten(0.28).rotate(-30).rgb().string();
    background.value = `linear-gradient(to top left, ${color}, ${color2})`;
  });
});
</script>

<template>
  <div class="fm" :style="{ background }" data-theme="dark">
    <!--suppress HtmlUnknownAttribute, VueUnrecognizedDirective -->
    <img src="" v-img-lazy :lazy="nextTrackCover" style="display: none" alt="image" />
    <!--suppress VueUnrecognizedDirective, HtmlUnknownAttribute -->
    <img
      class="cover"
      src=""
      :lazy="track.album && resizeImage(track.album.picUrl, 512)"
      v-img-lazy
      alt="image"
      @click="goToAlbum"
    />
    <div class="right-part">
      <div class="info">
        <div class="title">{{ track.name }}</div>
        <div class="artist"><ArtistsInLine :artists="track.artists" /></div>
      </div>
      <div class="controls">
        <div class="buttons">
          <button-icon title="不喜欢" @click.native="moveToFMTrash">
            <svg-icon id="thumbs-down" class="svg-icon" name="thumbs-down" />
          </button-icon>
          <button-icon :title="t(isPlaying ? 'player.pause' : 'player.play')" class="play" @click.native="play">
            <svg-icon :name="isPlaying ? 'pause' : 'play'" class="svg-icon" />
          </button-icon>
          <button-icon :title="t('player.next')" @click.native="next">
            <svg-icon name="next" class="svg-icon" />
          </button-icon>
        </div>
        <div class="card-name"><svg-icon name="fm" class="svg-icon" />私人FM</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.fm {
  padding: 1rem;
  background: var(--color-secondary-bg);
  border-radius: 1rem;
  display: flex;
  height: 198px;
  box-sizing: border-box;
}
.cover {
  height: 100%;
  clip-path: border-box;
  border-radius: 0.75rem;
  margin-right: 1.2rem;
  cursor: pointer;
  user-select: none;
}
.right-part {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: var(--color-text);
  width: 100%;
  .title {
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 0.6rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }
  .artist {
    opacity: 0.68;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-left: -0.4rem;
    .buttons {
      display: flex;
    }
    .button-icon {
      margin: 0 8px 0 0;
    }
    .svg-icon {
      width: 24px;
      height: 24px;
    }
    .svg-icon#thumbs-down {
      width: 22px;
      height: 22px;
    }
    .card-name {
      font-size: 1rem;
      opacity: 0.18;
      display: flex;
      align-items: center;
      font-weight: 600;
      user-select: none;
      .svg-icon {
        width: 18px;
        height: 18px;
        margin-right: 6px;
      }
    }
  }
}

button {
  color: #ffffff;
}
</style>
