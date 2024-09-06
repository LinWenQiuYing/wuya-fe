import { computed } from "vue";
import store from "..";
import { Set_Loading, Set_PdfUrl } from "../modules/pdfPreview";

export default function usePdfPreview() {
  const pdfUrl = computed({
    get(): string | null {
      return store.state.pdfPreview.pdfUrl;
    },
    set(url: string | null) {
      store.commit(`pdfPreview/${Set_PdfUrl}`, url);
    },
  });
  const pdfLoading = computed<boolean>({
    get() {
      return store.state.pdfPreview.loading;
    },
    set(value: boolean) {
      store.commit(`pdfPreview/${Set_Loading}`, value);
    },
  });
  return {
    pdfUrl,
    pdfLoading,
  };
}
