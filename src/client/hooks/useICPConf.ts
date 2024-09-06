import { fetcher } from "@/sign/api/sign";
import { target } from "@/config";

export type ICPConf = Array<{
  title?: string;
  text: string;
  link?: string;
}>;

const getICPConf = async () => {
  const esm: { default: ICPConf } = await import("#public/conf/icp.json");
  return esm.default;
};

const ICPRef: { value?: ICPConf } = {};
export default async function useICPConf() {
  if (!ICPRef.value) {
    ICPRef.value = target.isElectron
      ? await getICPConf()
      : await fetcher.get<ICPConf>("/conf/icp.json").then((res) => res.data);
  }
  return ICPRef.value!;
}
