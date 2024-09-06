import EditIcon from "@/client/icons/pencil-line.svg";
import { Component } from "vue";
import PreviewIcon from "@/client/icons/doc-eye-outline.svg";
import ExportIcon from "@/client/icons/square-outline-arrow-top.svg";

// 变换动作
export type TransformActionCode = "edit" | "preview" | "export";

export type TransformAction = {
  name: string;
  icon: Component;
  code: TransformActionCode;
};

export const editAction: TransformAction = {
  name: "编辑",
  code: "edit",
  icon: EditIcon,
};

export const previewAction: TransformAction = {
  code: "preview",
  name: "预览",
  icon: PreviewIcon,
};

export const exportAction: TransformAction = {
  code: "export",
  name: "导出",
  icon: ExportIcon,
};
