import { onMounted, onUnmounted } from "vue";

interface EventListener {
  <T extends Window, K extends keyof WindowEventMap>(this: T, event: WindowEventMap[K]): void;
  <T extends Document, K extends keyof DocumentEventMap>(this: T, event: DocumentEventMap[K]): void;
  <T extends HTMLElement, K extends keyof HTMLElementEventMap>(this: T, event: HTMLElementEventMap[K]): void;
}

/**
 * 组合式函数(即hook), 用作添加一个事件侦听器.
 * vue组件挂载后开始侦听, 卸载后移除侦听.
 * @param target 添加事件的目标, 可为 window, document, document.body 或者任意一html元素
 * @param event 在该目标上可触发的事件名, 自定义事件不行
 * @param listener 该事件相应的侦听器
 * @param options 侦听选项
 */
export default function useEventListener<
  T extends Window | Document | HTMLElement,
  K extends T extends Window
    ? keyof WindowEventMap
    : T extends Document
      ? keyof DocumentEventMap
      : keyof HTMLElementEventMap,
>(target: T, event: K, listener: EventListener, options?: boolean | AddEventListenerOptions) {
  onMounted(() => target.addEventListener(event, listener, options));
  onUnmounted(() => target.removeEventListener(event, listener, options));
}
