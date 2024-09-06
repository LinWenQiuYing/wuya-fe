import utf8 from "crypto-js/enc-utf8";
import encoder from "crypto-js/enc-hex";
import aes from "crypto-js/aes";
import mode from "crypto-js/mode-ecb";
import padding from "crypto-js/pad-pkcs7";

const SECRET_KEY = "transwarp!123456";
const IV_KEY = "1234567890123456";
const encrypt = (word: string) => {
  const keyHex = utf8.parse(SECRET_KEY);
  const iv = utf8.parse(IV_KEY);
  const encrypted = aes
    .encrypt(word, keyHex, {
      mode,
      padding,
      iv,
    })
    .ciphertext.toString(encoder);
  return encodeURI(encrypted.toString());
};

export default encrypt;
