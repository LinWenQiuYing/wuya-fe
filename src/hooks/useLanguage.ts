import { computed } from "vue";

export type Language = "zh" | "en";

function useLanguage() {
  return computed({
    get() {
      return (localStorage.getItem("language") || "zh") as Language;
    },
    set(language: Language) {
      localStorage.setItem("language", language);
    },
  });
}

export default useLanguage;
