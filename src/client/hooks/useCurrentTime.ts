import dayjs from "dayjs";
import { onBeforeUnmount, onMounted, ref } from "vue";
export default function useCurrentTime() {
  const nowTime = ref<string>("");
  // 获取当前时间
  const getNowTime = () => {
    // 获取当前时间
    const now = dayjs();

    // 格式化日期和星期
    const formattedDate = now.format("YYYY-MM-DD");
    const weekday = now.day(); // 星期几的数字，0表示星期日，6表示星期六

    // 将星期几的数字转换为文本
    const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const formattedWeekday = weekdays[weekday];

    // 格式化时间
    const formattedTime = now.format("HH:mm:ss");

    // 合并所有部分
    nowTime.value = `${formattedDate} ${formattedWeekday} ${formattedTime}`;
  };

  let timer: any;
  onMounted(() => {
    getNowTime();

    timer = setInterval(() => {
      getNowTime();
    }, 1000);
  });

  onBeforeUnmount(() => {
    clearInterval(timer);
    timer = null;
  });

  return {
    nowTime,
  };
}
