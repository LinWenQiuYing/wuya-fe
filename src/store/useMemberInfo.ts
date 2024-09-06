import { computed, ref } from "vue";
import { getMemberInfo, MemberState } from "@/client/api/user";

let initialized = false;

// undefined 代表着未初始化
export const memberInfo = ref<MemberState | null>(null);

export const isMembership = computed(() => !!memberInfo.value?.active);

export const reloadMemberInfo = async (): Promise<MemberState | null> => {
  const member = await getMemberInfo();
  return (memberInfo.value = member);
};

const init = () => {
  if (initialized) return;
  initialized = true;
  reloadMemberInfo().catch(console.error);
};

export const clearMemberInfo = () => {
  initialized = false;
  memberInfo.value = null;
};

export default function useMemberInfo() {
  init();

  return { info: memberInfo, isMembership };
}
