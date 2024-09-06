/**
 * 移除一个文件名的后缀
 *
 * 示例:
 * ```ts
 * removeExtension("CORS.pdf") // => "CORS"
 * removeExtension("docker.tar.gz") // => "docker.tar"
 * ```
 * @param filename 文件名
 */
export default function removeExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}
