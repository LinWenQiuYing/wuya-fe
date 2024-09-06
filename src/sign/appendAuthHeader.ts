import useAuthorization from "@/store/hooks/useAuthorization";

export default function appendAuthHeader<T extends Record<string, string>>(headers: T) {
  const authorization = useAuthorization();
  return authorization.value ? { ...headers, Authorization: authorization.value } : headers;
}
