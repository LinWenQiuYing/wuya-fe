import { useIsLoading } from "@/client/hooks/useIsLoading";
import { ref } from "vue";
import { translate } from "@/client/api/translate";
import useMarkdown from "@/client/hooks/useMarkdown";
import getTextLanguage from "@/client/utils/getTextLanguage";

export default function useTranslate() {
  const [isLoading, setIsLoading] = useIsLoading();
  const translateMarkdown = ref<string>();
  const markdown = useMarkdown();
  const toTranslate = async (text: string, target: string) => {
    setIsLoading(true);
    const formData = new FormData();
    const source = getTextLanguage(text);
    formData.append("q", text);
    formData.append("source", source);
    formData.append("target", target);
    formData.append("format", "text");
    formData.append("api_key", "");
    const { translatedText } = await translate(formData);
    const formatData = formatMarkdown(translatedText);
    translateMarkdown.value = markdown.render(formatData);
    setIsLoading(false);
  };
  return {
    isLoading,
    translateMarkdown,
    toTranslate,
  };
}

function formatMarkdown(data: string) {
  const result = data
    .replaceAll(/(\*\*)(.*)(\*\*)/g, (match: string, p1: string, p2: string, p3: string) => {
      return ` **${p2.trim()}** `;
    })
    .replaceAll(/(#+)/g, (match: string, p1: string) => {
      return `${p1} `;
    });
  return addReferenceHtml(result);
}

function addReferenceHtml(data: string) {
  const result = data.replaceAll(/(\[+)(\d+)(\]+)/g, (match: string, p1: string, p2: string, p3: string) => {
    return `<span class="corner-mark">${p2}</span>`;
  });
  return result;
}
