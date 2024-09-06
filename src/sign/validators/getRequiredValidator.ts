import { ValidatorOptions } from "./types";

export default function getRequiredValidator(message: string, options?: ValidatorOptions) {
  return (rule: unknown, value: string | boolean, callback: (message?: string) => void) => {
    // bypass 逻辑通过, 跳过验证
    if (options?.bypass?.()) {
      return callback();
    }
    if (!value || value === "") {
      return callback(message);
    }
    // 每个分支都调用调用 callback(), 否则验证过程会停止
    return callback();
  };
}