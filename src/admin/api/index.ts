export interface Api<T extends any> {
  code: number;
  data: T;
  message: string;
}
