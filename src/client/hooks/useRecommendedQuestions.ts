import { useNextQuestions } from "@/client/hooks/useNextQuestions";
import { useHotNews } from "@/client/hooks/useHotNews";
import useOffline from "@/hooks/useOffline";
import { ref, watch } from "vue";

/**
 * 热点推荐问题
 */
export interface HotQuestionsState {
  id?: string;
  title: string;
  newsTitle?: string;
  type?: "hot" | "realtime" | "report";
}

export default function useRecommendedQuestions() {
  const recommendedQuestions = ref<HotQuestionsState[]>([]);
  const getNextQuestions = useNextQuestions();
  const getHotNews = useHotNews();
  const offline = useOffline();
  watch(
    [offline],
    async ([offline]) => {
      const questions: HotQuestionsState[] = [];
      if (!offline) {
        const hotNews = await getHotNews();
        questions.push(...hotNews);
        const nextQuestions = await getNextQuestions();
        questions.push(...nextQuestions);
        recommendedQuestions.value = questions.slice(0, 6);
      } else {
        recommendedQuestions.value = [];
      }
    },
    {
      immediate: true,
    },
  );
  return recommendedQuestions;
}
