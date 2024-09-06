import type { UserConfig } from "@commitlint/types";
import { RuleConfigSeverity } from "@commitlint/types";

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      RuleConfigSeverity.Error,
      "always",
      [
        "chore", // 其它日常如版本发布 e.g. chore(release): release v1.2.1
        "ci", // 持续集成相关
        "feat", // 新功能（feature）
        "fix", // 修复bug
        "docs", // 修改文档
        "style", // 修改代码格式，不影响代码逻辑
        "refactor", // 代码重构，理论上不影响功能逻辑
        "test", // 修改测试用例
        "build", // 构建或其他工具的变动(如webpack)
        "revert", // 还原以前的提交
      ],
    ],
  },
} satisfies UserConfig;
