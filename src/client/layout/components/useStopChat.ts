import useSendQuestion from "@/client/hooks/useSendQuestion";
import useWriting from "@/client/views/writing/useWriting";
import { computed } from "vue";
import store from "@/store";
import useActiveModule from "@/client/layout/useActiveModule";
import useSendAudit from "@/client/views/audit/useSendAudit";
import useDataAnalysis from "@/client/hooks/useDataAnalysis";
import useSurvey from "@/client/views/survey/hooks/useSurvey";
import useSendVideoQuery from "@/client/views/video/components/useSendVideoQuery";
import useSendServiceQuery from "@/client/views/customerService/components/useSendServiceQuery";

export const useStopChat = () => {
  const { stop } = useSendQuestion();
  const { writingStop } = useWriting();
  const { auditStop } = useSendAudit();
  const { stopDataAnalysis } = useDataAnalysis();
  const { surveyStop } = useSurvey();
  const { stopService } = useSendVideoQuery();
  const { stopServiceChat } = useSendServiceQuery();
  const isStartChat = computed(() => store.state.chat.isStartChat);
  const activeModule = useActiveModule();
  return () => {
    if (isStartChat.value) {
      switch (activeModule.value) {
        case "contract":
          auditStop();
          break;
        case "survey":
          surveyStop();
          break;
        case "dataAnalysis":
          stopDataAnalysis();
          break;
        case "writing":
          writingStop();
          break;
        case "parser":
          stopService();
          break;
        case "customer_service":
          stopServiceChat();
          break;
        default:
          stop();
      }
    }
  };
};
