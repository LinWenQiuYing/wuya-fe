import getUniqueBlockGenerator from "./getUniqueBlockGenerator";

const { getUniqueBlock } = getUniqueBlockGenerator();
export default function getLocalIdent(className: string, fileName: string) {
  const block = getUniqueBlock(fileName);
  return `${block}_${className}`;
}
