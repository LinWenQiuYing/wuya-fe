export default async function dataURLToFile(dataURL: string, fileName: string, type: string): Promise<File> {
  const res: Response = await fetch(dataURL);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type });
}
