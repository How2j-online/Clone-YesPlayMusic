<script setup lang="ts">
import { computed, ref } from "vue";
import { ArtistPType, ArtistType, HotAlbum, HotSong, Mv } from "@/service/artist/type";
import { formatAlbumType, formatDate, resizeImage } from "@/utils/format";
import { useLocale } from "@/locales/useLocal";
import ButtonTwoTone from "@/components/ButtonTwoTone.vue";
import Cover from "@/components/Cover.vue";
import MvRow from "@/components/MvRow.vue";
import TrackList from "@/components/TrackList/TrackList.vue";
import CoverRow from "@/components/CoverRow.vue";
import Modal from "@/components/Modal.vue";
import ContextMenu from "@/components/ContextMenu.vue";
import { getArtistAlbum, getArtistMv, getArtistSinger } from "@/service/artist";
import { useRoute } from "vue-router";

defineOptions({
  name: "Artist"
});

const show = ref<boolean>(false);
const hasMoreMV = ref<boolean>(false);
const { t } = useLocale();
const route = useRoute();
const { id: artistId } = route.params;
const artist = ref<Partial<ArtistPType>>({});
const popularTracks = ref<HotSong[]>([]);
const latestRelease = ref<Partial<HotAlbum>>({
  picUrl: "",
  publishTime: 0,
  id: 0,
  name: "",
  type: ""
});
const showMorePopTracks = ref<boolean>(false);
const albumsData = ref<HotAlbum[]>([]);
const mvs = ref<Mv[]>([]);
const mvHover = ref<boolean>(false);
const similarArtists = ref([]); // 相似歌手
const showFullDescription = ref<boolean>(false);

const latestMV = computed(() => {
  const mv = mvs.value[0];
  return {
    id: mv?.id || mv?.vid,
    name: mv?.name || mv?.title,
    coverUrl: `${mv?.imgurl16v9 || mv?.cover || mv?.coverUrl}?param=464y260`,
    publishTime: mv?.publishTime
  };
});
const eps = computed(() => {
  return albumsData.value.filter(a => ["EP/Single", "EP", "Single"].includes(a.type));
});
const albums = computed(() => {
  return albumsData.value.filter(a => a.type === "专辑" || a.type === "精选集");
});
const scrollTo = (div: string, block: ScrollLogicalPosition = "center") => {
  document.getElementById(div).scrollIntoView({
    behavior: "smooth",
    block
  });
};
const toggleFullDescription = () => {};
const playPopularSongs = () => {};
const followArtist = () => {};
const copyUrl = (id: number) => {};
const openInBrowser = (id: number) => {};
const openMenu = (e: MouseEvent, trackItem: HotSong, index: number) => {};
const goToMv = async (id: number) => {};
const loadData = () => {
  getArtistSinger(+artistId).then(data => {
    artist.value = data.artist;
    popularTracks.value = data.hotSongs;
    show.value = true;
  });
  getArtistAlbum({ id: +artistId, limit: 5 }).then(data => {
    albumsData.value = data.hotAlbums;
    latestRelease.value = data.hotAlbums[0];
  });
  getArtistMv({ id: +artistId }).then(data => {
    mvs.value = data.mvs;
    hasMoreMV.value = data.hasMore;
  });
};
loadData();
</script>

<template>
  <div v-show="show" class="artist-page">
    <div class="artist-info">
      <div class="head">
        <img alt="img" :src="resizeImage(artist.img1v1Url, 1024)" loading="lazy" />
      </div>
      <div>
        <div class="name">{{ artist.name }}</div>
        <div class="artist">{{ t("artist.artist") }}</div>
        <div class="statistics">
          <a @click="scrollTo('popularTracks')">{{ artist.musicSize }} {{ t("common.songs") }}</a>
          ·
          <a @click="scrollTo('seeMore', 'start')">{{ artist.albumSize }} {{ t("artist.withAlbums") }}</a>
          ·
          <a @click="scrollTo('mvs')">{{ artist.mvSize }} {{ t("artist.videos") }}</a>
        </div>
        <div class="description" @click="toggleFullDescription">
          {{ artist.briefDesc }}
        </div>
        <div class="buttons">
          <ButtonTwoTone icon-class="play" @click.native="playPopularSongs">
            {{ t("common.play") }}
          </ButtonTwoTone>
          <ButtonTwoTone color="grey" @click.native="followArtist">
            <span v-if="artist.followed">{{ t("artist.following") }}</span>
            <span v-else>{{ t("artist.follow") }}</span>
          </ButtonTwoTone>
          <ButtonTwoTone icon-class="more" :icon-button="true" :horizontal-padding="0" color="grey" @click.native="openMenu">
          </ButtonTwoTone>
        </div>
      </div>
    </div>
    <div v-if="latestRelease !== undefined" class="latest-release">
      <div class="section-title">{{ t("artist.latestRelease") }}</div>
      <div class="release">
        <div class="container">
          <Cover
            :id="latestRelease.id"
            :image-url="resizeImage(latestRelease.picUrl)"
            type="album"
            :fixed-size="128"
            :play-button-size="30"
          />
          <div class="info">
            <div class="name">
              <router-link :to="`/album/${latestRelease.id}`">{{ latestRelease.name }}</router-link>
            </div>
            <div class="date">
              {{ formatDate(latestRelease.publishTime) }}
            </div>
            <div class="type">
              {{ formatAlbumType(latestRelease.type, latestRelease.size) }} · {{ latestRelease.size }} {{ t("common.songs") }}
            </div>
          </div>
        </div>
        <div v-show="latestMV.id" class="container latest-mv">
          <div class="cover" @mouseover="mvHover = true" @mouseleave="mvHover = false" @click="goToMv(latestMV.id)">
            <img :src="latestMV.coverUrl" alt="mv" loading="lazy" />
            <transition name="fade">
              <div
                v-show="mvHover"
                class="shadow"
                :style="{
                  background: 'url(' + latestMV.coverUrl + ')'
                }"
              ></div>
            </transition>
          </div>
          <div class="info">
            <div class="name">
              <router-link :to="'/mv/' + latestMV.id">{{ latestMV.name }}</router-link>
            </div>
            <div class="date">
              {{ formatDate(+latestMV.publishTime) }}
            </div>
            <div class="type">{{ t("artist.latestMV") }}</div>
          </div>
        </div>
        <div v-show="!latestMV.id"></div>
      </div>
    </div>
    <div id="popularTracks" class="popular-tracks">
      <div class="section-title">{{ t("artist.popularSongs") }}</div>
      <TrackList :id="artist.id" :tracks="popularTracks.slice(0, showMorePopTracks ? 24 : 12)" :type="'trackList'" />

      <div id="seeMore" class="show-more">
        <button @click="showMorePopTracks = !showMorePopTracks">
          <span v-show="!showMorePopTracks">{{ t("artist.showMore") }}</span>
          <span v-show="showMorePopTracks">{{ t("artist.showLess") }}</span>
        </button>
      </div>
    </div>
    <div v-if="albums.length !== 0" id="albums" class="albums">
      <div class="section-title">{{ t("artist.albums") }}</div>
      <CoverRow :type="'album'" :items="albums" :sub-text="'releaseYear'" :show-play-button="true" />
    </div>
    <div v-if="mvs.length !== 0" id="mvs" class="mvs">
      <div class="section-title">
        MVs
        <router-link v-show="hasMoreMV" :to="`/artist/${artist.id}/mv`">{{ t("home.seeMore") }}</router-link>
      </div>
      <MvRow :mvs="mvs" subtitle="publishTime" />
    </div>
    <div v-if="eps.length !== 0" class="eps">
      <div class="section-title">{{ t("artist.EPsSingles") }}</div>
      <CoverRow :type="'album'" :items="eps" :sub-text="'albumType+releaseYear'" :show-play-button="true" />
    </div>

    <!--<div v-if="similarArtists.length !== 0" class="similar-artists">-->
    <!--  <div class="section-title">{{ t("artist.similarArtists") }}</div>-->
    <!--  <CoverRow type="artist" :column-number="6" gap="36px 28px" :items="similarArtists.slice(0, 12)" />-->
    <!--</div>-->

    <Modal
      :show="showFullDescription"
      :close="toggleFullDescription"
      :show-footer="false"
      :click-outside-hide="true"
      :title="t('artist.artistDesc')"
    >
      <p class="description-fulltext">
        {{ artist.briefDesc }}
      </p>
    </Modal>

    <ContextMenu ref="artistMenu">
      <div class="item" @click="copyUrl(artist.id)">{{ t("contextMenu.copyUrl") }}</div>
      <div class="item" @click="openInBrowser(artist.id)">{{ t("contextMenu.openInBrowser") }}</div>
    </ContextMenu>
  </div>
</template>

<style scoped lang="less">
.artist-page {
  margin-top: 32px;
}

.artist-info {
  display: flex;
  align-items: center;
  margin-bottom: 26px;
  color: var(--color-text);
  img {
    height: 248px;
    width: 248px;
    border-radius: 50%;
    margin-right: 56px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 16px -8px;
  }
  .name {
    font-size: 56px;
    font-weight: 700;
  }

  .artist {
    font-size: 18px;
    opacity: 0.88;
    margin-top: 24px;
  }

  .statistics {
    font-size: 14px;
    opacity: 0.68;
    margin-top: 2px;
  }

  .buttons {
    margin-top: 26px;
    display: flex;
    .shuffle {
      padding: 8px 11px;
      .svg-icon {
        margin: 0;
      }
    }
  }

  .description {
    user-select: none;
    font-size: 14px;
    opacity: 0.68;
    margin-top: 24px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    cursor: pointer;
    white-space: pre-line;
    &:hover {
      transition: opacity 0.3s;
      opacity: 0.88;
    }
  }
}

.section-title {
  font-weight: 600;
  font-size: 22px;
  opacity: 0.88;
  color: var(--color-text);
  margin-bottom: 16px;
  padding-top: 46px;

  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
  }
}

.latest-release {
  color: var(--color-text);
  .release {
    display: flex;
  }
  .container {
    display: flex;
    flex: 1;
    align-items: center;
    border-radius: 12px;
  }
  img {
    height: 96px;
    border-radius: 8px;
  }
  .info {
    margin-left: 24px;
  }
  .name {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .date {
    font-size: 14px;
    opacity: 0.78;
  }
  .type {
    margin-top: 2px;
    font-size: 12px;
    opacity: 0.68;
  }
}

.popular-tracks {
  .show-more {
    display: flex;

    button {
      padding: 4px 8px;
      margin-top: 8px;
      border-radius: 6px;
      font-size: 12px;
      opacity: 0.78;
      color: var(--color-secondary);
      font-weight: 600;
      &:hover {
        opacity: 1;
      }
    }
  }
}

.similar-artists {
  .section-title {
    margin-bottom: 24px;
  }
}

.latest-mv {
  .cover {
    position: relative;
    transition: transform 0.3s;
    &:hover {
      cursor: pointer;
    }
  }
  img {
    border-radius: 0.75em;
    height: 128px;
    object-fit: cover;
    user-select: none;
  }

  .shadow {
    position: absolute;
    top: 6px;
    height: 100%;
    width: 100%;
    filter: blur(16px) opacity(0.4);
    transform: scale(0.9, 0.9);
    z-index: -1;
    background-size: cover;
    border-radius: 0.75em;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
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
