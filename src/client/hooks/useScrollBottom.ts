import { computed, nextTick, onBeforeUnmount, Ref, ref, watch } from "vue";
import store from "@/store";

export default function useScrollBottom(domRef: Ref<HTMLDivElement | undefined>) {
  const timer = ref<number | null>(null);
  const isCleared = ref<boolean>(false);
  const lastScrollTop = ref<number>(0);
  const isStartChat = computed(() => store.state.chat.isStartChat);

  function autoScroll(step: number) {
    const dom = domRef.value;
    if (dom) {
      // 滚动到页面底部
      dom.scrollBy({ top: step, behavior: "smooth" });
    }
  }

  function scrollListener() {
    const dom = domRef.value;
    if (dom) {
      const currentScroll = dom.scrollTop;
      // 父盒子的高度
      const clientHeight = dom.clientHeight;
      // 子盒子的高度（滚动盒子的高度）
      const scrollHeight = dom.scrollHeight;
      // 滚动的最大距离
      const scrollHeight_clientHeight = scrollHeight - clientHeight;
      // 滚动的最大距离小于等于实时滚动距离时，滚动到了底部
      // 检测当前滚动位置是否小于上一次的滚动位置
      if (currentScroll < lastScrollTop.value) {
        !isCleared.value && clearTimer();
      } else if (scrollHeight_clientHeight <= currentScroll) {
        if (isStartChat.value && isCleared.value) {
          timer.value = window.setInterval(() => checkAndScroll(), 2000);
          isCleared.value = false;
        }
      }
      lastScrollTop.value = currentScroll;
    }
  }

  function checkAndScroll() {
    const dom = domRef.value;
    if (dom) {
      // 父盒子的高度
      const clientHeight = dom.clientHeight;
      // 子盒子的高度（滚动盒子的高度）
      const scrollHeight = dom.scrollHeight;
      // 滚动的最大距离
      const scrollHeight_clientHeight = scrollHeight - clientHeight;
      // 实时滚动距离
      const scrollTop = dom.scrollTop;
      if (scrollHeight_clientHeight > scrollTop) {
        autoScroll(scrollHeight_clientHeight - scrollTop);
      }
    }
  }

  const clearTimer = () => {
    if (timer.value) {
      window.clearInterval(timer.value);
      isCleared.value = true;
    }
  };
  watch([() => domRef.value, () => isStartChat.value], async ([dom, isStartChat]) => {
    if (dom) {
      await nextTick();
      checkAndScroll();
      if (isStartChat) {
        //新建话题时记录当前滚动
        lastScrollTop.value = dom.scrollTop;
        isCleared.value = false;
        timer.value = window.setInterval(() => checkAndScroll(), 2000);
        dom && dom.addEventListener("scroll", scrollListener);
      } else {
        clearTimer();
      }
    }
  });

  onBeforeUnmount(() => {
    const dom = domRef.value;
    clearTimer();
    dom && dom.removeEventListener("scroll", scrollListener);
  });
}
