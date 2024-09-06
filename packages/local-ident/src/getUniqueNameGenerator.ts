import removeDigitalSuffix from "./removeDigitalSuffix";

/**
 * hash生成器, 通过它可以为组件名(如input, button)获取唯一hash, 组件名可重复
 */
export default function getUniqueNameGenerator() {
  // key: 组件名, 如 input, button
  // value: 该组件名统计的个数 - 1
  const conflictMap = new Map<string, number>();

  const getUniqueName = (name: string): string => {
    // 移除了name的尾部数字, 以保证不会和构建结果产生冲突
    const safeName = removeDigitalSuffix(name);
    if (conflictMap.has(safeName)) {
      const seq = (conflictMap.get(safeName) ?? 0) + 1;
      conflictMap.set(safeName, seq);
      return `${safeName}${seq}`;
    } else {
      conflictMap.set(safeName, 0);
      return safeName;
    }
  };

  return { getUniqueName };
}
