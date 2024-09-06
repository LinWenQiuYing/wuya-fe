import { ModuleCode } from "@/client/layout/useActiveModule";
import { AideKey } from "@/client/const";
import { ElMessage } from "element-plus";
import useUserPrivileges from "@/client/hooks/useUserPrivileges";

export default function verifySurveyOrAuditCount(path: ModuleCode, type: AideKey | null) {
  const userPrivileges = useUserPrivileges();

  if (userPrivileges.value?.unlimited) return true;
  if (path === "survey" || type === AideKey.ENTERPRISE_RESEARCH) {
    if (!userPrivileges.value?.diligenceCount) {
      ElMessage.error("当前剩余0次尽调");
      return false;
    }
  }
  if (path === "contract" || type === AideKey.CONTRACT_AUDIT) {
    if (!userPrivileges.value?.auditCount) {
      ElMessage.error("当前剩余0次审核");
      return false;
    }
  }

  return true;
}
