import { ref } from "vue";

export const useElementStyle = (el: Element) => {
  const padding = ref<number[]>([]);
  const getPadding = getComputedStyle(el)
    .padding.replace(/px/gi, "")
    .split(" ")
    .map(item => +item);
  if (getPadding.length === 1) {
    padding.value = Array(4).fill(getPadding[0]);
  }
  if (getPadding.length === 3) {
    getPadding.push(getPadding[1]);
    padding.value = getPadding;
  }
  padding.value = getPadding;
  return padding;
};
