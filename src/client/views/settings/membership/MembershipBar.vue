<template>
  <div :class="$style._">
    <PurchaseButton v-if="!isMobile" />
    <AppPayTest v-if="isMobile" />
    <CouponActivationButton />
  </div>
</template>
<script lang="ts" setup>
import PurchaseButton from "./PurchaseButton.vue";
import CouponActivationButton from "./CouponActivationButton.vue";
import AppPayTest from "./AppPayTest.vue";
import { isMobile } from "@/config";
</script>
<style lang="scss" module>
._ {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
