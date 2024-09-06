import type { Ref } from "vue";

export default function useOffline(): Ref<boolean> {
  return {
    get value() {
      return !navigator.onLine;
    },
  };
}
