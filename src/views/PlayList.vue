<script setup lang="ts">
import { useRoute } from "vue-router";

defineOptions({
  name: "PlayList"
});
const route = useRoute();
const id = route.params.id;
</script>

<template>
  <h1>{{ id }}</h1>
</template>

<style scoped lang="less"></style>
