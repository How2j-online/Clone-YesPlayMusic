<script setup lang="ts">
import { ref } from "vue";
import { useLocale } from "@/locales/useLocal";
import { useRoute } from "vue-router";
import { HotAlbum } from "@/service/artist/type";
import CoverRow from "@/components/CoverRow.vue";
import MvRow from "@/components/MvRow.vue";
import SvgIcon from "@/components/SvgIcon.vue";

const show = ref<boolean>(false);
const { t } = useLocale();
const route = useRoute();
const { keywords } = route.params;
const haveResult = ref<boolean>(false);

const albums = ref<HotAlbum[]>([]);
const artists = ref([]);
const tracks = ref([]);
const musicVideos = ref([]);
const playlists = ref([]);
</script>

<template>
  <div v-show="show" class="search-page">
    <div v-show="artists.length > 0 || albums.length > 0" class="row">
      <div v-show="artists.length > 0" class="artists">
        <div v-show="artists.length > 0" class="section-title">
          {{ t("search.artist") }}<router-link :to="`/search/${keywords}/artists`">{{ t("home.seeMore") }}</router-link>
        </div>
        <CoverRow type="artist" :column-number="3" :items="artists.slice(0, 3)" gap="34px 24px" />
      </div>

      <div class="albums">
        <div v-show="albums.length > 0" class="section-title">
          {{ t("search.album") }}<router-link :to="`/search/${keywords}/albums`">{{ t("home.seeMore") }}</router-link>
        </div>
        <CoverRow
          type="album"
          :items="albums.slice(0, 3)"
          sub-text="artist"
          :column-number="3"
          sub-text-font-size="14px"
          gap="34px 24px"
          :play-button-size="26"
        />
      </div>
    </div>

    <div v-show="tracks.length > 0" class="tracks">
      <div class="section-title">
        {{ t("search.song") }}<router-link :to="`/search/${keywords}/tracks`">{{ t("home.seeMore") }}</router-link>
      </div>
      <TrackList :tracks="tracks" type="tracklist" />
    </div>

    <div v-show="musicVideos.length > 0" class="music-videos">
      <div class="section-title">
        {{ t("search.mv") }}<router-link :to="`/search/${keywords}/music-videos`">{{ t("home.seeMore") }}</router-link>
      </div>
      <MvRow :mvs="musicVideos.slice(0, 5)" />
    </div>

    <div v-show="playlists.length > 0" class="playlists">
      <div class="section-title">
        {{ t("search.playlist") }}<router-link :to="`/search/${keywords}/playlists`">{{ t("home.seeMore") }}</router-link>
      </div>
      <CoverRow
        type="playlist"
        :items="playlists.slice(0, 12)"
        sub-text="title"
        :column-number="6"
        sub-text-font-size="14px"
        gap="34px 24px"
        :play-button-size="26"
      />
    </div>

    <div v-show="!haveResult" class="no-results">
      <div><svg-icon name="search" class="svg-icon" /> {{ keywords.length === 0 ? "输入关键字搜索" : t("search.noResult") }}</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.section-title {
  font-weight: 600;
  font-size: 22px;
  opacity: 0.88;
  color: var(--color-text);
  margin-bottom: 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
  }
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;

  .artists {
    flex: 1;
    margin-right: 8rem;
  }
  .albums {
    flex: 1;
  }
}

.tracks,
.music-videos,
.playlists {
  margin-top: 46px;
}

.no-results {
  position: absolute;
  top: 64px;
  right: 0;
  left: 0;
  bottom: 64px;
  font-size: 24px;
  color: var(--color-text);
  opacity: 0.38;
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    display: flex;
    align-items: center;
  }
  .svg-icon {
    height: 24px;
    width: 24px;
    margin-right: 16px;
  }
}
</style>
