import dayjs from "dayjs";

export const getTimeStr = (time: string) => {
  const parsedDate = dayjs(time);
  return parsedDate.format("YYYY-MM-DD HH:mm:ss");
};
