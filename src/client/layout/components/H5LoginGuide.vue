<template>
  <div :class="$style._">
    <VisitorProfileIcon @click="sign" />
    <button v-if="route.path === '/'" type="button" @click="sign">登录/注册</button>
  </div>
</template>

<script lang="ts" setup>
import { isMiniProgram } from "@/utils/wxUtils";
import VisitorProfileIcon from "../../icons/visitor-profile.svg";
import { useRoute } from "vue-router";
import { wxSignUtils } from "@/utils/wxUtils";
import reAuth from "@/sign/reAuth";

const route = useRoute();
const sign = async () => {
  if (isMiniProgram.value) {
    wxSignUtils.navigateToSign(route.fullPath);
  } else {
    await reAuth().catch(() => {});
  }
};
</script>

<style lang="scss" module>
._ {
  display: flex;
  align-items: center;
  padding: 5px 0 0 10px;

  button {
    margin-left: 12px;
    height: 28px;
    background: #e7e7e7;
    border-radius: 4px;
    border: none;
    font-size: 14px;
    line-height: 20px;
    padding: 0 14px;
  }
}
</style>
