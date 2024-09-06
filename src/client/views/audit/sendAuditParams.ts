import { AuditParams } from "@/client/views/audit/useSendAudit";
import { chatPrefix } from "@/utils/reqPrefix";
import appendAuthHeader from "@/sign/appendAuthHeader";

const AUDIT_ASSISTANT_URL = `${chatPrefix}/contract-audit`;
export default function sendAuditParams(params: AuditParams) {
  const { query, chat_model, topic_id, contract_source, audit_rule, regenerate } = params;
  return {
    url: AUDIT_ASSISTANT_URL,
    params: {
      method: "POST",
      headers: appendAuthHeader({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ query, chat_model, topic_id, contract_source, audit_rule, regenerate }),
    },
  };
}
