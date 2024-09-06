import type { Component } from "vue";
import DocIcon from "@/client/icons/word.svg";
import PDFIcon from "@/client/icons/pdf.svg";

export type ExportTypeCode = "docx" | "pdf";

type ExportType = {
  icon: Component;
  code: ExportTypeCode;
  name: string;
};

// 写作中可导出的类型
const exportableTypes: ExportType[] = [
  {
    icon: DocIcon,
    code: "docx",
    name: "docx文件",
  },
  {
    icon: PDFIcon,
    code: "pdf",
    name: "pdf文件",
  },
];

export default exportableTypes;
