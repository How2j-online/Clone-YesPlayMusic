<script setup lang="ts">
import Cover from "@/components/Cover.vue";
import { computed, onBeforeMount, ref } from "vue";
import { resizeImage } from "@/utils/format";
import { useLocale } from "@/locales/useLocal";
import { formatDate } from "@/utils/format";
import ButtonTwoTone from "@/components/ButtonTwoTone.vue";
import TrackList from "@/components/TrackList/TrackList.vue";
import ContextMenu from "@/components/ContextMenu.vue";
import Modal from "@/components/Modal.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import { getPlaylistDetail } from "@/service/playlist";
import { useRoute } from "vue-router";
import { PlayListType, TacksT } from "@/service/playlist/type";
import PlayerTool from "@/utils/player-tool";
const route = useRoute();
const { t } = useLocale();

defineOptions({
  name: "PlayList"
});
const playerTool = new PlayerTool();
const id = route.params.id as string;
const show = ref(true);
const showFullDescription = ref(false);
const isUserOwnPlaylist = false;
const loadingMore = ref(false);
const lastLoadedTrackIndex = ref(9);
const displaySearchInPlaylist = ref(false);
const isLikeSongsPage = ref(false);
const searchInputWidth = ref("0px");
const inputFocus = ref(false);
const inputSearchKeyWords = ref("");
const data = {
  user: {
    userId: 1,
    avatarUrl: "https://p1.music.126.net/2Z3Z3Q3Z3Q3Q3Q3Q3Q3Q3Q==/109951164209471697.jpg",
    nickname: "网易云音乐"
  }
};
const hasMore = ref(false);
const debounceTimeout = ref(null);
const specialPlaylist = {
  2829816518: {
    name: "欧美私人订制",
    gradient: "gradient-pink-purple-blue"
  },
  2890490211: {
    name: "助眠鸟鸣声",
    gradient: "gradient-green"
  },
  5089855855: {
    name: "夜的胡思乱想",
    gradient: "gradient-moonstone-blue"
  },
  2888212971: {
    name: "全球百大DJ",
    gradient: "gradient-orange-red"
  },
  2829733864: {
    name: "睡眠伴侣",
    gradient: "gradient-midnight-blue"
  },
  2829844572: {
    name: "洗澡时听的歌",
    gradient: "gradient-yellow"
  },
  2920647537: {
    name: "还是会想你",
    gradient: "gradient-dark-blue-midnight-blue"
  },
  2890501416: {
    name: "助眠白噪声",
    gradient: "gradient-sky-blue"
  },
  5217150082: {
    name: "摇滚唱片行",
    gradient: "gradient-yellow-red"
  },
  2829961453: {
    name: "古风音乐大赏",
    gradient: "gradient-fog"
  },
  4923261701: {
    name: "Trance",
    gradient: "gradient-light-red-light-blue "
  },
  5212729721: {
    name: "欧美点唱机",
    gradient: "gradient-indigo-pink-yellow"
  },
  3103434282: {
    name: "甜蜜少女心",
    gradient: "gradient-pink"
  },
  2829896389: {
    name: "日系私人订制",
    gradient: "gradient-yellow-pink"
  },
  2829779628: {
    name: "运动随身听",
    gradient: "gradient-orange-red"
  },
  2860654884: {
    name: "独立女声精选",
    gradient: "gradient-sharp-blue"
  },
  898150: {
    name: "浪漫婚礼专用",
    gradient: "gradient-pink"
  },
  2638104052: {
    name: "牛奶泡泡浴",
    gradient: "gradient-fog"
  },
  5317236517: {
    name: "后朋克精选",
    gradient: "gradient-pink-purple-blue"
  },
  2821115454: {
    name: "一周原创发现",
    gradient: "gradient-blue-purple"
  },
  2829883282: {
    name: "华语私人雷达",
    gradient: "gradient-yellow-red"
  },
  3136952023: {
    name: "私人雷达",
    gradient: "gradient-radar"
  }
};
const specialPlaylistInfo = ref<undefined | object>(undefined);
// 歌单详情数据
const playlist = ref<Partial<PlayListType>>({
  id: 0,
  coverImgUrl: "",
  creator: {
    userId: 0,
    nickname: ""
  },
  trackIds: [],
  privacy: 0,
  name: "",
  updateTime: 0,
  trackCount: 0,
  description: "",
  subscribedCount: 0,
  shareCount: 0,
  commentCount: 0,
  subscribed: false,
  englishTitle: "",
  updateFrequency: ""
});
// 歌单列表数据
const tracks = ref<Partial<TacksT>>([]);
const searchKeyWords = ref(""); // 搜索使用的关键字
// 过滤后的歌单列表数据
const filteredTracks = computed(() => {
  if (!searchKeyWords.value) {
    return tracks.value;
  }
  return tracks.value.filter(
    track =>
      (track.name && track.name.toLowerCase().includes(searchKeyWords.value.toLowerCase())) ||
      (track.al.name && track.al.name.toLowerCase().includes(searchKeyWords.value.toLowerCase())) ||
      track.ar.find(artist => artist.name && artist.name.toLowerCase().includes(searchKeyWords.value.toLowerCase()))
  );
});
// 获取歌单详情数据
onBeforeMount(() => {
  getPlaylistDetail(id).then(res => {
    playlist.value = res.playlist;
    tracks.value = res.playlist.tracks;
  });
});

const openMenu = () => {
  console.log("openMenu");
};
const openPlaylist = () => {
  console.log("openPlaylist");
};
const openUser = () => {
  console.log("openUser");
};
const openArtist = () => {
  console.log("openArtist");
};
const openAlbum = () => {
  console.log("openAlbum");
};
const openSong = () => {
  console.log("openSong");
};
const openVideo = () => {
  console.log("openVideo");
};
const toggleFullDescription = () => {};
const playPlaylistByID = () => {
  playerTool.playTracksList(+id, "playlist");
};
const likePlaylist = (toast: boolean = true) => {};
const searchInPlaylist = () => {};
const editPlaylist = () => {};
const deletePlaylist = () => {};
const loadMore = (loadNum: number = 10) => {};
const inputDebounce = () => {};
</script>

<template>
  <div v-show="show" class="playlist">
    <div v-if="specialPlaylistInfo === undefined && !isLikeSongsPage" class="playlist-info">
      <Cover
        :id="playlist.id"
        :image-url="resizeImage(playlist.coverImgUrl, 1024)"
        :show-play-button="true"
        :always-show-shadow="true"
        :click-cover-to-play="true"
        :fixed-size="288"
        type="playlist"
        :cover-hover="false"
        :play-button-size="18"
        @contextmenu.prevent
        @click.right.native="openMenu"
      />
      <!--歌单信息 及按钮-->
      <div class="info">
        <div class="title" @click.right="openMenu">
          <span v-if="playlist.privacy === 10" class="lock-icon"> <svg-icon name="lock" /></span>{{ playlist.name }}
        </div>
        <div class="artist">
          Playlist by
          <span v-if="[5277771961, 5277965913, 5277969451, 5277778542, 5278068783].includes(playlist.id)" style="font-weight: 600"
            >Apple Music</span
          >
          <a v-else :href="`https://music.163.com/#/user/home?id=${playlist.creator.userId}`" target="blank">{{
            playlist?.creator?.nickname
          }}</a>
        </div>
        <div class="date-and-count">
          {{ t("playlist.updatedAt") }}
          {{ formatDate(playlist?.updateTime) }} · {{ playlist?.trackCount }}
          {{ t("common.songs") }}
        </div>
        <div class="description" @click="toggleFullDescription">
          {{ playlist.description }}
        </div>
        <div class="buttons">
          <ButtonTwoTone icon-class="play" @click.native="playPlaylistByID">
            {{ t("common.play") }}
          </ButtonTwoTone>
          <ButtonTwoTone
            v-if="playlist.creator.userId !== data.user.userId"
            :icon-class="playlist.subscribed ? 'heart-solid' : 'heart'"
            :icon-button="true"
            :horizontal-padding="0"
            :color="playlist.subscribed ? 'blue' : 'grey'"
            :text-color="playlist.subscribed ? '#335eea' : ''"
            :background-color="playlist.subscribed ? 'var(--color-secondary-bg)' : ''"
            @click.native="likePlaylist"
          >
          </ButtonTwoTone>
          <ButtonTwoTone icon-class="more" :icon-button="true" :horizontal-padding="0" color="grey" @click.native="openMenu">
          </ButtonTwoTone>
        </div>
      </div>
      <!--搜索框-->
      <div v-if="displaySearchInPlaylist" class="search-box">
        <div class="container" :class="{ active: inputFocus }">
          <svg-icon name="search" class="svg-icon" />
          <div class="input">
            <input
              v-model.trim="inputSearchKeyWords"
              :placeholder="inputFocus ? '' : t('playlist.search')"
              @input="inputDebounce"
              @focus="inputFocus = true"
              @blur="inputFocus = false"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="specialPlaylistInfo !== undefined" class="special-playlist">
      <div class="title" :class="specialPlaylistInfo.gradient" @click.right="openMenu">
        <!-- <img :src="playlist.coverImgUrl | resizeImage" /> -->
        {{ specialPlaylistInfo.name + "how2j.online" }}
      </div>
      <div class="subtitle">{{ playlist?.englishTitle }} · {{ playlist?.updateFrequency }}</div>

      <div class="buttons">
        <ButtonTwoTone class="play-button" icon-class="play" color="grey" @click.native="playPlaylistByID">
          {{ t("common.play") }}
        </ButtonTwoTone>
        <ButtonTwoTone
          v-if="playlist.creator.userId !== data.user.userId"
          :icon-class="playlist.subscribed ? 'heart-solid' : 'heart'"
          :icon-button="true"
          :horizontal-padding="0"
          :color="playlist.subscribed ? 'blue' : 'grey'"
          :text-color="playlist.subscribed ? '#335eea' : ''"
          :background-color="playlist.subscribed ? 'var(--color-secondary-bg)' : ''"
          @click.native="likePlaylist"
        >
        </ButtonTwoTone>
        <ButtonTwoTone icon-class="more" :icon-button="true" :horizontal-padding="0" color="grey" @click.native="openMenu">
        </ButtonTwoTone>
      </div>
    </div>

    <div v-if="isLikeSongsPage" class="user-info">
      <h1>
        <!--suppress HtmlUnknownAttribute, VueUnrecognizedDirective -->
        <img src="" alt="image" class="avatar" :lazy="resizeImage(data.user.avatarUrl)" v-img-lazy />
        {{ data.user.nickname }}{{ t("library.sLikedSongs") }}
      </h1>
      <div class="search-box-likepage" @click="searchInPlaylist()">
        <div class="container" :class="{ active: inputFocus }">
          <svg-icon name="search" class="svg-icon" />
          <div class="input" :style="{ width: searchInputWidth }">
            <input
              v-if="displaySearchInPlaylist"
              v-model.trim="inputSearchKeyWords"
              :placeholder="inputFocus ? '' : t('playlist.search')"
              @input="inputDebounce()"
              @focus="inputFocus = true"
              @blur="inputFocus = false"
            />
          </div>
        </div>
      </div>
    </div>

    <TrackList
      :id="playlist.id"
      :tracks="filteredTracks"
      type="playlist"
      :extra-context-menu-item="isUserOwnPlaylist ? ['removeTrackFromPlaylist'] : []"
    />

    <div class="load-more">
      <ButtonTwoTone v-show="hasMore" color="grey" :loading="loadingMore" @click.native="loadMore(100)">{{
        t("explore.loadMore")
      }}</ButtonTwoTone>
    </div>

    <Modal
      :show="showFullDescription"
      :close="toggleFullDescription"
      :show-footer="false"
      :click-outside-hide="true"
      title="歌单介绍"
      >{{ playlist.description }}</Modal
    >

    <ContextMenu ref="playlistMenu">
      <!-- <div class="item">{{ t('contextMenu.addToQueue') }}</div> -->
      <div class="item" @click="likePlaylist(true)">
        {{ playlist?.subscribed ? t("contextMenu.removeFromLibrary") : t("contextMenu.saveToLibrary") }}
      </div>
      <div class="item" @click="searchInPlaylist()">{{ t("contextMenu.searchInPlaylist") }}</div>
      <div v-if="playlist.creator.userId === data.user.userId" class="item" @click="editPlaylist">编辑歌单信息</div>
      <div v-if="playlist.creator.userId === data.user.userId" class="item" @click="deletePlaylist">删除歌单</div>
    </ContextMenu>
  </div>
</template>

<style lang="less" scoped>
.playlist {
  margin-top: 32px;
}
.playlist-info {
  display: flex;
  margin-bottom: 72px;
  position: relative;
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    margin-left: 56px;
    .title {
      font-size: 36px;
      font-weight: 700;
      color: var(--color-text);

      .lock-icon {
        opacity: 0.28;
        color: var(--color-text);
        margin-right: 8px;
        .svg-icon {
          height: 26px;
          width: 26px;
        }
      }
    }
    .artist {
      font-size: 18px;
      opacity: 0.88;
      color: var(--color-text);
      margin-top: 24px;
    }
    .date-and-count {
      font-size: 14px;
      opacity: 0.68;
      color: var(--color-text);
      margin-top: 2px;
    }
    .description {
      font-size: 14px;
      opacity: 0.68;
      color: var(--color-text);
      margin-top: 24px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      cursor: pointer;
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

.special-playlist {
  margin-top: 192px;
  margin-bottom: 128px;
  border-radius: 1.25em;
  text-align: center;

  @keyframes letterSpacing4 {
    from {
      letter-spacing: 0;
    }

    to {
      letter-spacing: 4px;
    }
  }

  @keyframes letterSpacing1 {
    from {
      letter-spacing: 0;
    }

    to {
      letter-spacing: 1px;
    }
  }

  .title {
    font-size: 84px;
    line-height: 1.05;
    font-weight: 700;
    text-transform: uppercase;

    letter-spacing: 4px;
    animation-duration: 0.8s;
    animation-name: letterSpacing4;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    // background-image: linear-gradient(
    //   225deg,
    //   var(--color-primary),
    //   var(--color-primary)
    // );

    img {
      height: 78px;
      border-radius: 0.125em;
      margin-right: 24px;
    }
  }
  .subtitle {
    font-size: 18px;
    letter-spacing: 1px;
    margin: 28px 0 54px 0;
    animation-duration: 0.8s;
    animation-name: letterSpacing1;
    text-transform: uppercase;
    color: var(--color-text);
  }
  .buttons {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    button {
      margin-right: 16px;
    }
  }
}

.gradient-test {
  background-image: linear-gradient(to left, #92fe9d 0%, #00c9ff 100%);
}

[data-theme="dark"] {
  .gradient-radar {
    background-image: linear-gradient(to left, #92fe9d 0%, #00c9ff 100%);
  }
}

.gradient-radar {
  background-image: linear-gradient(to left, #0ba360 0%, #3cba92 100%);
}

.gradient-blue-purple {
  background-image: linear-gradient(45deg, #89c4f5 0%, #6284ff 42%, #ff0000 100%);
}

.gradient-sharp-blue {
  background-image: linear-gradient(45deg, #00c6fb 0%, #005bea 100%);
}

.gradient-yellow-pink {
  background-image: linear-gradient(45deg, #f6d365 0%, #fda085 100%);
}

.gradient-pink {
  background-image: linear-gradient(45deg, #ee9ca7 0%, #ffdde1 100%);
}

.gradient-indigo-pink-yellow {
  background-image: linear-gradient(43deg, #4158d0 0%, #c850c0 46%, #ffcc70 100%);
}

.gradient-light-red-light-blue {
  background-image: linear-gradient(225deg, hsl(190, 30%, 50%) 0%, #081abb 38%, #ec3841 58%, hsl(13, 99%, 49%) 100%);
}

.gradient-fog {
  background: linear-gradient(-180deg, #bcc5ce 0%, #929ead 98%),
    radial-gradient(at top left, rgba(255, 255, 255, 0.3) 0%, rgba(0, 0, 0, 0.3) 100%);
  background-blend-mode: screen;
}

.gradient-red {
  background-image: linear-gradient(213deg, #ff0844 0%, #ffb199 100%);
}

.gradient-sky-blue {
  background-image: linear-gradient(147deg, #48c6ef 0%, #6f86d6 100%);
}

.gradient-dark-blue-midnight-blue {
  background-image: linear-gradient(213deg, #09203f 0%, #537895 100%);
}

.gradient-yellow-red {
  background: linear-gradient(147deg, #fec867 0%, #f72c61 100%);
}

.gradient-yellow {
  background: linear-gradient(147deg, #fceb02 0%, #fec401 100%);
}

.gradient-midnight-blue {
  background-image: linear-gradient(-20deg, #2b5876 0%, #4e4376 100%);
}

.gradient-orange-red {
  background-image: linear-gradient(147deg, #ffe53b 0%, #ff2525 74%);
}

.gradient-moonstone-blue {
  background-image: linear-gradient(147deg, hsl(200, 34%, 8%) 0%, hsl(204, 35%, 38%) 50%, hsl(200, 34%, 18%) 100%);
}

.gradient-pink-purple-blue {
  background-image: linear-gradient(to right, #ff3cac 0%, #784ba0 50%, #2b86c5 100%) !important;
}

.gradient-green {
  background-image: linear-gradient(90deg, #c6f6d5, #68d391, #38b2ac) !important;
}

.user-info {
  h1 {
    font-size: 42px;
    position: relative;
    color: var(--color-text);
    .avatar {
      height: 44px;
      margin-right: 12px;
      vertical-align: -7px;
      border-radius: 50%;
      border: rgba(0, 0, 0, 0.2);
    }
  }
}

.search-box {
  display: flex;
  position: absolute;
  right: 20px;
  bottom: -55px;
  justify-content: flex-end;

  .container {
    display: flex;
    align-items: center;
    height: 32px;
    background: var(--color-secondary-bg-for-transparent);
    border-radius: 8px;
    width: 200px;
  }

  .svg-icon {
    height: 15px;
    width: 15px;
    color: var(--color-text);
    opacity: 0.28;
    margin: 0 8px;
  }

  input {
    font-size: 16px;
    border: none;
    background: transparent;
    width: 96%;
    font-weight: 600;
    margin-top: -1px;
    color: var(--color-text);
  }

  .active {
    background: var(--color-primary-bg-for-transparent);
    input,
    .svg-icon {
      opacity: 1;
      color: var(--color-primary);
    }
  }
}

[data-theme="dark"] {
  .search-box {
    .active {
      input,
      .svg-icon {
        color: var(--color-text);
      }
    }
  }
}

.search-box-like-page {
  display: flex;
  position: absolute;
  right: 12vw;
  top: 95px;
  justify-content: flex-end;

  .input {
    transition: all 0.5s;
  }

  .container {
    display: flex;
    align-items: center;
    height: 32px;
    background: var(--color-secondary-bg-for-transparent);
    border-radius: 8px;
  }

  .svg-icon {
    height: 15px;
    width: 15px;
    color: var(--color-text);
    opacity: 0.28;
    margin-left: 8px;
    margin-right: 8px;
  }

  input {
    font-size: 16px;
    border: none;
    background: transparent;
    width: 96%;
    font-weight: 600;
    margin-top: -1px;
    color: var(--color-text);
  }

  .active {
    background: var(--color-primary-bg-for-transparent);
    input,
    .svg-icon {
      opacity: 1;
      color: var(--color-primary);
    }
  }
}

[data-theme="dark"] {
  .search-box-like-page {
    .active {
      input,
      .svg-icon {
        color: var(--color-text);
      }
    }
  }
}

@media (max-width: 1336px) {
  .search-box-like-page {
    right: 8vw;
  }
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
