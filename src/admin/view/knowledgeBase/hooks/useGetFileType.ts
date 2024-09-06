import { computed, onMounted, ref } from "vue";
import { Parser, Target_Content_Type } from "@/admin/types/api";
import { getParserType } from "@/admin/api/knowledge";

export default function useGetFileType() {
  const parserTypes = ref<Array<Parser>>([]); // 所有解析类型
  const fileName = ref("请选择本地PDF文件"); // 当前选择name
  const fileType = ref<Target_Content_Type>(); // 文件类型

  onMounted(async () => {
    const result = await getParserType();
    parserTypes.value = result.data; //获取所有的文件类型
  });

  const fileParserTypes = computed(() => {
    return parserTypes.value.filter((item) => {
      if (typeof item.target_content_type === "string") {
        return item.target_content_type === fileType.value;
      } else {
        return item.target_content_type.includes(fileType.value);
      }
    });
  });
  return {
    parserTypes,
    fileName,
    fileType,
    fileParserTypes,
  };
}
