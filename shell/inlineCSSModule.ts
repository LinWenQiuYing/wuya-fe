import fs from "fs";
import path from "path";

type AlonePath = { style: string; component: string };

const getAlonePath = (dir: string): AlonePath | null => {
  const alonePath = {
    style: path.join(dir, "index.module.scss"),
    component: path.join(dir, "index.vue"),
  };
  const hasAloneStyle = fs.existsSync(alonePath.style);
  const hasAloneComponent = fs.existsSync(alonePath.component);
  if (hasAloneStyle && hasAloneComponent) {
    return alonePath;
  }
  return null;
};

const getDirectories = (dir: string): string[] => {
  const stat = fs.statSync(dir);
  if (stat.isDirectory()) {
    const children = fs.readdirSync(dir);
    return [dir, ...children.map((child) => getDirectories(path.join(dir, child))).flat()];
  }
  return [];
};

export const replaceStyleReference = (sourceCode: string) => {
  return sourceCode.replace(/:class="([^"]+)"/g, ($0, $1: string) => {
    const fixedClassName = $1.replace(/\bstyle\./g, "$style.");
    return `:class="${fixedClassName}"`;
  });
};

export const inlineComponentStyle = (componentSourceCode: string, styleSourceCode: string): string => {
  const fixedComponentSourceCode = replaceStyleReference(componentSourceCode).replace(
    /import\s+\S+\s+from\s+"[^/]+\/index.module.scss";\n/,
    "",
  );
  const inlineCSSModuleSourceCode = `<style lang="scss" module>\n${styleSourceCode.trimEnd()}\n</style>`;
  return `${fixedComponentSourceCode.trimEnd()}\n\n${inlineCSSModuleSourceCode.trimEnd()}\n`;
};

const inlineAloneComponentStyle = (alonePath: AlonePath) => {
  const componentSourceCode = fs.readFileSync(alonePath.component, "utf-8");
  const styleSourceCode = fs.readFileSync(alonePath.style, "utf-8");
  fs.writeFileSync(alonePath.component, inlineComponentStyle(componentSourceCode, styleSourceCode));
  fs.unlinkSync(alonePath.style);
};

const refactor = (dir: string) => {
  const directories = getDirectories(dir);
  const alinePaths = directories.map(getAlonePath).filter((it) => it !== null);
  alinePaths.forEach(inlineAloneComponentStyle);
};

export default refactor;
