import store from "..";

// 重置合同审核会话(session)
export default function resetAuditSession() {
  store.commit("chat/RESET_AUDIT_SESSION");
}
