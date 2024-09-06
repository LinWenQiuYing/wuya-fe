import { useTagsHook } from "@/client/hooks/useTags";
import store from "@/store";
import useModelType from "@/store/hooks/useModelType";
import useReferencesLimit from "@/client/views/settings/useReferencesLimit";
import useDefaultLanguage from "@/client/views/settings/useDefaultLanguage";
import { chatPrefix } from "@/utils/reqPrefix";
import { ChatParams } from "@/client/types/api";
import appendAuthHeader from "@/sign/appendAuthHeader";

const modelType = useModelType();
const referencesLimit = useReferencesLimit();
const defaultLanguage = useDefaultLanguage();

export default function sendQaParams(chatParams: ChatParams) {
  const { getCheckedDataSourceIds, getCheckKnowStr } = useTagsHook(store);
  // 获取选择的所有文件或来源
  const checkAttachments = () => {
    return [...getCheckedDataSourceIds(), ...getCheckKnowStr()];
  };
  const qaUrl = `${chatPrefix}/qa`;
  chatParams.sources = checkAttachments();
  if (chatParams.sourceNewsId) {
    chatParams.sources.push("news-" + chatParams.sourceNewsId);
    delete chatParams.sourceNewsId;
  }
  if (!chatParams.chat_model && modelType.value) {
    chatParams.chat_model = modelType.value;
  }
  // 引用数量
  chatParams["max_references"] = referencesLimit.value;
  const url = chatParams.newsId ? `${chatPrefix}/news/interpretation/${chatParams.newsId}` : qaUrl;
  const method = chatParams.newsId ? "GET" : "POST";

  const headers = appendAuthHeader({
    "Content-Type": "application/json",
    "Accept-Language": defaultLanguage.value,
  });
  const { query, chat_model, sources, max_references, topic_id, key } = chatParams;
  const params = { query, chat_model, sources, max_references, topic_id, key };
  const body = !chatParams.newsId ? JSON.stringify(params) : null;

  return {
    url,
    params: {
      method,
      headers,
      body,
    },
  };
}
