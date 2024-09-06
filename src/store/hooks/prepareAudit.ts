import store from "..";

export default function prepareAudit(question: string) {
  store.commit("chat/TOGGLE_STARTCHAT", true);
  store.commit("chat/SET_IS_STOP", false);
  store.commit("chat/PREPARE_AUDIT", question);
}
