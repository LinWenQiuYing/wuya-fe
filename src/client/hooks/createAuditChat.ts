import router from "@/router";
import useDrawer from "@/client/hooks/useDrawer";
import prepareAudit from "@/store/hooks/prepareAudit";
import useSendAudit from "@/client/views/audit/useSendAudit";
import useClearChat from "@/store/hooks/useClearChat";
import verifyDoc from "@/client/hooks/verifyDoc";

const createAuditChat = async (question: string, options?: { rule?: string }) => {
  const { send } = useSendAudit();
  const { closeDrawer } = useDrawer();
  const { clearChat } = useClearChat();
  const contractSource = verifyDoc(["docx", "pdf"], "请选择一份docx或pdf文件");
  closeDrawer();
  clearChat();
  prepareAudit(question);
  await router.push("/contract/detail");
  await send({ query: question, audit_rule: options?.rule, contract_source: contractSource! }, true).catch(
    console.error,
  );
};

export default createAuditChat;
