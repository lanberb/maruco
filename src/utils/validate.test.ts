import { describe, expect, test } from "@jest/globals";
import { createAllComponentNamePattern } from "./validate";

describe("createAllComponentNamePattern", () => {
  test("pascal case", () => {
    const words = {
      primary: ["A", "B", "C"],
      secondary: ["A", "B", "C"],
      tertiary: ["A", "B", "C"],
    };

    const result = [
      "AAA",
      "AAB",
      "AAC",
      "ABA",
      "ABB",
      "ABC",
      "ACA",
      "ACB",
      "ACC",

      "BAA",
      "BAB",
      "BAC",
      "BBA",
      "BBB",
      "BBC",
      "BCA",
      "BCB",
      "BCC",

      "CAA",
      "CAB",
      "CAC",
      "CBA",
      "CBB",
      "CBC",
      "CCA",
      "CCB",
      "CCC",
    ];

    expect(
      createAllComponentNamePattern({
        mode: "pascal",
        words,
      }),
    ).toStrictEqual(result);
  });

  test("dot case", () => {
    const words = {
      primary: ["A", "B", "C"],
      secondary: ["A", "B", "C"],
      tertiary: ["A", "B", "C"],
    };

    const result = [
      "A.A.A",
      "A.A.B",
      "A.A.C",
      "A.B.A",
      "A.B.B",
      "A.B.C",
      "A.C.A",
      "A.C.B",
      "A.C.C",

      "B.A.A",
      "B.A.B",
      "B.A.C",
      "B.B.A",
      "B.B.B",
      "B.B.C",
      "B.C.A",
      "B.C.B",
      "B.C.C",

      "C.A.A",
      "C.A.B",
      "C.A.C",
      "C.B.A",
      "C.B.B",
      "C.B.C",
      "C.C.A",
      "C.C.B",
      "C.C.C",
    ];

    expect(
      createAllComponentNamePattern({
        mode: "dot",
        words,
      }),
    ).toStrictEqual(result);
  });

  test("kebab case", () => {
    const words = {
      primary: ["A", "B", "C"],
      secondary: ["A", "B", "C"],
      tertiary: ["A", "B", "C"],
    };

    const result = [
      "A-A-A",
      "A-A-B",
      "A-A-C",
      "A-B-A",
      "A-B-B",
      "A-B-C",
      "A-C-A",
      "A-C-B",
      "A-C-C",

      "B-A-A",
      "B-A-B",
      "B-A-C",
      "B-B-A",
      "B-B-B",
      "B-B-C",
      "B-C-A",
      "B-C-B",
      "B-C-C",

      "C-A-A",
      "C-A-B",
      "C-A-C",
      "C-B-A",
      "C-B-B",
      "C-B-C",
      "C-C-A",
      "C-C-B",
      "C-C-C",
    ];

    expect(
      createAllComponentNamePattern({
        mode: "kebab",
        words,
      }),
    ).toStrictEqual(result);
  });
});
