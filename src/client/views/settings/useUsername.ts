import { computed } from "vue";
import useUserInfo from "@/store/hooks/useUserInfo";
import { updateUsername } from "@/client/api/user";
import { ResponseBody } from "@/sign/api/sign";
import { ElMessage } from "element-plus";
import updateUserProfile from "@/sign/updateUserProfile";

export const setUsername = async (username: string) => {
  const userInfo = useUserInfo();
  const userProfile = await updateUsername(username).catch((err: ResponseBody<null>) => {
    ElMessage.error(err);
  });
  if (!userProfile) return;
  const userInfoValue = userInfo.value;
  if (!userInfoValue) return;
  userInfo.value = { ...userInfoValue, username };
  updateUserProfile(userProfile);
  ElMessage.success("用户名更新成功");
  return userProfile;
};

export default function useUsername() {
  const userInfo = useUserInfo();
  return computed(() => userInfo.value?.username || "");
}
