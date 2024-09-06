import isValidPhone from "@/sign/validators/isValidPhone";
import { ValidatorOptions } from "./types";

export default function getPhoneValidator(message: string, options?: ValidatorOptions) {
  return (rule: unknown, value: string | number, callback: (message?: string) => void) => {
    // bypass 逻辑通过, 跳过验证
    if (options?.bypass?.()) {
      return callback();
    }
    if (!isValidPhone(value)) {
      return callback(message);
    }
    // 每个分支都调用调用 callback(), 否则验证过程会停止
    return callback();
  };
}
