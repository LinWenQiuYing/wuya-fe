const withEndSlash = (path: string): string => {
  return path.endsWith("/") ? path : `${path}/`;
};
export default withEndSlash;
