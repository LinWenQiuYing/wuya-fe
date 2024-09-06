import { KnowledgeSourceType } from "@/client/types";
import useDefaultLanguage from "@/client/views/settings/useDefaultLanguage";
import useActiveModule from "@/client/layout/useActiveModule";

// 判断数据源是否可用
const useSourceUnavailable = () => {
  const defaultLanguage = useDefaultLanguage();
  const activeModule = useActiveModule();
  return (type: KnowledgeSourceType) => {
    return (
      ["ja", "en-US"].includes(defaultLanguage.value) &&
      type === KnowledgeSourceType.FINANCE &&
      !["survey", "dataAnalysis"].includes(activeModule.value)
    );
  };
};

export default useSourceUnavailable;
