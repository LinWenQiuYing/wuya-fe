import { SurveyParams } from "@/client/views/survey/hooks/useSurvey";
import { useTagsHook } from "@/client/hooks/useTags";
import store from "@/store";
import useModelType from "@/store/hooks/useModelType";
import { chatPrefix } from "@/utils/reqPrefix";
import appendAuthHeader from "@/sign/appendAuthHeader";
import useReferencesLimit from "@/client/views/settings/useReferencesLimit";

const WRITING_ASSISTANT_URL = `${chatPrefix}/enterprise_research/stream_generation`;

const modelType = useModelType();
export default function sendSurveyParams(params: SurveyParams) {
  const { getCheckedDataSourceIds, getCheckKnowStr } = useTagsHook(store);
  const referencesLimit = useReferencesLimit();
  const sources = [...getCheckedDataSourceIds(), ...getCheckKnowStr()];
  if (!params.chat_model && modelType.value) {
    params.chat_model = modelType.value;
  }
  const { chat_model, query, outline, topic_id, modify_flag, qa_record_id, enterprise_name, stock_code } =
    params;
  return {
    url: WRITING_ASSISTANT_URL,
    params: {
      method: "POST",
      headers: appendAuthHeader({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        chat_model,
        sources,
        query,
        outline,
        topic_id,
        modify_flag,
        qa_record_id,
        enterprise_name,
        stock_code,
        max_references: referencesLimit.value,
      }),
    },
  };
}
