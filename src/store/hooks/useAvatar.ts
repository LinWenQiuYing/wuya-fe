import useUserInfo, { isAnonymous } from "./useUserInfo";
import getBase64MimeType from "@/client/utils/getBase64MimeType";
import dataURLToFile from "@/client/utils/dataURLToFile";
import { getAvatarBase64, updateAvatar } from "@/client/api/user";
import { ResponseBody } from "@/sign/api/sign";
import { ElMessage } from "element-plus";
import { computed, onMounted } from "vue";
import store from "..";
import { Set_Avatar } from "../modules/sign";

export const setAvatar = async (dataURL: string) => {
  const userInfo = useUserInfo();
  const username = userInfo.value?.username;
  const mimeType = getBase64MimeType(dataURL);
  const [, extension] = mimeType.split("/");
  const fileName = username ? `avatar-${username}.${extension}` : `avatar.${extension}`;
  const file = await dataURLToFile(dataURL, fileName, mimeType);
  const response = await updateAvatar(file).catch((err: ResponseBody<null>) => {
    ElMessage.error(err);
  });
  if (!response) return false;
  store.commit(`sign/${Set_Avatar}`, dataURL);
  ElMessage.success("个人头像更新成功");
  return true;
};

export default function useAvatar(disableHooks?: boolean) {
  const avatar = computed({
    get() {
      return store.state.sign.avatar;
    },
    set(dataURL) {
      store.commit(`sign/${Set_Avatar}`, dataURL);
    },
  });

  disableHooks ||
    onMounted(async () => {
      if (avatar.value) return;
      if (isAnonymous.value) return;
      const dataURL = (await getAvatarBase64().catch(console.error)) || null;
      if (!dataURL?.startsWith("data:image/")) return null;
      store.commit(`sign/${Set_Avatar}`, dataURL);
    });

  return avatar;
}
