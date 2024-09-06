<template>
  <div :class="$style.logoImg">
    <LogoBookName />
  </div>
  <div :class="$style.introduce">让知识即刻呈现，让回答值得信赖</div>
  <div :class="$style.scanMessage">扫码注册，即可体验</div>
  <img :class="$style.pictureCode" :src="qrCodeImage" alt="QR Code" style="padding: 11px 73px 0" />
  <!--  <div :class="$style.invitePeople">分享者：{{ userInfo?.username }}</div>-->
</template>
<script setup lang="ts">
const userInfo = useUserInfo();
import useUserInfo from "@/store/hooks/useUserInfo";
import LogoBookName from "@/client/icons/logo-books-name-horizontal.svg";
const qrCodeImage = defineModel<string>();
</script>
<style module lang="scss">
.logoImg {
  padding: 44px 76px 0;
}

.introduce {
  padding: 7px 37px 0;
  font-size: 14px;
  color: #6d7587;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}

.scanMessage {
  font-size: 12px;
  color: #2d364d;
  line-height: 22px;
  text-align: center;
  font-style: normal;
  padding-top: 27px;
}

.pictureCode {
  width: 138px;
  height: 138px;
  padding: 16px 16px 0;
}

.invitePeople {
  font-size: 12px;
  color: #2d364d;
  line-height: 22px;
  font-style: normal;
  padding-top: 12px;
  text-align: center;
}
</style>
