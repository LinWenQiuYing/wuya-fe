import getUniqueNameGenerator from "./getUniqueNameGenerator";
import getComponentNameByPath from "./getComponentNameByPath";

/**
 * hash生成器, 通过它可以为某个块(如infinity/src/sign/views/SignIn.vue)获取唯一hash.
 * 多次传入同一个块获取的hash值是同一个.
 */
export default function getUniqueBlockGenerator() {
  const fileMap = new Map<string, string>();
  const { getUniqueName } = getUniqueNameGenerator();

  /**
   * 获取某个块(块也可称之为组件)的唯一hash名, 块只由访问路径确定
   * @param fileName 块的访问路径
   * @return uniqueBlock 块的唯一hash名
   */
  const getUniqueBlock = (fileName: string): string => {
    if (fileMap.has(fileName)) return fileMap.get(fileName)!;
    const componentName = getComponentNameByPath(fileName);
    const uniqueName = getUniqueName(componentName);
    fileMap.set(fileName, uniqueName);
    return uniqueName;
  };
  return { getUniqueBlock };
}
