// 懒加载
export const useLazy = (el: HTMLElement | HTMLImageElement, callback?: Fn) => {
  let observer: IntersectionObserver;
  const listenEl = () => {
    observer.observe(el);
  };

  /**
   * 监听元素是否进入可视区域
   * 参考: https://juejin.cn/post/6844903874302574599
   */

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback && callback();
        observer.unobserve(el);
      }
    });
  });

  // 监听元素
  listenEl();

  return {
    observer
  };
};
