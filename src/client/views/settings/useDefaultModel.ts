import { computed } from "vue";
import useUserInfo from "@/store/hooks/useUserInfo";
import { updateDefaultModel } from "@/client/api/user";
import { ElMessage } from "element-plus";

export default function useDefaultModel() {
  const userInfo = useUserInfo();
  return computed({
    get() {
      return userInfo.value?.defaultModel;
    },
    set(value) {
      if (!value) return;
      updateDefaultModel(value)
        .then(() => {
          userInfo.value = { ...userInfo.value!, defaultModel: value };
          ElMessage.success("默认模型更新成功");
        })
        .catch(ElMessage.error);
    },
  });
}
