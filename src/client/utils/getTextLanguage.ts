import { franc } from "franc";

const getTextLanguage = (text: string) => {
  const language = franc(text) as string;
  if (language === "eng") {
    return "en";
  } else if (["zho", "cmn", "zh-cn"].includes(language)) {
    return "zh";
  } else if (language === "jpn") {
    return "ja";
  }
  return "zh";
};
export default getTextLanguage;
