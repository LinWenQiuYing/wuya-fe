import router from "@/router";
import useClearChat from "@/store/hooks/useClearChat";
import prepareSurvey from "@/store/hooks/prepareSurvey";
import clearNewsId from "@/store/hooks/clearNewsId";
import handleCompany from "@/client/views/survey/hooks/handleCompany";
import useSurvey from "@/client/views/survey/hooks/useSurvey";
// 创建新聊天话题(用指定问题开始当前话题)
const createSurveyTopic = async (question: string, options?: { rule?: string }) => {
  const { clearChat } = useClearChat();
  const { surveyStop } = useSurvey();
  surveyStop();
  clearChat();
  clearNewsId();
  prepareSurvey(question, options?.rule);
  await router.push("/survey/detail");
  await handleCompany(question).catch(console.error);
};

export default createSurveyTopic;
