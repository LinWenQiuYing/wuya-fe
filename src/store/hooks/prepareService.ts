import store from "@/store";

export default function prepareService(question: string) {
  store.commit("chat/PREPARE_SERVICE", question);
  store.commit("chat/TOGGLE_STARTCHAT", true);
  store.commit("chat/SET_IS_STOP", false);
}
