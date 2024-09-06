// 名单里的接口不需要鉴权, 即不会带上Authorization这个首部
import { userPrefix } from "@/utils/reqPrefix";

const whitelist = [`${userPrefix}/auth/any/login-tds`];
export default whitelist;
