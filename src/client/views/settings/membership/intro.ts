import { type Component } from "vue";
import BookIcon from "@/client/icons/book.svg";
import PenIcon from "@/client/icons/pen.svg";
import RectanglesIcon from "@/client/icons/rectangles.svg";
import DiskIcon from "@/client/icons/disk-fill.svg";

export type MembershipIntro = {
  icon: Component;
  title: string;
  description: string;
};

const intro: MembershipIntro[] = [
  {
    icon: DiskIcon,
    title: "大容量文件存储空间",
    description: "个人知识库存储容量扩充至10GB，音视频文档存储无忧",
  },
  {
    icon: BookIcon,
    title: "丰富的知识源",
    description: "支持构建个人知识库，使用互联网、财经、法律等多种知识源。",
  },
  {
    icon: PenIcon,
    title: "尊享专业助手服务",
    description: "尽调报告、合同审核助手每月可使用50次，全方位助力日常工作。",
  },
  {
    icon: RectanglesIcon,
    title: "提供多种模型供回答",
    description: "支持选择远程无涯大模型，远程无涯小模型进行回答。",
  },
];

export default intro;
