import { onMounted, onUnmounted } from "vue";
import { TimeNotation } from "@/utils/isTimeNotation";
import parseTimeNotation from "@/utils/parseTimeNotation";
import { renewToken } from "@/sign/api/sign";
import useTokenExpired from "@/store/hooks/useTokenExpired";
import { isUnSigned } from "@/store/hooks/useUserInfo";

export default function periodicallyRenewToken(interval: TimeNotation) {
  // 毫秒数: 续租间隔
  const ms = parseTimeNotation(interval);
  // 任务id
  let intervalId: number | undefined;
  // token续租的过期时间
  const expired = useTokenExpired();

  // 重置这次token续租的token过期时间(一般来说比真实的过期时间要短, 因为要保证时间上有足够的冗余)
  const resetExpired = () => (expired.value = Date.now() + ms);

  // 刷新token续租的过期时间
  const refreshExpired = () => {
    // 没有设置过期时间, 立即设置过期时间, 不作其它处理
    if (!expired.value) {
      resetExpired();
      return;
    }
    // 如果已过期, 立即续租, 并续租成功后重置过期时间
    if (expired.value < Date.now() && !isUnSigned.value) {
      renewToken().then(resetExpired).catch(console.error);
    }
    // 如果没过期 不作处理
  };

  // 清除续租任务
  const clearPeriodicallyRenewal = () => window.clearInterval(intervalId);

  // 周期性地续租token
  const periodicallyRenewal = () => {
    clearPeriodicallyRenewal();
    intervalId = window.setInterval(refreshExpired, ms);
  };

  const onVisibilityChange = () => {
    if (document.visibilityState !== "visible") return;
    refreshExpired();
  };

  // 添加token续租
  const addRenewal = () => {
    // 页面加载的时候立马检测一次token是否过期 (若过期则续租)
    refreshExpired();
    // 切换tab并当前tab重新激活的时候检测token是否过期 (若过期则续租)
    document.addEventListener("visibilitychange", onVisibilityChange, { capture: true });
    // 周期性地对token进行续租
    periodicallyRenewal();
  };

  // 清除token续租
  const clearRenewal = () => {
    clearPeriodicallyRenewal();
    document.removeEventListener("visibilitychange", onVisibilityChange, { capture: true });
  };

  onMounted(addRenewal);
  onUnmounted(clearRenewal);
}
