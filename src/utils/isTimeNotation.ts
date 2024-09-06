// 时间单位: “时”、”分“、”秒“等
export type TimeUnit = "ms" | "s" | "m" | "h" | "d";
export type TimeNotation = `${number}${TimeUnit}`;

export const timeNotationPattern = /^(\d+(?:\.\d+)?)(ms|s|m|h|d)$/;
export default function isTimeNotation(value: string): value is TimeNotation {
  return timeNotationPattern.test(value);
}
