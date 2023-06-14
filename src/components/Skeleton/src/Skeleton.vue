<script setup lang="ts">
import SkeletonItem from "@/components/Skeleton/src/SkeletonItem.vue";

defineOptions({
  name: "Skeleton"
});
</script>
<template>
  <div class="skeleton-wrapper">
    <div class="skeleton-content">
      <slot name="template">
        <SkeletonItem type="circle" :item-style="{ height: '100px', width: '100px' }" />
      </slot>
    </div>
  </div>
</template>

<style scoped lang="less"></style>
