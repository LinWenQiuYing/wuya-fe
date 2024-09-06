/**
 * 校验密码是否合法
 *
 * @param value 密码
 * @return
 * - 如果通过校验返回`true`
 * - 否则返回错误消息
 */
export default function isValidPassword(value?: string): true | string {
  if (!value || !value.length) return "密码不能为空";
  if (value.length < 8) return "密码太短(小于8位)";
  if (value.length > 64) return "密码太长(大于64位)";
  const points: CheckPoint[] = [
    (value) => /\d/.test(value),
    (value) => /[a-z]/i.test(value),
    // (value) => /[A-Z]/.test(value),
    // (value) => value.replace(/[0-9a-zA-Z]/g, "").length > 0,
  ];
  // const passNum = points.filter((point) => point(value)).length;
  // if (passNum < 3) {
  //   return "密码至少8位，需要包含字母和数字";
  // }
  if (!points.every((check) => check(value))) {
    return "密码至少8位，需要包含字母和数字";
  }
  return true;
}

type CheckPoint = (value: string) => boolean;
