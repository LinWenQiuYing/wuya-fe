<template>
  <div :class="$style._">
    <img v-if="avatar" :src="avatar" alt="" />
    <img v-else :src="defaultAvatarURL" alt="" />
    <span>
      <slot :username="userName">{{ userName }}</slot>
    </span>
  </div>
</template>
<script lang="ts" setup>
import defaultAvatarURL from "@/assets/image/robot.svg?url";

const props = defineProps<{
  inviteTable?: string;
  avatar?: string;
  userName: string;
}>();
</script>
<style lang="scss" module>
@use "src/styles/theme";
._ {
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: theme.$font-size-base;
  line-height: 1.4;
  font-weight: 400;

  > img {
    display: block;
    height: 32px;
  }

  > span {
    margin: 0 8px;
    cursor: default;
    font-weight: bold;
    font-size: theme.$font-size-base;
    color: theme.$text-color-primary;
    line-height: 41px;
    text-align: left;
    font-style: normal;
    &:empty {
      display: none;
    }
  }

  &:global(.reverse) {
    flex-direction: row-reverse;
  }
}
</style>
