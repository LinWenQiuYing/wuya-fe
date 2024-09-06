import store from "@/store";

export default function prepareVideo(question: string) {
  store.commit("chat/PREPARE_VIDEO", question);
  store.commit("chat/TOGGLE_STARTCHAT", true);
  store.commit("chat/SET_IS_STOP", false);
}
