import isByteNotation, { ByteNotation, byteNotationPattern } from "./isByteNotation";

type Bytes = number;
type KB = number;
type MB = number;
type GB = number;
const getBytesOfKB = (value: KB): Bytes => value * 1024;
const getBytesOfMB = (value: MB): Bytes => getBytesOfKB(value) * 1024;
const getBytesOfGB = (value: GB): Bytes => getBytesOfMB(value) * 1024;

export default function parseByteNotation<T extends string = ByteNotation>(value: T): Bytes {
  const displayValue = value.toString();
  if (!isByteNotation(value)) {
    throw new Error(`value "${displayValue}" is not a byte notation`);
  }
  const result = byteNotationPattern.exec(value);
  if (!result) {
    throw new Error(`unknown byte notation: "${value}"`);
  }
  const [, stringifyAmount, unit] = result;
  const amount = parseFloat(stringifyAmount);
  switch (unit.toUpperCase()) {
    case "GB":
    case "G":
      return getBytesOfGB(amount);
    case "KB":
    case "K":
      return getBytesOfKB(amount);
    case "MB":
    case "M":
      return getBytesOfMB(amount);
    case "B":
      return amount;
    default:
      throw new Error(`unknown byte notation unit: "${unit}"`);
  }
}
