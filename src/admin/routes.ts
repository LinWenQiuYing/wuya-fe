import { RouteRecordRaw, RouterView } from "vue-router";
import pickMenu from "@/utils/pickMenu";
import HistogramIcon from "@/admin/icons/histogram.svg";
import BookIcon from "@/admin/icons/book.svg";
import UserIcon from "@/admin/icons/user.svg";
import ShopIcon from "@/admin/icons/shop.svg";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/admin",
    component: () => import("@/admin/AdminApp.vue"),
    children: [
      {
        path: "",
        meta: { nav: { name: "首页", icon: HistogramIcon, active: "/admin" } },
        component: () => import("@/admin/view/homePage/index.vue"),
      },
      {
        path: "/admin/knowledge",
        meta: { nav: { name: "知识库管理", icon: BookIcon }, code: "knowledge" },
        component: RouterView,
        children: [
          {
            path: "",
            meta: { title: "知识库管理" },
            component: () => import("@/admin/view/knowledgeBase/index.vue"),
          },
          {
            path: "tags",
            meta: { title: "标签管理" },
            component: () => import("@/admin/view/knowledgeBase/tagManager/index.vue"),
          },
          {
            path: "projectFlow",
            meta: { title: "项目流程" },
            component: () => import("@/admin/view/knowledgeBase/projectFlow/index.vue"),
          },
          {
            path: "createKnowledge",
            meta: { title: "新建知识库" },
            component: () => import("@/admin/view/knowledgeBase/CreateKnowledge.vue"),
          },
        ],
      },
      {
        path: "users",
        meta: { nav: { name: "用户管理", icon: UserIcon } },
        component: () => import("@/admin/view/userManage/index.vue"),
      },
      {
        path: "services",
        meta: { nav: { name: "应用商店", icon: ShopIcon } },
        component: () => import("@/admin/view/appStore/index.vue"),
      },
    ],
  },
];

export default routes;

export const menu = pickMenu(routes);
