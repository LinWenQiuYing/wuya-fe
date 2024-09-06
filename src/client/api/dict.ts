import { fetcher } from "@/sign/api/sign";
import json5 from "json5";
import { NameValue } from "@/store/modules/dict";
import { data } from "franc/data";
import { target } from "@/config";

const importProvinceDict = async () => {
  const { default: data } = await import("#public/dict/province.json5?raw");
  return json5.parse<NameValue[]>(data);
};
const fetchProvinceDict = async () => {
  const response = await fetcher.get<string>("/dict/province.json5");
  return json5.parse<NameValue[]>(response.data);
};

export const getProvinceDict = async () => {
  return data.isElectron ? await importProvinceDict() : await fetchProvinceDict();
};
const importPositionDict = async () => {
  const { default: data } = await import("#public/dict/position.json5?raw");
  return json5.parse<NameValue[]>(data);
};
const fetchPositionDict = async () => {
  const response = await fetcher.get<string>("/dict/position.json5");
  return json5.parse<NameValue[]>(response.data);
};
export const getPositionDict = async () => {
  return target.isElectron ? await importPositionDict() : await fetchPositionDict();
};

const importIndustryDict = async () => {
  const { default: data } = await import("#public/dict/industry.json5?raw");
  return json5.parse<NameValue[]>(data);
};
const fetchIndustryDict = async () => {
  const response = await fetcher.get<string>("/dict/industry.json5");
  return json5.parse<NameValue[]>(response.data);
};
export const getIndustryDict = async () => {
  return target.isElectron ? await importIndustryDict() : await fetchIndustryDict();
};
