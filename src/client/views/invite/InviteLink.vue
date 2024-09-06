<template>
  <div :class="[$style._, { [$style.h5]: isMobile }]">
    <div :class="$style.colSpan">
      <div :class="$style.font">邀请步骤： <br />好友通过我分享的链接或二维码注册</div>
    </div>
    <div :class="$style.inviteButtonBox">
      <el-button :class="$style.buttonStyle" @click="copyInviteLink">复制邀请链接</el-button>
      <el-popover placement="bottom-end" trigger="hover" :width="170" :popper-class="$style.popClass">
        <DownloadPicture v-model="linkUrl"></DownloadPicture>
        <template #reference>
          <el-button :class="$style.buttonStyle">扫码分享</el-button>
        </template>
      </el-popover>
    </div>
  </div>
</template>
<script setup lang="ts">
import copyText from "./useCopy";
import { onMounted, ref } from "vue";
import { getInviteLink } from "../../api/invite";
import DownloadPicture from "@/client/views/invite/DownloadPicture.vue";
import { isMobile } from "@/config";
let linkUrl = ref<string>("");
onMounted(async () => {
  try {
    linkUrl.value = await getInviteLink();
  } catch (error) {
    console.error("请求失败:", error);
  }
});

const copyInviteLink = () => {
  copyText(linkUrl.value);
};
</script>
<style module lang="scss">
@use "src/styles/theme";

._ {
  width: 100%;
  padding-top: 11px;
  display: flex;
}
.popClass {
  &.popClass {
    padding: 5px 0;
  }
}
.h5 {
  flex-direction: column;
}
.h5 .inviteButtonBox {
  width: 100%;
  padding-top: 10px;
}

.colSpan {
  margin-left: 22px;
}

.font {
  font-size: theme.$font-size-base;
  color: theme.$text-color-primary;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}

.inviteButtonBox {
  width: 50%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  place-content: center center;
}

.buttonStyle {
  background: #fff;
  border-radius: theme.$border-radius-sm;
  border: 1px solid #dddfe3;
  font-size: theme.$font-size-base;
  color: theme.$text-color-primary;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  font-weight: revert;
}

.buttonStyle:hover {
  border: 1px solid #306bec;
  color: #306bec;
  background: #fff;
  transition:
    border,
    color 0.5s linear;
}
</style>
