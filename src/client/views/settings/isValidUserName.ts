// 用户名校验规则
export default function isValidUserName(name: string) {
  const regex = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
  return regex.test(name);
}
