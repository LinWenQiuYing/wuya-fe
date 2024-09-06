import { LocationQueryValue } from "vue-router";

function omitRestQueryValue(query: LocationQueryValue | LocationQueryValue[]): LocationQueryValue;

function omitRestQueryValue(
  query: LocationQueryValue | LocationQueryValue[] | undefined,
): LocationQueryValue | undefined;

function omitRestQueryValue(query: LocationQueryValue | LocationQueryValue[] | undefined) {
  if (typeof query === "string") return query;
  if (!query) return query;
  if (Array.isArray(query)) return query.find((it) => it !== null);
}

export default omitRestQueryValue;
