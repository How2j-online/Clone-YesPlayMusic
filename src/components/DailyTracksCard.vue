<template>
  <div class="daily-recommend-card" @click="goToDailyTracks">
    <!--suppress VueUnrecognizedDirective, HtmlUnknownAttribute -->
    <img src="" v-img-lazy :lazy="coverUrl" alt="image" />
    <div class="container">
      <div class="title-box">
        <div class="title">
          <span>每</span>
          <span>日</span>
          <span>推</span>
          <span>荐</span>
        </div>
      </div>
    </div>
    <button class="play-button" @click.stop="playDailyTracks">
      <svg-icon name="play" class="svg-icon" :data-theme="theme" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import sample from "lodash-es/sample";
import { computed, onMounted, ref } from "vue";
import { getDailyRecommendTracks } from "@/service/home";
import SvgIcon from "@/components/SvgIcon.vue";
import { usePlayerStore } from "@/store/player";
import { useSettingStore } from "@/store/setting";

const settingStore = useSettingStore();
const theme = computed(() => {
  return !settingStore.theme ? "dark" : "light";
});

const defaultCovers = [
  "https://p1.music.126.net/WP8O0ixZNwpm0fG6zymivQ==/109951167957001651.jpg",
  "https://p2.music.126.net/0-Ybpa8FrDfRgKYCTJD8Xg==/109951164796696795.jpg",
  "https://p2.music.126.net/QxJA2mr4hhb9DZyucIOIQw==/109951165422200291.jpg",
  "https://p1.music.126.net/AhYP9TET8l-VSGOpWAKZXw==/109951165134386387.jpg"
];
const useAnimation = ref<boolean>(false);
const recommendTracks = ref([]);
// 加载每日推荐歌曲数据
const loadDailyTracks = () => {
  getDailyRecommendTracks().then(res => {
    recommendTracks.value = res.data.dailySongs;
  });
};

// 跳转到每日推荐页面
const goToDailyTracks = () => {
  console.log("goToDailyTracks");
};

// 播放每日推荐歌曲
const playDailyTracks = () => {
  console.log("playDailyTracks");
};

// 获取封面图片
const coverUrl = computed(() => {
  return `${recommendTracks.value[0]?.al.picUrl || sample(defaultCovers)}?param=1024y1024`;
});

onMounted(() => {
  // 如果每日推荐歌曲数据为空，则加载数据
  if (recommendTracks.value.length === 0) loadDailyTracks();
});
</script>

<style lang="less" scoped>
.daily-recommend-card {
  border-radius: 1rem;
  height: 198px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  animation: move 38s infinite;
  animation-direction: alternate;
  z-index: -1;
}

.container {
  background: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.28));
  height: 198px;
  width: 50%;
  display: flex;
  align-items: center;
  border-radius: 0.94rem;
}

.title-box {
  height: 148px;
  width: 148px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 25px;
  user-select: none;
  .title {
    height: 100%;
    width: 100%;
    font-weight: 600;
    font-size: 64px;
    line-height: 48px;
    opacity: 0.96;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    place-items: center;
  }
}

.play-button {
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: white;
  position: absolute;
  right: 1.6rem;
  bottom: 1.4rem;
  background: rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  margin-bottom: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  width: 44px;
  transition: 0.2s;
  cursor: default;

  .svg-icon {
    margin-left: 4px;
    height: 16px;
    width: 16px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.44);
  }
  &:active {
    transform: scale(0.94);
  }
}

@keyframes move {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}
</style>
