import { Set_User } from "../modules/sign";
import store from "..";
import { UserInfo } from "@/sign/api/sign";
import { computed } from "vue";

export default function useUserInfo() {
  return computed<UserInfo | null>({
    get() {
      return store.state.sign.userInfo;
    },
    set(userInfo) {
      store.commit(`sign/${Set_User}`, userInfo);
    },
  });
}

// 匿名模式（未登录，有游客模式token）
export const isAnonymous = computed(() => {
  const userInfo = store.state.sign.userInfo;
  return (
    userInfo !== null && (userInfo.username === "anonymous" || userInfo.id === -1 || userInfo.status === 4)
  );
});

// 所有未登录状态（后续会取消userInfo.id为null的情况）
export const isUnSigned = computed(() => {
  const userInfo = store.state.sign.userInfo;
  return userInfo === null || typeof userInfo.id !== "number" || isAnonymous.value;
});
