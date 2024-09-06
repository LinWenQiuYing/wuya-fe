import { onMounted, ref } from "vue";
import { nextQuestions } from "@/client/api";
import { QuestionType } from "@/client/types";

export default function useQuestions(question_type: QuestionType) {
  const questions = ref<Array<any>>([]);
  const params = { question_type };
  const getQuestion = async () => {
    const result = nextQuestions(params);
    return result;
  };
  onMounted(async () => {
    const res = await getQuestion();
    questions.value = res.splice(0, 5);
  });
  return {
    questions,
  };
}
