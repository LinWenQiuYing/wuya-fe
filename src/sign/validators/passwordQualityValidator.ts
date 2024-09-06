import isValidPassword from "./isValidPassword";

const passwordQualityValidator = (rule: unknown, value: string, callback: (message?: string) => void) => {
  const validOrMessage = isValidPassword(value);
  if (validOrMessage === true) {
    callback();
  } else {
    callback(validOrMessage);
  }
};

export default passwordQualityValidator;
