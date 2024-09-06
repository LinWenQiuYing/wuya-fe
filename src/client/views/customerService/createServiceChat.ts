import useClearChat from "@/store/hooks/useClearChat";
import router from "@/router";
import clearNewsId from "@/store/hooks/clearNewsId";
import useSendServiceQuery from "@/client/views/customerService/components/useSendServiceQuery";
import prepareService from "@/store/hooks/prepareService";

// 创建新聊天话题(用指定问题开始当前话题)
const createServiceChat = async (question: string) => {
  const { send } = useSendServiceQuery();
  const { clearChat } = useClearChat();
  clearChat();
  clearNewsId();
  prepareService(question);
  await router.push("/customer_service/detail");
  await send({ query: question }, true).catch(console.error);
};

export default createServiceChat;
