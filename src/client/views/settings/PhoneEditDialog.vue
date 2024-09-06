<template>
  <el-dialog v-model="visible" :class="$style._">
    <template #header>
      <h3 :class="$style.title">{{ title }}</h3>
    </template>
    <template v-if="steps.validatingOldPhone.value">
      <PhoneVerifyForm :phone="phone!" @close="closeDialog" @next="onOldPhoneValidated" />
    </template>
    <template v-if="steps.editingNewPhone.value">
      <PhoneEditForm @close="closeDialog" @next="closeDialog" />
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import PhoneEditForm from "./PhoneEditForm.vue";
import PhoneVerifyForm from "./PhoneVerifyForm.vue";
import { getUserPhone } from "@/client/api/user";

const visible = defineModel<boolean>();

const phone = await getUserPhone();
const title = phone ? "修改手机号" : "绑定手机号";
const validateOldPhoneRequired = computed(() => phone !== null);
const oldPhoneValidated = ref(false);
const steps = {
  validatingOldPhone: computed(() => validateOldPhoneRequired.value && !oldPhoneValidated.value),
  editingNewPhone: computed(() => !validateOldPhoneRequired.value || oldPhoneValidated.value),
};

const closeDialog = () => (visible.value = false);

const onOldPhoneValidated = () => {
  oldPhoneValidated.value = true;
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  // 除了顶部, 将内边距移除, 改为form组件自己设置
  --el-dialog-padding-primary: #{theme.$dialog-breath-vertical} 0 0;
  width: 480px;
}

.title {
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: theme.$text-color-primary;
  padding-left: theme.$dialog-breath-horizontal;
}
</style>
