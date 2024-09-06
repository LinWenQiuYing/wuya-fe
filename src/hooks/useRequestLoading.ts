import { Ref, ref } from "vue";
import { ElMessage } from "element-plus";

interface Options<M extends string = string> {
  showErr?: boolean;
  message?: M;
}

export default function useRequestLoading<T = unknown, P extends unknown[] = unknown[]>(
  fn: (...args: P) => Promise<T>,
  options: Options = {},
): [(...args: P) => Promise<T>, Ref<boolean>] {
  const loading = ref<boolean>(false);
  const { showErr, message } = options;

  const returnFn = async function (...args: P): Promise<T> {
    try {
      loading.value = true;
      const result = await fn(...args);
      return result;
    } catch (e) {
      if (showErr) {
        ElMessage({
          type: "error",
          message,
        });
      }
      throw e;
    } finally {
      loading.value = false;
    }
  };
  return [returnFn, loading];
}
