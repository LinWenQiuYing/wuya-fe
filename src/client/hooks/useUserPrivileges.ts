/**
 * 权益相关内容
 */

import useUserInfo from "@/store/hooks/useUserInfo";
import { onMounted, ref } from "vue";
import useMemberInfo, { isMembership } from "@/store/useMemberInfo";
import { getServiceCount, SvcTypeEnum } from "@/client/api/user";

export type PrivilegesInfo = {
  // 特殊用户或管理员没有次数限制
  unlimited: boolean;
  // 合同审核剩余次数
  auditCount: number;
  // 尽调剩余次数
  diligenceCount: number;
};

let initialized = false;

export const privilegesInfo = ref<PrivilegesInfo | null>();
const userInfo = useUserInfo();
const memberInfo = useMemberInfo();

export const reloadUserPrivileges = async () => {
  const info = {
    unlimited: false,
    auditCount: 0,
    diligenceCount: 0,
  };
  if (userInfo.value?.isAdmin || Number(memberInfo.info.value?.specialMem) > 1) {
    info.unlimited = true;
    return (privilegesInfo.value = info);
  }

  const diligenceEquity = await getServiceCount(SvcTypeEnum.DILIGENCE);
  const auditEquity = await getServiceCount(SvcTypeEnum.CONTRACT_AUDIT);
  const key = isMembership.value ? "latestValidMemTypeCard" : "lastValidExpTypeCard";
  if (!auditEquity || !diligenceEquity) return;
  info.diligenceCount = diligenceEquity[key]?.remainingCount || 0;
  info.auditCount = auditEquity[key]?.remainingCount || 0;
  return (privilegesInfo.value = info);
};

const init = () => {
  if (initialized) return;
  initialized = true;
  reloadUserPrivileges().catch(console.error);
};

export const clearUserPrivileges = () => {
  initialized = false;
  privilegesInfo.value = null;
};

export default function useUserPrivileges() {
  onMounted(init);
  return privilegesInfo;
}
