<template>
  <div :class="$style._">
    <account-header :slot-options="slotOptions">
      <template #back>
        <ArrowLeftBold :class="$style.arrowClass"> </ArrowLeftBold>
      </template>
      <template #title>头像设置</template>
      <template #more>
        <MoreFilled @click="setImage(imageRef)"></MoreFilled>
      </template>
    </account-header>
    <div :class="$style.wrap">
      <img :src="avatar ? avatar : AvatarURL" :class="$style.avatar" />
    </div>
    <input ref="imageRef" type="file" accept="image/*" @change="saveImage" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AvatarURL from "@/assets/image/avatar.png";
import AccountHeader from "@/client/components/AccountHeader.vue";
import { MoreFilled, ArrowLeftBold } from "@element-plus/icons-vue";
import useAvatar, { setAvatar } from "@/store/hooks/useAvatar";
import fileToDataURL from "@/client/utils/fileToDataURL";
import { optionType } from "@/client/components/types/component";
const avatar = useAvatar();
const imageRef = ref<HTMLInputElement>();
const setImage = (inputRef_) => {
  if (!inputRef_) return;
  inputRef_.click();
};

const slotOptions: optionType[] = [
  {
    className: "fill",
    name: "more",
  },
  {
    className: "title",
    name: "title",
  },
];
const saveImage = async (event: Event) => {
  const files = (<HTMLInputElement>event.target).files;
  if (!files) return;
  const base64 = await fileToDataURL(files[0]).catch(console.error);
  if (!base64) return;
  const success = await setAvatar(base64);
  if (!success) return;
  // dropdownVisible.value = false;
};
</script>

<style lang="scss" module>
._ {
  background: linear-gradient(180deg, #fbfbff 0%, #fdfcfc 52%, #ffffff 100%, #ffffff 100%);
  height: 100%;

  input {
    display: none;
  }
}

.wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.avatar {
  width: 100%;
  height: 359px;
  max-width: 375px;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: rgba(0, 0, 0, 0.6);
}

.mask:global(.hidden) {
  display: none;
}

.menuList {
  position: fixed;
  z-index: 3;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #f4f4f4;
  border-radius: 12px 12px 0 0;

  > li {
    width: 100%;
    background: #ffffff;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #f4f4f4;

    &:nth-child(2) {
      border-bottom: 6px solid #f4f4f4;
    }
  }
}
.arrowClass {
  width: 20px;
  height: 57px;
}
</style>
