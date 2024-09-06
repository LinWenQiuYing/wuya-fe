import useHistoryChat from "@/store/hooks/useHistoryChat";
import resetChatSession from "./resetChatSession";
import resetWriteSession from "./resetWriteSession";
import resetAuditSession from "@/store/hooks/resetAuditSession";
import resetSurveySession from "@/store/hooks/resetSurveySession";
import resetVideoSession from "@/store/hooks/resetVideoSession";
import resetServiceSession from "@/store/hooks/resetServiceSession";

export default function useClearChat() {
  const { curChat } = useHistoryChat();
  const clearChat = () => {
    resetChatSession();
    resetWriteSession();
    resetAuditSession();
    resetSurveySession();
    resetVideoSession();
    resetServiceSession();
    // 避免切换账号后, 历史收藏还是上一个用账号的
    curChat.value = null;
  };
  return {
    clearChat,
  };
}
