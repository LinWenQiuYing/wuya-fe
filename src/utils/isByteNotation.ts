// 存储单位的最常见习惯用法
type MostlyByteUnit = "G" | "M" | "K" | "Gb" | "Mb" | "Kb" | "b";
// 存储单位
export type ByteUnit = MostlyByteUnit | Lowercase<MostlyByteUnit> | Uppercase<MostlyByteUnit>;
// 比特数表示法, 如 0.5G , 200M
export type ByteNotation = `${number}${ByteUnit}`;

export const byteNotationPattern = /^(\d+(?:\.\d+)?)([gmk]?b?)$/i;
export default function isByteNotation(value: string): value is ByteNotation {
  return byteNotationPattern.test(value);
}
