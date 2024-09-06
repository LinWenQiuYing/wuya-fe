import js from "@eslint/js";
import ts from "typescript-eslint";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier/recommended";
import promise from "eslint-plugin-promise";
import vue from "eslint-plugin-vue";
import { dirname } from "path";
import { fileURLToPath } from "url";

export default [
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  promise.configs["flat/recommended"],
  ...vue.configs["flat/recommended"],
  {
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        parser: tsParser,
        project: ["./tsconfig.eslint.json", "./packages/*/tsconfig.json"],
        extraFileExtensions: [".vue"],
        tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "prettier/prettier": [
        "warn",
        {
          endOfLine: "auto",
        },
      ],
    },
  },
  {
    ...ts.configs.disableTypeChecked,
    files: ["**/*.js"],
  },
  // prettier in last
  prettier,
];
