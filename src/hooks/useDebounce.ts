export default function useDebounce<T extends (...args: any[]) => Promise<any>>(func: T, delay: number) {
  let timer: number;
  return function debounce(...args: Parameters<T>): Promise<ReturnType<T>> {
    return new Promise((resolve, reject) => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        func(...args)
          .then(resolve)
          .catch(reject);
      }, delay);
    });
  };
}
