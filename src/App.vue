<template>
  <div id="appMain" :class="{ 'use-select-none': userSelectNone }">
    <Scrollbar ref="scrollBar" class="user-select-none" @use-select="handleUseSelect" />
    <Navbar />
    <main ref="main" @scroll="handleMainScroll">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" v-if="isKeepAlive" />
        </KeepAlive>
        <component :is="Component" v-if="!isKeepAlive" />
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import Scrollbar from "@/components/Scrollbar.vue";
import { provide, ref } from "vue";
import { onActivated } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();
const userSelectNone = ref<boolean>(false);
const isKeepAlive = route.meta.keepAlive;
const scrollBar = ref<InstanceType<typeof Scrollbar> | null>(null);
const main = ref<HTMLElement | null>(null);
const PARENT_PROVIDE = "parentProvide";
provide(PARENT_PROVIDE, main);

const handleMainScroll = () => {
  scrollBar.value?.handleScroll();
};

const handleUseSelect = () => {
  userSelectNone.value = !userSelectNone.value;
};
onActivated(() => {
  console.log(12312);
});
</script>

<style scoped lang="less">
#appMain {
  width: 100%;
  transition: all 0.4s;
}

main {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: auto;
  padding: 64px 10vw 96px 10vw;
  box-sizing: border-box;
  scrollbar-width: none; // firefox
}
main::-webkit-scrollbar {
  width: 0;
}

@media (max-width: 1336px) {
  main {
    padding: 64px 5vw 96px 5vw;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s;
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
