import { Component } from "vue";
import UndoIcon from "@/client/icons/undo-stroke.svg";
import RedoIcon from "@/client/icons/redo-stroke.svg";
import AddIcon from "@/client/icons/plus.svg";
import IntelliEditIcon from "@/client/icons/pencil-outline-stars.svg";
import IntelliEditHotIcon from "@/client/icons/pencil-outline-stars-gradient.svg";
import SaveIcon from "@/client/icons/disk-outline.svg";
import CloseIcon from "@/client/icons/xmark.svg";

// 编辑动作
export type EditActionCode =
  | "undo"
  | "redo"
  | "edit"
  | "save"
  | "move-up"
  | "move-down"
  | "delete"
  | "add"
  | "cancel";

export type EditAction = {
  code: EditActionCode;
  icon?: Component;
  hot?: Component;
  name: string;
  // 是否显示高亮效果
  active?: boolean;
  // 该action是否不可用
  disabled?: (ctx: DisabledContext) => boolean;
  // 是否和之前的项从视觉效果上分裂开成分组效果
  split?: boolean;
  // 当前操作是否竞争光标
  raceCursor?: boolean;
};

export type DisabledContext = {
  // 当前段落的索引
  currSectionIndex: number;
  // 所有段落的数量
  sectionNums: number;
};

export const addAction: EditAction = {
  name: "添加章节",
  code: "add",
  icon: AddIcon,
  raceCursor: true,
};

export const cancelAction: EditAction = {
  name: "取消",
  code: "cancel",
  icon: CloseIcon,
  split: true,
};

export const undoAction: EditAction = {
  code: "undo",
  name: "撤销",
  icon: UndoIcon,
};

export const redoAction: EditAction = {
  code: "redo",
  name: "重做",
  icon: RedoIcon,
};

export const intelliAction: EditAction = {
  code: "edit",
  name: "AI修改",
  icon: IntelliEditIcon,
  hot: IntelliEditHotIcon,
  raceCursor: true,
};

export const editActions: EditAction[] = [
  undoAction,
  redoAction,
  intelliAction,
  addAction,
  cancelAction,
  {
    code: "save",
    name: "保存",
    icon: SaveIcon,
    active: true,
  },
  {
    name: "向上移动",
    code: "move-up",
    disabled(ctx) {
      return ctx.currSectionIndex === 0;
    },
  },
  {
    name: "向下移动",
    code: "move-down",
    disabled(ctx) {
      return ctx.currSectionIndex === ctx.sectionNums - 1;
    },
  },
  {
    name: "删除章节",
    code: "delete",
  },
];

export const editActionCodes = editActions.map((action) => action.code);

export type EditActionMap = Record<EditActionCode, EditAction>;

const editActionMap = editActions.reduce(
  (map: EditActionMap, action) => {
    map[action.code] = action;
    return map;
  },
  <EditActionMap>{},
);

export const raceCursorActions: EditActionCode[] = editActions
  .filter((it) => it.raceCursor)
  .map((it) => it.code);

export default editActionMap;

export type StreamState = "pending" | "streaming" | "finished" | "failed" | "aborted";
