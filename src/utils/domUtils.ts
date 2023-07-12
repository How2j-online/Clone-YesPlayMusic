export const on = (element: Element | HTMLElement | Document | Window, event: string, handler: Fn): void => {
  if (element && event && handler) {
    element.addEventListener(event, handler, false);
  }
};

export const off = (element: Element | HTMLElement | Document | Window, event: string, handler: Fn): void => {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false);
  }
};
