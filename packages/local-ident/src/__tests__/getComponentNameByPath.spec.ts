import { describe, expect, test } from "vitest";
import getComponentNameByPath from "../getComponentNameByPath";

describe("getComponentByPath", () => {
  test("work in normal component", () => {
    const filename: string = "/infinity/src/sign/views/SignIn.vue?vue&type=style&index=0&lang.module.scss";
    const filename2: string = "/infinity/src/sign/views/CSM.vue?vue&type=style&index=0&lang.module.scss";
    expect(getComponentNameByPath(filename)).toBe("signIn");
    expect(getComponentNameByPath(filename2)).toBe("CSM");
  });

  test("work in index file", () => {
    const vueFile: string =
      "/infinity/src/sign/views/SignIn/index.vue?vue&type=style&index=0&lang.module.scss";
    const scssFile: string = "/infinity/src/sign/views/SignIn/index.module.scss";
    expect(getComponentNameByPath(vueFile)).toBe("signIn");
    expect(getComponentNameByPath(scssFile)).toBe("signIn");
  });
});
