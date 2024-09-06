import { ref, Ref } from "vue";
import computePosition from "../utils/computePosition";
import { translate } from "@/client/api/translate";

export default function (
  boxRef: Ref<HTMLDivElement>,
  iframeRef: Ref<HTMLIFrameElement>,
  tipRef: Ref<HTMLDivElement>,
  transRef: Ref<HTMLDivElement>,
) {
  const isShowTranslate = ref(false);
  const isShowTip = ref(false);
  const selectText = ref("");
  const translatedText = ref("");
  const curPosition = ref({
    pageX: 0,
    pageY: 0,
  });
  const transLoading = ref(false);
  const mousedownPosition = ref({
    pageX: 0,
    pageY: 0,
  });

  const onTranslate = async () => {
    const trans = transRef.value;
    const box = boxRef.value;
    translatedText.value = "";
    transLoading.value = true;
    isShowTip.value = false;
    isShowTranslate.value = true;
    if (trans) {
      const { x, y } = computePosition(curPosition.value, box, { width: 420, height: 400 });
      const [source, target] = detectLanguage(selectText.value);
      trans.style.left = x + "px";
      trans.style.top = y + "px";
      const formData = new FormData();
      formData.append("q", selectText.value);
      formData.append("source", source);
      formData.append("target", target);
      formData.append("format", "text");
      formData.append("api_key", "");
      const data = await translate(formData);
      translatedText.value = data.translatedText;
      transLoading.value = false;
    }
  };
  const mousedown = (e: MouseEvent) => {
    isShowTip.value = false;
    isShowTranslate.value = false;
    mousedownPosition.value.pageX = e.pageX;
    mousedownPosition.value.pageY = e.pageY;
  };
  const mouseup = (e: MouseEvent) => {
    const box = boxRef.value;
    const iframe = iframeRef.value;
    const tip = tipRef.value;
    //判断是点击事件
    if (mousedownPosition.value.pageX === e.pageX && mousedownPosition.value.pageY === e.pageY) return;
    if (box && tip && iframe) {
      const choose = iframe.contentWindow?.getSelection()?.toString() || "";
      if (choose) {
        const pageX = e.pageX;
        const pageY = e.pageY;
        curPosition.value.pageX = pageX;
        curPosition.value.pageY = pageY;
        const { x, y } = computePosition({ pageX, pageY }, box, { width: 80, height: 24 });
        tip.style.left = x + "px";
        tip.style.top = y + "px";
        isShowTip.value = true;
        selectText.value = choose;
      }
    }
  };

  const onMouse = () => {
    const iframe = iframeRef.value;
    if (iframe?.contentDocument) {
      iframe.contentDocument.addEventListener("mousedown", mousedown, false);
      iframe.contentDocument.addEventListener("mouseup", mouseup, false);
    }
  };
  const removeMouse = () => {
    const iframe = iframeRef.value;
    if (iframe?.contentDocument) {
      iframe.contentDocument.removeEventListener("mousedown", mousedown, true);
      iframe.contentDocument.removeEventListener("mouseup", mouseup, true);
    }
  };

  const detectLanguage = (text: string) => {
    const chineseRegex = /[\u4e00-\u9fa5]/g;
    let source = "en";
    let target = "zh";
    // TODO 默认英转中 有中出现时 全转英
    if (chineseRegex.test(text)) {
      source = "zh";
      target = "en";
    }
    return [source, target];
  };

  return {
    isShowTip,
    isShowTranslate,
    transLoading,
    selectText,
    translatedText,
    onMouse,
    removeMouse,
    onTranslate,
  };
}
