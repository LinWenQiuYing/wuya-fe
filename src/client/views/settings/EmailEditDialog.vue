<template>
  <el-dialog v-model="visible" :class="$style._">
    <template #header>
      <h3 :class="$style.title">{{ title }}</h3>
    </template>
    <template v-if="steps.validatingOldEmail.value">
      <EmailVerifyForm :email="userInfo?.email!" @close="closeDialog" @next="onOldEmailValidated" />
    </template>
    <template v-if="steps.editingNewEmail.value">
      <EmailEditForm @close="closeDialog" @next="closeDialog" />
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import EmailEditForm from "./EmailEditForm.vue";
import EmailVerifyForm from "./EmailVerifyForm.vue";
import useUserInfo from "@/store/hooks/useUserInfo";

const visible = defineModel<boolean>();

const userInfo = useUserInfo();
const title = userInfo.value?.email ? "修改邮箱" : "绑定邮箱";
const validateOldEmailRequired = computed(() => userInfo.value?.email);
const oldEmailValidated = ref(false);
const steps = {
  validatingOldEmail: computed(() => validateOldEmailRequired.value && !oldEmailValidated.value),
  editingNewEmail: computed(() => !validateOldEmailRequired.value || oldEmailValidated.value),
};

const closeDialog = () => (visible.value = false);

const onOldEmailValidated = () => {
  oldEmailValidated.value = true;
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
