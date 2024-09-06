import { ref } from "vue";

const defaultData = [
  {
    id: "1",
    title: "金融年报",
    description: "详细记录了财务状况、利润与损失表、资产负债表以及审计结…",
    num: 123,
  },
  {
    id: "2",
    title: "市场趋势分析报告",
    description: "投资组合报告汇总了公司的投资组合情费者趋势的深入分析，…",
    num: 123,
  },
  {
    id: 4,
    title: "投资组合报告",
    description: "投资组合报告汇总了公司的投资组合情况，包括股票、债券、…",
    num: 123,
  },
  {
    id: 5,
    title: "风险管理策略",
    description: "收录了公司的风险管理策略手册，包括风险识别、评估、应…",
    num: 123,
  },
  {
    id: 6,
    title: "财务政策",
    description: "详细介绍了公司的财务管理政策和流程，包括预算编制、成本…",
    num: 123,
  },
  {
    id: 7,
    title: "员工培训资料库",
    description: "包含了公司的培训计划、培训课程和培训资料，旨在提升员工…",
    num: 123,
  },
  {
    id: "1",
    title: "金融年报",
    description: "详细记录了财务状况、利润与损失表、资产负债表以及审计结…",
    num: 123,
  },
  {
    id: "2",
    title: "市场趋势分析报告",
    description: "投资组合报告汇总了公司的投资组合情费者趋势的深入分析，…",
    num: 123,
  },
];

export default function useGetKnowledgeBase() {
  const cardData = ref(defaultData);
  return {
    cardData,
  };
}
