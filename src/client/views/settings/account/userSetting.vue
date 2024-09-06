<template>
  <div :class="$style._">
    <account-header :slot-options="slotOptions">
      <template #back>
        <ArrowLeftBold :class="$style.arrowClass"></ArrowLeftBold>
      </template>
      <template #title>用户名设置</template>
      <template #confirm>
        <span @click="onClick">确定</span>
      </template>
    </account-header>
    <div :class="$style.userInput">
      <el-input v-model="displayValue" placeholder="请输入用户名" :class="$style.username" clearable />
    </div>
  </div>
</template>

<script setup lang="ts">
import useUsername, { setUsername } from "../useUsername";
import AccountHeader from "@/client/components/AccountHeader.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeftBold } from "@element-plus/icons-vue";
import { optionType } from "@/client/components/types/component";
import { ElMessage } from "element-plus";
import isValidUserName from "../isValidUserName";

const router = useRouter();
const userName = useUsername();
const displayValue = ref(userName.value);
const onClick = async () => {
  if (userName.value === displayValue.value) return;
  if (!displayValue.value || displayValue.value.length > 30 || !isValidUserName(displayValue.value))
    return ElMessage.info("请输入30字以内的中英文、数字");
  await updateUsername(displayValue.value);
};
const slotOptions: optionType[] = [
  {
    className: "title",
    name: "title",
  },
  {
    className: "confirm",
    name: "confirm",
  },
];
const updateUsername = async (username: string) => {
  const success = await setUsername(username);
  if (success) {
    setTimeout(() => {
      router.go(-1);
    }, 1000);
  } else {
    return;
  }
};
</script>

<style lang="scss" module>
._ {
  background: linear-gradient(180deg, #fbfbff 0%, #fdfcfc 52%, #ffffff 100%, #ffffff 100%);
  height: 100%;

  .confirm {
    font-weight: 400;
    font-size: 16px;
    color: #999999;
    position: absolute;
    right: 15px;
  }

  .userInput {
    padding: 18px 15px 0;

    .username {
      height: 42px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #f4f2f2;
    }
  }
}

.arrowClass {
  width: 20px;
  height: 57px;
}
</style>
