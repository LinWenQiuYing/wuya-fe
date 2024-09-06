import { ref, onMounted, onUnmounted } from "vue";
import { TimeNotation } from "@/utils/isTimeNotation";
import parseTimeNotation from "@/utils/parseTimeNotation";

export default function useExpired(ttl: TimeNotation) {
  const ms = parseTimeNotation(ttl);
  const expired = ref(false);
  let taskId: number;

  onMounted(() => {
    taskId = window.setTimeout(() => (expired.value = true), ms);
  });

  onUnmounted(() => window.clearTimeout(taskId));

  const resetExpired = () => {
    expired.value = false;
    window.clearTimeout(taskId);
    taskId = window.setTimeout(() => (expired.value = true), ms);
  };

  return { expired, resetExpired };
}
