import { expect, test } from "@jest/globals";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";
import { part1, part2 } from "./index.js";

const [INPUT, INPUT_TEST_0, INPUT_TEST_1, INPUT_TEST_2] = await Promise.all([
  readFile(new URL("input", import.meta.url), "utf-8"),
  readFile(new URL("input_test_0", import.meta.url), "utf-8"),
  readFile(new URL("input_test_1", import.meta.url), "utf-8"),
  readFile(new URL("input_test_2", import.meta.url), "utf-8"),
]);

test("part1", () => {
  expect(part1(INPUT_TEST_0)).toBe(39);
  expect(part1(INPUT_TEST_1)).toBe(590_784);
  expect(part1(INPUT_TEST_2)).toBe(474_140);
  expect(part1(INPUT)).toBe(615_869);
});

test("part2", () => {
  expect(part2(INPUT_TEST_2)).toBe(2_758_514_936_282_235);
  expect(part2(INPUT)).toBe(1_323_862_415_207_825);
});
