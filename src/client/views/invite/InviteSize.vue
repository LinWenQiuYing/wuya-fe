<template>
  <div :class="$style.inviteSize">
    <span>我已邀请 </span>
    <span :class="$style.invitePeopleFont">{{ inviteNumber }}</span>
    <span> 人，第 </span><span :class="$style.invitePeopleFont">{{ inviteRank || "--" }}</span
    ><span> 名</span>
  </div>
</template>
<script setup lang="ts">
const inviteNumber = defineModel<number>("inviteNumber");
const inviteRank = defineModel<number>("inviteRank");
</script>
<style lang="scss" module>
@use "src/styles/theme";

.inviteSize {
  padding: 13px 0 20px 22px;
  span {
    vertical-align: middle;
    line-height: 22px;
  }
}

.invitePeopleFont {
  font-weight: bold;
  font-size: theme.$font-size-xxl;
  color: #086df4;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}
</style>
