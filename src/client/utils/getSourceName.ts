import { KnowledgeSourceType } from "@/client/types";
import { KNOWLEDGE_SOURCE_TITLE } from "@/client/const";

export function getSourceName(sourceKeys: KnowledgeSourceType[]) {
  if (sourceKeys.includes(KnowledgeSourceType.ALL)) {
    const sources = Object.values(KnowledgeSourceType).filter((name) => name !== KnowledgeSourceType.ALL);
    return sources.map((key) => KNOWLEDGE_SOURCE_TITLE.get(key));
  }
  return sourceKeys.map((key) => KNOWLEDGE_SOURCE_TITLE.get(key));
}
