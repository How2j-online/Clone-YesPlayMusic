<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { getAlbumNewest, getArtists, getByAppleMusic, getRecommendPlaylist, getTopList } from "@/service/home";
import CoverRow from "@/components/CoverRow.vue";
import { useLocale } from "@/locales/useLocal";
import DailyTracksCard from "@/components/DailyTracksCard.vue";
import FMCard from "@/components/FMCard.vue";

defineOptions({
  name: "Home"
});

// 国际化
const { t } = useLocale();
// 数据
const listData = reactive({
  byAppleMusic: [],
  recommendArtists: [],
  recommendTracks: [],
  newReleasesAlbum: [],
  topList: []
});

const loadData = () => {
  // apple music
  getByAppleMusic().then(res => {
    listData.byAppleMusic = res.list;
  });
  // 推荐歌单
  getRecommendPlaylist().then(res => {
    listData.recommendTracks = res.result;
  });
  // 推荐歌手
  getArtists().then(res => {
    listData.recommendArtists = res.artists.slice(0, 6);
  });
  // 新专速递
  getAlbumNewest().then(res => {
    listData.newReleasesAlbum = res.albums;
  });
  // 排行榜
  getTopList().then(res => {
    listData.topList = res.list.slice(0, 5);
  });
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div id="home">
    <!--by Apple Music-->
    <div class="index-row first-row">
      <h1 class="title">by Apple Music</h1>
      <CoverRow :type="'playlist'" :items="listData.byAppleMusic" sub-text="appleMusic" :image-size="1024" />
    </div>
    <!--recommend playlist-->
    <div class="index-row">
      <h1 class="title">
        {{ t("home.recommendPlaylist") }}
        <router-link to="/explore?category=推荐歌单">{{ t("home.seeMore") }}</router-link>
      </h1>
      <CoverRow :type="'playlist'" :items="listData.recommendTracks" sub-text="copywriter" />
    </div>
    <!--for you-->
    <div class="index-row">
      <h1 class="title">For you</h1>
      <div class="for-you-row">
        <DailyTracksCard />
        <FMCard />
      </div>
    </div>
    <!--推荐艺人-->
    <div class="index-row">
      <h1 class="title">{{ t("home.recommendArtist") }}</h1>
      <CoverRow type="artist" :column-number="6" :items="listData.recommendArtists" />
    </div>
    <!--新专速递-->
    <div class="index-row">
      <h1 class="title">
        {{ t("home.newAlbum") }}
        <router-link to="/new-album">{{ t("home.seeMore") }}</router-link>
      </h1>
      <CoverRow type="album" :items="listData.newReleasesAlbum" sub-text="artist" />
    </div>
    <!--排行榜-->
    <div class="index-row">
      <h1 class="title">
        {{ t("home.charts") }}
        <router-link to="/explore?category=排行榜">{{ t("home.seeMore") }}</router-link>
      </h1>
      <CoverRow type="playlist" :items="listData.topList" sub-text="updateFrequency" :image-size="1024" />
    </div>
  </div>
</template>

<style scoped lang="less">
.index-row {
  margin-top: 54px;
}
.index-row.first-row {
  margin-top: 32px;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
  }
}

footer {
  display: flex;
  justify-content: center;
  margin-top: 48px;
}

.for-you-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 78px;
}
</style>
