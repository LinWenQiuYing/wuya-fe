import { ref } from "vue";
// import { getSources } from "@/client/api/chat";

const defaultData = {
  personal: {
    name: "个人",
    description: "从个人文档构建的知识库中获取答案",
  },
  enterprise: {
    name: "企业",
    description: "从公司内部共享的知识管理系统中检索专业资料",
  },
  internet: {
    name: "互联网",
    description: "在公开互联网上搜索可用的信息",
  },
  finance: {
    name: "财经",
    description: "从企业年报、行业分析报告中获取专业的财经知识",
  },
  law: {
    name: "法律",
    description: "从法律法规文档中获取专业法律意见",
  },
};
export default function useGetSources() {
  const source = ref(defaultData);

  // const getList = async () => {
  //   const res = await getSources(_this);
  //   source.value = defaultData;
  // };
  //
  // onMounted(() => {
  //   getList();
  // });

  return {
    source,
  };
}
