import { describe, expect, test } from "@jest/globals";
import { permutations, range, split } from "./utils.js";

describe("split", () => {
  test.each`
    str             | separator
    ${"abc"}        | ${""}
    ${"a b c"}      | ${" "}
    ${"a  b \n  c"} | ${/\s+/g}
    ${"a\nb\nc\n"}  | ${"\n"}
  `('split "$str" by "$separator"', ({ str, separator }) => {
    expect(Array.from(split(str, separator))).toEqual(str.split(separator));
  });
});

describe("permutations", () => {
  test("range(3)", () => {
    expect(Array.from(permutations(range(0, 3)))).toEqual([
      [0, 1, 2],
      [0, 2, 1],
      [1, 0, 2],
      [1, 2, 0],
      [2, 0, 1],
      [2, 1, 0],
    ]);
  });

  test("ABCD, length 0", () => {
    expect(Array.from(permutations("ABCD", 0))).toEqual([[]]);
  });

  test("ABCD, length 1", () => {
    expect(Array.from(permutations("ABCD", 1))).toEqual([
      ["A"],
      ["B"],
      ["C"],
      ["D"],
    ]);
  });

  test("ABCD, length 2", () => {
    expect(Array.from(permutations("ABCD", 2))).toEqual([
      ["A", "B"],
      ["A", "C"],
      ["A", "D"],
      ["B", "A"],
      ["B", "C"],
      ["B", "D"],
      ["C", "A"],
      ["C", "B"],
      ["C", "D"],
      ["D", "A"],
      ["D", "B"],
      ["D", "C"],
    ]);
  });

  test("ABCD, length 3", () => {
    expect(Array.from(permutations("ABCD", 3))).toEqual([
      ["A", "B", "C"],
      ["A", "B", "D"],
      ["A", "C", "B"],
      ["A", "C", "D"],
      ["A", "D", "B"],
      ["A", "D", "C"],
      ["B", "A", "C"],
      ["B", "A", "D"],
      ["B", "C", "A"],
      ["B", "C", "D"],
      ["B", "D", "A"],
      ["B", "D", "C"],
      ["C", "A", "B"],
      ["C", "A", "D"],
      ["C", "B", "A"],
      ["C", "B", "D"],
      ["C", "D", "A"],
      ["C", "D", "B"],
      ["D", "A", "B"],
      ["D", "A", "C"],
      ["D", "B", "A"],
      ["D", "B", "C"],
      ["D", "C", "A"],
      ["D", "C", "B"],
    ]);
  });
});
