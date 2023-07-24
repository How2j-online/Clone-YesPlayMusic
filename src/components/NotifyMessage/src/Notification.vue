<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    type: string;
    content: string;
  }>(),
  {
    type: "success",
    content: "success"
  }
);
const show = ref<boolean>(false);
const backgroundColor = ref<string>("#fff");

const emit = defineEmits({
  destroy: () => true
});

const starTimer = () => {
  setTimeout(() => {
    handleClose();
  }, 3000);
};
const handleClose = () => {
  show.value = false;
};

onMounted(() => {
  show.value = true;
  starTimer();
});
defineExpose({
  show
});
</script>

<template>
  <transition name="slide-fade" @before-leave="handleClose" @after-leave="emit('destroy')">
    <div class="notification" v-show="show" :style="{ backgroundColor: backgroundColor }">
      <div class="notification__content">
        <div class="notification__title" :class="type">{{ content }}</div>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="less">
.notification {
  position: fixed;
  left: 50%;
  bottom: 74px;
  transform: translateX(-50%);
  z-index: 999;
  padding: 6px 12px;
  box-sizing: border-box;
  border-radius: 6px;
  box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.88);
  border: 2px solid rgba(51, 94, 234, 1);
  display: flex;
  color: var(--color-text);
  align-items: center;
  justify-content: center;
  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  &__title {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text);
  }
  &.success {
    background-color: #67c23a;
  }
  &.warning {
    background-color: #e6a23c;
  }
  &.info {
    background-color: #909399;
  }
  &.error {
    background-color: #f56c6c;
  }
}

[data-theme="dark"] {
  .notification {
    background: rgba(46, 46, 46, 0.68);
    backdrop-filter: blur(16px) contrast(120%);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10%) translateX(-50%);
  opacity: 0;
}
</style>
