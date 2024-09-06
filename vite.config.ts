import { loadEnv, PluginOption, UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// import eslint from "vite-plugin-eslint";
// import stylelint from "vite-plugin-stylelint";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import svg from "vite-svg-loader";
import getLocalIdent from "./packages/local-ident";
import ssl from "@vitejs/plugin-basic-ssl";
import { BuildTarget } from "@/@types";

const env = loadEnv("dev", ".", "");

const target: BuildTarget = "web";
export default {
  define: {
    ["process.env.TARGET"]: JSON.stringify(target),
  },
  build: {
    outDir: "./dist/web",
  },
  server: {
    host: true,
    port: 8090,
    proxy: {
      // "^/(infinity/chat/financial_analysis|infinity/chat/topic/root|infinity/chat/record)/": {
      //   target: "http://172.16.191.64:19000",
      //   secure: false,
      // },
      "^/(tq|talib|tquser|studio|tcserver|wuya|infinity|chat|v2|documents|tas|manager|api|images|baops)/": {
        target: env.BACKEND,
        secure: false,
      },
    },
  },
  css: {
    modules: {
      exportGlobals: false,
      generateScopedName: getLocalIdent,
    },
  },
  plugins: [
    ...[env.SSL === "true" ? [ssl()] : []],
    vue(),
    svg({
      svgoConfig: {
        plugins: [
          "cleanupIds",
          {
            name: "prefixIds",
            params: {
              delim: "__",
              prefixIds: true,
              prefixClassNames: true,
              prefix: (node, info) => {
                const path = info.path ?? "";
                const arr = path.split("/");
                const filename = arr[arr.length - 1];
                return filename.replace(/\..+$/, "");
              },
            },
          },
        ],
      },
    }),
    <PluginOption>AutoImport({
      dts: "./node_modules/@types/auto-imports.d.ts",
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dts: "./node_modules/@types/components.d.ts",
      resolvers: [ElementPlusResolver()],
    }),
    tsconfigPaths({ loose: true }),
    // eslint({
    //   failOnWarning: false,
    //   failOnError: false,
    // }),
    // stylelint(),
  ],
  test: {
    environment: "jsdom",
  },
} satisfies UserConfig;
