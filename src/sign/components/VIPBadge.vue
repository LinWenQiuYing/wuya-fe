<template>
  <span v-if="isMembership" :class="$style._" title="您是我们的VIP">
    <CrownIcon />
  </span>
</template>
<script lang="ts" setup>
import CrownIcon from "@/client/icons/crown.svg";
import useMemberInfo, { isMembership } from "@/store/useMemberInfo";

useMemberInfo();
</script>
<style lang="scss" module>
._ {
  width: 16px;
  height: 16px;
  background: linear-gradient(303deg, #ffe292 0%, #dba963 100%);
  border-radius: 50%;
  border: 2px solid #fff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  svg {
    fill: currentColor;
    width: 7px;
  }
}
</style>
