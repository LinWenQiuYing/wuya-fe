<template>
  <div :class="$style._">
    <account-header :slot-options="slotOptions">
      <template #back>
        <ArrowLeftBold :class="$style.arrowClass"> </ArrowLeftBold>
      </template>
      <template #title> 手机号设置</template>
    </account-header>
    <div :class="$style.settingNum">
      <p :class="$style.isBind">
        {{ userInfo.phone ? "已绑定手机号" : "没有绑定手机号" }}
      </p>
      <p v-if="userInfo.phone" :class="$style.bindingNum">
        <span>{{ isShowNum ? phone_ : userInfo.phone }}</span>
        <span @click="getUserPhone_">{{ isShowNum ? "隐藏" : "显示" }}</span>
      </p>
      <button type="button" :class="$style.skipBtn">
        <router-link :class="$style.editBtn" :to="{ name: 'numberChange' }">
          {{ userInfo.phone ? "更换手机号" : "去绑定" }}
        </router-link>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AccountHeader from "@/client/components/AccountHeader.vue";
import { useRouter } from "vue-router";
import { getUserPhone } from "@/client/api/user";
import useUserInfo from "@/store/hooks/useUserInfo";
import { isMobile } from "@/config";
import { ArrowLeftBold, ArrowRight } from "@element-plus/icons-vue";
import { optionType } from "@/client/components/types/component";

const userInfo = useUserInfo();
const router = useRouter();
const phone_ = ref<string>();
const isShowNum = ref<boolean>(false);
const slotOptions: optionType[] = [
  {
    className: "title",
    name: "title",
  },
];
const getUserPhone_ = async () => {
  if (!isShowNum.value) {
    phone_.value = await getUserPhone();
  }
  isShowNum.value = !isShowNum.value;
};
</script>

<style lang="scss" module>
._ {
  background: linear-gradient(180deg, #fbfbff 0%, #fdfcfc 52%, #ffffff 100%, #ffffff 100%);
  height: 100%;
}

.settingNum {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.isBind {
  font-weight: 500;
  font-size: 18px;
  color: #333333;
  padding: 40px 0;
}

.bindingNum {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 52px;
  span {
    &:nth-child(1) {
      font-weight: 500;
      font-size: 24px;
      color: #333333;
    }

    &:nth-child(2) {
      font-weight: 400;
      font-size: 14px;
      color: #206cf1;
      margin-left: 12px;
    }
  }
}
.skipBtn {
  border: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 345px;
  height: 42px;
  background: #206cf1;
  border-radius: 8px;
  & > a {
    font-weight: 400;
    font-size: 16px;
    color: #ffffff;
  }
}
.arrowClass {
  width: 20px;
  height: 57px;
}
</style>
