import { dirname, basename, parse } from "path";
import removeExtension from "./removeExtension";
import formatComponentName from "./formatComponentName";

export default function getComponentNameByPath(filename: string) {
  const { dir, base } = parse(filename);
  const rawName = base.startsWith("index.") ? basename(dir) : removeExtension(base);
  return formatComponentName(rawName);
}
