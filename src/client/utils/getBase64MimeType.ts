export default function getBase64MimeType(base64: string) {
  const regexp = /^data:([^;]+);base64,/;
  const result = regexp.exec(base64);
  if (!result) {
    throw new Error(`The input content is not in base64 format: ${base64}`);
  }
  return result[1];
}
