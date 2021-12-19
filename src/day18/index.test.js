import { expect, test } from "@jest/globals";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";
import { explode, part1, part2, split } from "./index.js";

const [INPUT, INPUT_TEST_0, INPUT_TEST_1] = await Promise.all([
  readFile(new URL("input", import.meta.url), "utf-8"),
  readFile(new URL("input_test_0", import.meta.url), "utf-8"),
  readFile(new URL("input_test_1", import.meta.url), "utf-8"),
]);

// prettier-ignore
test("explode", () => {
  expect(explode([[[[[9,8],1],2],3],4])).toEqual([[[[0,9],2],3],4]);
  expect(explode([7,[6,[5,[4,[3,2]]]]])).toEqual([7,[6,[5,[7,0]]]]);
  expect(explode([[6,[5,[4,[3,2]]]],1])).toEqual([[6,[5,[7,0]]],3]);
  expect(explode([[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]])).toEqual([[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]);
  expect(explode([[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]])).toEqual([[3,[2,[8,0]]],[9,[5,[7,0]]]]);
});

test("split", () => {
  expect(split(10)).toEqual([5, 5]);
  expect(split(11)).toEqual([5, 6]);
});

test("part1", () => {
  expect(part1("[1,1]\n[2,2]\n[3,3]\n[4,4]\n")).toBe(445);
  expect(part1("[1,1]\n[2,2]\n[3,3]\n[4,4]\n[5,5]\n")).toBe(791);
  expect(part1("[1,1]\n[2,2]\n[3,3]\n[4,4]\n[5,5]\n[6,6]\n")).toBe(1137);

  expect(part1(INPUT_TEST_0)).toBe(3488);
  expect(part1(INPUT_TEST_1)).toBe(4140);
  expect(part1(INPUT)).toBe(3935);
});

test("part2", () => {
  expect(part2(INPUT_TEST_0)).toBe(3805);
  expect(part2(INPUT_TEST_1)).toBe(3993);
  expect(part2(INPUT)).toBe(4669);
});
