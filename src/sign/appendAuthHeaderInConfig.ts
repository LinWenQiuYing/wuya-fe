import { InternalAxiosRequestConfig } from "axios";
import appendAuthHeader from "./appendAuthHeader";
import whitelist from "./config/api-whitelist";

export default function appendAuthHeaderInConfig(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  if (config.url && whitelist.includes(config.url)) {
    return config;
  }
  return {
    ...config,
    headers: appendAuthHeader(config.headers),
  };
}
