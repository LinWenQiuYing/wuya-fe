import { describe, test, expect } from "vitest";
import getLocalIdent from "../getLocalIdent";

describe("getLocalIdent", () => {
  test("keep stable when repeat some block", () => {
    const block: string = "/infinity/src/component/Input.vue";
    expect(getLocalIdent("_", block)).toBe("input__");
    expect(getLocalIdent("icon", block)).toBe("input_icon");
    expect(getLocalIdent("_", block)).toBe("input__");
  });

  test("generate seq hash when block raw name conflict", () => {
    const inputs = [
      "/infinity/src/component/Input.vue",
      "/infinity/src/client/component/Input/index.module.scss",
      "/infinity/src/admin/component/Input/index.vue",
    ];
    expect(getLocalIdent("_", inputs[0])).toBe("input__");
    expect(getLocalIdent("_", inputs[1])).toBe("input1__");
    expect(getLocalIdent("_", inputs[2])).toBe("input2__");
  });
});
