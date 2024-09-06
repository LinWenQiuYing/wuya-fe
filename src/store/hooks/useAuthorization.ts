import { Set_Authorization } from "../modules/sign";
import store from "..";
import { computed } from "vue";

type Authorization = string;

export default function useAuthorization() {
  return computed<Authorization | null>({
    get() {
      return store.state.sign.authorization;
    },
    set(authorization) {
      store.commit(`sign/${Set_Authorization}`, authorization);
    },
  });
}
