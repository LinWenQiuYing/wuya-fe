import { computed } from "vue";
import useUserInfo from "@/store/hooks/useUserInfo";
import { updateReferencesLimit } from "@/client/api/user";
import { ReferencesLimit, ResponseBody, UserInfo } from "@/sign/api/sign";
import { ElMessage } from "element-plus";

const getUserInfoReferencesLimit = (userInfo: UserInfo | null): ReferencesLimit => {
  return userInfo?.maxSource || 20;
};
export default function useReferencesLimit() {
  const userInfo = useUserInfo();

  return computed<ReferencesLimit>({
    get() {
      return getUserInfoReferencesLimit(userInfo.value);
    },
    set(value) {
      if (value === getUserInfoReferencesLimit(userInfo.value)) return;
      updateReferencesLimit(value).then(
        () => {
          userInfo.value = { ...userInfo.value!, maxSource: value };
          ElMessage.success("参考来源数量更新成功");
        },
        (err: ResponseBody<null>) => {
          ElMessage.error(err);
        },
      );
    },
  });
}
