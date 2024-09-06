<template>
  <div :class="$style._">
    <img v-if="avatar" :src="avatar" :class="$style.avatar" alt="avatar" />
    <img v-else :src="defaultAvatarURL" :class="$style.avatar" alt="default avatar" />
    <span :class="$style.honorific">尊敬的会员</span>
    <span :class="$style.name">{{ userInfo?.username }}</span>
    <VIPLabel :class="$style.vip" />
    <span :class="$style.expired">会员期至{{ expired }}</span>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import useAvatar from "@/store/hooks/useAvatar";
import useUserInfo from "@/store/hooks/useUserInfo";
import defaultAvatarURL from "@/assets/image/robot.svg?url";
import VIPLabel from "./VIPLabel.vue";
import getDatePart from "./getDatePart";
import { MemberState } from "@/client/api/user";

const props = defineProps<{
  memberInfo: MemberState;
}>();

const avatar = useAvatar();
const userInfo = useUserInfo();

const expired = computed(() => getDatePart(props.memberInfo.annualMemEnd));
</script>
<style lang="scss" module>
@use "src/styles/theme";

$size-avatar: 62px;

._ {
  display: grid;
  grid-template-columns: ($size-avatar + 6px) auto auto 1fr;
  gap: 5px 8px;
  align-items: center;
}

.avatar {
  display: block;
  width: $size-avatar;
  grid-column: 1;
  grid-row: 1 / span 2;
  align-self: center;
  justify-self: start;
}

.honorific,
.name {
  font-weight: bold;
  font-size: 22px;
  color: theme.$text-color-primary;
  line-height: 32px;
  word-break: keep-all;
}

.honorific {
  grid-column: 2;
  grid-row: 1;
}

.name {
  grid-column: 3;
  grid-row: 1;
}

.expired {
  grid-column: 2 / span 3;
  grid-row: 2;
  font-size: 16px;
  color: #6d7587;
  line-height: 20px;
  word-break: keep-all;
}
</style>
