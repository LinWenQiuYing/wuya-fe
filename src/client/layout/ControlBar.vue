<template>
  <div
    :class="[
      $style._,
      { [$style.thin]: props.compact },
      { [$style.split]: !(offline || isAnonymous || isMobile) },
    ]"
  >
    <template v-if="isAnonymous">
      <router-link
        :class="[$style.link, props.compact ? 'sm' : 'lg']"
        :to="preferSignEntry"
        @click="() => reAuth({ remote: false })"
        >登录</router-link
      >
    </template>
    <template v-else-if="userInfo">
      <UserMenu :compact="props.compact" :include-manager-entry="true" :reverse-menu="true" size="lg" />
      <OfflineLabel v-if="offline" :class="$style.offline" :size="props.compact ? 'sm' : 'md'" />
      <router-link
        v-show="!props.compact"
        active-class=""
        exact-active-class=""
        to="/settings/account"
        :class="$style.gear"
      >
        <GearIcon />
      </router-link>
    </template>
  </div>
</template>

<script setup lang="ts">
import GearIcon from "@/client/icons/gear.svg";
import UserMenu from "@/sign/components/UserMenu.vue";
import OfflineLabel from "@/client/components/OfflineLabel.vue";
import useOffline from "@/hooks/useOffline";
import useUserInfo, { isAnonymous } from "@/store/hooks/useUserInfo";
import getPreferSignEntry from "@/sign/getPreferSignEntry";
import reAuth from "@/sign/reAuth";
import { isMobile } from "@/config";

const props = defineProps<{
  compact?: boolean;
}>();

const userInfo = useUserInfo();
const offline = useOffline();
const preferSignEntry = await getPreferSignEntry();
</script>

<style lang="scss" module>
@use "src/styles/theme";

._ {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 theme.$padding-md;
}

.thin {
  padding: 8px;
  width: 100%;

  .offline {
    position: relative;
    margin-top: -15px;
  }
}

.split {
  border-top: 1px solid #e0e4f1;
}

.link {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  &:global(.lg) {
    background: #086df4;
    border-radius: 2px;
    letter-spacing: 8px;
    text-indent: 8px;
    height: 34px;
    max-width: 300px;
    font-size: 14px;
  }

  &:global(.sm) {
    width: 44px;
    height: 24px;
    background: #1677ff;
    border-radius: 4px;
    font-size: 13px;
  }
}

.gear {
  color: theme.$text-color-primary;
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    color: theme.$color-primary;
  }

  > svg {
    fill: currentColor;
  }
}
</style>
