<template>
  <el-dialog v-model="visible" :class="$style._">
    <template #header>
      <h3 :class="$style.title">{{ title }}</h3>
    </template>
    <template v-if="!next_">
      <PhoneVerifyForm :phone="phone!" @close="closeDialog" @next="setPassWord" />
    </template>
    <template v-if="next_">
      <PasswordSetForm @close="closeDialog" @finish="closeDialog" :numPhone="numPhone" />
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import PasswordSetForm from "./PasswordSetForm.vue";
import PhoneVerifyForm from "./PhoneVerifyForm.vue";
import { getUserPhone } from "@/client/api/user";

const visible = defineModel<boolean>();
const next_ = ref<boolean>(false);
const phone = await getUserPhone();
const title = computed(() => {
  return next_.value ? "设置密码" : "验证手机号";
});

const closeDialog = () => (visible.value = false);
type numPhone_ = {
  phone: string | number;
  verifyCode: string | number;
};
const numPhone = reactive<numPhone_>({
  phone: phone,
  verifyCode: "",
});
const setPassWord = (value: number | string) => {
  next_.value = true;
  console.log(next_.value, "next_.value");
  numPhone.verifyCode = value;
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
