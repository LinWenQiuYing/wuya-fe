import { chatPrefix } from "@/utils/reqPrefix";
import appendAuthHeader from "@/sign/appendAuthHeader";
import { ServiceParams } from "@/client/views/customerService/components/useSendServiceQuery";
import useModelType from "@/store/hooks/useModelType";

const modelType = useModelType();
export default function beforeSendHandleService(params: ServiceParams) {
  const url = `${chatPrefix}/customer_service`;
  const method = "POST";
  const headers = appendAuthHeader({
    "Content-Type": "application/json",
  });
  const { query, topic_id } = params;
  return {
    url,
    params: {
      method,
      headers,
      body: JSON.stringify({ query, topic_id, chat_model: modelType.value }),
    },
  };
}
