import store from "..";
import { computed } from "vue";
import { NameValue, SetProvince } from "../modules/dict";
import { getProvinceDict } from "@/client/api/dict";

export default function useProvinceDict() {
  const province = computed(() => store.state.dict.province);

  const setDict = (value: NameValue[]) => {
    store.commit(`dict/${SetProvince}`, value);
  };

  const loadDict = () => {
    getProvinceDict().then(setDict).catch(console.error);
  };

  if (!province.value.length) {
    loadDict();
  }

  return province;
}
