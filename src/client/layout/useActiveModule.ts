import { computed } from "vue";
import router from "@/router";
import getGlobPattern from "@/utils/getGlobPattern";

export type ModuleCode =
  | "qa"
  | "writing"
  | "news"
  | "survey"
  | "dataAnalysis"
  | "contract"
  | "parser"
  | "customer_service"
  | "financialAnalysis";

type ModuleReflect = {
  code: ModuleCode;
  patterns: string[];
};

const moduleMap: ModuleReflect[] = [
  {
    code: "qa",
    patterns: ["/qa"],
  },
  {
    code: "writing",
    patterns: ["/writing", "/writing/*"],
  },
  {
    code: "news",
    patterns: ["/news", "/new/*"],
  },
  {
    code: "survey",
    patterns: ["/survey", "/survey/*"],
  },
  {
    code: "dataAnalysis",
    patterns: ["/dataAnalysis", "/dataAnalysis/*"],
  },
  {
    code: "contract",
    patterns: ["/contract", "/contract/*"],
  },
  {
    code: "parser",
    patterns: ["/parser", "/parser/*"],
  },
  {
    code: "customer_service",
    patterns: ["/customer_service", "/customer_service/*"],
  },
  {
    code: "financialAnalysis",
    patterns: ["/financialAnalysis", "/financialAnalysis/*"],
  },
];

export default function useActiveModule() {
  return computed<ModuleCode>(() => {
    const reflect = moduleMap.find((it) => {
      return it.patterns.some((pattern) => getGlobPattern(pattern).test(router.currentRoute.value.path));
    });
    return reflect ? reflect.code : "qa";
  });
}
