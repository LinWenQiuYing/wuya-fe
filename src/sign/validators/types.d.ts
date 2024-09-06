export interface ValidatorOptions {
  // bypass函数返回true, 表示跳过验证
  bypass?: () => boolean;
}
