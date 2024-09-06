import prepareDataAnalysis from "@/store/hooks/prepareDataAnalysis";
import useDataAnalysis from "@/client/hooks/useDataAnalysis";
import router from "@/router";
import { getCheckedFile } from "@/client/hooks/sendAnalysisParams";
import { ElMessage } from "element-plus";

const createDataAnalysis = async (question: string) => {
  const { files, hasOtherFileType } = getCheckedFile(["xlsx", "csv"]);
  if (files.length <= 0 || hasOtherFileType) return ElMessage.error("仅支持xlsx和csv格式文件");
  const { sendDataAnalysis } = useDataAnalysis();
  prepareDataAnalysis(question);
  await router.push("/dataAnalysis/detail");
  await sendDataAnalysis({ query: question, files }, true).catch(console.error);
};

export default createDataAnalysis;
