import prepareFinancialReport from "@/store/hooks/prepareFinancialReport";
import useFinancialReport from "@/client/hooks/useFinancialReport";
import router from "@/router";
import { getSourcesFile, fileTypes } from "@/client/hooks/sendFinancialReportParams";
import { ElMessage } from "element-plus";

const createFinancialReport = async (question: string) => {
  const { sendFinancialReport } = useFinancialReport();
  const { sources, hasOtherFileType } = getSourcesFile(fileTypes);
  if (sources.length <= 0 || hasOtherFileType)
    return ElMessage.error(
      "请勾选包含资产负债表、利润表和现金流量表的年度财报或季度财报，格式为PDF或者Excel",
    );
  prepareFinancialReport(question);
  await router.push("/financialAnalysis/detail");
  await sendFinancialReport({ query: question, sources }, true).catch(console.error);
};

export default createFinancialReport;
