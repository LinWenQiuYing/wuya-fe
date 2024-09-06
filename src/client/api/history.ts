import { get, post } from "@/utils/reqMethod";
import { ChatDetail, ChatTreeNode, CreatFolderParams, HistoryChatTree } from "@/client/types/api";
import { chatPrefix } from "@/utils/reqPrefix";

// 获取历史对话跟目录
export const getHistoryChatRoot = async (): Promise<ChatTreeNode | null> => {
  const result = await get<ChatTreeNode | null>(`${chatPrefix}/topic/root`);
  return result.data ?? null;
};

// 获取历史对话树
export const getHistoryChatTree = async (parent_id: number): Promise<HistoryChatTree> => {
  const result = await get<HistoryChatTree>(`${chatPrefix}/topic/tree`, { parent_id });
  return result.data;
};

// 获取历史对话树
//topic_type: 1是智能问答2是写作助手3资讯
export const getHistoryChat = async (
  parent_id: number,
  topic_type?: number[],
  page = 1,
  size = 30,
): Promise<ChatTreeNode[]> => {
  const result = await post(
    `${chatPrefix}/topic/list?parent_id=${parent_id}&size=${size}&page=${page}`,
    topic_type,
  );
  return result.data as ChatTreeNode[];
};

// 修改历史对话title
export const editChat = async (topic_id: number, title_name: string): Promise<boolean> => {
  const result = await get<boolean>(`${chatPrefix}/topic/update/title-name`, { topic_id, title_name });
  return result.data;
};

// 删除topic 和 子topic(如果有)
export const deleteChat = async (topic_id: number): Promise<boolean> => {
  const result = await get<boolean>(`${chatPrefix}/topic/delete`, { topic_id });
  return result.data;
};

// 移动topic 和 子topic(如果有)
export const moveChat = async (topic_id: number, parent_id: number): Promise<boolean> => {
  const result = await get<boolean>(`${chatPrefix}/topic/move`, { topic_id, parent_id });
  return result.data;
};

// 新建
export const createChat = async (data: CreatFolderParams): Promise<ChatTreeNode> => {
  const result = await post<ChatTreeNode>(`${chatPrefix}/topic/create`, data);
  return result.data;
};

// 问答记录快照
export type RecordSnapshot = {
  a_parm: string;
  q_parm: string;
  agent_type: string;
  create_time: string;
  end_time: string;
  id: number;
  question: string;
  topic_id: number;
};

//获取详情
export const getChatDetail = async (topic_id: number): Promise<ChatDetail[]> => {
  const result = await get<ChatDetail[]>(`${chatPrefix}/record/list`, { topic_id });
  return result.data;
};
