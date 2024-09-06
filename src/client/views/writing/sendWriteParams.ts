import { useTagsHook } from "@/client/hooks/useTags";
import store from "@/store";
import { chatPrefix } from "@/utils/reqPrefix";
import appendAuthHeader from "@/sign/appendAuthHeader";
import useDefaultLanguage from "@/client/views/settings/useDefaultLanguage";
import { WriteQuery } from "./useWriting";

const WRITING_ASSISTANT_URL = `${chatPrefix}/writing`;
export default function sendWriteParams(query: WriteQuery) {
  const { getCheckedDataSourceIds, getCheckKnowStr } = useTagsHook(store);
  const context_source = [...getCheckedDataSourceIds(), ...getCheckKnowStr()];
  const defaultLanguage = useDefaultLanguage();
  return {
    url: WRITING_ASSISTANT_URL,
    params: {
      body: JSON.stringify({ ...query, context_source }),
      method: "POST",
      headers: appendAuthHeader({
        "Content-Type": "application/json",
        "Accept-Language": defaultLanguage.value,
      }),
    },
  };
}
