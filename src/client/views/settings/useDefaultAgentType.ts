import { computed } from "vue";
import useUserInfo from "@/store/hooks/useUserInfo";
import { updateProfileColumn } from "@/client/api/user";
import { ElMessage } from "element-plus";
import { AideKey } from "@/client/const";

export const parseAgentType = (value: string | null | undefined): AideKey[] => {
  const withValue = value || "";
  return withValue === "" ? [] : (withValue.split(",") as AideKey[]);
};

const AGENT_CONST = "agent_type";
export default function useDefaultAgentType() {
  const userInfo = useUserInfo();
  const defaultAgentType = computed(() => parseAgentType(userInfo.value?.agentType));
  const setDefaultAgentType = async (value: AideKey[]) => {
    const params = value ? value.join(",") : "";
    const res = await updateProfileColumn(AGENT_CONST, params).catch(ElMessage.error);
    if (!res) return;
    userInfo.value = { ...userInfo.value!, agentType: params };
  };
  return {
    defaultAgentType,
    setDefaultAgentType,
  };
}
