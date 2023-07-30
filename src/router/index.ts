import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue")
  },
  {
    path: "/explore", // 发现页面
    name: "explore",
    component: () => import("@/views/Explore.vue")
  },
  {
    path: "/library", // 我的音乐页面
    name: "library",
    component: () => import("@/views/LibraryMusic.vue")
  },
  {
    path: "/playlist/:id", // 歌单页面
    name: "playlist",
    component: () => import("@/views/Playlist.vue")
  },
  {
    path: "/artist/:id", // 歌手页面
    name: "artist",
    component: () => import("@/views/Artist.vue")
  },
  {
    path: "/album/:id", // 专辑页面
    name: "album",
    component: () => import("@/views/Album.vue")
  },
  {
    path: "/new-album", // 最新专辑页面
    name: "new-album",
    component: () => import("@/views/NewAlbum.vue")
  },
  {
    path: "/mv/:id", // MV页面
    name: "mv",
    component: () => import("@/views/Mv.vue")
  },
  {
    path: "/artist/:id/mv",
    name: "artistMV",
    component: () => import("@/views/ArtistMV.vue"),
    meta: {
      keepAlive: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
