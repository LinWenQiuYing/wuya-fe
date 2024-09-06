<template>
  <div :class="$style._">
    <!--    <h3 :class="$style.title">个人资料</h3>-->
    <p :class="$style.info">可在此填写个人情况，用于推荐新闻以及让模型给出更有用的回答</p>
    <p :class="$style.tips">个人资料仅用于让模型更了解用户，不会作公开用途，可随时清空</p>
    <el-input
      v-model="bio"
      :class="$style.input"
      :rows="13"
      type="textarea"
      placeholder="我是一个软件工程师，关注金融行业的新闻"
    />
    <!--    <h4 :class="$style.head4">无涯Prompt</h4>-->
    <!--    <el-input-->
    <!--      v-model="prompt"-->
    <!--      :class="$style.input"-->
    <!--      :rows="13"-->
    <!--      type="textarea"-->
    <!--      placeholder="可在此输入模型回答时的Prompt"-->
    <!--    />-->
    <el-button type="primary" :class="$style.btn" @click="updatePersonalDetails">保存</el-button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import useUserInfo from "@/store/hooks/useUserInfo";
import { updateProfileColumn } from "@/client/api/user";
import { ResponseBody } from "@/sign/api/sign";

const userInfo = useUserInfo();
const bio = ref<string>(userInfo.value?.personalDetails ?? "");
// const prompt = ref<string>(userInfo.value?.defaultPrompt ?? "");

// const updateProfile = async () => {
//   const response = await Promise.all([
//     updateProfileColumn("personal_details", bio.value),
//     updateProfileColumn("default_prompt", prompt.value),
//   ]).catch((err: ResponseBody<null>[]) => {
//     if (err.length > 0) {
//       ElMessage.error(err[0]);
//     }
//   });
//   if (!response) return;
//   userInfo.value = { ...userInfo.value!, personalDetails: bio.value, defaultPrompt: prompt.value };
//   ElMessage.success("个人资料更新成功");
// };

const updatePersonalDetails = async () => {
  const response = await updateProfileColumn("personal_details", bio.value).catch(
    (err: ResponseBody<null>) => {
      ElMessage.error(err);
    },
  );
  if (!response) return;
  ElMessage.success("个人资料更新成功");
  if (!userInfo.value) return;
  userInfo.value = { ...userInfo.value, personalDetails: bio.value };
};
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  //min-width: 375px;
  max-width: 720px;
  margin: 28px auto;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 18px;
  color: theme.$text-color-primary;
  line-height: 32px;
  font-weight: 700;
  margin: 28px 0;
}

.info {
  font-size: 16px;
  color: theme.$text-color-primary;
  line-height: 24px;
  font-weight: 400;
}

.tips {
  font-size: 14px;
  color: #6d7587;
  line-height: 22px;
  font-weight: 400;
  padding-top: 12px;
}

.input {
  margin: 20px 0;
  width: 100%;
  height: 286px;
}

.head4 {
  margin-top: 20px;
  font-size: 16px;
  color: #2d364d;
  line-height: 24px;
  font-weight: 400;
}

.btn {
  align-self: flex-end;
  margin-top: 8px;
}
</style>
