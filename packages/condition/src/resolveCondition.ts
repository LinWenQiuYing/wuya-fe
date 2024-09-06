import { Condition, Rule } from "./types";
import isObject from "./isObject";

function resolveCondition<T extends Rule = Rule>(
  condition: Condition<T>,
  isTruth: (rule: T) => boolean,
): boolean;

function resolveCondition<T extends Rule = Rule, Args extends unknown[] = unknown[]>(
  condition: Condition<T, Args>,
  isTruth: (rule: T) => boolean,
  ...args: Args
): boolean;

function resolveCondition<T extends Rule = Rule, Args extends unknown[] = unknown[]>(
  condition: Condition<T, Args>,
  isTruth: (pattern: T) => boolean,
  ...args: Args
): boolean {
  const isObjectCondition = isObject(condition);
  if (typeof condition === "function") {
    return condition(...args);
  } else if (isObjectCondition && "both" in condition) {
    const subs = <Condition<T, Args>[]>condition.both;
    return subs.every((child: Condition<T, Args>) => resolveCondition(child, isTruth, ...args));
  } else if (isObjectCondition && "any" in condition) {
    const subs = <Condition<T, Args>[]>condition.any;
    return subs.some((child: Condition<T, Args>) => resolveCondition(child, isTruth, ...args));
  } else if (isObjectCondition && "not" in condition) {
    return !resolveCondition(<Condition<T, Args>>condition.not, isTruth, ...args);
  } else {
    return isTruth(<T>condition);
  }
}

export default resolveCondition;
