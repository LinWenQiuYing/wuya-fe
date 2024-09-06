import { describe, expect, test } from "vitest";
import getUniqueBlockGenerator from "../getUniqueBlockGenerator";

describe("getUniqueBlockGenerator", () => {
  test("generate seq hash", () => {
    const { getUniqueBlock } = getUniqueBlockGenerator();
    expect(getUniqueBlock("/infinity/src/component/Input.vue")).toBe("input");
    expect(getUniqueBlock("/infinity/src/sign/component/Input/index.vue")).toBe("input1");
    expect(getUniqueBlock("/infinity/src/admin/component/input.module.scss")).toBe("input2");
  });

  test("keep stable when repeat some block", () => {
    const { getUniqueBlock } = getUniqueBlockGenerator();
    expect(getUniqueBlock("/infinity/src/component/Input.vue")).toBe("input");
    expect(getUniqueBlock("/infinity/src/component/Input.vue")).toBe("input");
  });

  test("ignore digital suffix in block name", () => {
    const { getUniqueBlock } = getUniqueBlockGenerator();
    expect(getUniqueBlock("/infinity/src/component/Input1.vue")).toBe("input");
    expect(getUniqueBlock("/infinity/src/component/Input.vue")).toBe("input1");
  });
});
