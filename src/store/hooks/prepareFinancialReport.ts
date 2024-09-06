import store from "..";

export default function prepareFinancialReport(question: string, reset = true) {
  store.commit("chat/TOGGLE_STARTCHAT", true);
  store.commit("chat/SET_IS_STOP", false);
  reset && store.commit("chat/RESET_FINANCIAL_REPORT_SESSION");
  store.commit("chat/PREPARE_FINANCIAL_REPORT", question);
}
