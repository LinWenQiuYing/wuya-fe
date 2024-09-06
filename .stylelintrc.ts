import { Config } from "stylelint";

const config: Config = {
  extends: ["stylelint-config-standard-scss"],
  rules: {
    "scss/double-slash-comment-empty-line-before": [
      "always",
      {
        ignore: ["inside-block"],
      },
    ],
    "value-keyword-case": [
      "lower",
      {
        camelCaseSvgKeywords: true,
      },
    ],
  },
  overrides: [
    {
      files: ["*.vue"],
      extends: ["stylelint-config-html/vue"],
      customSyntax: "postcss-html",
      rules: {
        // 使用全小写, 可用“-”连接
        // 但element-ui的样式(el-[a-z]+__[a-z]+)除外
        "selector-class-pattern": "^([a-z][a-z0-9-]*)|(el-[a-z]+__[a-z]+)|_$",
        "selector-pseudo-class-no-unknown": [
          true,
          {
            ignorePseudoClasses: ["global", "deep"],
          },
        ],
      },
    },
    {
      files: ["*.module.scss"],
      rules: {
        "selector-class-pattern": "^([a-z][a-zA-Z0-9]*)|_$",
        "selector-pseudo-class-no-unknown": [
          true,
          {
            ignorePseudoClasses: ["global"],
          },
        ],
      },
    },
  ],
};

export default config;
