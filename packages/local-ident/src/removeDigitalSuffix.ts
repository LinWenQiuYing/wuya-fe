import memorize from "./memorize";

/**
 * 移除尾部的数字, 全数字则忽略
 *
 * e.g. removeDigitalSuffix("input1") // => input
 * @param id
 */
const removeDigitalSuffix = (id: string): string => {
  return /^\d+$/.test(id) ? id : id.replace(/\d*$/, "");
};

/**
 * 这是一个纯函数式的, 所以对结果进行缓存
 */
export default memorize(removeDigitalSuffix);
