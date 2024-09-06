import useActiveModule from "@/client/layout/useActiveModule";
import { computed } from "vue";
import { aideList } from "@/client/const";

/**
 * 助手的默认知识源
 * 使用助手有两种模式，一是通过菜单选择某一个助手 二是首页输入框@了某个助手
 * 此函数只考虑第一种情况
 */
export default function useDefaultAgentSource() {
  const activeModule = useActiveModule();
  const inAgentModule = computed(() =>
    ["survey", "dataAnalysis", "contract", "parser", "customer_service", "financialAnalysis"].includes(
      activeModule.value,
    ),
  );
  return computed(() => {
    if (inAgentModule.value) {
      const current = aideList.find((aide) => {
        const path = aide.path.split("/").pop();
        return path === activeModule.value;
      });
      return current?.defaultSource ?? [];
    }
    return null;
  });
}
