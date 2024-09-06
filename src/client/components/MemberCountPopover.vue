<template>
  <el-popover placement="top" :popper-class="$style.popper" :width="width">
    <template #reference>
      <div :class="isDisabled && $style.disabled">
        <slot :disabled="isDisabled"></slot>
      </div>
    </template>
    <span :class="$style.tip">{{ title }}</span>
    <router-link
      v-if="!isMembership && !userPrivileges?.unlimited"
      to="/settings/account"
      :class="$style.member_btn"
      >开通会员</router-link
    >
    <p v-if="!userPrivileges?.unlimited" :class="$style.count">{{ description }}</p>
  </el-popover>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { isMembership } from "@/store/useMemberInfo";
import { SvcTypeEnum } from "@/client/api/user";
import useUserPrivileges from "@/client/hooks/useUserPrivileges";

const props = defineProps<{
  type: SvcTypeEnum;
}>();

const userPrivileges = useUserPrivileges();

const count = computed(() => {
  const num =
    props.type === SvcTypeEnum.CONTRACT_AUDIT
      ? userPrivileges.value?.auditCount
      : userPrivileges.value?.diligenceCount;
  return num || 0;
});

const width = computed(() => (userPrivileges.value?.unlimited ? 200 : 262));

const isDisabled = computed(() => {
  return !(userPrivileges.value?.unlimited || count.value > 0);
});

const title = computed(() => {
  if (userPrivileges.value?.unlimited) return "您可畅享无限次提问机会";
  return isMembership.value ? "会员每月有额外50次提问机会，您已是月度会员" : "会员可享每月额外50次提问机会";
});

const description = computed(() => {
  if (isMembership.value) {
    return `当前剩余${count.value}次`;
  } else {
    return `每日可免费体验一次，当前剩余${count.value}次`;
  }
});
</script>

<style module lang="scss">
.popper {
  :global {
    .el-popper__arrow {
      display: none;
    }
  }
}

.tip {
  color: #2d364d;
}

.count {
  color: #6d7587;
}

.member_btn {
  color: #086df4;
  grid-column: 2 / 3;
  &:before {
    content: "";
    width: 1px;
    margin: 0 8px;
    height: 100%;
    border-left: 1px solid #2d364d;
  }
}

.disabled {
  opacity: 0.6;
}
</style>
