const cache: Record<string, string> = {};
export const getIcon = (key: string) => {
  return key in cache ? cache[key] : null;
};
export const setIcon = (key: string, icon: string) => {
  cache[key] = icon;
};
