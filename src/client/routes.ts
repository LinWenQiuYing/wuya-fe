import HomeIcon from "@/client/icons/home-query.svg";
import NewspaperIcon from "@/client/icons/newspaper.svg";
import RobotIcon from "@/client/icons/robot.svg";
import pickMenu from "@/utils/pickMenu";
import { RouteRecordRaw, RouterView } from "vue-router";
import ClientApp from "./ClientApp.vue";
import UpArrowCircleIcon from "@/client/icons/up-arrow-circle.svg";
import AngleBracketsCircleIcon from "@/client/icons/angle-brackers-circle.svg";
import ChatLineChartIcon from "@/client/icons/chat-line-chart.svg";
import ContractCircleIcon from "@/client/icons/contract-circle.svg";
import VideoCircleIcon from "@/client/icons/video-circle.svg";
import PenIcon from "@/client/icons/pen.svg";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/homepage",
    redirect: "/",
  },
  {
    path: "/",
    // 这个组件不懒加载
    component: ClientApp,
    children: [
      {
        path: "",
        component: () => import("@/client/views/Guide.vue"),
        meta: {
          nav: {
            name: "主页",
            icon: HomeIcon,
            active: {
              any: ["/", "/qa"],
            },
            hidden: {
              any: [{ offline: false }],
            },
          },
          sidecar: true,
        },
      },
      {
        path: "qa",
        component: () => import("@/client/views/intelligentQA/index.vue"),
        meta: {
          sidecar: true,
          menuStyle: { pc: "cubed", h5: "none" },
        },
      },
      {
        path: "news",
        component: () => import("@/client/views/information/InformationHome.vue"),
        meta: {
          nav: {
            name: "资讯",
            icon: NewspaperIcon,
            active: {
              any: ["/news", "/new/*"],
            },
            hidden: { offline: true },
            interceptor: {
              auth: "electron",
            },
          },
          sidecar: {
            exclude: ["sources"],
          },
        },
      },

      {
        path: "new/:newId",
        component: () => import("@/client/views/information/InformationDetail.vue"),
        meta: {
          sidecar: true,
          menuStyle: { pc: "cubed", h5: "none" },
        },
      },
      {
        path: "writing",
        component: RouterView,
        meta: {
          nav: {
            name: "写作",
            icon: PenIcon,
            hidden: "h5",
            interceptor: {
              auth: "electron",
            },
          },
          sidecar: true,
          alpha: "h5",
        },
        children: [
          {
            path: "",
            component: () => import("@/client/views/writing/index.vue"),
          },
          {
            path: "topic/:topicId",
            component: () => import("@/client/views/writing/WritingDetail.vue"),
          },
          {
            path: "topic/:topicId/record/:recordId/draft/:draftId",
            component: () => import("@/client/views/writing/WritingDraft.vue"),
            meta: {
              sidecar: {
                topicGenerator: true,
                sources: "readonly",
                history: true,
              },
            },
          },
        ],
      },
      {
        path: "qn",
        component: () => import("@/client/views/QN.vue"),
        meta: {
          nav: {
            name: "问数",
            icon: ChatLineChartIcon,
            hidden: "electron",
            order: 0,
            interceptor: {
              auth: true,
            },
          },
          alpha: "h5",
        },
      },
      {
        path: "aboutUs",
        component: () => import("@/client/views/AboutUs.vue"),
        meta: { menuStyle: { pc: "tiled", h5: "none" } },
      },
      {
        path: "agents",
        component: () => import("@/client/views/agent/Agent.vue"),
        meta: {
          nav: {
            icon: RobotIcon,
            name: "助手",
            hidden: "h5",
          },
        },
      },
      {
        path: "survey",
        meta: {
          nav: {
            name: "尽调",
            icon: UpArrowCircleIcon,
            hidden: true,
            interceptor: {
              auth: true,
            },
            agent: true,
          },
          sidecar: true,
          alpha: "h5",
        },
        children: [
          {
            path: "",
            component: () => import("@/client/views/survey/index.vue"),
          },
          {
            path: "detail",
            component: () => import("@/client/views/survey/SurveyDetail.vue"),
          },
        ],
      },
      {
        path: "settings",
        component: () => import("@/client/views/settings/index.vue"),
        redirect: "settings/account",
        meta: { menuStyle: { pc: "tiled", h5: "none" }, hidden: "setting" },
        children: [
          {
            path: "account",
            component: () => import("@/client/views/settings/account/index.vue"),
          },
          {
            path: "profile",
            component: () => import("@/client/views/settings/Profile.vue"),
          },
        ],
      },
      {
        path: "settings/account/avatar",
        name: "avatar",
        component: () => import("@/client/views/settings/account/avatar.vue"),
        meta: {
          hidden: "setting",
        },
      },
      {
        path: "invite",
        name: "invite",
        meta: { menuStyle: { pc: "tiled", h5: "none" }, hidden: "setting" },
        component: () => import("@/client/views/invite/index.vue"),
      },
      {
        path: "settings/account/userSetting",
        name: "userSetting",
        component: () => import("@/client/views/settings/account/userSetting.vue"),
        meta: {
          hidden: "setting",
        },
      },
      {
        path: "settings/account/numberChange",
        name: "numberChange",
        component: () => import("@/client/views/settings/account/numberChange.vue"),
        meta: {
          hidden: "setting",
        },
      },
      {
        path: "settings/account/passwordChange",
        name: "passwordChange",
        component: () => import("@/client/views/settings/account/passwordChange.vue"),
        meta: {
          hidden: "setting",
        },
      },
      {
        path: "settings/account/numberSetting",
        name: "numberSetting",
        component: () => import("@/client/views/settings/account/numberSetting.vue"),
        meta: {
          hidden: "setting",
        },
      },
      {
        path: "settings/account/emailSetting",
        name: "emailSetting",
        component: () => import("@/client/views/settings/account/emailSetting.vue"),
        meta: {
          hidden: "setting",
        },
      },
      {
        path: "settings/account/verifyPhone",
        name: "verifyPhone",
        component: () => import("@/client/views/settings/account/verifyPhone.vue"),
        meta: {
          hidden: "setting",
        },
      },
      {
        path: "settings/account/passwordSetting/:phone/:code",
        name: "passwordSetting",
        component: () => import("@/client/views/settings/account/passwordSetting.vue"),
        meta: {
          hidden: "setting",
        },
      },
      {
        path: "dataAnalysis",
        meta: {
          nav: {
            icon: AngleBracketsCircleIcon,
            name: "分析",
            hidden: true,
            interceptor: {
              auth: true,
            },
            agent: true,
          },
          sidecar: true,
        },
        children: [
          {
            path: "",
            component: () => import("@/client/views/agent/dataAnalysis/DataAnalysisHome.vue"),
          },
          {
            path: "detail",
            component: () => import("@/client/views/agent/dataAnalysis/DataAnalysisChat.vue"),
          },
        ],
      },
      {
        path: "financialAnalysis",
        meta: {
          nav: {
            icon: AngleBracketsCircleIcon,
            name: "财报",
            hidden: true,
            interceptor: {
              auth: true,
            },
            agent: true,
          },
          sidecar: true,
        },
        children: [
          {
            path: "",
            component: () => import("@/client/views/agent/financialReport/Home.vue"),
          },
          {
            path: "detail",
            component: () => import("@/client/views/agent/financialReport/Chat.vue"),
          },
        ],
      },
      {
        path: "contract",
        meta: {
          nav: {
            icon: ContractCircleIcon,
            name: "审核",
            hidden: true,
            interceptor: {
              auth: true,
            },
            agent: true,
          },
          sidecar: true,
        },
        children: [
          {
            path: "",
            component: () => import("@/client/views/audit/index.vue"),
          },
          {
            path: "detail",
            component: () => import("@/client/views/audit/AuditAnswer.vue"),
          },
        ],
      },
      {
        path: "parser",
        meta: {
          nav: {
            icon: VideoCircleIcon,
            name: "视频",
            hidden: true,
            interceptor: {
              auth: true,
            },
            agent: true,
          },
          sidecar: true,
        },
        children: [
          {
            path: "",
            component: () => import("@/client/views/video/index.vue"),
          },
          {
            path: "detail",
            component: () => import("@/client/views/video/detail.vue"),
          },
        ],
      },
      {
        path: "customer_service",
        meta: {
          nav: {
            icon: VideoCircleIcon,
            name: "客服",
            hidden: true,
            interceptor: {
              auth: true,
            },
            agent: true,
          },
          sidecar: true,
        },
        children: [
          {
            path: "",
            component: () => import("@/client/views/customerService/index.vue"),
          },
          {
            path: "detail",
            component: () => import("@/client/views/customerService/detail.vue"),
          },
        ],
      },
    ],
  },
];

export const menu = pickMenu(routes);

export const h5Menu = pickMenu(routes, "h5");

export default routes;
