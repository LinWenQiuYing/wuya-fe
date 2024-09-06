import { onUnmounted } from "vue";
import { TimeNotation } from "@/utils/isTimeNotation";
import parseTimeNotation from "@/utils/parseTimeNotation";
import { getMemberCardPayStatus } from "@/client/api/user";

export default function usePollingPayStatus(timeout: TimeNotation, interval: TimeNotation = "1s") {
  const ms = {
    timeout: parseTimeNotation(timeout),
    // 开发环境中, 后端1分钟从公网同步一次支付状态
    interval: parseTimeNotation(import.meta.env.PROD ? interval : "65s"),
  };
  let taskId: number;
  let aborted = false;

  onUnmounted(() => window.clearTimeout(taskId));

  const run = async (orderId: string) => {
    const { promise, resolve, reject } = Promise.withResolvers<boolean>();
    const expired = Date.now() + ms.timeout;

    const pollingPayStatus = async () => {
      if (aborted) {
        resolve(false);
        return;
      }
      const paid = await getMemberCardPayStatus(orderId);
      if (paid) {
        resolve(true);
      } else {
        planNextPolling();
      }
    };

    const planNextPolling = () => {
      if (Date.now() > expired) {
        resolve(false);
        return;
      }
      taskId = window.setTimeout(() => {
        pollingPayStatus().catch(reject);
      }, ms.interval);
    };

    await pollingPayStatus().catch(reject);

    return promise;
  };

  const abort = () => {
    aborted = true;
    window.clearTimeout(taskId);
  };

  return { run, abort };
}
