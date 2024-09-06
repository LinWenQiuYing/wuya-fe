import fetchPdfUrl from "@/client/components/pdfComponent/utils/fetchPdfUrl";
import { ElMessage } from "element-plus";
import useDrawer from "@/client/hooks/useDrawer";
import usePdfPreview from "@/store/hooks/usePdfPreview";
import { target } from "@/config";

const electronPdfPage = 2;
export default function useClickReference() {
  const { pdfUrl } = usePdfPreview();
  const { open } = useDrawer();
  let page = 1;
  return (data: Record<string, string>) => {
    if (data.news_link) {
      window.open(data.news_link, "_blank");
    } else {
      fetchPdfUrl(data)
        .then((url: string) => {
          if (["个人", "企业"].includes(data.from_title)) {
            const suffix = data.document_name.split(".").pop();
            if (suffix && ["ppt", "pptx", "pdf", "docx", "doc"].includes(suffix)) {
              if (target.isWeb) {
                page =
                  Number(data.document_pages.split("_")[0]) > 5
                    ? 6
                    : Number(data.document_pages.split("_")[0]);
              } else if (target.isElectron) {
                page = electronPdfPage;
              }
            }
          }
          pdfUrl.value = `${url}#page=${page}`;
          open("pdf");
        })
        .catch(() => ElMessage.error("该文档已被删除，无法预览"));
    }
  };
}
