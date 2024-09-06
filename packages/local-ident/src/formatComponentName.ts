import uncapitalize from "./uncapitalize";

/**
 * 对组件名进行格式化
 * - 如果组件名是全大小, 则原样返回
 * - 否则则首字母小写
 * @param rawName 原始的组件名
 * @return componentName 处理后的组件名
 */
export default function formatComponentName(rawName: string) {
  return rawName.toUpperCase() === rawName ? rawName : uncapitalize(rawName);
}
