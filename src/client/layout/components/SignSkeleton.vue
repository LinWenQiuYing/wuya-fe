<template>
  <div :class="$style.anonymous_login">
    <div v-for="(_, i) in new Array(6)" :key="i" :class="$style.anonymous_warp">
      <GrayFolderIcon :class="$style.folder_icon" />
      <div :class="$style.oblong"></div>
    </div>
    <div :class="$style.signout_box">
      <LockIcon :class="$style.lock_icon" />
      请在<a @click="reAuth">登录账号</a>后查看
    </div>
  </div>
</template>

<script setup lang="ts">
import reAuth from "@/sign/reAuth";
import GrayFolderIcon from "@/client/icons/gray-folder.svg";
import LockIcon from "@/client/icons/lock.svg";
</script>

<style module lang="scss">
@use "src/styles/theme";

.anonymous_login {
  position: relative;
  font-size: 14px;
  mask: linear-gradient(0, rgba(237, 239, 243, 0.05) 0%, #edeff3 60%);

  a {
    color: #306bec;

    &:hover {
      cursor: pointer;
    }
  }
}

.anonymous_warp {
  display: flex;
  height: 18px;
  margin: 10px 0;
}

.folder_icon {
  margin-top: 2px;
  height: 18px;
  margin-right: 5px;
}

.oblong {
  flex: 1;
  border-radius: 2px;
  background-color: #dadcdf;
}

.signout_box {
  color: theme.$text-color-secondary;
  font-size: theme.$font-size-base;
  position: absolute;
  top: calc(50% - 34px);
  left: calc(50% - 70px);
}

.lock_icon {
  width: 14px;
  height: auto;
  margin-right: 3px;
  vertical-align: text-bottom;
  fill: theme.$text-color-secondary;
}
</style>
