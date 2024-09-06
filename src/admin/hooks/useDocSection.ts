import { getPdfPreview } from "@/admin/api/knowledge";

function useDocSection() {
  const getPdfUrl = async (id: string) => {
    const data = await getPdfPreview(id);
    const blob = new Blob([data.file], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    return `${url}#navpanes=0&page=${1}`;
  };
  return {
    getPdfUrl,
  };
}

export default useDocSection;
