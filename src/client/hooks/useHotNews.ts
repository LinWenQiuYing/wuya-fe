import { hotNewsQuestions } from "@/client/api";

export const useHotNews = () => {
  return async () => {
    const res = await hotNewsQuestions();
    return Object.keys(res)
      .map((str) => {
        const key = str as "hot" | "realtime";
        const val = res[key];
        const num = Object.keys(val).length < 2 ? 2 : 1;
        return Object.keys(val).map((id) => {
          const list = val[id].question_list ?? [];
          const titles = list.slice(0, num) as string[];
          return titles.map((t) => ({
            id: id,
            title: t,
            newsTitle: val[id].title as string,
            type: key,
          }));
        });
      })
      .flat(2);
  };
};
