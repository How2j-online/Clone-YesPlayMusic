<script setup lang="ts">
import { ref, nextTick } from "vue";
defineOptions({
  name: "ContextMenu"
});

const showMenu = ref<boolean>(false);
const menu = ref<HTMLElement | null>(null);
const contextMenu = ref<HTMLElement | null>(null);
const topM = ref<string>("0px");
const leftM = ref<string>("0px");
const closeMenu = () => {
  showMenu.value = false;
};
const openMenu = (e: PointerEvent) => {
  showMenu.value = true;
  nextTick(() => {
    menu.value?.focus();
    setMenu(e.y, e.x);
  });
  e.preventDefault();
};
const setMenu = (topY: number, leftX: number) => {
  let largestHeight = window.innerHeight - menu.value?.offsetHeight;
  let largestWidth = window.innerWidth - menu.value?.offsetWidth - 25;
  if (topY > largestHeight) topY = largestHeight;
  if (leftX > largestWidth) leftX = largestWidth;
  topM.value = topY + "px";
  leftM.value = leftX + "px";
};
defineExpose({
  openMenu
});
</script>

<template>
  <div ref="contextMenu" class="context-menu">
    <div
      v-if="showMenu"
      ref="menu"
      class="menu"
      tabindex="-1"
      :style="{ top: topM, left: leftM }"
      @blur="closeMenu"
      @click="closeMenu"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
.context-menu {
  width: 100%;
  height: 100%;
  user-select: none;
}

.menu {
  position: fixed;
  min-width: 136px;
  max-width: 240px;
  list-style: none;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  box-sizing: border-box;
  padding: 6px;
  z-index: 1000;
  transition: background 125ms ease-out, opacity 125ms ease-out, transform 125ms ease-out;

  &:focus {
    outline: none;
  }
}

[data-theme="dark"] {
  .menu {
    background: rgba(36, 36, 36, 0.78);
    backdrop-filter: blur(16px) contrast(120%) brightness(60%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.08);
  }
  .menu .item:hover {
    color: var(--color-text);
  }
}

@supports (-moz-appearance: none) {
  .menu {
    background-color: var(--color-body-bg) !important;
  }
}
</style>
