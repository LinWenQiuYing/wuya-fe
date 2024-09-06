import { ref } from "vue";
import useEventListener from "./useEventListener";

export default function useOffline() {
  const offline = ref<boolean>(!navigator.onLine);
  useEventListener(window, "online", () => {
    offline.value = false;
  });
  useEventListener(window, "offline", () => {
    offline.value = true;
  });
  return offline;
}
