import { Set_Expired } from "../modules/sign";
import store from "..";
import { computed } from "vue";
import { Milliseconds } from "@/utils/parseTimeNotation";

export default function useTokenExpired() {
  return computed<Milliseconds | null>({
    get() {
      return store.state.sign.expired;
    },
    set(expired) {
      store.commit(`sign/${Set_Expired}`, expired);
    },
  });
}
