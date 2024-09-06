import prepareChat from "@/store/hooks/prepareChat";
import useSendQuestion from "@/client/hooks/useSendQuestion";
import useClearChat from "@/store/hooks/useClearChat";
import router from "@/router";
import preSendHandleAgent from "@/client/hooks/preSendHandleAgent";
import { AideKey } from "@/client/const";
import store from "@/store";
import { getCheckedFile } from "@/client/hooks/sendAnalysisParams";
import { getSourcesFile, fileTypes } from "@/client/hooks/sendFinancialReportParams";
import { ElMessage } from "element-plus";
import clearNewsId from "@/store/hooks/clearNewsId";
import beforeConfirm from "@/client/hooks/beforeConfirm";
import verifyDoc from "@/client/hooks/verifyDoc";
import useTree from "@/client/hooks/useTree";
import { ChatParams } from "@/client/types/api";
import { CheckIdState } from "@/store/modules/documentQA";

// 创建新聊天话题(用指定问题开始当前话题)
const createChatTopic = async (question: string, options?: { rule?: string; key?: string }) => {
  const { isCheckSource } = useTree();
  const currentAgent = store.state.agent.type;
  let contractSource;
  let source;
  let files: string[] = []; // 数据分析需传递的文件fileUuid
  let sources: CheckIdState[] = []; // 财务审核传递的sources参数
  // 合同审核
  if (currentAgent === AideKey.CONTRACT_AUDIT) {
    contractSource = verifyDoc(["docx", "pdf"], "请选择一份docx或pdf文件");
    if (!contractSource) return;
  }
  if (currentAgent === AideKey.VIDEO_PARSE && isCheckSource()) {
    source = verifyDoc(["avi", "mp4", "flv", "wmv", "mkv", "weba"], "仅支持勾选一个视频");
    if (!source) return;
  }
  // 数据分析
  if (currentAgent === AideKey.DATA_ANALYSIS) {
    const data = getCheckedFile(["xlsx", "csv"]);
    files = data.files;
    if (files.length <= 0 || data.hasOtherFileType) return ElMessage.error("仅支持xlsx和csv格式文件");
  }
  //财务审核
  if (currentAgent === AideKey.FINANCIAL_ANALYSIS) {
    const data = getSourcesFile(fileTypes);
    if (data.sources.length <= 0 || data.hasOtherFileType)
      return ElMessage.error(
        "请勾选包含资产负债表、利润表和现金流量表的年度财报或季度财报，格式为PDF或者Excel",
      );
    sources = data.sources;
  }
  const { send, stop } = useSendQuestion();
  const { clearChat } = useClearChat();
  clearChat();
  stop();
  prepareChat(question);
  clearNewsId();
  const agent = await preSendHandleAgent();

  await router.push("/qa");
  if (agent === AideKey.ENTERPRISE_RESEARCH) {
    await beforeConfirm(question, options?.rule).catch(console.error);
  } else {
    const params: ChatParams = {
      query: question,
      chat_agent: agent,
      contract_source: contractSource,
      audit_rule: options?.rule,
      files,
      video_source: source,
      key: options?.key,
    };
    if (currentAgent === AideKey.FINANCIAL_ANALYSIS) {
      params.sources = sources;
    }
    await send(params, true).catch(console.error);
  }
};

export default createChatTopic;
