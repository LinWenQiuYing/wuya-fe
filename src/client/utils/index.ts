import dayjs from "dayjs";
import { Knowledge } from "@/client/types/api";
import { KNOWLEDGE_SOURCE_TITLE, TreeRootKeys } from "@/client/const";
import { KnowledgeSourceType } from "@/client/types";
import { FolderFileProp, TreeRootProp } from "@/client/types/treeData";
import { Store } from "vuex";
import { StoreState } from "@/store";
import { ChatDataState, ChatProgressState } from "@/client/types/chat";

export function getTimeDifference(serverTime) {
  const serverDate = new Date(serverTime) as any;
  const currentDate = new Date() as any;
  const timeDifference = Math.floor((currentDate - serverDate) / (1000 * 60 * 60)); // 计算相差小时数

  if (timeDifference < 1) {
    return "刚刚";
  } else if (timeDifference <= 24) {
    return `${timeDifference}小时前`;
  } else {
    const parsedDate = dayjs(serverTime);
    return parsedDate.format("YYYY-MM-DD");
  }
}

// T 类型的键名 U 需要定义的类型
export type GenerateType<T extends readonly string[], U> = {
  [K in T[number]]: U;
};

// 去掉子节点
export const findParentTree = (data) => {
  const res = [];
  data.forEach((d) => {
    if (!d.parentId) {
      res.push(d);
    } else {
      const isParent = data.every((r) => r.id !== d.parentId);
      if (isParent) res.push(d);
    }
  });
  return res;
};

export const createKnowRootNode = (
  val: Array<Knowledge | FolderFileProp>,
  name: KnowledgeSourceType,
  key: TreeRootKeys,
  anonymous?: boolean,
): TreeRootProp => {
  if (key === "privateTree") {
    return {
      ...val[0],
      id: anonymous ? name : val[0].id,
      name: KNOWLEDGE_SOURCE_TITLE.get(name),
      isLeaf: !!anonymous,
      type: name,
      isRoot: true,
      isCreate: true,
    };
  } else {
    val.forEach((tree) => {
      (tree as FolderFileProp).parentId = name as unknown as number;
      if (key === "publicTree") {
        (tree as FolderFileProp).type = KnowledgeSourceType.ENTERPRISE;
      }
    });

    return {
      name: KNOWLEDGE_SOURCE_TITLE.get(name),
      isLeaf: !val.length,
      id: name,
      isRoot: true,
      children: val,
      type: name,
    };
  }
};

// 转化回答内容
export function formatData(data, store: Store<StoreState>) {
  if (data.llm_output !== "null") {
    const chatData = store.state.chat.chatData;
    if (chatData.length > 0) {
      const curChat = chatData.pop();
      if (!curChat.answer.isProgress) curChat.answer.isProgress = true;
      let curAnswer = "";
      const citations = data?.citations;
      if (citations && citations.length > 0) {
        citations.forEach((item: number) => {
          curAnswer = curAnswer + `<span class="corner-mark">${item + 1}</span>`;
        });
      }
      curAnswer = curAnswer + data.llm_output;
      curChat.answer["llm_output"] = formatMarkdown((curChat.answer.llm_output ?? "") + curAnswer);
      store.commit("chat/SET_CHAT_DATA", [...chatData, curChat]);
    }
  }
}

// 存储数组格式
export function formatArrData(
  val: string | string[] | ChatProgressState,
  key: keyof ChatDataState["answer"],
  store: Store<StoreState>,
) {
  const chatData = store.state.chat.chatData;
  const curChat = chatData.pop()!;
  const storage = curChat.answer[key] || [];
  storage.push(val);
  curChat.answer[key] = storage;
  store.commit("chat/SET_CHAT_DATA", [...chatData, curChat]);
}

// 存储数组格式
export function formatReference(val: any[], store: any) {
  const chatData = store.state.chat.chatData;
  const curChat = chatData.pop();
  curChat.answer["reference"] = val;
  store.commit("chat/SET_CHAT_DATA", [...chatData, curChat]);
}

// 截取第一个/前面的字符
export function getSubString(str: string) {
  return str.split("/")[0];
}

//格式化markdown
const regex = /##\s+关键信息|##\s+分析/g;

function formatMarkdown(data: string) {
  return data.replace(regex, "");
}
