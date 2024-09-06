import { ChatTreeNode } from "@/client/types/api";
import store from "@/store";
import useChatDetail from "./useChatDetail";
import { useRouter } from "vue-router";
import { AideKey } from "@/client/const";
import useDefaultAgentType from "@/client/views/settings/useDefaultAgentType";
import {
  AnalysisRecordState,
  AuditRecordState,
  ChatDataState,
  RecordState,
  ServiceRecordState,
  SurveyRecordState,
  VideoRecordState,
} from "@/client/types/chat";
import { WritingRecord } from "@/store/modules/chat";

export default function useJumpRoute() {
  const { getDetail } = useChatDetail();
  const router = useRouter();
  const { defaultAgentType, setDefaultAgentType } = useDefaultAgentType();
  const goWrite = async (chatData: WritingRecord[], data: ChatTreeNode) => {
    const topicId = data.id;
    store.commit("chat/SET_WRITE_QUESTION", data.title_name);
    store.commit("chat/SET_WRITE_DATA", chatData);
    await router.push(`/writing/topic/${topicId}`);
  };
  const getAllAgentTypeSame = (chatData: ChatDataState[]) => {
    const firstItemType = chatData[0].answer.agentType;
    return chatData.every((item) => item.answer.agentType === firstItemType);
  };
  const goQa = async (chatData: ChatDataState[], data: ChatTreeNode) => {
    const type = chatData[0].answer.agentType;
    if (getAllAgentTypeSame(chatData) && type !== AideKey.NO_AGENT) {
      switch (type) {
        case AideKey.DATA_ANALYSIS:
          await goDataAnalysis(chatData, data);
          break;
        case AideKey.CONTRACT_AUDIT:
          await goAudit(chatData, data);
          break;
        case AideKey.ENTERPRISE_RESEARCH:
          await goSurvey(chatData, data);
          break;
        case AideKey.VIDEO_PARSE:
          await goVideo(chatData, data);
          break;
        case AideKey.CUSTOMER_SERVICE:
          await goService(chatData, data);
          break;
        case AideKey.FINANCIAL_ANALYSIS:
          await goFinancialAnalysis(chatData, data);
          break;
      }
    } else {
      store.commit("chat/SET_QUESTION", data.title_name);
      store.commit("chat/SET_CHAT_DATA", chatData);
      if (data.topic_type === 3) {
        const newsId = chatData[0].newsId;
        store.commit("documentQA/SET_NEWS_ID", newsId);
        await router.push("/qa?backtrack=store");
      } else {
        await router.push("/qa");
      }
    }
  };

  const goSurvey = async (chatData: RecordState<SurveyRecordState>[], data: ChatTreeNode) => {
    if (!defaultAgentType.value.includes(AideKey.ENTERPRISE_RESEARCH)) {
      await setDefaultAgentType(defaultAgentType.value.concat(AideKey.ENTERPRISE_RESEARCH));
    }
    store.commit("chat/SET_SURVEY_QUESTION", data.title_name);
    store.commit("chat/SET_SURVEY_DATA", chatData);
    await router.push("/survey/detail");
  };

  const goVideo = async (chatData: RecordState<VideoRecordState>[], data: ChatTreeNode) => {
    if (!defaultAgentType.value.includes(AideKey.VIDEO_PARSE)) {
      await setDefaultAgentType(defaultAgentType.value.concat(AideKey.VIDEO_PARSE));
    }
    store.commit("chat/SET_VIDEO_QUESTION", data.title_name);
    store.commit("chat/SET_VIDEO_DATA", chatData);
    await router.push("/parser/detail");
  };

  const goService = async (chatData: RecordState<ServiceRecordState>[], data: ChatTreeNode) => {
    if (!defaultAgentType.value.includes(AideKey.CUSTOMER_SERVICE)) {
      await setDefaultAgentType(defaultAgentType.value.concat(AideKey.CUSTOMER_SERVICE));
    }
    store.commit("chat/SET_SERVICE_QUESTION", data.title_name);
    store.commit("chat/SET_SERVICE_DATA", chatData);
    await router.push("/customer_service/detail");
  };

  const goAudit = async (chatData: RecordState<AuditRecordState>[], data: ChatTreeNode) => {
    if (!defaultAgentType.value.includes(AideKey.CONTRACT_AUDIT)) {
      await setDefaultAgentType(defaultAgentType.value.concat(AideKey.CONTRACT_AUDIT));
    }
    store.commit("chat/SET_AUDIT_QUESTION", data.title_name);
    store.commit("chat/SET_AUDIT_DATA", chatData);
    await router.push("/contract/detail");
  };

  const goDataAnalysis = async (chatData: RecordState<AnalysisRecordState>[], data: ChatTreeNode) => {
    if (!defaultAgentType.value.includes(AideKey.DATA_ANALYSIS)) {
      await setDefaultAgentType(defaultAgentType.value.concat(AideKey.DATA_ANALYSIS));
    }
    store.commit("chat/SET_DATA_ANALYSIS_QUESTION", data.title_name);
    store.commit("chat/SET_DATA_ANALYSIS_DATA", chatData);
    await router.push("/dataAnalysis/detail");
  };
  const goFinancialAnalysis = async (chatData: RecordState<AnalysisRecordState>[], data: ChatTreeNode) => {
    if (!defaultAgentType.value.includes(AideKey.FINANCIAL_ANALYSIS)) {
      await setDefaultAgentType(defaultAgentType.value.concat(AideKey.FINANCIAL_ANALYSIS));
    }
    store.commit("chat/SET_FINANCIAL_REPORT_QUESTION", data.title_name);
    store.commit("chat/SET_FINANCIAL_REPORT", chatData);
    await router.push("/financialAnalysis/detail");
  };
  const getHistoryDetail = async (data: ChatTreeNode) => {
    store.commit("chat/SET_CHAT_ID", data.id);
    const { chatData } = await getDetail(data.id, data.topic_type);
    switch (data.topic_type) {
      case 1:
      case 3:
        await goQa(chatData as ChatDataState[], data);
        break;
      case 2:
        await goWrite(chatData as WritingRecord[], data);
    }
    store.commit("chat/TOGGLE_STARTCHAT", false);
  };

  return { getHistoryDetail };
}
