import removeExtension from "./removeExtension";

export default function getNamesSummary(names: string[]) {
  const stringifyNames = names.map(removeExtension).join(",");
  return stringifyNames.length > 10 ? stringifyNames.slice(0, 10) + "..." : stringifyNames;
}
