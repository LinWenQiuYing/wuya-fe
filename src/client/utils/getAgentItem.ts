import { AideKey, aideList } from "@/client/const";

export default function getAgentItem(key?: AideKey) {
  if (key === AideKey.NO_AGENT || !key) return undefined;
  return aideList.find((item) => item.key === key);
}
