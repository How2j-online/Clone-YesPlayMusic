<template>
  <component :is="currentComponent" ref="svgRef" :class="props.class" />
</template>

<script lang="ts" setup>
defineOptions({
  name: "SvgIcon"
});
import type { Component } from "vue";
import { computed, watch, ref, nextTick, onMounted } from "vue";

const modules = import.meta.glob("@/assets/icons/*.svg", {
  as: "component",
  eager: true
});
const props = defineProps<{
  name: string;
  color?: string;
  size?: number;
  class?: string;
}>();
// icon lower name
const newName = computed(() => {
  return props.name.toLowerCase();
});

// 获取对应svg组件
const currentComponent = computed(() => {
  const fileName = "/" + newName.value + ".svg";
  let findMod;
  for (const path in modules) {
    const mod = modules[path];
    if (path.endsWith(fileName)) {
      findMod = mod as Component;
    }
  }
  return findMod;
});

// 获取svg组件实例
const svgRef = ref();
const color = computed(() => {
  return {
    fill: props.color
  };
});

const settStyle = () => {
  nextTick(() => {
    const svg = svgRef.value;
    if (svg) {
      const svgEl = svg.$el as SVGElement;
      svgEl.style.color = color.value.fill ?? "";
      if (props.class) return;
      if (props.size === 100 || !props.size) {
        svgEl.style.height = "100%";
        svgEl.style.width = "100%";
      } else {
        svgEl.style.height = `${props.size}px`;
        svgEl.style.width = `${props.size}px`;
      }
    }
  });
};

watch(color, () => {
  settStyle();
});

onMounted(() => {
  settStyle();
});
</script>

<style scoped></style>
