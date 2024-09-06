import { get } from "src/utils/reqMethod";
import { chatPrefix } from "@/utils/reqPrefix";

export interface Version {
  display_version: string;
  intern_version: string;
  steps_behind?: number;
}

export interface LatestVersion {
  latest_ota_pack: {
    version: string;
    intern_version: string;
    torrent: string;
    exec_path: string;
    desc: string;
  };
  steps_behind: number;
}

// AIPC 获取当前版本
export const getCurVersion = async (): Promise<Version> => {
  const result = await get<Version>(`${chatPrefix}/current-version`);
  return result.data;
};

// AIPC 获取最新版本
export const getLatestVersion = async (): Promise<LatestVersion> => {
  const result = await get<LatestVersion>(`${chatPrefix}/latest-version`);
  return result.data;
};
