<template>
  <div>
    <transition name="fade">
      <div
        v-show="show"
        id="scrollbar"
        class="user-select-none"
        :class="{ 'on-drag': isOnDrag }"
        @click="handleClick"
      >
        <div
          id="thumbContainer"
          :class="{ active }"
          :style="thumbStyle"
          @mouseenter="handleMouseenter"
          @mouseleave="handleMouseleave"
          @mousedown="handleDragStart"
          @click.stop
        >
          <div></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import type { Ref } from "vue";
import { computed, inject, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useDebounce } from "@/utils";

const gapValue = 64 * 2;
const PARENT_PROVIDE = "parentProvide";
const route = useRoute();

let top = ref<number>(0); // 滚动条位置
let thumbHeight = ref<number>(0); // 滚动条高度
let active = ref<boolean>(false); // 滚动条是否移入
let show = ref<boolean>(true); // 滚动条是否显示
let isOnDrag = ref<boolean>(false); // 是否在拖拽
let onDragClientY = ref<number>(0); // 拖拽时鼠标位置

// 记录滚动条位置
const positions = reactive({
  home: { scrollTop: 0 },
});

// 滚动条样式
const thumbStyle = computed(() => {
  return {
    transform: `translateY(${top.value}px)`,
    height: `${thumbHeight.value}px`,
  };
});

// main 元素
const injectApp = inject(PARENT_PROVIDE) as Ref<HTMLElement>;
const main = ref() as Ref<HTMLElement>;
onMounted(() => {
  main.value = injectApp.value;
});

// 滚动条位置
const handleScroll = () => {
  // main 元素高度
  const clientHeight = main.value.clientHeight - gapValue;
  // main 元素内容高度
  const scrollHeight = main.value.scrollHeight - gapValue;
  // main 内容区域
  const scrollTop = main.value.scrollTop;
  // 距离顶部的距离 ~~ 按位取反
  let topValue = ~~((scrollTop / scrollHeight) * clientHeight);
  // 滚动条高度
  let thumbHeightValue = ~~((clientHeight / scrollHeight) * clientHeight);
  if (thumbHeightValue < 24) thumbHeightValue = 24;

  top.value = topValue;
  thumbHeight.value = thumbHeightValue;

  if (!show.value && clientHeight !== thumbHeightValue) {
    show.value = true;
  }
  setScrollBarHideTimeout();
  setScrollPosition();
};

// 鼠标移入移出
const handleMouseenter = () => {
  active.value = true;
};
const handleMouseleave = () => {
  active.value = false;
};

// 拖拽滚动条
const handleDragStart = (e: PointerEvent) => {
  onDragClientY.value = e.clientY;
  isOnDrag.value = true;
  emit("useSelect");
  document.addEventListener("mousemove", handleDragMove);
  document.addEventListener("mouseup", handleDragEnd);
};
const handleDragMove = (e: PointerEvent) => {
  if (!isOnDrag.value) return;
  const clientHeight = main.value.clientHeight - gapValue;
  const scrollHeight = main.value.scrollHeight - gapValue;
  const clientY = e.clientY;
  const scrollTop = main.value.scrollTop;
  const offset = ~~(
    ((clientY - onDragClientY.value) / clientHeight) *
    scrollHeight
  );
  top.value = ~~((scrollTop / scrollHeight) * clientHeight);
  main.value.scrollBy(0, offset);
  onDragClientY.value = clientY;
};
const handleDragEnd = () => {
  isOnDrag.value = false;
  emit("useSelect");
  document.removeEventListener("mousemove", handleDragMove);
  document.removeEventListener("mouseup", handleDragEnd);
};

// 点击滚动条
const handleClick = (e: PointerEvent) => {
  let scrollTop;
  if (e.clientY < top.value + thumbHeight.value) {
    scrollTop = -256;
  } else {
    scrollTop = 256;
  }
  main.value.scrollBy({ top: scrollTop, behavior: "smooth" });
};

// 隐藏滚动条
const setScrollBarHideTimeout = useDebounce(() => {
  if (!active.value) show.value = false;
  show.value = false;
}, 4000);

const setScrollPosition = useDebounce(() => {
  if (route.meta.savePosition) {
    positions[route.name] = {
      scrollTop: main.value.scrollTop,
    };
  }
}, 1000);
defineExpose({
  handleScroll,
  setScrollPosition,
});

const emit = defineEmits(["useSelect"]);
</script>

<style lang="less" scoped>
#scrollbar {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 16px;
  z-index: 1000;

  #thumbContainer {
    margin-top: 64px;
    div {
      transition: background 0.4s;
      position: absolute;
      right: 2px;
      width: 8px;
      height: 100%;
      border-radius: 4px;
      background: rgba(128, 128, 128, 0.38);
    }
  }
  #thumbContainer.active div {
    background: rgba(128, 128, 128, 0.58);
  }
}

[data-theme="dark"] {
  #thumbContainer div {
    background: var(--color-secondary-bg);
  }
}

#scrollbar.on-drag {
  left: 0;
  width: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
