import { knowledgeSources } from "@/client/const";
import { KnowledgeSourceType } from "@/client/types";
import { ref, watch } from "vue";
import store from "@/store";
import useSourceUnavailable from "@/client/hooks/useSourceUnavailable";
import useActiveModule from "@/client/layout/useActiveModule";

const useSources = () => {
  const sources = ref<KnowledgeSourceType[]>([]);
  const sourceDisableFun = useSourceUnavailable();
  const activeModule = useActiveModule();
  watch(
    [() => store.state.documentQA.knowledgeSource, () => activeModule.value],
    ([knowledgeSource]) => {
      let checkedSources = knowledgeSource.includes(KnowledgeSourceType.ALL)
        ? knowledgeSources
        : knowledgeSource;
      checkedSources = checkedSources.filter((item) => !sourceDisableFun(item));
      sources.value = checkedSources;
    },
    {
      immediate: true,
    },
  );
  return sources;
};

export default useSources;
