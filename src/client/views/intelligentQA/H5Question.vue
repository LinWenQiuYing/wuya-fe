<template>
  <div :class="$style._">
    <component :is="Icon" />
    <span :class="$style.text">{{ props.text }}</span>
  </div>
</template>
<script lang="ts" setup>
import type { Component } from "vue";
import NewsIcon from "@/client/icons/news.svg";
import DashboardIcon from "@/client/icons/dashboard-line-chart.svg";
import ReportIcon from "@/client/icons/report.svg";

type QuestionType = "hot" | "realtime" | "report";

const props = defineProps<{
  readonly type: QuestionType;
  readonly text: string;
}>();

const iconMap: Record<QuestionType, Component> = {
  hot: NewsIcon,
  realtime: DashboardIcon,
  report: ReportIcon,
};

const getIconByQuestionType = (type: QuestionType): Component => {
  const component = iconMap[type];
  if (!component) {
    throw Error(`unknown question type: "${type}"`);
  }
  return component;
};

const Icon = getIconByQuestionType(props.type);
</script>
<style lang="scss" module>
@use "src/styles/theme";

._ {
  border-radius: 8px;
  border: 1px solid #e5e5ec;
  height: 42px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 12px;
  font-size: 14px;
  margin: 7px 0;
  width: 100%;

  > svg {
    width: 16px;
    display: block;
    margin-right: 8px;
  }
}

.text {
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
