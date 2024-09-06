/**
 * 多个条件的"与"逻辑
 *
 * 假如a，b，c是条件， 那么 { both: [a, b, c] } 仅当a、b、c都为true时才为true
 *
 * 其中， 子条件a、b、c可由任意条件组成
 */
export interface AndCondition<T extends Rule = Rule, Args extends unknown[] = unknown[]> {
  both: Condition<T, Args>[];
}

/**
 * 多个条件的"或"逻辑
 *
 * 假如a，b，c是条件， 那么 { any: [a, b, c] } 只要a、b、c有任意一个为true就为true
 *
 * 其中， 子条件a、b、c可由任意条件组成
 */
export interface OrCondition<T extends Rule = Rule, Args extends unknown[] = unknown[]> {
  any: Condition<T, Args>[];
}

/**
 * 对一个条件的"非"逻辑
 *
 * 假如a是条件， 那么 { not: a } 为a的逻辑的取反
 *
 * "非"逻辑只能针对一个单一条件， 但该单一条件可由任意条件组成
 */
export interface NegativeCondition<T extends Rule = Rule, Args extends unknown[] = unknown[]> {
  not: Condition<T, Args>;
}

/**
 * 运行时条件
 *
 * 它是一个函数
 * 1. 不能是异步函数
 * 2. 返回值只能是 boolean 类型
 * 3. 可带参数，参数列表由泛型数组Args指定
 *
 * 当前条件的值，是当前函数运行后的返回值
 */
export interface RuntimeCondition<Args extends unknown[] = unknown[]> {
  (...args: Args): boolean;
}

type KnownConditionKeys = "both" | "any" | "not";

/**
 * 原子条件需要满足如下条件：
 * 1. 不能是函数(函数应该替换作更严格的运行时条件)
 * 2. 不能是对象且key名是 'both'，'any'，'not' 之一
 */
export type Rule<S extends string = string> =
  | Record<Exclude<S, KnownConditionKeys>, unknown>
  | unknown[]
  | string
  | number
  | boolean;

/**
 * 一个条件的陈述, 它可以是：
 * 1. 一个原子条件
 * 2. 原子条件用AND,OR,NOT逻辑组成的复合条件
 * 3. 复合条件用AND,OR,NOT逻辑进一步组成的复合条件
 * 4. 一个运行时条件(通过函数描述)
 *
 * 原子条件用泛型Rule描述
 *
 * Condition类型有两个泛型参数：
 * 1. 第一个泛型Rule指定了原子条件的类型
 * 2. 第二个泛型Args指定了运行时条件的参数类型
 */
export type Condition<T extends Rule = Rule, Args extends unknown[] = unknown[]> =
  | AndCondition<T, Args>
  | OrCondition<T, Args>
  | NegativeCondition<T, Args>
  | RuntimeCondition<Args>
  | T;

/**
 * 一个`静态`条件(即不包含函数)的陈述, 它可以是：
 * 1. 一个原子条件
 * 2. 原子条件用AND,OR,NOT逻辑组成的复合条件
 * 3. 复合条件用AND,OR,NOT逻辑进一步组成的复合条件
 *
 * 原子条件用泛型Rule描述
 *
 * 注: 静态条件是通用条件移除运行时条件后的简化版本
 */
export type StaticCondition<T extends Rule = Rule> = Condition<T, never[]>;

/**
 * 条件解析器
 *
 * 它解析一个条件陈述，返回一个boolean值
 *
 * @param condition 条件陈述
 *
 * @param isTruth 判断一个原子条件是否为真
 *
 * @param [args] 运行时条件的参数列表
 */
export interface ResolveCondition<T extends Rule = Rule, Args extends unknown[] = unknown[]> {
  (condition: Condition<T, Args>, isTruth: (rule: T) => boolean, ...args: Args): boolean;
  (condition: Condition<T, never[]>, isTruth: (rule: T) => boolean): boolean;
}
