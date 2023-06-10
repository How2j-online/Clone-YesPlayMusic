<template>
  <div class="nav-bar user-select-none">
    <nav>
      <div class="navigation-buttons">
        <button-icon @click="handleGo('back')"
          ><SvgIcon name="arrow-left" class="svg-icon" />
        </button-icon>
        <button-icon @click="handleGo('forward')"
          ><SvgIcon name="arrow-right" class="svg-icon" />
        </button-icon>
      </div>
      <div class="navigation-links">
        <router-link to="/" :class="{ active: route.name === 'home' }">
          {{ t("nav.home") }}
        </router-link>
        <router-link to="/explore" :class="{ active: route.name === 'explore' }">
          {{ t("nav.explore") }}
        </router-link>
        <router-link to="/library" :class="{ active: route.name === 'library' }">
          {{ t("nav.library") }}
        </router-link>
      </div>
      <div class="right-part">
        <div class="search-box">
          <div class="container" :class="{ active: inputFocus }">
            <svg-icon name="search" :class="'svg-icon'" />
            <div class="input">
              <input
                ref="searchInput"
                v-model="keywords"
                type="search"
                :placeholder="inputFocus ? '' : t('nav.search')"
                @keydown.enter="doSearch"
                @focus="inputFocus = true"
                @blur="inputFocus = false"
              />
            </div>
          </div>
        </div>
        <img
          alt="avatar"
          class="avatar"
          src="https://s4.music.126.net/style/web2/img/default/default_avatar.jpg?param=60y60"
          @click="showUserProfileMenu"
          loading="lazy"
        />
      </div>
    </nav>
    <ContextMenu ref="userProfileMenu">
      <div @click="toSettings" class="item">
        <svg-icon name="settings" :size="15" />
        {{ t("library.userProfileMenu.settings") }}
      </div>
      <div v-if="!isLooseLoggedIn" class="item" @click="toLogin">
        <svg-icon name="login" :size="15" />
        {{ t("login.login") }}
      </div>
      <div v-if="isLooseLoggedIn" class="item" @click="logout">
        <svg-icon name="logout" :size="15" />
        {{ t("library.userProfileMenu.logout") }}
      </div>
    </ContextMenu>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import SvgIcon from "@/components/SvgIcon.vue";
import { ref } from "vue";
import { useLocale } from "@/locales/useLocal";
import ButtonIcon from "@/components/ButtonIcon.vue";
import ContextMenu from "@/components/ContextMenu.vue";

defineOptions({
  name: "Navbar",
  inheritAttrs: true
});
const userProfileMenu = ref<InstanceType<typeof ContextMenu> | null>(null);

const router = useRouter();
const route = useRoute();
const { t } = useLocale();

const isLooseLoggedIn = ref<boolean>(false);
const inputFocus = ref<boolean>(false);
const keywords = ref<string>("");
const handleGo = (where: string) => {
  if (where === "back") router.back();
  else router.forward();
};
const doSearch = () => {
  if (!keywords.value) return;
  if (route.name === "search" && route.params.keywords === keywords.value) {
    return;
  }
  router.push({
    name: "search",
    params: { keywords: keywords.value }
  });
};
const showUserProfileMenu = e => {
  userProfileMenu.value?.openMenu(e);
};
const toSettings = () => {
  router.push("/settings");
};
const toLogin = () => {
  router.push("/login");
};
const logout = () => {
  if (!confirm("确定要退出登录吗？")) return;
  router.push({ name: "home" });
};
</script>

<style lang="less" scoped>
nav {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--color-navbar-bg);
  z-index: 100;
}

@media (max-width: 1336px) {
  nav {
    padding: 0 5vw;
  }
}

@supports (-moz-appearance: none) {
  nav {
    background-color: var(--color-body-bg);
  }
}

nav.has-custom-title-bar {
  padding-top: 20px;
}

.navigation-buttons {
  flex: 1;
  display: flex;
  align-items: center;
  .svg-icon {
    height: 24px;
    width: 24px;
  }
}
@media (max-width: 970px) {
  .navigation-buttons {
    flex: unset;
  }
}

.navigation-links {
  flex: 1;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  user-select: none;
  a {
    font-size: 18px;
    font-weight: 700;
    text-decoration: none;
    border-radius: 6px;
    padding: 6px 10px;
    color: var(--color-text);
    transition: 0.2s;
    -webkit-user-drag: none;
    margin: 0 12px;
    &:hover {
      background: var(--color-secondary-bg-for-transparent);
    }
    &:active {
      transform: scale(0.92);
      transition: 0.2s;
    }
  }
  a.active {
    color: var(--color-primary);
  }
}

.search {
  .svg-icon {
    height: 18px;
    width: 18px;
  }
}

.search-box {
  display: flex;
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
    margin: 0 4px 0 8px;
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

.right-part {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .avatar {
    user-select: none;
    height: 30px;
    margin-left: 12px;
    vertical-align: -7px;
    border-radius: 50%;
    cursor: pointer;
    -webkit-user-drag: none;
    &:hover {
      filter: brightness(80%);
    }
  }
  .search-button {
    display: none;
  }
}

.item {
  font-weight: 600;
  font-size: 14px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: default;
  color: var(--color-text);
  display: flex;
  align-items: center;
  &:hover {
    color: var(--color-primary);
    background: var(--color-primary-bg-for-transparent);
    transition: opacity 125ms ease-out, transform 125ms ease-out;
  }
  &:active {
    opacity: 0.75;
    transform: scale(0.95);
  }

  .svg-icon {
    height: 16px;
    width: 16px;
    margin-right: 5px;
  }
}
</style>
