import { nextQuestions } from "@/client/api";

export const useNextQuestions = () => {
  return async () => {
    const result = await nextQuestions({ question_type: "report" });
    return result.map((str) => ({
      title: str,
      type: "report",
    }));
  };
};
