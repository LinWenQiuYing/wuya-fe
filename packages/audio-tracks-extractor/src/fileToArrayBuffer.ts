// 将File对象转成ArrayBuffer格式
export default async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      if (!data) {
        reject("Trying to read into arrayBuffer but no result");
      } else if (typeof data === "string") {
        reject(`Trying to read into arrayBuffer but get string: "${data}"`);
      } else {
        resolve(data);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
