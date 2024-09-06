import store from "..";
import { computed } from "vue";
import { NameValue, SetIndustry } from "../modules/dict";
import { getIndustryDict } from "@/client/api/dict";

export default function useIndustryDict() {
  const industry = computed(() => store.state.dict.industry);

  const setDict = (value: NameValue[]) => {
    store.commit(`dict/${SetIndustry}`, value);
  };

  const loadDict = () => {
    getIndustryDict().then(setDict).catch(console.error);
  };

  if (!industry.value.length) {
    loadDict();
  }

  return industry;
}
