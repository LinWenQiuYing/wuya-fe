import { pdfPreview } from "@/client/api/knowSource";

export default function usePdfUrl() {
  const getPdfUrl = async (id: string) => {
    const data = await pdfPreview(id);
    const blob = new Blob([data.file], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    return `${url}#navpanes=0&page=${1}`;
  };
  return getPdfUrl;
}
