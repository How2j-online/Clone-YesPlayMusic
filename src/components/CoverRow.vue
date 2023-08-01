<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@/components/SvgIcon.vue";
import Cover from "@/components/Cover.vue";
import { formatPlayCount } from "@/utils/format";
import ExplicitSymbol from "@/components/ExplicitSymbol.vue";

interface PropsCoverItemsType {
  id: number;
  name: string;
  img1v1Url?: string;
  picUrl?: string;
  coverImgUrl?: string;
  mark?: number;
  privacy?: number;
  copywriter?: string;
  description?: string;
  updateFrequency?: string;
  playCount?: number;
  creator?: {
    nickname: string;
  };
  publishTime?: number;
  artist?: {
    id: number;
    name: string;
  };
  artists?: {
    id: number;
    name: string;
  }[];
  type?: string;
  size?: number;
}

defineOptions({
  name: "CoverRow"
});
const props = withDefaults(
  defineProps<{
    type: string;
    items: PropsCoverItemsType[];
    columnNumber?: number; // 一行几个
    gap?: string; // grid-gap 网格上下间距
    playButtonSize?: number; // 播放按钮大小
    showPlayCount?: boolean; // 是否显示播放量
    subText?: string; // 子标题
    subTextFontSize?: string; // 子标题大小
  }>(),
  {
    columnNumber: 5,
    gap: "44px 24px",
    playButtonSize: 22,
    subText: null,
    subTextFontSize: "16px"
  }
);
// 样式
const rowStyle = computed(() => {
  return {
    "grid-template-columns": `repeat(${props.columnNumber}, 1fr)`,
    "grid-gap": props.gap
  };
});
// 是否显示播放量
const getImageUrl = (item: PropsCoverItemsType) => {
  if (item.img1v1Url) {
    const img1v1ID = item.img1v1Url.split("/");
    let imgID = img1v1ID[img1v1ID.length - 1];
    if (imgID === "5639395138885805.jpg") {
      // 没有头像的歌手，网易云返回的img1v1Url并不是正方形的 😅😅😅
      return "https://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=512y512";
    }
  }
  let img = item.img1v1Url || item.picUrl || item.coverImgUrl;
  return `${img?.replace(/http:\/\//, "https://")}?param=512y512`;
};
// 是否是隐私
const isPrivacy = (item: PropsCoverItemsType) => {
  return props.type === "playlist" && item.privacy === 10;
};
// 是否是独家
const isExplicit = (item: PropsCoverItemsType) => {
  return props.type === "album" && item.mark === 1056768;
};
// 获取标题
const getTitleLink = (item: PropsCoverItemsType) => {
  return `/${props.type}/${item.id}`;
};
// 获取子标题
const getSubText = (item: PropsCoverItemsType) => {
  if (props.subText === "copywriter") return item.copywriter;
  if (props.subText === "description") return item.description;
  if (props.subText === "updateFrequency") return item.updateFrequency;
  if (props.subText === "creator") return "by " + item.creator.nickname;
  if (props.subText === "releaseYear") return new Date(item.publishTime).getFullYear();
  if (props.subText === "artist") {
    if (item.artist !== undefined) return `<a href="/#/artist/${item.artist.id}">${item.artist.name}</a>`;
    if (item.artists !== undefined) return `<a href="/#/artist/${item.artists[0].id}">${item.artists[0].name}</a>`;
  }
  if (props.subText === "albumType+releaseYear") {
    let albumType = item.type;
    if (item.type === "EP/Single") {
      albumType = item.size === 1 ? "Single" : "EP";
    } else if (item.type === "Single") {
      albumType = "Single";
    } else if (item.type === "专辑") {
      albumType = "Album";
    }
    return `${albumType} · ${new Date(item.publishTime).getFullYear()}`;
  }
  if (props.subText === "appleMusic") return "by Apple Music";
};
</script>

<template>
  <div class="cover-row" :style="rowStyle">
    <div class="item" v-for="item in items" :key="item.id" :class="{ artist: type === 'artist' }">
      <!--图片-->
      <Cover
        :type="type"
        :image-url="getImageUrl(item)"
        :id="item.id"
        :play-button-size="type === 'artist' ? 26 : playButtonSize"
      />
      <!--文字-->
      <div class="text">
        <div v-if="showPlayCount" class="info">
          <span class="play-count"><svg-icon class="svg-icon" name="play" />{{ formatPlayCount(item.playCount) }} </span>
        </div>
        <div class="title" :style="{ fontSize: subTextFontSize }">
          <span v-if="isExplicit(item)" class="explicit-symbol"><ExplicitSymbol /></span>
          <span v-if="isPrivacy(item)" class="lock-icon"> <svg-icon class="svg-icon" name="lock" /></span>
          <router-link :to="getTitleLink(item)">{{ item.name }}</router-link>
        </div>
        <div v-if="type !== 'artist' && subText !== 'none'" class="info">
          <span v-html="getSubText(item)"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.cover-row {
  display: grid;
}
.item {
  color: var(--color-text);
  .text {
    margin-top: 8px;
    .title {
      font-size: 16px;
      font-weight: 600;
      line-height: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-all;
    }
    .info {
      font-size: 12px;
      opacity: 0.68;
      line-height: 18px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-word;
    }
  }
}

.item.artist {
  display: flex;
  flex-direction: column;
  text-align: center;
  .cover {
    display: flex;
  }
  .title {
    margin-top: 4px;
  }
}

@media (max-width: 834px) {
  .item .text .title {
    font-size: 14px;
  }
}

.explicit-symbol {
  opacity: 0.28;
  color: var(--color-text);
  float: right;
  .svg-icon {
    margin-bottom: -3px;
  }
}

.lock-icon {
  opacity: 0.28;
  color: var(--color-text);
  margin-right: 4px;
  // float: right;
  .svg-icon {
    height: 12px;
    width: 12px;
  }
}

.play-count {
  font-weight: 600;
  opacity: 0.58;
  color: var(--color-text);
  font-size: 12px;
  .svg-icon {
    margin-right: 3px;
    height: 8px;
    width: 8px;
  }
}
</style>
