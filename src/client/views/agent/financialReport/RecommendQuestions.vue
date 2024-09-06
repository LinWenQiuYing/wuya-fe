<template>
  <div :class="$style._">
    <div v-for="(item, key) in data" :key="key" :class="$style.wrapper">
      <div v-if="item.title" :class="$style.title">
        {{ item.title }}
      </div>
      <div :class="$style.question_wrapper">
        <Question
          v-for="(question, index) in item.questions"
          :key="index"
          :data="question"
          @click="() => send(question)"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Question from "@/client/components/Question.vue";
import createFinancialReport from "@/client/hooks/createFinancialReport";

const props = defineProps<{
  send?: (question: string) => void;
}>();

const send = props.send ?? createFinancialReport;
const data = [
  { title: "", questions: ["全部指标", "常规性分析", "合规性检查"] },
  {
    title: "常规性分析",
    questions: [
      "收入波动分析",
      "销售回款分析",
      "三费分析",
      "利润分析",
      "毛利率分析",
      "货币资金分析",
      "运营效率分析",
      "其他应收款分析",
      "商誉风险分析",
      "负债分析",
      "现金流量分析",
    ],
  },
  {
    title: "合规性检查",
    questions: [
      "税金及附加合理性分析",
      "所得税比例检查",
      "其他应收款异常变动检查",
      "未分配利润与净利润的勾稽",
      "潜在资金占用、民间借贷检查",
      "融资居间费用比例检查",
    ],
  },
];
</script>
<style module lang="scss">
@use "src/styles/theme";

._ {
  height: 100%;
  padding-bottom: 70px;
}

.wrapper {
  margin-top: 16px;
}

.title {
  padding-left: 10px;
  height: 40px;
  line-height: 40px;
  font-weight: bold;
  font-size: 16px;
  color: #2d364d;
}

.question_wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 8px;
}
</style>
