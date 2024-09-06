import "@/styles/global.scss";
import "@/styles/nprogress-reset.scss";
import "element-plus/es/components/message/style/css";
import "nprogress/nprogress.css";
import "vant/lib/index.css";
import "@/styles/common.scss";
import "@/styles/el-reset.scss";

import { createApp } from "vue";
import { RouterView } from "vue-router";
import router from "./router";
import store from "./store";
import { createPinia } from "pinia";
import i18n from "@/utils/initI18n";
import { initWXSDK } from "./utils/wxUtils";
initWXSDK();

const app = createApp(RouterView);
const pinia = createPinia();
app.use(pinia);
app.use(i18n);
app.use(router);
app.use(store);
app.mount("#app");
