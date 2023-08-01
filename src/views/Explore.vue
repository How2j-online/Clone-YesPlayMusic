<script setup lang="ts">
import { useLocale } from "@/locales/useLocal";
import ButtonTwoTone from "@/components/ButtonTwoTone.vue";
import CoverRow from "@/components/CoverRow.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { getTopPlaylist } from "@/service/playlist";

const playlistCategoriesTop = [
  "全部",
  "推荐歌单",
  "精品歌单",
  "官方",
  "排行榜",
  "欧美",
  "流行",
  "摇滚",
  "电子",
  "说唱",
  "ACG",
  "影视原声"
];
const playlistCategories = [
  {
    name: "全部",
    enable: true,
    bigCat: "static"
  },
  // {
  //   name: "For You",
  //   enable: true,
  //   bigCat: "static",
  // },
  {
    name: "推荐歌单",
    enable: true,
    bigCat: "static"
  },
  // {
  //   name: "最新专辑",
  //   enable: false,
  //   bigCat: "static",
  // },
  {
    name: "精品歌单",
    enable: true,
    bigCat: "static"
  },
  {
    name: "官方",
    enable: true,
    bigCat: "static"
  },
  {
    name: "排行榜",
    enable: true,
    bigCat: "static"
  },
  {
    name: "华语",
    enable: false,
    bigCat: "语种"
  },
  {
    name: "欧美",
    enable: true,
    bigCat: "语种"
  },
  {
    name: "日语",
    enable: false,
    bigCat: "语种"
  },
  {
    name: "韩语",
    enable: false,
    bigCat: "语种"
  },
  {
    name: "粤语",
    enable: false,
    bigCat: "语种"
  },
  {
    name: "流行",
    enable: true,
    bigCat: "风格"
  },
  {
    name: "摇滚",
    enable: true,
    bigCat: "风格"
  },
  {
    name: "民谣",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "电子",
    enable: true,
    bigCat: "风格"
  },
  {
    name: "舞曲",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "说唱",
    enable: true,
    bigCat: "风格"
  },
  {
    name: "轻音乐",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "爵士",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "乡村",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "R&B/Soul",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "古典",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "民族",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "英伦",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "金属",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "朋克",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "蓝调",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "雷鬼",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "世界音乐",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "拉丁",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "New Age",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "古风",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "后摇",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "Bossa Nova",
    enable: false,
    bigCat: "风格"
  },
  {
    name: "清晨",
    enable: false,
    bigCat: "场景"
  },
  {
    name: "夜晚",
    enable: false,
    bigCat: "场景"
  },
  {
    name: "学习",
    enable: false,
    bigCat: "场景"
  },
  {
    name: "工作",
    enable: false,
    bigCat: "场景"
  },
  {
    name: "午休",
    enable: false,
    bigCat: "场景"
  },
  {
    name: "下午茶",
    enable: false,
    bigCat: "场景"
  },
  {
    name: "地铁",
    enable: false,
    bigCat: "场景"
  },
  {
    name: "驾车",
    enable: false,
    bigCat: "场景"
  },
  {
    name: "运动",
    enable: false,
    bigCat: "场景"
  },
  {
    name: "旅行",
    enable: false,
    bigCat: "场景"
  },
  {
    name: "散步",
    enable: false,
    bigCat: "场景"
  },
  {
    name: "酒吧",
    enable: false,
    bigCat: "场景"
  },
  {
    name: "怀旧",
    enable: false,
    bigCat: "情感"
  },
  {
    name: "清新",
    enable: false,
    bigCat: "情感"
  },
  {
    name: "浪漫",
    enable: false,
    bigCat: "情感"
  },
  {
    name: "伤感",
    enable: false,
    bigCat: "情感"
  },
  {
    name: "治愈",
    enable: false,
    bigCat: "情感"
  },
  {
    name: "放松",
    enable: false,
    bigCat: "情感"
  },
  {
    name: "孤独",
    enable: false,
    bigCat: "情感"
  },
  {
    name: "感动",
    enable: false,
    bigCat: "情感"
  },
  {
    name: "兴奋",
    enable: false,
    bigCat: "情感"
  },
  {
    name: "快乐",
    enable: false,
    bigCat: "情感"
  },
  {
    name: "安静",
    enable: false,
    bigCat: "情感"
  },
  {
    name: "思念",
    enable: false,
    bigCat: "情感"
  },
  {
    name: "综艺",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "影视原声",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "ACG",
    enable: true,
    bigCat: "主题"
  },
  {
    name: "儿童",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "校园",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "游戏",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "70后",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "80后",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "90后",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "网络歌曲",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "KTV",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "经典",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "翻唱",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "吉他",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "钢琴",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "器乐",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "榜单",
    enable: false,
    bigCat: "主题"
  },
  {
    name: "00后",
    enable: false,
    bigCat: "主题"
  }
];
const allBigCats = ["语种", "风格", "场景", "情感", "主题"];

const { t } = useLocale();
const route = useRoute();
const activeCategory = ref("全部");
const showCatOptions = ref(false);
const showLoadMoreButton = ref(false);
const playlists = ref([]);
const hasMore = ref(true);
const loadingMore = ref(false);

const subText = computed(() => {
  if (activeCategory.value === "排行榜") return "updateFrequency";
  if (activeCategory.value === "推荐歌单") return "copywriter";
  return "none";
});
const goToCategory = (category: string) => {};
const getCatsByBigCat = (name: string) => {
  return playlistCategories.filter(c => c.bigCat === name);
};
const toggleCat = (name: string) => {};
const getPlaylist = () => {
  return getTopPlayList();
};
const getTopPlayList = () => {
  getTopPlaylist({
    cat: activeCategory.value,
    offset: playlists.value.length
  }).then(data => {
    updatePlaylist(data.playlists);
    hasMore.value = data.more;
  });
};
const updatePlaylist = (playlist: []) => {
  playlists.value.push(...playlist);
  loadingMore.value = false;
  showLoadMoreButton.value = true;
};
const loadData = () => {
  activeCategory.value = route.query.category === undefined ? "全部" : (route.query.category as string);
  getPlaylist();
};
loadData();
</script>

<template>
  <div class="explore-page">
    <h1>{{ t("explore.explore") }}</h1>
    <div class="buttons">
      <div
        v-for="category in playlistCategoriesTop"
        :key="category"
        class="button"
        :class="{ active: category === activeCategory && !showCatOptions }"
        @click="goToCategory(category)"
      >
        {{ category }}
      </div>
      <div class="button more" :class="{ active: showCatOptions }" @click="showCatOptions = !showCatOptions">
        <svg-icon class="svg-icon" name="more"></svg-icon>
      </div>
    </div>

    <div v-show="showCatOptions" class="panel">
      <div v-for="bigCat in allBigCats" :key="bigCat" class="big-cat">
        <div class="name">{{ bigCat }}</div>
        <div class="cats">
          <div
            v-for="cat in getCatsByBigCat(bigCat)"
            :key="cat.name"
            class="cat"
            :class="{
              active: playlistCategoriesTop.includes(cat.name)
            }"
            @click="toggleCat(cat.name)"
          >
            <span>{{ cat.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="playlists">
      <CoverRow
        type="playlist"
        :items="playlists"
        :sub-text="subText"
        :show-play-button="true"
        :show-play-count="activeCategory !== '排行榜'"
        :image-size="activeCategory !== '排行榜' ? 512 : 1024"
      />
    </div>
    <div v-show="['推荐歌单', '排行榜'].includes(activeCategory) === false" class="load-more">
      <ButtonTwoTone v-show="showLoadMoreButton && hasMore" color="grey" :loading="loadingMore" @click.native="getPlaylist">{{
        t("explore.loadMore")
      }}</ButtonTwoTone>
    </div>
  </div>
</template>

<style scoped lang="less">
h1 {
  color: var(--color-text);
  font-size: 56px;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
}
.button {
  user-select: none;
  cursor: pointer;
  padding: 8px 16px;
  margin: 10px 16px 6px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  border-radius: 10px;
  background-color: var(--color-secondary-bg);
  color: var(--color-secondary);
  transition: 0.2s;

  &:hover {
    background-color: var(--color-primary-bg);
    color: var(--color-primary);
  }
}
.button.active {
  background-color: var(--color-primary-bg);
  color: var(--color-primary);
}
.panel {
  margin-top: 10px;
  background: var(--color-secondary-bg);
  border-radius: 10px;
  padding: 8px;
  color: var(--color-text);

  .big-cat {
    display: flex;
    margin-bottom: 32px;
  }

  .name {
    font-size: 24px;
    font-weight: 700;
    opacity: 0.68;
    margin-left: 24px;
    min-width: 54px;
    height: 26px;
    margin-top: 8px;
  }
  .cats {
    margin-left: 24px;
    display: flex;
    flex-wrap: wrap;
  }
  .cat {
    user-select: none;
    margin: 4px 0 0 0;
    display: flex;
    // justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
    transition: 0.2s;
    min-width: 98px;

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      padding: 6px 12px;
      height: 26px;
      border-radius: 10px;
      opacity: 0.88;
      &:hover {
        opacity: 1;
        background-color: var(--color-primary-bg);
        color: var(--color-primary);
      }
    }
  }
  .cat.active {
    color: var(--color-primary);
  }
}

.playlists {
  margin-top: 24px;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.button.more {
  .svg-icon {
    height: 24px;
    width: 24px;
  }
}
</style>
