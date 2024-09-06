<template>
  <slot />
</template>
<script lang="ts" setup>
import { fetchUserInfo, getAnonymousAccess, ResponseBody } from "@/sign/api/sign";
import useUserInfo from "@/store/hooks/useUserInfo";
import useAuthorization from "@/store/hooks/useAuthorization";
import { ElMessage } from "element-plus";
import injectQueryToken from "../injectQueryToken";
import reAuth from "../reAuth";
import isAdmin from "../isAdmin";
import updateUserProfile from "../updateUserProfile";
import getSignConfig from "../getSignConfig";
import periodicallyRenewToken from "@/sign/periodicallyRenewToken";
import { onUnmounted } from "vue";
import { clearMemberInfo } from "@/store/useMemberInfo";
import { clearUserPrivileges } from "@/client/hooks/useUserPrivileges";

const props = defineProps<{
  injectable?: boolean;
  forceAdmin?: boolean;
}>();

let isTokenInjected = false;
if (props.injectable) {
  isTokenInjected = await injectQueryToken();
}

const userInfo = useUserInfo();
const authorization = useAuthorization();
const signConfig = await getSignConfig();

async function initAuth() {
  if (!authorization.value) {
    // 是否允许游客模式
    if (signConfig.guestMode) {
      // 允许游客模式, 没有authorization则去创建获取token
      const userProfile = await getAnonymousAccess().catch((err: ResponseBody<null>) => {
        ElMessage.error(err);
      });
      if (userProfile) {
        updateUserProfile(userProfile);
      }
    } else {
      // 不允许游客模式, 没有authorization则去登录
      await reAuth();
    }
  } else if (!userInfo.value || isTokenInjected) {
    // 如果有了登录后获取到的authorization但是没有用户信息, 则也去获取用户信息
    userInfo.value = await fetchUserInfo();
  } else if (props.forceAdmin && !isAdmin(userInfo.value)) {
    if (userInfo.value) {
      ElMessage.warning("当前用户不是管理员");
    }
    // 如果需要是管理员(forceAdmin: true), 但是没有管理员权限, 则强制去登录
    await reAuth({ remote: true });
  }
}

await initAuth();

if (signConfig.renewal) {
  periodicallyRenewToken(signConfig.renewal.interval);
}

onUnmounted(() => {
  clearMemberInfo();
  clearUserPrivileges();
});

// 从小程序返回，不一定会触发visibilityChange事件。先改成跳小程序登录页同时原页面刷新
// // 从h5页面跳小程序登录页，未登录直接点返回，不会触发本组件的生命周期变化
// // 如果接口鉴权失败要求登录，会清空 authorization 和 userInfo。返回h5后需要重新初始化权限和用户信息
// if (isMiniProgram.value) {
//   wxSignUtils.addSignPageBackCallback(async () => { await initAuth() })
// }
</script>
