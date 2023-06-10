<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { getByAppleMusic, getRecommendPlaylist } from "@/service/home";
import CoverRow from "@/components/CoverRow.vue";
import { useLocale } from "@/locales/useLocal";
import DailyTracksCard from "@/components/DailyTracksCard.vue";
import FMCard from "@/components/FMCard.vue";
defineOptions({
  name: "Home"
});
const { t } = useLocale();
const listData = reactive({
  byAppleMusic: [],
  recommendArtists: [],
  newReleasesAlbum: []
});
const loadData = () => {
  getByAppleMusic().then(res => {
    listData.byAppleMusic = res.list;
  });
  getRecommendPlaylist().then(res => {
    listData.recommendArtists = res.result;
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
      <CoverRow
        :type="'playlist'"
        :items="listData.byAppleMusic"
        sub-text="appleMusic"
        :image-size="1024"
      />
    </div>
    <!--recommend playlist-->
    <div class="index-row">
      <h1 class="title">
        {{ t("home.recommendPlaylist") }}
        <router-link to="/explore?category=推荐歌单">{{ t("home.seeMore") }}</router-link>
      </h1>
      <CoverRow :type="'playlist'" :items="listData.recommendArtists" sub-text="copywriter" />
    </div>
    <!--for you-->
    <div class="index-row">
      <h1 class="title">For you</h1>
      <div class="for-you-row">
        <DailyTracksCard />
        <FMCard />
      </div>
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
