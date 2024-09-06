import useClearChat from "@/store/hooks/useClearChat";
import router from "@/router";
import useSendVideoQuery, { VideoParams } from "@/client/views/video/components/useSendVideoQuery";
import prepareVideo from "@/store/hooks/prepareVideo";
import clearNewsId from "@/store/hooks/clearNewsId";
import verifyDoc from "@/client/hooks/verifyDoc";
import useTree from "@/client/hooks/useTree";

// 创建新聊天话题(用指定问题开始当前话题)
const createParserChat = async (question: string) => {
  const { send } = useSendVideoQuery();
  const { clearChat } = useClearChat();
  const { isCheckSource } = useTree();
  const params: VideoParams = { query: question };
  if (isCheckSource()) {
    const source = verifyDoc(["avi", "mp4", "flv", "wmv", "mkv", "weba"], "仅支持勾选一个视频");
    if (!source) return;
    params.video_source = source;
  }
  clearChat();
  clearNewsId();
  prepareVideo(question);
  await router.push("/parser/detail");
  await send(params, true).catch(console.error);
};

export default createParserChat;
