import { createI18n, Locale } from "vue-i18n";
import useLanguage from "@/hooks/useLanguage";

function initI18n() {
  const lang = useLanguage();
  return createI18n({
    //是否启用旧版 Vue I18n 的某些特性
    legacy: false,
    //指定应用的默认语言环境
    locale: lang.value,
    //当当前语言环境的翻译不存在时，将回退到这个语言环境
    fallbackLocale: "zh",
    missing: (locale: Locale, key: string) => key,
    //缺失翻译警告提示
    missingWarn: true,
  });
}

export default initI18n();
