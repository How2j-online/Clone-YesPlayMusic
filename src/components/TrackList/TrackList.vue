<template>
  <div class="track-list">
    <ContextMenu ref="menuRef">
      <!--歌曲信息-->
      <div v-show="type !== 'cloudDisk'" class="item-info">
        <!--suppress HtmlUnknownAttribute, VueUnrecognizedDirective -->
        <img src="" alt="image" :lazy="resizeImage(rightClickedTrackComputed.al.picUrl, 224)" v-img-lazy />
        <div class="info">
          <div class="title">{{ rightClickedTrackComputed.name }}</div>
          <div class="subtitle">{{ rightClickedTrackComputed.ar[0].name }}</div>
        </div>
      </div>
      <hr v-show="type !== 'cloudDisk'" />
      <div class="item" @click="play">{{ t("contextMenu.play") }}</div>
      <div class="item" @click="addToQueue">{{ t("contextMenu.addToQueue") }}</div>
      <div v-if="extraContextMenuItem.includes('removeTrackFromQueue')" class="item" @click="removeTrackFromQueue">
        从队列删除
      </div>
      <hr v-show="type !== 'cloudDisk'" />
      <div v-show="!isRightClickedTrackLiked && type !== 'cloudDisk'" class="item" @click="like">
        {{ t("contextMenu.saveToMyLikedSongs") }}
      </div>
      <div v-show="isRightClickedTrackLiked && type !== 'cloudDisk'" class="item" @click="like">
        {{ t("contextMenu.removeFromMyLikedSongs") }}
      </div>
      <div v-if="extraContextMenuItem.includes('removeTrackFromPlaylist')" class="item" @click="removeTrackFromPlaylist">
        从歌单中删除
      </div>
      <div v-show="type !== 'cloudDisk'" class="item" @click="addTrackToPlaylist">{{ t("contextMenu.addToPlaylist") }}</div>
      <div v-show="type !== 'cloudDisk'" class="item" @click="copyLink">{{ t("contextMenu.copyUrl") }}</div>
      <div v-if="extraContextMenuItem.includes('removeTrackFromCloudDisk')" class="item" @click="removeTrackFromCloudDisk">
        从云盘中删除
      </div>
    </ContextMenu>

    <!--歌单列表-->
    <div :style="listStyles">
      <TrackListItem
        v-for="(trackItem, index) in tracks"
        :type="type"
        :key="itemKey === 'id' ? trackItem.id : `${trackItem.id}${index}`"
        :tack-prop="trackItem"
        :track-no="index + 1"
        :highlight-playing-track="highlightPlayingTrack"
        @dblclick.native="playThisList(trackItem.id || trackItem.songId)"
        @click.right.native="openMenu($event, trackItem, index)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TrackListItem from "@/components/TrackList/TrackListItem.vue";
import ContextMenu from "@/components/ContextMenu.vue";
import { useLocale } from "@/locales/useLocal";
import { resizeImage } from "@/utils/format";
import { computed, CSSProperties, onBeforeMount, provide, ref } from "vue";
import { TracksItemType } from "@/service/playlist/type";
import { RCTProvideKey } from "@/global/key";
import { usePlayerStore } from "@/store/player";
import PlayerTool from "@/utils/player-tool";

defineOptions({
  name: "TrackList"
});

const props = withDefaults(
  defineProps<{
    tracks: TracksItemType[];
    type: string;
    id: number;
    dbClickTrackFunc?: string;
    albumObject?: () => {};
    extraContextMenuItem?: Array<string>;
    columnNumber?: number;
    highlightPlayingTrack?: boolean;
    itemKey?: string;
  }>(),
  {
    tracks: () => [],
    type: "trackList",
    id: 0,
    dbClickTrackFunc: "default",
    albumObject: () => {
      return {
        artist: {
          name: ""
        }
      };
    },
    extraContextMenuItem: () => {
      return [];
    },
    columnNumber: 4,
    highlightPlayingTrack: true,
    itemKey: "id"
  }
);

const { t } = useLocale();
const playerTool = new PlayerTool();
const menuRef = ref<InstanceType<typeof ContextMenu> | null>(null);
const playerStore = usePlayerStore();
const listStyles = ref<CSSProperties>({}); // 列表样式
// 右键的表单信息
const rightClickedTrack = ref<Partial<TrackListItem>>({
  id: 0,
  name: "",
  ar: [{ name: "" }],
  al: {
    picUrl: ""
  }
});
const rightClickedTrackIndex = ref<number>(0);
const rightClickedTrackComputed = computed<Partial<TracksItemType>>(() => {
  if (props.type === "cloudDisk") return { id: 0, name: "", ar: [{ name: "" }], al: { picUrl: "" } };
  return rightClickedTrack.value;
});
// 右键打开菜单
const openMenu = (e: PointerEvent, track: TrackListItem, index: number = -1) => {
  rightClickedTrack.value = track;
  rightClickedTrackIndex.value = index;
  menuRef.value?.openMenu(e);
};
// 双击播放音乐
const playThisList = (id: number) => {
  if (props.dbClickTrackFunc === "default") {
    playThisListDefault(id);
  }
};
const playThisListDefault = (trackID: number) => {
  playerTool.playTracksList(props.id, props.type, trackID);
};

const isRightClickedTrackLiked = computed(() => {
  // rightClickedTrack.value.id;
  return false;
});
// 播放音乐
const play = () => {
  playerTool.playTracksList(props.id, props.type, rightClickedTrackComputed.value.id);
};
// 添加歌曲到播放列表
const addToQueue = () => {
  playerTool.addTrackToTracksList(props.id, props.type, rightClickedTrackComputed.value.id);
};
// 从播放列表中删除
const removeTrackFromQueue = () => {};
// 添加到我喜欢的音乐
const like = () => {};
// 从我喜欢的音乐中删除
const removeTrackFromPlaylist = () => {};
// 添加到歌单
const addTrackToPlaylist = () => {};
// 复制链接
const copyLink = () => {};
// 从云盘中删除
const removeTrackFromCloudDisk = () => {};

// 设置列表样式
onBeforeMount(() => {
  if (props.type == "trackList") {
    listStyles.value = {
      display: "grid",
      gap: "4px",
      gridTemplateColumns: `repeat(${props.columnNumber}, 1fr)`
    };
  }
});

// 依赖
provide(RCTProvideKey, rightClickedTrackComputed);
</script>

<style lang="less" scoped>
.track-list {
  .item-info {
    padding: 10px 10px;
    display: flex;
    align-items: center;
    color: var(--color-text);
    cursor: default;
    img {
      height: 38px;
      width: 38px;
      border-radius: 4px;
    }
    .info {
      margin-left: 10px;
    }
    .title {
      font-size: 16px;
      font-weight: 600;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }
    .subtitle {
      font-size: 12px;
      opacity: 0.68;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }
  }
}

hr {
  margin: 4px 10px;
  background: rgba(128, 128, 128, 0.18);
  height: 1px;
  box-shadow: none;
  border: none;
}
.menu .item {
  font-weight: 600;
  font-size: 14px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: default;
  color: var(--color-text);
  display: flex;
  align-items: center;
  &:hover {
    color: var(--color-primary);
    background: var(--color-primary-bg-for-transparent);
    transition: opacity 125ms ease-out, transform 125ms ease-out;
  }
  &:active {
    opacity: 0.75;
    transform: scale(0.95);
  }

  .svg-icon {
    height: 16px;
    width: 16px;
    margin-right: 5px;
  }
}
</style>
