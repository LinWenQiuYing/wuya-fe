<template>
  <div class="knowledge-wrapper">
    <div class="left">
      <LiftCardList @change-type="changeType" />
    </div>
    <div class="right">
      <RightContent :type="type" @change-type="changeType" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import LiftCardList from "./LiftCardList.vue";
import RightContent from "./RightContent.vue";

const type = ref("table");
const changeType = (val: string) => {
  type.value = val;
};
</script>

<style scoped lang="scss">
@import "src/styles/theme";
.knowledge-wrapper {
  /* padding: 16px; */
  height: 100%;
  width: 100%;
  display: flex;
  //background: #ffffff;
  background: $background-color-light;
}

.left {
  flex: 0 0 320px;
  width: 320px;
  padding: 2px 24px 12px;
  border-right: 1px solid #e0e4f1;
  /* background: #ffffff; */
}

.right {
  /* background: linear-gradient(134deg, #e4f8ff 0%, #e7eeff 100%); */
  // padding: 16px 20px;
  padding: 0 $padding-xl $padding-xl;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
// .crete-wrapper {
//   height: 100%;
//   padding: $padding-md;
// }
</style>
