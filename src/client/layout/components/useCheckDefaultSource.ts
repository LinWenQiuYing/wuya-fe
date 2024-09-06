import useDefaultSources from "@/client/views/settings/useDefaultSources";
import { KnowledgeSourceType } from "@/client/types";
import store from "@/store";
import { knowledgeSources } from "@/client/const";
import useSourceUnavailable from "@/client/hooks/useSourceUnavailable";
import useDefaultAgentSource from "@/client/layout/useDefaultAgentSource";

const useCheckDefaultSource = () => {
  const defaultSources = (useDefaultSources().value ?? []) as KnowledgeSourceType[];
  const sourceDisableFun = useSourceUnavailable();
  const agentSources = useDefaultAgentSource();
  return () => {
    let needCheckDefaultSources = agentSources.value || defaultSources;
    store.commit("documentQA/SET_KNOWLEDGE_SOURCE", needCheckDefaultSources);
    if (needCheckDefaultSources.includes(KnowledgeSourceType.ALL)) {
      needCheckDefaultSources = knowledgeSources;
    }
    return needCheckDefaultSources.filter((item) => !sourceDisableFun(item));
  };
};

export default useCheckDefaultSource;
