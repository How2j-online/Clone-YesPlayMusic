// 图片懒加载
import { useLazy } from "@/hooks/useLazy";
import type { Directive, DirectiveBinding } from "vue";

const imgLazyLoad = (el: HTMLImageElement, loadType: "src" | "bc" = "src") => {
  const defaultImg = "https://img.yzcdn.cn/vant/cat.jpeg";
  const loadImg = () => {
    el.src = el.getAttribute("lazy");
    el.onerror = () => {
      el.src = defaultImg;
    };
    el.removeAttribute("lazy");
  };

  // 加载元素
  const loadElement = () => {
    switch (loadType) {
      case "src":
        loadImg();
        break;
      case "bc":
        el.style.backgroundImage = `url(${el.getAttribute("lazy")})`;
        el.removeAttribute("lazy");
        break;
    }
  };

  // 懒加载
  useLazy(el, loadElement);
};

const createImageHandler = (el: HTMLImageElement, binding: DirectiveBinding) => {
  const { modifiers } = binding;
  if (modifiers.bc) {
    imgLazyLoad(el, "bc");
  } else {
    imgLazyLoad(el, "src");
  }
};

const lazyDirective: Directive = {
  mounted(el: HTMLImageElement, binding: DirectiveBinding) {
    createImageHandler(el, binding);
  }
};

export default lazyDirective;
