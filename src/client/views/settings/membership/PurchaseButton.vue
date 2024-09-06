<template>
  <button type="button" :class="$style.btn" @click="showDialog">{{ title }}</button>
  <Teleport to="body">
    <PurchaseDialog v-if="dialogVisible" v-model:visible="dialogVisible" />
  </Teleport>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import PurchaseDialog from "./PurchaseDialog.vue";
import useMemberInfo, { isMembership } from "@/store/useMemberInfo";

const dialogVisible = ref(false);

useMemberInfo();

const title = computed(() => (isMembership.value ? "续费会员" : "开通会员"));

const showDialog = () => (dialogVisible.value = true);
</script>
<style lang="scss" module>
.btn {
  background-image: linear-gradient(-70deg, #1776ff 0%, #6ac9ff 100%);
  border-radius: 4px;
  padding: 5px 12px;
  line-height: 20px;
  border: unset;
  box-shadow: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #eee;
  transition: color 0.3s ease-in-out;
  margin-left: 12px;
  font-size: 14px;

  &:hover {
    color: #fff;
  }
}
</style>
