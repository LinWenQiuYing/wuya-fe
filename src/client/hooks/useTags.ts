import { ref } from "vue";
import { KnowledgeSourceType } from "../types";
import { Store } from "vuex";
import { StoreState } from "@/store";

import { CheckIdState } from "@/store/modules/documentQA";
import useSources from "@/client/hooks/useSources";

export const useTagsHook = (store: Store<StoreState>) => {
  const dataSourceIds = ref<CheckIdState[]>([]);
  const sources = useSources();

  //设置选中知识源的id
  const setCheckedDataSourceIds = (val: CheckIdState[]) => {
    store.commit("documentQA/SET_CURRENT_DATASOURCE_IDS", val);
  };

  //获取选择知识源的id
  const getCheckedDataSourceIds = () => {
    dataSourceIds.value = store.state.documentQA.currentKnowledgeSourceIds;
    return dataSourceIds.value;
  };

  //获取选中知识源类型，转化为后端需要的值
  const getCheckKnowStr = (): string[] => {
    // 发送问题是传递的数据源(知识库层级数据)
    let knowledgeSource: KnowledgeSourceType[] = sources.value;
    knowledgeSource = knowledgeSource.filter(
      (item) => ![KnowledgeSourceType.PERSONAL, KnowledgeSourceType.ENTERPRISE].includes(item),
    );
    return knowledgeSource;
  };

  return {
    setCheckedDataSourceIds,
    getCheckedDataSourceIds,
    getCheckKnowStr,
  };
};
