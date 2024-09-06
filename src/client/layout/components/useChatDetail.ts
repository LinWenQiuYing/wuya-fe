import { getChatDetail } from "@/client/api/history";
import { AideKey } from "@/client/const";
import { ChatDetail, ChatParams } from "@/client/types/api";
import {
  AnalysisAnswer,
  AnalysisRecordState,
  AuditAnswer,
  AuditRecordState,
  ChatDataState,
  QaAnswer,
  QaRecordState,
  RecordState,
  ServiceAnswer,
  ServiceRecordState,
  SurveyAnswer,
  SurveyRecordState,
  VideoAnswer,
  VideoRecordState,
} from "@/client/types/chat";
import { SurveyParams } from "@/client/views/survey/hooks/useSurvey";
import { AuditParams } from "@/client/views/audit/useSendAudit";
import { DataAnalysisParams } from "@/client/hooks/useDataAnalysis";
import formatAuditResult from "@/client/views/audit/formatAuditResult";
import formatSurveyResult from "@/client/utils/formatSurveyResult";
import formatAnalysisResult from "@/client/utils/formatAnalysisResult";
import formatWriteResult from "@/client/views/writing/formatWriteResult";
import { formatQaResult } from "@/client/utils/formatQaResult";
import { WritingEventStreamMessage, WritingRecord } from "@/store/modules/chat";
import { WriteQuery } from "@/client/views/writing/useWriting";
import formatVideoResult from "@/client/views/video/formatVideoResult";
import formatServiceResult from "@/client/views/customerService/formatServiceResult";

function useChatDetail() {
  /**
   * topicType: 1为首页问答 2写作问答 3新闻资讯
   */
  const getDetail = async (topic_id: number, topicType: number) => {
    const result = await getChatDetail(topic_id).catch(console.error);
    const chatData = result ? formatChatData(result, topicType) : null;
    return {
      chatData,
    };
  };
  return {
    getDetail,
  };
}

export default useChatDetail;

type AllAnswerState = QaAnswer | WritingEventStreamMessage | SurveyAnswer | AnalysisAnswer | AuditAnswer;
const formatChatData = (data: ChatDetail[], topicType: number) => {
  return data.map((item) => {
    const a_parm = <AllAnswerState[]>JSON.parse(item.a_parm);
    const q_parm = <ChatParams | SurveyParams | AuditParams | DataAnalysisParams | WriteQuery>(
      JSON.parse(item.q_parm)
    );
    let newsId;
    if ("sources" in q_parm) {
      const id = q_parm.sources
        ?.filter((source) => typeof source === "string")
        .find((source) => source.includes("news-"));
      if (id) {
        newsId = id.split("news-").pop();
      }
    }
    const topicId = item.topic_id;
    const recordId = item.id;
    const record: ChatDataState | WritingRecord = {
      question: q_parm.query,
      answer: {
        isProgress: true,
        agentType: item.agent_type,
      },
      topicId,
      recordId,
      newsId,
      commentOn: item.comment_on,
      comment: item.comment,
    };
    if (a_parm) {
      switch (item.agent_type) {
        case AideKey.CONTRACT_AUDIT:
          (<AuditAnswer[]>a_parm).forEach((item) => {
            formatAuditResult(item, <RecordState<AuditRecordState>>record);
          });
          break;
        case AideKey.ENTERPRISE_RESEARCH:
          (<SurveyAnswer[]>a_parm).forEach((item) => {
            formatSurveyResult(item, <RecordState<SurveyRecordState>>record);
          });
          break;
        case AideKey.DATA_ANALYSIS:
        case AideKey.FINANCIAL_ANALYSIS:
          (<AnalysisAnswer[]>a_parm).forEach((item) => {
            formatAnalysisResult(item, <RecordState<AnalysisRecordState>>record);
          });
          break;
        case AideKey.VIDEO_PARSE:
          (<VideoAnswer[]>a_parm).forEach((item) => {
            formatVideoResult(item, <RecordState<VideoRecordState>>record);
          });
          break;
        case AideKey.CUSTOMER_SERVICE:
          (<ServiceAnswer[]>a_parm).forEach((item) => {
            formatServiceResult(item, <RecordState<ServiceRecordState>>record);
          });
          break;
        default:
          if (topicType === 2) {
            (<WritingEventStreamMessage[]>a_parm).forEach((item) => {
              formatWriteResult(item, <WritingRecord>record);
            });
          } else {
            (<QaAnswer[]>a_parm).forEach((item) => {
              formatQaResult(item, <RecordState<QaRecordState>>record);
            });
          }
      }
    }
    if (!("answerStatus" in record.answer)) record.answer.answerStatus = 1;
    return record;
  });
};
