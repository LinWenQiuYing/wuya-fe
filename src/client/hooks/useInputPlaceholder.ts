import { computed } from "vue";
import { useRoute } from "vue-router";

const defaultPlaceholder = "您可以问任何问题, 也可以随时@小助手";
const analysisPlaceholder = "我是数据分析助手，可以深入研究xlsx和csv格式数据，快速给出解答";
const useInputPlaceholder = () => {
  const route = useRoute();
  const placeholder = computed(() => {
    const path = route.path.split("/")[1];
    if (path === "dataAnalysis") {
      return analysisPlaceholder;
    }
    return defaultPlaceholder;
  });
  return placeholder;
};

export default useInputPlaceholder;
