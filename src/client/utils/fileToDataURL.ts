import arrayBufferToString from "@/client/utils/arrayBufferToString";

// 将File对象转成base64格式
export default async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      if (!dataURL) {
        reject();
      } else if (typeof dataURL === "string") {
        resolve(dataURL);
      } else {
        resolve(arrayBufferToString(dataURL));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
