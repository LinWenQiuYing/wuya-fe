import { ref, onMounted, onBeforeUnmount } from "vue";

export default function useOutSide(clickOutsideCallback: Function) {
  const nodeRef = ref<Element>();
  const clickHandler = (event: MouseEvent) => {
    if (!nodeRef.value) return;
    // 判断是否点在外面
    if (!nodeRef.value.contains(event.target as Node)) {
      clickOutsideCallback(event);
    }
  };

  onMounted(() => {
    document.addEventListener("click", clickHandler);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", clickHandler);
  });

  return { nodeRef };
}
