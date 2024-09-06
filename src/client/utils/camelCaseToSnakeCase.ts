const isUpperCase = (str: string) => str.toUpperCase() === str;

export default function camelCaseToSnakeCase(camelCase: string) {
  return [...camelCase]
    .reduce((acc: string[], char) => {
      if (isUpperCase(char)) {
        acc.push("_", char.toLowerCase());
      } else {
        acc.push(char);
      }
      return acc;
    }, [])
    .join("");
}
