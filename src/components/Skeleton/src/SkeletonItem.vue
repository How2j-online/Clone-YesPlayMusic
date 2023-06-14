<script setup lang="ts">
import { CSSProperties } from "vue";

defineOptions({
  name: "SkeletonItem"
});

withDefaults(
  defineProps<{
    type?: "row" | "col" | "rect" | "circle";
    containerClass?: string;
    itemStyle: CSSProperties;
    active?: boolean;
  }>(),
  {
    type: "row",
    active: true,
    itemStyle: () => {
      return {
        with: "16px",
        height: "16px"
      };
    }
  }
);
</script>

<template>
  <div>
    <div v-if="type === 'row'" :class="containerClass" class="ske-row-container">
      <div class="ske ske-row" :style="itemStyle"></div>
    </div>
    <div v-else-if="type === 'col'" :class="containerClass" class="ske-col-container">
      <div class="ske ske-col" :style="itemStyle"></div>
    </div>
    <div v-else-if="type === 'rect'" :class="containerClass" class="ske-rect-container">
      <div class="ske ske-rect" :class="{ 'ske-ani': active }" :style="itemStyle"></div>
    </div>
    <div v-else-if="type === 'circle'" :class="containerClass" class="ske-circle-container">
      <div class="ske ske-circle" :class="{ 'ske-ani': active }" :style="itemStyle"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
@keyframes skeleton-stripes {
  to {
    background-position-x: -20%;
  }
}

.ske-rect,
.ske-circle {
  background-size: 200% 100%;
  background-color: #f2f2f2;
  margin: 0;
}

.ske-rect.ske-ani,
.ske-circle.ske-ani {
  background: linear-gradient(100deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 60%) #ededed;
  background-size: 200% 100%;
  background-position-x: 120%;
  animation: 1.4s skeleton-stripes ease-in-out infinite;

  //background: linear-gradient(90deg, var(#f0f2f5) 25%, var(#e6e8eb) 37%, var(#f0f2f5) 63%);
  //background-size: 400% 100%;
  //animation: skeleton-stripes  1.4s ease infinite;
}

.ske-col-container {
  display: flex;
}

.ske-col,
.ske-row {
  margin: 0;
}

.ske-circle {
  border-radius: 100%;
}
</style>
