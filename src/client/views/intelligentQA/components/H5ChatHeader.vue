<template>
  <div :class="$style._">
    <div :class="$style.header">
      <div :class="$style.link_back" @click="router.go(-1)">
        <BackIcon />
      </div>
      <div v-if="props?.question" :class="$style.question_wrapper">
        <slot />
        <h2 :class="$style.chat_question">{{ props?.question }}</h2>
      </div>
      <div :class="$style.right">
        <H5Collect v-show="props.showCollect" />
      </div>
    </div>
    <div :class="$style.footer" />
  </div>
</template>
<script setup lang="ts">
import BackIcon from "@/client/icons/arrow-left-outline-radius.svg";
import H5Collect from "@/client/views/intelligentQA/components/H5Collect.vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  question: string;
  showCollect: boolean;
}>();

const router = useRouter();
</script>

<style module lang="scss">
@import "src/styles/theme";

._ {
  display: flex;
  flex-direction: column;
}

.header {
  width: 100%;
  display: flex;
  background-color: #fff;
  padding-top: 12px;
}

.footer {
  width: 100%;
  height: 12px;
  background: linear-gradient(to bottom, #fff 0%, #fff 20%, transparent 100%);
}

.link_back {
  outline: 0 none;
  background-color: unset;
  border: 0 none;
  box-shadow: none;
  width: 34px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-color-primary;
  flex-shrink: 0;
  flex-grow: 0;

  &:active {
    color: currentColor;
  }

  > svg {
    height: 18px;
    display: block;
    fill: currentColor;
    position: relative;
    margin-right: -6px;
  }
}

.question_wrapper {
  flex: 1;
}

.chat_question {
  text-align: justify;
  font-size: 20px;
}

.right {
  width: 34px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
