import { computed } from "vue";
import useUserInfo from "@/store/hooks/useUserInfo";
import { updateDefaultSources } from "@/client/api/user";
import { ResponseBody } from "@/sign/api/sign";
import { ElMessage } from "element-plus";

export const parseSources = (value: string | null | undefined): string[] | null => {
  const valueWithDefault = value || "";
  return valueWithDefault === "" ? null : valueWithDefault.split(",");
};

export default function useDefaultSources() {
  const userInfo = useUserInfo();
  return computed<string[] | null>({
    get() {
      return parseSources(userInfo?.value?.defaultKnowledgeSource);
    },
    set(sources) {
      const defaultKnowledgeSource = sources ? sources.join(",") : "";
      if (defaultKnowledgeSource === userInfo?.value?.defaultKnowledgeSource) return;
      updateDefaultSources(defaultKnowledgeSource).then(
        () => {
          userInfo.value = { ...userInfo.value!, defaultKnowledgeSource };
          ElMessage.success("默认知识源更新成功");
        },
        (err: ResponseBody<null>) => {
          ElMessage.error(err);
        },
      );
    },
  });
}
