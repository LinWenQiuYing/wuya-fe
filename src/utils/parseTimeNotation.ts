import isTimeNotation, { TimeNotation, timeNotationPattern } from "./isTimeNotation";

export type Milliseconds = number;

export default function parseTimeNotation<T extends string = TimeNotation>(value: T): Milliseconds {
  const displayValue = value.toString();
  if (!isTimeNotation(value)) {
    throw new Error(`value: "${displayValue}" is not a time notation`);
  }
  const result = timeNotationPattern.exec(value);
  if (!result) {
    throw new Error(`unknown time notation: "${value}"`);
  }
  const [, stringifyAmount, unit] = result;
  const amount = parseFloat(stringifyAmount);
  switch (unit) {
    case "d":
      return amount * 24 * 60 * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    case "m":
      return amount * 60 * 1000;
    case "s":
      return amount * 1000;
    case "ms":
      return amount;
    default:
      throw new Error(`unknown time notation unit: "${unit}"`);
  }
}
