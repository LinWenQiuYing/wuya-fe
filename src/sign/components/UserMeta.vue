<template>
  <div :class="[{ reverse }, size, $style._]">
    <img v-if="avatar" :src="avatar" alt="" />
    <img v-else :src="defaultAvatarURL" alt="" />
    <VIPBadge v-if="!isAnonymous" :class="$style.mark" />
    <span :class="$style.name">
      <slot :username="username">{{ username }}</slot>
    </span>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import useUserInfo, { isAnonymous } from "@/store/hooks/useUserInfo";
import useAvatar from "@/store/hooks/useAvatar";
import defaultAvatarURL from "@/assets/image/robot.svg?url";
import VIPBadge from "./VIPBadge.vue";

const props = defineProps<{
  readonly reverse?: boolean;
  readonly size?: "lg" | "sm";
}>();

const { reverse, size = "sm" } = props;

const userInfo = useUserInfo();
const avatar = useAvatar();

const username = computed(() => userInfo.value?.username);
</script>
<style lang="scss" module>
._ {
  display: grid;
  grid-template-columns: min-content 1fr;
  column-gap: 8px;
  align-items: center;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 400;
  cursor: pointer;

  > img {
    display: block;
    grid-column: 1;
    grid-row: 1;
  }

  &:global(.lg) > img {
    height: 40px;
  }

  &:global(.sm) > img {
    height: 32px;
  }

  &:global(.reverse) {
    direction: rtl;
  }
}

.mark {
  grid-column: 1;
  grid-row: 1;
  align-self: end;
  justify-self: end;
}

.name {
  grid-column: 2;
  grid-row: 1;
}
</style>
