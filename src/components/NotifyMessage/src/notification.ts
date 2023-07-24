import { createVNode, Ref, render } from "vue";
import type { VNode } from "vue";
import Notification from "@/components/NotifyMessage/src/Notification.vue";

type NotifyType = "success" | "error" | "info" | "warning";
interface NotifyOptions {
  type?: NotifyType;
  content?: string;
}
interface NotificationHandle {
  close: () => void;
}
type NotifyFn = (options?: NotifyOptions) => NotificationHandle;
type NotifyTypedFn = (options?: NotifyOptions) => NotificationHandle;
interface Notify extends NotifyFn {
  success: NotifyTypedFn;
  warning: NotifyTypedFn;
  error: NotifyTypedFn;
  info: NotifyTypedFn;
}

let messageNotify: VNode | null = null;

const createNotify: NotifyFn & Partial<Notify> = (options?: NotifyOptions) => {
  if (messageNotify) {
    return;
  }
  let container = document.createElement("div");
  container.setAttribute("class", "messageWrapper");
  const props = {
    ...options,
    onDestroy: () => {
      messageNotify = null;
      console.log("onDestroy");
      render(null, container);
    }
  };
  const vNode = createVNode(Notification, props);
  messageNotify = vNode;
  render(vNode, container);
  document.body.appendChild(container.firstElementChild!);
  const vm = vNode.component!;

  return {
    close: () => {
      (vm.exposed as { show: Ref<boolean> }).show.value = false;
      messageNotify = null;
    }
  };
};

const notificationTypes = ["success", "info", "warning", "error"] as const;

notificationTypes.forEach(type => {
  createNotify[type] = (option = {}) => {
    if (typeof option === "string") {
      option = { content: option };
    }
    return createNotify({ ...option, type });
  };
});
export default createNotify;
