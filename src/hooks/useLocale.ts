import useLanguage, { Language } from "@/hooks/useLanguage";
import { useI18n } from "vue-i18n";

// 切换语言
function useLocale() {
  const lang = useLanguage();
  const { locale } = useI18n();
  return (value: Language) => {
    lang.value = value;
    locale.value = value;
  };
}

export default useLocale;
