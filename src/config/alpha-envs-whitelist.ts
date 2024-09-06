export type Host = string;
export type RuntimeJudgment = () => boolean;
export type AlphaEnv = Host | RuntimeJudgment;
// alpha阶段的功能, 允许展示的环境
const env: AlphaEnv[] = ["172.18.20.142:8090", () => import.meta.env.DEV];
export default env;
