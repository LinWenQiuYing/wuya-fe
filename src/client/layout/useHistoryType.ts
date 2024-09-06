import { computed } from "vue";
import useActiveModule, { ModuleCode } from "./useActiveModule";
import { HistoryChatType } from "@/client/types";

const getHistoryTypeByActiveModule = (activeModule: ModuleCode | null): HistoryChatType | null => {
  if (!activeModule) return null;
  switch (activeModule) {
    case "qa":
      return HistoryChatType.intelligent_qa;
    case "news":
      return HistoryChatType.real_time_information;
    case "writing":
      return HistoryChatType.writing_assistant;
    default:
      return null;
  }
};

export default function useHistoryType() {
  const activeModule = useActiveModule();
  return computed(() => getHistoryTypeByActiveModule(activeModule.value) ?? HistoryChatType.intelligent_qa);
}
