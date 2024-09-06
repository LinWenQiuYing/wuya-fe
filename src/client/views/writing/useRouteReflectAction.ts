import { computed, ComputedRef } from "vue";
import { LocationQueryValue, useRoute, useRouter } from "vue-router";
import { EditActionCode, editActionCodes } from "./editActions";
import parseNumber from "./parseNumber";

type SectionId = number;
export type ReflectAction = { code: EditActionCode; id: SectionId };
export type ReflectActionMap = Record<SectionId, EditActionCode>;

const stringifyActions = (value: ReflectActionMap): string[] => {
  return Object.entries(value).reduce((arr: string[], [id, code]): string[] => {
    if (code === "cancel") return arr;
    return [...arr, `${code}:${id}`];
  }, []);
};

const parseStringifyAction = (value: LocationQueryValue): ReflectAction | null => {
  if (!value) return null;
  const arr = value.split(":");
  if (arr.length !== 2) return null;
  const [maybeCode, rawId] = arr;
  if (!(<string[]>editActionCodes).includes(maybeCode)) return null;
  const code = <EditActionCode>maybeCode;
  const id = parseNumber(rawId);
  if (id === null) return null;
  return { code, id };
};

const parseActions = (value: LocationQueryValue | LocationQueryValue[]): ReflectActionMap => {
  if (Array.isArray(value)) {
    return value.reduce((hub: ReflectActionMap, text) => {
      const action = parseStringifyAction(text);
      if (!action) return hub;
      hub[action.id] = action.code;
      return hub;
    }, {});
  }
  const action = parseStringifyAction(value);
  if (!action) return <ReflectActionMap>{};
  const { code, id } = action;
  return <ReflectActionMap>{ [id]: code };
};

type UseState<T> = [ComputedRef<T>, (value: T) => Promise<void>];

// 将编辑动作存储到url中的query中, 以便刷新后可以恢复
export default function useRouteReflectAction(): UseState<ReflectActionMap> {
  const route = useRoute();
  const router = useRouter();
  const reflectAction = computed(() => parseActions(route.query.action));
  const setReflectAction = async (value: ReflectActionMap) => {
    const prevActions: ReflectActionMap = parseActions(route.query.action);
    const mergedActions: ReflectActionMap = { ...prevActions, ...value };
    const action = stringifyActions(mergedActions);
    await router.replace({ ...route, query: { ...route.query, action } });
  };
  return [reflectAction, setReflectAction];
}
