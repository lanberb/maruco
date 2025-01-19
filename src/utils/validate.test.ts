import { describe, expect, test } from "@jest/globals";
import { validateComponentName } from "./validate";

// const helloworld = "helloworld";
// const helloWorld = "helloWorld";
// const Helloworld = "Helloworld";
const HelloWorld = "HelloWorld";
// const HELLO_WORLD = "HELLO_WORLD";
// const HelloWorld_a = "HelloWorld_¥a";

describe("validateComponentName", () => {
  test("pascal case", () => {
    const mode = "pascal";
    const name = HelloWorld;

    expect(
      validateComponentName({
        name,
        mode,
        words: {
          primary: ["Hello"],
          secondary: ["World"],
          tertiary: [],
        },
      }),
    ).toBe("true");
  });
});
