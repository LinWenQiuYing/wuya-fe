import { VideoParams } from "@/client/views/video/components/useSendVideoQuery";
import { chatPrefix } from "@/utils/reqPrefix";
import appendAuthHeader from "@/sign/appendAuthHeader";

export default function beforeSendHandleVideo(params: VideoParams) {
  const url = `${chatPrefix}/video-parser`;
  const method = "POST";
  const headers = appendAuthHeader({
    "Content-Type": "application/json",
  });
  const { query, topic_id, video_source } = params;
  return {
    url,
    params: {
      method,
      headers,
      body: JSON.stringify({ query, topic_id, video_source }),
    },
  };
}
