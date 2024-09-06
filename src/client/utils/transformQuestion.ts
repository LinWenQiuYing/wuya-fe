import { QuestionDocType } from "@/client/types";

export interface SourceIdParams {
  kb_id?: string[];
  dir_id?: string[];
  doc_id?: string[];
}

export default function transformQuestion(ids: SourceIdParams[]): QuestionDocType {
  return ids.reduce((pre, current) => {
    if (current.kb_id !== undefined) {
      if (!pre.kbIdList) pre.kbIdList = [];
      pre.kbIdList = pre.kbIdList.concat(current.kb_id);
    } else if (current.dir_id !== undefined) {
      if (!pre.dirIdList) pre.dirIdList = [];
      pre.dirIdList = pre.dirIdList.concat(current.dir_id);
    } else if (current.doc_id !== undefined) {
      if (!pre.docIdList) pre.docIdList = [];
      pre.docIdList = pre.docIdList.concat(current.doc_id);
    }
    return pre;
  }, {} as QuestionDocType);
}
