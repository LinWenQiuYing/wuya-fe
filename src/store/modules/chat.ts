import { Module } from "vuex";
import { StoreState } from "@/store";
import { KnowledgeData } from "@/client/types/api";
import {
  AnalysisRecordState,
  AuditRecordState,
  ChatDataState,
  RecordState,
  ServiceRecordState,
  SurveyRecordState,
  VideoRecordState,
} from "@/client/types/chat";
import { AideKey } from "@/client/const";

// 大纲片段
export type OutlineFragment = { outline: string | null };
// 广西片段
export type TextFragment = { text: string | null };
// 描述解读进度的结构
export type AgentProgress = {
  action: string;
  active_message: string | null;
  complete_message: string | null;
  data: string[] | null;
};
// 进度消息
export type AgentMessage = {
  agent: AgentProgress;
};
// 单个文档引用的结构
export type DocumentReference = {
  uid: string;
  content: string;
};
// 返回的文档引用列表
export type ReferencesMessage = {
  reference: DocumentReference[];
};
// 引文信息
export type CitationsMessage = {
  text: string;
  citations: number[];
};
// 会话ID
export type TopicID = { topic_id: number; record_id: number };

export type SuccessMessage = { status: "ok" };
export type ErrorMessage = { status: "error"; detail: string };
// 状态消息
export type StatusMessage = SuccessMessage | ErrorMessage;
// 写作的服务端推送事件消息
export type WritingEventStreamMessage =
  | OutlineFragment
  | TextFragment
  | AgentMessage
  | ReferencesMessage
  | CitationsMessage
  | StatusMessage
  | TopicID;

// 写作的回答
export type WritingAnswer = {
  outline?: string;
  reference?: DocumentReference[];
  text?: string;
  isProgress: boolean;
  // 是否手动中止, true表示已被手动中止
  answerStop: boolean;
  progress: AgentProgress[];
  // 标识流是否输出完毕
  // 1: 输出成功
  // 0: 输出失败
  answerStatus?: 0 | 1;
  agent_type?: string;
  error?: string;
};

// 写作记录
export type WritingRecord = {
  recordId: number | null;
  question: string;
  editing?: boolean;
  topicId?: number;
  answer: WritingAnswer;
};

export type ChatState = {
  isStartChat: boolean;
  isStop: boolean;
  question: string;
  chat_id: number | null;
  sources: KnowledgeData | null;
  showDrawer: boolean;
  drawerType: string;
  cmd: string;
  graphName: string;
  chatData: ChatDataState[];
  writeQuestion: string;
  writeData: WritingRecord[];
  surveyQuestion: string;
  surveyData: RecordState<SurveyRecordState>[];
  dataAnalysisQuestion: string;
  dataAnalysisData: RecordState<AnalysisRecordState>[];
  auditQuestion: string;
  auditData: RecordState<AuditRecordState>[];
  videoQuestion: string;
  videoData: RecordState<VideoRecordState>[];
  serviceQuestion: string;
  serviceData: RecordState<ServiceRecordState>[];
  financialReportQuestion: string;
  financialReportData: RecordState<AnalysisRecordState>[];
};
const state: ChatState = {
  //新版用户端需要数据
  isStartChat: false, //true代表开始false代表结束
  isStop: false, //是否是手动停止true为是
  question: "", //智能写作问题
  chat_id: null, //对话id
  sources: null, //知识源第一层数据
  showDrawer: false, //预览抽屉
  drawerType: "", // 抽屉类型
  cmd: "", //当前图谱cmd
  graphName: "", //当前图谱名称
  chatData: [], //智能问答的数据
  writeQuestion: "", //写作助手问题
  writeData: [], //写作助手的数据
  surveyQuestion: "", //尽调助手问题
  surveyData: [], //尽调助手的数据
  dataAnalysisQuestion: "", //数据分析问题
  dataAnalysisData: [], //数据分析的数据
  auditQuestion: "", // 合同审核助手问题
  auditData: [], // 合同审核助手数据
  videoQuestion: "", // 视频解析问题
  videoData: [], // 视频解析数据
  serviceQuestion: "", // 客服问题
  serviceData: [], // 客服数据
  financialReportQuestion: "", //财报分析
  financialReportData: [], //财报分析会话数据
};

export default {
  namespaced: true,
  state,
  mutations: {
    TOGGLE_STARTCHAT(state, payload: boolean) {
      state.isStartChat = payload;
    },
    SET_IS_STOP(state, payload: boolean) {
      state.isStop = payload;
    },
    SET_CHAT_DATA(state, payload: ChatDataState[]) {
      state.chatData = payload;
    },
    // 重置聊天会话, 新的问答将出现在新的话题(topic)中
    RESET_CHAT_SESSION(state) {
      state.chat_id = null;
      state.question = "";
      state.chatData = [];
    },
    // 准备一个新的问答
    PREPARE_CHAT(state, questionArr: [string, AideKey]) {
      const [question, agentType] = questionArr;
      state.question = question;
      state.chatData = [
        ...state.chatData,
        {
          question,
          answer: {
            agentType,
            isProgress: false,
            answerStop: false,
            progress: [],
          },
        },
      ];
    },
    SET_QUESTION(state, payload: string) {
      state.question = payload;
    },
    SET_CHAT_ID(state, payload: number) {
      state.chat_id = payload;
    },
    SET_SOURCES(state, payload: KnowledgeData) {
      state.sources = payload;
    },
    SET_SHOW_DRAWER(state, payload: boolean) {
      state.showDrawer = payload;
    },
    SET_DRAWER_TYPE(state, payload: string) {
      state.drawerType = payload;
    },
    SET_CMD(state, payload: string) {
      state.cmd = payload;
    },
    SET_GRAPH_NAME(state, payload: string) {
      state.graphName = payload;
    },
    SET_WRITE_DATA(state, payload: WritingRecord[]) {
      state.writeData = payload;
    },
    SET_WRITE_QUESTION(state, payload: string) {
      state.writeQuestion = payload;
    },
    // 重置写作会话(session), 新的写作将出现在新的话题(topic)中
    RESET_WRITE_SESSION(state) {
      state.chat_id = null;
      state.writeQuestion = "";
      state.writeData = [];
    },
    // 准备一个新的写作
    PREPARE_WRITE(state, question: string) {
      state.writeQuestion = question;
      state.writeData = [
        ...state.writeData,
        {
          question,
          recordId: null,
          answer: {
            isProgress: false,
            answerStop: false,
            progress: [],
          },
        },
      ];
    },
    SET_SURVEY_DATA(state, payload: RecordState<SurveyRecordState>[]) {
      state.surveyData = payload;
    },
    SET_SURVEY_QUESTION(state, payload: string) {
      state.surveyQuestion = payload;
    },
    // 重置尽调会话(session), 新的尽调将出现在新的话题(topic)中
    RESET_SURVEY_SESSION(state) {
      state.chat_id = null;
      state.surveyQuestion = "";
      state.surveyData = [];
    },
    // 准备一个新的尽调
    PREPARE_SURVEY(state, params: string[]) {
      const [question, outline] = params;
      state.surveyQuestion = question;
      state.surveyData = [
        ...state.surveyData,
        {
          question,
          answer: {
            outline,
            isProgress: false,
            answerStop: false,
            progress: [],
          },
        },
      ];
    },
    SET_DATA_ANALYSIS_DATA(state, payload: RecordState<AnalysisRecordState>[]) {
      state.dataAnalysisData = payload;
    },
    SET_DATA_ANALYSIS_QUESTION(state, payload: string) {
      state.dataAnalysisQuestion = payload;
    },
    // 重置数据分析会话(session), 新的数据分析将出现在新的话题(topic)中
    RESET_DATA_ANALYSIS_SESSION(state) {
      state.chat_id = null;
      state.dataAnalysisQuestion = "";
      state.dataAnalysisData = [];
    },
    // 准备一个新的数据分析
    PREPARE_DATA_ANALYSIS(state, question: string) {
      state.dataAnalysisQuestion = question;
      state.dataAnalysisData = [
        ...state.dataAnalysisData,
        {
          question,
          answer: {
            isProgress: false,
            answerStop: false,
            progress: [],
          },
        },
      ];
    },
    // 重置合同审核助手会话
    RESET_AUDIT_SESSION(state) {
      state.chat_id = null;
      state.auditQuestion = "";
      state.auditData = [];
    },
    // 准备一个新的合同审核助手
    PREPARE_AUDIT(state, question: string) {
      state.auditQuestion = question;
      state.auditData = [
        ...state.auditData,
        {
          question,
          answer: {
            isProgress: false,
            answerStop: false,
            progress: [],
          },
        },
      ];
    },
    SET_AUDIT_DATA(state, payload: RecordState<AuditRecordState>[]) {
      state.auditData = payload;
    },
    SET_AUDIT_QUESTION(state, payload: string) {
      state.auditQuestion = payload;
    },
    // 重置视频解析助手
    RESET_VIDEO_SESSION(state) {
      state.chat_id = null;
      state.videoQuestion = "";
      state.videoData = [];
    },
    // 准备一个新的视频解析对话
    PREPARE_VIDEO(state, question: string) {
      state.videoQuestion = question;
      state.videoData = [
        ...state.videoData,
        {
          question,
          answer: {
            isProgress: false,
            answerStop: false,
            progress: [],
          },
        },
      ];
    },
    SET_VIDEO_DATA(state, payload: RecordState<VideoRecordState>[]) {
      state.videoData = payload;
    },
    SET_VIDEO_QUESTION(state, payload: string) {
      state.videoQuestion = payload;
    },
    // 重置视频解析助手
    RESET_SERVICE_SESSION(state) {
      state.chat_id = null;
      state.serviceQuestion = "";
      state.serviceData = [];
    },
    // 准备一个新的视频解析对话
    PREPARE_SERVICE(state, question: string) {
      state.serviceQuestion = question;
      state.serviceData = [
        ...state.serviceData,
        {
          question,
          answer: {
            isProgress: false,
            answerStop: false,
            progress: [],
          },
        },
      ];
    },
    SET_SERVICE_DATA(state, payload: RecordState<ServiceRecordState>[]) {
      state.serviceData = payload;
    },
    SET_SERVICE_QUESTION(state, payload: string) {
      state.serviceQuestion = payload;
    },

    //准备一个新的财报分析助手
    PREPARE_FINANCIAL_REPORT(state, question: string) {
      state.financialReportQuestion = question;
      state.financialReportData = [
        ...state.financialReportData,
        {
          question,
          answer: {
            isProgress: false,
            answerStop: false,
            progress: [],
          },
        },
      ];
    },
    SET_FINANCIAL_REPORT(state, payload: RecordState<AnalysisRecordState>[]) {
      state.financialReportData = payload;
    },
    SET_FINANCIAL_REPORT_QUESTION(state, payload: string) {
      state.financialReportQuestion = payload;
    },
    // 重置财务分析会话(session)
    RESET_FINANCIAL_REPORT_SESSION(state) {
      state.chat_id = null;
      state.financialReportQuestion = "";
      state.financialReportData = [];
    },
  },
} satisfies Module<ChatState, StoreState>;
