export default function isValidPhone(value: string | number): boolean {
  return /^1[3456789]\d{9}$/.test(value.toString());
}
