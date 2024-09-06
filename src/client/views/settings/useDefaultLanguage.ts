import { computed } from "vue";
import useUserInfo from "@/store/hooks/useUserInfo";
import { updateProfileColumn } from "@/client/api/user";
import { ElMessage } from "element-plus";
import { Language } from "@/client/types";

const defaultLanguage = "default_language";
export default function useDefaultLanguage() {
  const userInfo = useUserInfo();
  return computed({
    get(): Language {
      return userInfo.value?.defaultLanguage ?? "zh-CN";
    },
    set(value: Language) {
      if (!value) return;
      updateProfileColumn(defaultLanguage, value)
        .then(() => {
          userInfo.value = { ...userInfo.value!, defaultLanguage: value };
          ElMessage.success("默认语言更新成功");
        })
        .catch(ElMessage.error);
    },
  });
}
