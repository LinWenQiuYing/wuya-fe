<template>
  <button type="button" :class="$style.btn" @click="showDialog">兑换会员</button>
  <Teleport to="body">
    <CouponActivationDialog v-if="dialogVisible" v-model:visible="dialogVisible" />
  </Teleport>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import CouponActivationDialog from "./CouponActivationDialog.vue";

const dialogVisible = ref(false);

const showDialog = () => (dialogVisible.value = true);
</script>
<style lang="scss" module>
@use "src/styles/theme";

.btn {
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #dddfe3;
  padding: 4px 10px;
  line-height: 20px;
  color: theme.$text-color-primary;
  background: unset;
  box-shadow: unset;
  outline: unset;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition:
    color 0.3s ease-in-out,
    border-color 0.3s ease-in-out;

  &:hover {
    color: theme.$color-primary;
    border-color: theme.$color-primary;
  }
}
</style>
