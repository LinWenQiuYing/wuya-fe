// also see: https://developer.chrome.com/blog/how-to-convert-arraybuffer-to-and-from-string
export default function arrayBufferToString(arrayBuffer: ArrayBuffer): string {
  return new TextDecoder().decode(arrayBuffer);
}
