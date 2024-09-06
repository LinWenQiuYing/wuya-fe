import parseNumber from "./parseNumber";
import { LocationQueryValue } from "vue-router";
import omitRestQueryValue from "@/utils/omitRestQueryValue";

export default function parseNumberID(id: LocationQueryValue | LocationQueryValue[]): number | null {
  const firstQueryValue = omitRestQueryValue(id);
  return parseNumber(firstQueryValue);
}
