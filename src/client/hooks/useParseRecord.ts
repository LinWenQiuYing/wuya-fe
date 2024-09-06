import { parseSpeech } from "@/client/api/documents";
import Recorder from "js-audio-recorder";
import { ref } from "vue";
import { useIsLoading } from "@/client/hooks/useIsLoading";
import { ParsingData } from "@/client/types/api";

export function useGetParseSpeech() {
  const [loading, setLoading] = useIsLoading();
  // 解析语音文件
  const parse = async (blob: Blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", blob);
    const result = await parseSpeech(formData);
    setLoading(false);
    return result;
  };
  return {
    parse,
    loading,
  };
}

export function useParseRecord() {
  const { parse, loading: parseLoading } = useGetParseSpeech();
  const recorder = new Recorder();
  const isRecording = ref(false);
  const parseData = ref<ParsingData>();

  function startRecord() {
    recorder
      .start()
      .then(() => {
        isRecording.value = true;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async function stopRecord() {
    recorder.stop();
    isRecording.value = false;
    const wavBlob = recorder.getWAVBlob();
    const blob = new Blob([wavBlob], { type: "audio/wav" });
    const result = await parse(blob);
    parseData.value = result;
  }

  return {
    isRecording,
    parseData,
    parseLoading,
    startRecord,
    stopRecord,
  };
}
