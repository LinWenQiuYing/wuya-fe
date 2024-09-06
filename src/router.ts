import NProgress from "nprogress";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import sign from "./sign/routes";
import client from "./client/routes";
import admin from "./admin/routes";
import getTransparentLocation from "@/utils/getTransparentLocation";
import { MenuStyle } from "@/@types";
import useDefaultAgentType from "@/client/views/settings/useDefaultAgentType";
import { aideList } from "@/client/const";

const routes: Readonly<RouteRecordRaw[]> = [
  ...sign,
  ...client,
  ...admin,
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    meta: { title: "404" },
    component: () => import("@/components/NoFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  linkExactActiveClass: "exact",
  routes,
});

// 路由加载前
router.beforeEach((to, from, next) => {
  NProgress.start();

  const { defaultAgentType } = useDefaultAgentType();
  const agentMenu = aideList.filter((item) => defaultAgentType.value.includes(item.key));
  const inLoad = agentMenu.some((route) => {
    const agentPath = route.path.split("/")[1];
    const toPath = to.path.split("/")[1];
    return agentPath === toPath;
  });
  // 未添加助手禁止访问
  if (to.meta.nav?.agent && !inLoad) {
    next("/");
    return;
  }
  const loc = getTransparentLocation(to, from);
  if (loc) {
    next(loc);
  } else {
    next();
  }
});

// 路由加载后
router.afterEach(() => {
  NProgress.done();
});

export default router;

// 默认菜单样式是 cubed : 方块式堆叠(图标在上, 名字在下)
export const defaultMenuStyle: MenuStyle = "cubed";
