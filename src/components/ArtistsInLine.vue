<template>
  <span class="artist-in-line">
    {{ computedPrefix }}
    <span v-for="(ar, index) in filteredArtists" :key="index">
      <router-link v-if="ar.id !== 0" :to="`/artist/${ar.id}`">{{ ar.name }}</router-link>
      <span v-else>{{ ar.name }}</span>
      <span v-if="index !== filteredArtists.length - 1" class="separator">,</span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineOptions({
  name: "ArtistInLine"
});
const props = withDefaults(
  defineProps<{
    artists: {
      id: number;
      name: string;
    }[];
    exclude?: string;
    prefix?: string;
  }>(),
  {
    exclude: "",
    prefix: ""
  }
);
const filteredArtists = computed(() => {
  return props.artists.filter(a => a.name !== props.exclude);
});
const computedPrefix = computed(() => {
  if (filteredArtists.value.length !== 0) return props.prefix;
  else return "";
});
</script>

<style lang="less" scoped>
.separator {
  /* make separator distinct enough in long list */
  margin-left: 1px;
  margin-right: 4px;
  position: relative;
  top: 0.5px;
}
</style>
