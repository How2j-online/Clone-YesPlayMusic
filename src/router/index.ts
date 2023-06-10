import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue")
  },
  {
    path: "/explore",
    name: "explore",
    component: () => import("@/views/Explore.vue")
  },
  {
    path: "/library",
    name: "library",
    component: () => import("@/views/LibraryMusic.vue")
  },
  {
    path: "/playlist/:id",
    name: "playlist",
    component: () => import("@/views/Playlist.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
