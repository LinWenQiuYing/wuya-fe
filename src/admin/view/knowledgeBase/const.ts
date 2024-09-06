import { KnowledgeBasePeople } from "@/admin/types";
import BaseInformation from "./components/BaseInformation.vue";
import Author from "./components/Author.vue";
import Document from "./components/Document.vue";
import Section from "./components/Section.vue";
import RelationalGraph from "./relationGraph/index.vue";
import KnowList from "@/admin/view/knowledgeBase/components/KnowList.vue";
import OrganizationList from "@/admin/view/knowledgeBase/components/OrganizationList.vue";

export const KNOWLEDGE_BASE_PEOPLE = new Map<KnowledgeBasePeople, string>([
  [KnowledgeBasePeople.PERSON, "个人"],
  [KnowledgeBasePeople.MANY, "协同"],
]);

export const createKnowProcedure = (repositoryType: number) => {
  const textKnow = [
    {
      title: "导入文档",
      content: Document,
    },
    {
      title: "文档切片",
      content: Section,
    },
  ];

  const grapKnow = [
    {
      title: "定义实体-关系",
      content: RelationalGraph,
    },
  ];

  const baseKnow = [
    {
      title: "基本信息",
      content: BaseInformation,
    },
  ];
  const procedure = repositoryType === 1 ? textKnow : grapKnow;
  return [...baseKnow, ...procedure].concat({
    title: "设置权限",
    content: Author,
  });
};

export const tableFiltertype = [
  {
    label: "PDF",
    value: ["pdfList"],
  },
  {
    label: "docx",
    value: ["docsList"],
  },
  {
    label: "图片",
    value: ["imgList"],
  },
  {
    label: "excel",
    value: ["tableList"],
  },
  {
    label: "其他文件",
    value: ["noneList", "txtList", "pptxList"],
  },
  {
    label: "音视频",
    value: ["mediaList"],
  },
];

export enum StatusNumber {
  waiting = 1,
  uploading = 2,
  upload_Failed = 3,
  uploaded = 4,
  parsing = 5,
  parse_failed = 6,
  parse_success = 7,
  edited = 8,
  saved_failed = 9,
  saved = 10,
}

export const DocUploadStatus = new Map([
  [StatusNumber.waiting, "上传中..."],
  [StatusNumber.uploading, "上传中..."],
  [StatusNumber.upload_Failed, "上传失败"],
  [StatusNumber.uploaded, "上传中..."],
  [StatusNumber.parsing, "上传中..."],
  [StatusNumber.parse_failed, "上传失败"],
  [StatusNumber.parse_success, "上传中..."],
  [StatusNumber.edited, "上传中..."],
  [StatusNumber.saved_failed, "上传失败"],
  [StatusNumber.saved, "上传成功"],
]);

export const knowledgeLeftComponent = [
  {
    key: "knowledge",
    label: "知识库",
    component: KnowList,
  },
  {
    key: "organization",
    label: "组织架构",
    component: OrganizationList,
  },
];

export const filterStatus = [
  {
    text: "上传中",
    value: "processing",
  },
  {
    text: "上传失败",
    value: "fail",
  },
  {
    text: "上传完成",
    value: "success",
  },
];
