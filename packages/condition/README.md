# Condition (条件逻辑)

condition用于增加对一个条件的表达能力.

它由`与`, `否`, `非`逻辑的任意组合和`运行性`逻辑组成.

```typescript
type Condition<Rule> =
 | Rule
 | AndCondition<Rule>
 | OrCondition<Rule> 
 | NegativeCondition<Rule> 
 | RuntimeCondition;
```

### 与逻辑(AndCondition)

假如a，b，c是条件， 那么 { both: [a, b, c] } 表示a、b、c的与.

### 或逻辑(OrCondition)

假如a，b，c是条件， 那么 { any: [a, b, c] } 表示a、b、c的或.

### 非逻辑(NegativeCondition)

假如a是条件， 那么 { not: a } 表示a的非

### 运行性逻辑(RuntimeCondition)

运行时逻辑是一个返回值是布尔值的函数, 返回的布尔值即是当前逻辑的结果.
