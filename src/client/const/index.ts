import { KnowledgeSourceType, Language } from "@/client/types";
import type { Component } from "vue";
import BookIcon from "@/client/icons/book.svg";
import RectanglesIcon from "@/client/icons/rectangles.svg";
import UserIcon from "@/client/icons/user-fill-collar.svg";
import BrainIcon from "@/client/icons/brain.svg";
import BuildingIcon2 from "@/client/icons/building2.svg";
import BuildingIcon from "@/client/icons/building.svg";
import DiodesIcon from "@/client/icons/diodes.svg";
import LineChartIcon from "@/client/icons/line-chart.svg";
import ScalesIcon from "@/client/icons/scales.svg";
import HammerIcon from "@/client/icons/hammer.svg";
import EarthIcon from "@/client/icons/earth-LAT-1-LON-2.svg";
import EarthIcon2 from "@/client/icons/earth-LAT-2-LON-2.svg";
import { Condition } from "#condition";
import { Glob } from "@/@types";

export type Source = {
  type: KnowledgeSourceType;
  title: string;
  desc: string;
  icon: {
    pc: Component;
    h5: Component;
  };
};

export const KNOWLEDGE_SOURCE: Source[] = [
  {
    type: KnowledgeSourceType.ALL,
    title: "全部",
    desc: "从互联网和知识库中获取答案",
    icon: { pc: BookIcon, h5: RectanglesIcon },
  },
  {
    type: KnowledgeSourceType.PERSONAL,
    title: "个人",
    desc: "从个人文档构建的知识库中获取答案",
    icon: { pc: UserIcon, h5: BrainIcon },
  },
  {
    type: KnowledgeSourceType.ENTERPRISE,
    title: "企业",
    desc: "从公司内部共享的知识管理系统中检索专业资料",
    icon: { pc: BuildingIcon2, h5: BuildingIcon },
  },

  {
    type: KnowledgeSourceType.FINANCE,
    title: "财经",
    desc: "从企业年报，行业分享报告中获取专业的财经知识",
    icon: { pc: DiodesIcon, h5: LineChartIcon },
  },
  {
    type: KnowledgeSourceType.LAW,
    title: "法律",
    desc: "从法律法规文档中获取专业法律意见",
    icon: { pc: ScalesIcon, h5: HammerIcon },
  },
  {
    type: KnowledgeSourceType.INTERNET,
    title: "互联网",
    desc: "从公开互联网上搜索可用的信息",
    icon: { pc: EarthIcon, h5: EarthIcon2 },
  },
];
export const KNOWLEDGE_SOURCE_TITLE = new Map<KnowledgeSourceType, string>([
  [KnowledgeSourceType.ALL, "全部知识源"],
  [KnowledgeSourceType.PERSONAL, "个人"],
  [KnowledgeSourceType.ENTERPRISE, "企业"],
  [KnowledgeSourceType.FINANCE, "财经"],
  [KnowledgeSourceType.LAW, "法律"],
  [KnowledgeSourceType.INTERNET, "互联网"],
]);

export const treeTagKey = {
  privateTree: KnowledgeSourceType.PERSONAL,
  publicTree: KnowledgeSourceType.ENTERPRISE,
  financeTree: KnowledgeSourceType.FINANCE,
  lawTree: KnowledgeSourceType.LAW,
  internetTree: KnowledgeSourceType.INTERNET,
};

export type TreeRootKeys = keyof typeof treeTagKey;

export const CHAT_BOX_ELEMENT_ID = "chat_box_element_id";
export const INFORMATION_CHAT_BOX_ID = "information_chat_box_id";
export const WRITING_ASSISTANT_CHAT_BOX_ID = "writing_assistant_chat_box_id";
export const dataAnalysisChatId = "dataAnalysisChatId";

export const languageOptions: Array<{ name: string; value: Language }> = [
  {
    name: "中文",
    value: "zh-CN",
  },
  {
    name: "日本語",
    value: "ja",
  },
  {
    name: "English",
    value: "en-US",
  },
];

export const defaultAuditRule = `# 一、合同价款及支付
## （一）复核合同的不含税金额、税金和税率正确与否
复核合同的不含税金额、税金和税率正确与否:
1. 数据公式检验：含税金额=不含税金额+税金 或 含税金额=不含税金额×（1+税率）; 不含税金额=含税金额/（1+税率）;税金=不含税金额×税率; 一般情况下合同含税总价出错的概率较小，主要是不含税金额和税率易出错；
2. 税率匹配校验：对于产品销售合同，包括软件产品和硬件产品，税率应为13%；对于服务销售合同，包括开发服务、咨询服务、驻场运维、维保服务、培训服务等，税率应为6%；
## （二）金额的大小写是否正确和规范
正确的大写数字为：零、壹、贰、叁、肆、伍、陆、柒、捌、玖、拾正确的大写单位为：万、仟、佰、圆、角、分千位符顾名思义是以每一千为划分标准的符号，举例：2,010,000.00
# 二、法务规范
...`;
export const knowledgeSources: KnowledgeSourceType[] = [
  KnowledgeSourceType.PERSONAL,
  KnowledgeSourceType.ENTERPRISE,
  KnowledgeSourceType.FINANCE,
  KnowledgeSourceType.LAW,
  KnowledgeSourceType.INTERNET,
];

export enum AideKey {
  DATA_ANALYSIS = "data_analysis",
  ENTERPRISE_RESEARCH = "enterprise_research",
  CONTRACT_AUDIT = "contract_audit",
  VIDEO_PARSE = "video_parser",
  CUSTOMER_SERVICE = "customer_service",
  FINANCIAL_ANALYSIS = "financial_analysis", //财务审核
  NO_AGENT = "no_agent",
}

export interface AgentItem {
  name: string;
  description: string;
  path: string;
  active?: Condition<Glob>;
  key: AideKey;
  menuNAme: string;
  notOnline?: boolean;
  progressTitle?: string;
  defaultSource: KnowledgeSourceType[];
}

export const aideList: AgentItem[] = [
  {
    name: "数据分析助手",
    menuNAme: "分析",
    description: "结构化数据的深入分析",
    key: AideKey.DATA_ANALYSIS,
    path: "/dataAnalysis",
    progressTitle: "数据解析",
    defaultSource: [],
  },
  {
    name: "尽调助手",
    description: "提供全面的公司和行业调研",
    key: AideKey.ENTERPRISE_RESEARCH,
    path: "/survey",
    menuNAme: "尽调",
    progressTitle: "问题解读",
    defaultSource: [KnowledgeSourceType.INTERNET, KnowledgeSourceType.FINANCE],
  },
  {
    name: "视频解析助手",
    menuNAme: "视频",
    description: "支持Bilibili等视频内容总结",
    path: "/parser",
    key: AideKey.VIDEO_PARSE,
    progressTitle: "问题解读",
    defaultSource: [],
  },
  {
    name: "合同审核",
    menuNAme: "审核",
    description: "行业与自定义规则合同审核",
    path: "/contract",
    key: AideKey.CONTRACT_AUDIT,
    progressTitle: "问题解读",
    defaultSource: [],
  },
  {
    name: "财务审核",
    menuNAme: "财务",
    description: "快速洞察财务报表核心指标",
    key: AideKey.FINANCIAL_ANALYSIS,
    path: "/financialAnalysis",
    progressTitle: "财务解析",
    defaultSource: [],
  },
  {
    name: "无涯客服",
    menuNAme: "客服",
    description: "随时解答无涯产品疑问",
    path: "/customer_service",
    key: AideKey.CUSTOMER_SERVICE,
    progressTitle: "问题解读",
    defaultSource: [],
  },
];
