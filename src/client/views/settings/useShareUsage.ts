import { computed } from "vue";
import useUserInfo from "@/store/hooks/useUserInfo";
import { toggleShareUsage } from "@/client/api/user";
import { ResponseBody } from "@/sign/api/sign";
import { ElMessage } from "element-plus";

export default function useShareUsage() {
  const userInfo = useUserInfo();
  return computed({
    get() {
      return userInfo.value?.useHistoryData ?? true;
    },
    set(value) {
      toggleShareUsage(value).then(
        () => {
          // ElMessage.success("是否保留使用数据修改成功");
          userInfo.value = { ...userInfo.value!, useHistoryData: value };
        },
        (err: ResponseBody<null>) => {
          ElMessage.error(err);
        },
      );
    },
  });
}
