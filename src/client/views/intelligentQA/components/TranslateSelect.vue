<template>
  <el-popover :popper-class="$style.popper" :show-arrow="false" :offset="0" placement="top">
    <template #reference>
      <div :class="$style.operation">
        <TranslateIcon :class="$style.icon" title="翻译" />
      </div>
    </template>
    <ul>
      <li
        v-for="(item, index) in languageOptions"
        :key="index"
        :class="$style.language"
        @click="props.onTranslate(item.value)"
      >
        {{ item.name }}
      </li>
    </ul>
  </el-popover>
</template>
<script setup lang="ts">
import TranslateIcon from "@/client/icons/translate.svg";

type TransLateLanguage = "zh" | "ja" | "en";

const props = defineProps<{
  onTranslate: (value: TransLateLanguage) => void;
}>();

const languageOptions: Array<{
  name: string;
  value: TransLateLanguage;
}> = [
  {
    name: "中文",
    value: "zh",
  },
  {
    name: "日本語",
    value: "ja",
  },
  {
    name: "English",
    value: "en",
  },
];
</script>
<style module lang="scss">
@use "src/styles/theme";

.popper {
  border: none !important;
  padding: 0 !important;
  width: 117px !important;
  height: 90px;
  background: #ffffff;
}

.language {
  padding: 0 theme.$padding-sm;
  height: 30px;
  line-height: 30px;
  font-size: theme.$font-size-base;
  color: #2d364d;

  &:hover {
    background: #f0f2f7;
  }
}

.operation {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    color: theme.$color-primary;

    .icon {
      fill: theme.$color-primary;
    }
  }
}

.title {
  padding: 0 theme.$padding-md 0 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  fill: theme.$text-color-primary;
  height: 18px;
}
</style>
