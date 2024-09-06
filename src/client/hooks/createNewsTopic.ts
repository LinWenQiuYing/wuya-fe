import { HotQuestionsState } from "@/client/hooks/useRecommendedQuestions";
import store from "@/store";
import useClearChat from "@/store/hooks/useClearChat";
import useSendQuestion from "@/client/hooks/useSendQuestion";
import { ChatParams } from "@/client/types/api";
import router from "@/router";
import prepareChat from "@/store/hooks/prepareChat";
import { AideKey } from "@/client/const";

const { send } = useSendQuestion();

const sendQa = async (query: string, key?: string) => {
  const chatId = store.state.chat.chat_id;
  const isChat = store.state.chat.isStartChat;
  const isStop = store.state.chat.isStop;
  const newsId = store.state.documentQA.newsId;
  if (isChat) stop();
  prepareChat(query);
  await router.push("/qa?backtrack=store");
  const params: ChatParams = {
    query,
    sourceNewsId: newsId,
    chat_agent: AideKey.NO_AGENT,
    key,
  };
  //上次对话仍再继续则先关闭
  if (!isStop && chatId) params.topic_id = chatId;
  await send(params, !chatId);
};

const createNewsChatTopic = async (newsQuery: HotQuestionsState, key?: string) => {
  const { clearChat } = useClearChat();
  clearChat();
  store.commit("chat/SET_QUESTION", newsQuery.title);
  store.commit("chat/SET_CHAT_DATA", [
    {
      question: newsQuery.newsTitle,
      newsId: [`news-${newsQuery.id}`],
      answer: {
        isProgress: false,
        answerStop: false,
        progress: [],
      },
    },
  ]);
  store.commit("documentQA/SET_NEWS_ID", newsQuery.id);
  await send({
    query: newsQuery.newsTitle!,
    newsId: newsQuery.id,
    callback: sendQa,
    chat_agent: AideKey.NO_AGENT,
    key,
  });
};
export default createNewsChatTopic;
