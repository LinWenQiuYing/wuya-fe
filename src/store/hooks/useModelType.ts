import type { ModelCode } from "@/client/api/chat";
import { computed } from "vue";
import useUserInfo from "./useUserInfo";

export default function useModelType() {
  const userInfo = useUserInfo();
  return computed<ModelCode | undefined>({
    get() {
      return userInfo.value?.defaultModel;
    },
    set(value) {
      userInfo.value = { ...userInfo.value!, defaultModel: value! };
    },
  });
}
