import { ref, Ref } from "vue";

export function useIsLoading(): [Ref<boolean>, (value: boolean) => void] {
  const isLoading = ref(false);
  const onChange = (value: boolean) => {
    isLoading.value = value;
  };
  return [isLoading, onChange];
}
