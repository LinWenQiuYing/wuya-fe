import prepareWrite from "@/store/hooks/prepareWrite";
import useWriting from "@/client/views/writing/useWriting";
import router from "@/router";
import useClearChat from "@/store/hooks/useClearChat";
import { isAnonymous } from "@/store/hooks/useUserInfo";
import reAuth from "@/sign/reAuth";
import clearNewsId from "@/store/hooks/clearNewsId";

// 创建新聊天话题(用指定问题开始当前话题)
const createWriteTopic = async (question: string) => {
  if (isAnonymous.value) {
    // 不需要调用退出接口
    return reAuth().catch(console.error);
  }
  const { send } = useWriting();
  const { clearChat } = useClearChat();
  clearChat();
  clearNewsId();
  prepareWrite(question);
  await router.push("/writing/topic/_");
  await send({ query: question }, true).catch(console.error);
};

export default createWriteTopic;
