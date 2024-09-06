import { watch } from "vue";
import useActiveModule from "@/client/layout/useActiveModule";
import { Ref } from "vue";
import { ElTree } from "element-plus";
import { KnowledgeSourceType } from "@/client/types";
import useSources from "@/client/hooks/useSources";

const useCheckSource = (treeRef: Ref<InstanceType<typeof ElTree> | undefined>) => {
  const activeModule = useActiveModule();
  const sources = useSources();
  watch(
    () => activeModule.value,
    () => {
      if (treeRef.value) {
        const checkedNodes = treeRef.value.getCheckedNodes();
        const filterCheckedNodes = checkedNodes.filter((node) =>
          sources.value.includes(node.type as KnowledgeSourceType),
        );
        treeRef.value.setCheckedKeys(filterCheckedNodes.map((item: Record<string, string>) => item.id));
      }
    },
  );
};
export default useCheckSource;
