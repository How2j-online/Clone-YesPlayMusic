<script lang="ts" setup>
import SvgIcon from "@/components/SvgIcon.vue";
import { reactive } from "vue";
const props = withDefaults(
  defineProps<{
    size?: number;
  }>(),
  {
    size: 16
  }
);
const svgStyle = reactive({
  height: props.size + "px",
  width: props.size + "px",
  position: "relative",
  left: "-1px"
});
</script>
<template>
  <svg-icon name="explicit" :style="svgStyle" class="svg-icon"></svg-icon>
</template>

<style lang="less" scoped></style>
