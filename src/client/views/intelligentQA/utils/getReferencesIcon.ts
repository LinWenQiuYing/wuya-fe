import ExcelIcon from "@/client/icons/excel.svg";
import ImageIcon from "@/client/icons/image.svg";
import TxtIcon from "@/client/icons/txt.svg";
import VideoIcon from "@/client/icons/video.svg";
import WordIcon from "@/client/icons/word.svg";
import PdfIcon from "@/client/icons/pdf.svg";

export default function getReferencesIcon(data: Record<string, any>) {
  if (!data.document_name) return PdfIcon;
  const splitName = data.document_name.split(".");
  const suffix = splitName[splitName.length - 1];
  switch (suffix) {
    case "gif":
    case "bmp":
    case "jpg":
    case "jpeg":
    case "png":
      return ImageIcon;
    case "doc":
    case "docx":
      return WordIcon;
    case "wav":
    case "ogg":
    case "aac":
    case "flac":
    case "m4a":
    case "avi":
    case "flv":
    case "wmv":
    case "mkv":
    case "mp3":
    case "mp4":
    case "weba":
      return VideoIcon;
    case "xlsx":
    case "csv":
      return ExcelIcon;
    case "txt":
      return TxtIcon;
    default:
      return PdfIcon;
  }
}
