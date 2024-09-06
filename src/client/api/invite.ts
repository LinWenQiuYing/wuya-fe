import { get, post } from "src/utils/reqMethod";
import { userPrefix } from "@/utils/reqPrefix";

export interface DtoInvite {
  avatarBase64?: string;
  count?: number;
  inviter?: string;
  lastTime?: string;
  ranking?: number;
}

export interface InviteImg {
  filename: string;
  uuid: string;
}

interface InviteTableResult {
  dtoInvite: DtoInvite;
  dtoInvites: DtoInvite[];
}
export const getInviteLink = async (): Promise<string> => {
  const response = await get<string>(`${userPrefix}/invite/invite-url`);
  return response.data;
};

export const getInviteTable = async (): Promise<InviteTableResult> => {
  const response = await get<InviteTableResult>(`${userPrefix}/invite/leaderboard`);
  return response.data;
};

export const saveImgCode = async (base64Img: string): Promise<any> => {
  const response = await post(`${userPrefix}/invite/save-img`, base64Img);
  return response.data;
};
