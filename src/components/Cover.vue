<script setup lang="ts">
import { computed, ref } from "vue";
import SvgIcon from "@/components/SvgIcon.vue";

defineOptions({
  name: "Cover"
});
interface Styles {
  width?: string;
  height?: string;
  borderRadius?: string;
  backgroundImage?: string;
}

const props = withDefaults(
  defineProps<{
    id: number; // 音乐id
    type: string;
    imageUrl: string;
    fixedSize?: number; // 封面大小
    playButtonSize?: number; // 播放按钮大小
    coverHover?: boolean; // 是否显示阴影
    alwaysShowPlayButton?: boolean; // 是否一直显示播放按钮
    alwaysShowShadow?: boolean; // 是否一直显示阴影
    clickCoverToPlay?: boolean; // 点击封面是否播放
    shadowMargin?: number; // 阴影边距
    radius?: number; // 圆角
  }>(),
  {
    fixedSize: 0,
    playButtonSize: 22,
    coverHover: true,
    alwaysShowPlayButton: true,
    alwaysShowShadow: false,
    clickCoverToPlay: false,
    shadowMargin: 12,
    radius: 12
  }
);

const focus = ref(false);

// 图片样式
const imageStyles = computed(() => {
  let styles: Partial<Omit<Styles, "backgroundImage">> = {};
  if (props.fixedSize !== 0) {
    styles.width = props.fixedSize + "px";
    styles.height = props.fixedSize + "px";
  }
  if (props.type === "artist") styles.borderRadius = "50%";
  return styles;
});

// 播放按钮样式
const playButtonStyles = computed(() => {
  let styles: Partial<Omit<Styles, "borderRadius" | "backgroundImage">> = {};
  styles.width = props.playButtonSize + "%";
  styles.height = props.playButtonSize + "%";
  return styles;
});

// 阴影样式
const shadowStyles = computed(() => {
  let styles: Partial<Omit<Styles, "width" | "height">> = {};
  styles.backgroundImage = `url(${props.imageUrl})`;
  if (props.type === "artist") styles.borderRadius = "50%";
  return styles;
});
</script>

<template>
  <div
    class="cover"
    :class="{ 'cover-hover': coverHover }"
    @mouseover="focus = true"
    @mouseleave="focus = false"
  >
    <div class="cover-container">
      <div class="shade">
        <button v-show="focus" class="play-button" :style="playButtonStyles">
          <svg-icon class="svg-icon" name="play" />
        </button>
      </div>

      <!--suppress HtmlUnknownAttribute, VueUnrecognizedDirective -->
      <img alt="image" src="" v-img-lazy :lazy="imageUrl" :style="imageStyles" />

      <transition v-if="coverHover || alwaysShowShadow" name="fade">
        <div v-show="focus || alwaysShowShadow" class="shadow" :style="shadowStyles"></div>
      </transition>
    </div>
  </div>
</template>

<style scoped lang="less">
.cover {
  position: relative;
  transition: transform 0.3s;
}
.cover-container {
  position: relative;
}
img {
  border-radius: 0.75em;
  width: 100%;
  user-select: none;
  aspect-ratio: 1 / 1;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.cover-hover {
  &:hover {
    cursor: pointer;
    //transform: scale(1.02);
  }
}

.shade {
  position: absolute;
  top: 0;
  height: calc(100% - 3px);
  width: 100%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}
.play-button {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.08);
  height: 22%;
  width: 22%;
  border-radius: 50%;
  cursor: default;
  transition: 0.2s;
  .svg-icon {
    height: 44%;
    margin-left: 4px;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.28);
  }
  &:active {
    transform: scale(0.94);
  }
}

.shadow {
  position: absolute;
  top: 12px;
  height: 100%;
  width: 100%;
  filter: blur(16px) opacity(0.6);
  transform: scale(0.92, 0.96);
  z-index: -1;
  background-size: cover;
  border-radius: 0.75em;
  aspect-ratio: 1 / 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
