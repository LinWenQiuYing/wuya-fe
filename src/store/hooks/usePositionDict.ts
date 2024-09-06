import store from "..";
import { computed } from "vue";
import { NameValue, SetPosition } from "../modules/dict";
import { getPositionDict } from "@/client/api/dict";

export default function usePositionDict() {
  const position = computed(() => store.state.dict.position);

  const setDict = (value: NameValue[]) => {
    store.commit(`dict/${SetPosition}`, value);
  };

  const loadDict = () => {
    getPositionDict().then(setDict).catch(console.error);
  };

  if (!position.value.length) {
    loadDict();
  }

  return position;
}
