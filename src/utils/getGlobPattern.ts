const regCache: Record<string, RegExp> = {};
export const getGlobPattern = (glob: string) => {
  if (glob in regCache) return regCache[glob];
  const pattern = glob.replace(/\*/g, ".*");
  const reg = new RegExp(`^${pattern}$`);
  regCache[glob] = reg;
  return reg;
};
export default getGlobPattern;
