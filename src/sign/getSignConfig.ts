import { getSignConf, SignConfig } from "./api/conf";

const configRef: { value?: SignConfig } = {};

export default async function getSignConfig() {
  if (!configRef.value) {
    configRef.value = await getSignConf();
    return configRef.value;
  }
  return configRef.value;
}
