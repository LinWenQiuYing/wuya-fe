import useGetHistoryChat from "@/client/hooks/useGetHistoryChat";
import useHistoryType from "@/client/layout/useHistoryType";

/**
 * 重新加载会话历史(第一页内容)
 *
 * 会根据路由自动重载`问答`、`咨询`或者`写作`的会话历史
 */
export default async function reloadSessionHistory() {
  const { getHistoryChats } = useGetHistoryChat();
  const type = useHistoryType();
  await getHistoryChats(type.value, 1, false);
}
