<template>
  <el-dropdown>
    <template #default>
      <UserMeta :size="props.size" :class="$style.default" :reverse="props.reverseMeta">
        <template #default="{ username }">
          {{ props.compact ? null : username }}
        </template>
      </UserMeta>
    </template>
    <template #dropdown>
      <el-dropdown-menu :class="[$style.dropdown, { reverse: props.reverseMenu }]">
        <el-dropdown-item @click="() => reAuth({ logout: true })">
          <SwitchButton :class="[$style.icon, $style.switch]" />
          <span>退出登录</span>
        </el-dropdown-item>
        <el-dropdown-item v-if="managerEntryVisible">
          <router-link to="/admin" active-class="" exact-active-class="" :class="$style.link">
            <Switch :class="$style.icon" />
            <span>管理端</span>
          </router-link>
        </el-dropdown-item>
        <template v-if="!inTag">
          <el-dropdown-item @click="showInviteDialog">
            <InviteIcon :class="$style.icon2" />
            <span>我的邀请</span>
            <teleport to="body">
              <InviteDialog v-model="inviteDialogVisible" v-if="inviteDialogVisible" />
            </teleport>
          </el-dropdown-item>
          <el-dropdown-item @click="feedback">
            <ChatIcon :class="$style.icon2" />
            <span>意见反馈</span>
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { SwitchButton, Switch } from "@element-plus/icons-vue";
import reAuth from "@/sign/reAuth";
import UserMeta from "./UserMeta.vue";
import useUserInfo from "@/store/hooks/useUserInfo";
import isAdmin from "../isAdmin";
import ChatIcon from "@/client/icons/chat-outline-smile.svg";
import InviteIcon from "@/client/icons/invite.svg";
import { getFeedbackURL } from "@/sign/api/sign";
import InviteDialog from "@/client/views/invite/InviteDialog.vue";
import { isMobile } from "@/config";
import { useRouter, useRoute } from "vue-router";
import omitRestQueryValue from "@/utils/omitRestQueryValue";

const router = useRouter();
const route = useRoute();

const props = defineProps<{
  // 是否是简凑模式, 简凑模式下不显示用户名
  compact?: boolean;
  // 是否水平倒置meta栏
  reverseMeta?: boolean;
  // 菜单中菜单项是否倒序
  reverseMenu?: boolean;
  // 是否包含管理端的入口
  includeManagerEntry?: boolean;
  size?: "lg" | "sm";
}>();

const inTag = omitRestQueryValue(route.query.tag) === "off";
const inviteDialogVisible = ref(false);
const userInfo = useUserInfo();
const managerEntryVisible = computed(
  () => props.includeManagerEntry && userInfo.value && isAdmin(userInfo.value),
);

const showInviteDialog = () => {
  if (!isMobile) inviteDialogVisible.value = true;
  else {
    router.push({ path: "invite" });
  }
};
const feedback = async () => {
  const url = await getFeedbackURL().catch(console.error);
  if (!url) return;
  window.open(url, "_blank");
};
</script>
<style lang="scss" module>
.default {
  padding: 4px;

  &:hover,
  &:focus-visible {
    outline: 0 none;
    background: #f0f3fa;
  }
}

.dropdown:global(.reverse) {
  display: flex;
  flex-direction: column-reverse;
}

.link {
  color: inherit;
  display: flex;
  align-items: center;
  justify-self: flex-start;
}

.icon {
  height: 14px;
  margin-right: 3px;
  fill: currentColor;
}

.icon2 {
  height: 18px;
  margin-right: 1px;
  margin-left: -2px;
  fill: currentColor;
}

.switch {
  color: #e31430;
}
</style>
