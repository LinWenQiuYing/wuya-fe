/**
 * Convert first character of string literal type to lowercase
 * @param str a string literal
 */
export default function uncapitalize<T extends string>(str: T) {
  const [firstLetter, ...rest] = str;
  return <Uncapitalize<T>>[firstLetter.toLowerCase(), ...rest].join("");
}
