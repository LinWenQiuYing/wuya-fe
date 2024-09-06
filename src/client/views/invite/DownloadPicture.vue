<template>
  <div :class="$style._">
    <div>
      <img :class="$style.pictureCode" :src="qrCodeImage" alt="QR Code" />
    </div>
    <div :class="$style.linkFont" @click="convertToImage">下载二维码</div>
    <div v-show="false" :class="$style.codeCanvas" ref="qrcode">
      <QrCodeStyle v-model="qrCodeImage"></QrCodeStyle>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ModelRef, ref } from "vue";
import QrCodeStyle from "./QrCodeStyle.vue";
import { useConvertToImage } from "./useDownloadQrCode";
import { useUrlToQRCode } from "./useUrlToQRCode";
const qrcode = ref<HTMLElement | null>(null);
const linkUrl = defineModel<string>();
const qrCodeImage = useUrlToQRCode(<ModelRef<string>>linkUrl);

const convertToImage = () => {
  useConvertToImage(qrcode.value!);
};
</script>

<style module lang="scss">
@use "src/styles/theme";

._ {
  width: 170px;
  height: 193px;
}

.pictureCode {
  width: 138px;
  height: 138px;
  padding: 16px 16px 0;
}

.codeCanvas {
  width: 284px;
  height: 382px;
  background-color: #f0f2f5;
}

.linkFont {
  cursor: pointer;
  padding: 8px 0 0 16px;
  height: 19px;
  font-size: theme.$font-size-base;
  color: #086df4;
  line-height: 19px;
  text-align: left;
  font-style: normal;
  font-weight: 700;
}
</style>
