import { RouteRecordRaw } from "vue-router";

export const patterns = {
  sign: "/sign",
};

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/sign",
    component: () => import("@/sign/views/SignContext.vue"),
    children: [
      {
        path: "",
        component: () => import("@/sign/views/Sign.vue"),
      },
      {
        path: "in",
        component: () => import("@/sign/views/SignIn.vue"),
      },
      {
        path: "up",
        component: () => import("@/sign/views/SignUp.vue"),
      },
      {
        path: "forget",
        component: () => import("@/sign/views/ResetPassword.vue"),
      },
    ],
  },
  {
    path: "/privacy",
    component: () => import("@/sign/views/PrivacyPolicy.vue"),
  },
  {
    path: "/terms",
    component: () => import("@/sign/views/ServiceAggrement.vue"),
  },
];

export default routes;
