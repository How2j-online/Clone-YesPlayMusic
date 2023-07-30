<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { formatAlbumType, formatDate, formatTime, resizeImage } from "@/utils/format";
import { AlbumDynamicType, AlbumPType, AlbumType, TacksT } from "@/service/playlist/type";
import ExplicitSymbol from "@/components/ExplicitSymbol.vue";
import Cover from "@/components/Cover.vue";
import ButtonTwoTone from "@/components/ButtonTwoTone.vue";
import { useLocale } from "@/locales/useLocal";
import TrackList from "@/components/TrackList/TrackList.vue";
import CoverRow from "@/components/CoverRow.vue";
import Modal from "@/components/Modal.vue";
import ContextMenu from "@/components/ContextMenu.vue";
import { groupBy, sortBy, toPairs } from "lodash-es";
import { useRoute } from "vue-router";
import { getAlumListDetail, getAlumListDynamic, getArtistAlbum } from "@/service/playlist";
import { splitSoundtrackAlbumTitle } from "@/utils";
import { getTrackDetail } from "@/service/player/track";

defineOptions({
  name: "Album"
});
const { t } = useLocale();
const route = useRoute();
const albumId = Number(route.params.id);
const show = ref<boolean>(false);
// 专辑信息
const album = ref<Partial<AlbumPType>>({
  id: 0,
  picUrl: "",
  size: 0,
  artist: {
    id: 0
  }
});
// 专辑歌曲信息
const tracks = ref<Partial<TacksT>>([]);
// 更多专辑
const moreAlbums = ref([]);
// 专辑动态信息
const dynamicDetail = ref<Partial<AlbumDynamicType>>({});
//
const subtitle = ref("");
const title = ref("");
const showFullDescription = ref<boolean>(false);

const albumTime = computed(() => {
  let time = 0;
  tracks.value.map(t => (time = time + t.dt));
  return time;
});
const tracksByDisc = computed(() => {
  if (tracks.value.length <= 1) return [];
  const pairs = toPairs(groupBy(tracks.value, "cd"));
  return sortBy(pairs, p => p[0]).map(items => ({
    disc: items[0],
    tracks: items[1]
  }));
});
const filteredMoreAlbums = computed(() => {
  let moreAlbumsF = moreAlbums.value.filter(a => a.id !== album.value.id);
  let realAlbums = moreAlbumsF.filter(a => a.type === "专辑");
  let eps = moreAlbumsF.filter(a => a.type === "EP" || (a.type === "EP/Single" && a.size > 1));
  let restItems = moreAlbumsF.filter(
    a => realAlbums.find(a1 => a1.id === a.id) === undefined && eps.find(a1 => a1.id === a.id) === undefined
  );
  if (realAlbums.length === 0) {
    return [...realAlbums, ...eps, ...restItems].slice(0, 5);
  } else {
    return [...realAlbums, ...restItems].slice(0, 4);
  }
});
// 打开菜单
const openMenu = () => {};
const toggleFullDescription = () => {};
const playAlbumByID = (id: number) => {};
const likeAlbum = (isLike: boolean = false) => {};
const copyUrl = (id: number) => {};
const openInBrowser = (id: number) => {};
const formatTitle = () => {
  let splitTitle = splitSoundtrackAlbumTitle(album.value.name);
  let splitTitle2 = splitSoundtrackAlbumTitle(splitTitle.title, true);
  title.value = splitTitle2.title;
  if (splitTitle.subtitle !== "" && splitTitle2.subtitle !== "") {
    subtitle.value = splitTitle.subtitle + " . " + splitTitle2.subtitle;
  } else {
    subtitle.value = splitTitle.subtitle === "" ? splitTitle2.subtitle : splitTitle.subtitle;
  }
};

const loadData = () => {
  getAlumListDetail(albumId).then(res => {
    album.value = res.album;
    tracks.value = res.songs;
    formatTitle();
    show.value = true;
    let tracksIDs = tracks.value.map(t => t.id);
    // 获取歌曲信息
    getTrackDetail(tracksIDs.join(",")).then(res => {
      tracks.value = res.songs;
    });
    // 获取更多专辑
    getArtistAlbum({ id: album.value.artist.id, limit: 5 }).then(res => {
      moreAlbums.value = res.hotAlbums;
    });
  });
  getAlumListDynamic(albumId).then(res => {
    dynamicDetail.value = res;
  });
};
loadData();
</script>

<template>
  <div v-show="show" class="album-page">
    <div class="playlist-info">
      <Cover
        :id="album.id"
        :image-url="resizeImage(album.picUrl, 1024)"
        :show-play-button="true"
        :always-show-shadow="true"
        :click-cover-to-play="true"
        :fixed-size="288"
        type="album"
        :cover-hover="false"
        :play-button-size="18"
        @click.right.native="openMenu"
      />
      <div class="info">
        <div class="title" @click.right="openMenu">{{ title }}</div>
        <div v-if="subtitle !== ''" class="subtitle" @click.right="openMenu">{{ subtitle }}</div>
        <div class="artist">
          <span v-if="album.artist.id !== 104700">
            <span>{{ formatAlbumType(album.type, album.size) }} by </span
            ><router-link :to="`/artist/${album.artist.id}`">{{ album.artist.name }}</router-link></span
          >
          <span v-else>Compilation by Various Artists</span>
        </div>
        <div class="date-and-count">
          <span v-if="album.mark === 1056768" class="explicit-symbol"><ExplicitSymbol /></span>
          <span :title="formatDate(album.publishTime)">{{ new Date(album.publishTime).getFullYear() }}</span>
          <span> · {{ album.size }} {{ t("common.songs") }}</span
          >,
          {{ formatTime(albumTime, "Human") }}
        </div>
        <div class="description" @click="toggleFullDescription">
          {{ album.description }}
        </div>
        <div class="buttons" style="margin-top: 32px">
          <ButtonTwoTone icon-class="play" @click.native="playAlbumByID(album.id)">
            {{ t("common.play") }}
          </ButtonTwoTone>
          <ButtonTwoTone
            :icon-class="dynamicDetail.isSub ? 'heart-solid' : 'heart'"
            :icon-button="true"
            :horizontal-padding="0"
            :color="dynamicDetail.isSub ? 'blue' : 'grey'"
            :text-color="dynamicDetail.isSub ? '#335eea' : ''"
            :background-color="dynamicDetail.isSub ? 'var(--color-secondary-bg)' : ''"
            @click.native="likeAlbum"
          >
          </ButtonTwoTone>
          <ButtonTwoTone icon-class="more" :icon-button="true" :horizontal-padding="0" color="grey" @click.native="openMenu">
          </ButtonTwoTone>
        </div>
      </div>
    </div>
    <div v-if="tracksByDisc.length > 1">
      <div v-for="item in tracksByDisc" :key="item.disc">
        <h2 class="disc">Disc {{ item.disc }}</h2>
        <TrackList :id="album.id" :tracks="item.tracks" :type="'album'" :album-object="album.artist" />
      </div>
    </div>
    <div v-else>
      <TrackList :id="album.id" :tracks="tracks" :type="'album'" :album-object="album.artist" />
    </div>
    <div class="extra-info">
      <div class="album-time"></div>
      <div class="release-date">
        {{ t("album.released") }}
        {{ formatDate(album.publishTime, "MMMM D, YYYY") }}
      </div>
      <div v-if="album.company" class="copyright">© {{ album.company }}</div>
    </div>
    <div v-if="filteredMoreAlbums.length !== 0" class="more-by">
      <div class="section-title">
        More by
        <router-link :to="`/artist/${album.artist.id}`">{{ album.artist.name }} </router-link>
      </div>
      <div>
        <CoverRow type="album" :items="filteredMoreAlbums" sub-text="albumType+releaseYear" />
      </div>
    </div>
    <Modal
      :show="showFullDescription"
      :close="toggleFullDescription"
      :show-footer="false"
      :click-outside-hide="true"
      :title="t('album.albumDesc')"
    >
      <p class="description-fulltext">
        {{ album.description }}
      </p>
    </Modal>
    <ContextMenu ref="albumMenu">
      <!-- <div class="item">{{ t('contextMenu.addToQueue') }}</div> -->
      <div class="item" @click="likeAlbum(true)">
        {{ dynamicDetail.isSub ? t("contextMenu.removeFromLibrary") : t("contextMenu.saveToLibrary") }}
      </div>
      <div class="item">{{ t("contextMenu.addToPlaylist") }}</div>
      <div class="item" @click="copyUrl(album.id)">{{ t("contextMenu.copyUrl") }}</div>
      <div class="item" @click="openInBrowser(album.id)">{{ t("contextMenu.openInBrowser") }}</div>
    </ContextMenu>
  </div>
</template>

<style scoped lang="less">
.album-page {
  margin-top: 32px;
}
.playlist-info {
  display: flex;
  width: 78vw;
  margin-bottom: 72px;
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    margin-left: 56px;
    color: var(--color-text);
    .title {
      font-size: 56px;
      font-weight: 700;
    }
    .subtitle {
      font-size: 22px;
      font-weight: 600;
    }
    .artist {
      font-size: 18px;
      opacity: 0.88;
      margin-top: 24px;
      a {
        font-weight: 600;
      }
    }
    .date-and-count {
      font-size: 14px;
      opacity: 0.68;
      margin-top: 2px;
    }
    .description {
      user-select: none;
      font-size: 14px;
      opacity: 0.68;
      margin-top: 24px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      cursor: pointer;
      white-space: pre-line;
      &:hover {
        transition: opacity 0.3s;
        opacity: 0.88;
      }
    }
    .buttons {
      margin-top: 32px;
      display: flex;
      button {
        margin-right: 16px;
      }
    }
  }
}
.disc {
  color: var(--color-text);
}

.explicit-symbol {
  opacity: 0.28;
  color: var(--color-text);
  margin-right: 4px;
  .svg-icon {
    margin-bottom: -3px;
  }
}

.extra-info {
  margin-top: 36px;
  margin-bottom: 36px;
  font-size: 12px;
  opacity: 0.48;
  color: var(--color-text);
  div {
    margin-bottom: 4px;
  }
  .album-time {
    opacity: 0.68;
  }
}

.more-by {
  border-top: 1px solid rgba(128, 128, 128, 0.18);

  padding-top: 22px;
  .section-title {
    font-size: 22px;
    font-weight: 600;
    opacity: 0.88;
    color: var(--color-text);
    margin-bottom: 20px;
  }
}
.description-fulltext {
  font-size: 16px;
  margin-top: 24px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-line;
}
</style>
