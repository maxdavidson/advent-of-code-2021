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
  expect(part1(INPUT_TEST_0)).toBe(10);
  expect(part1(INPUT_TEST_1)).toBe(19);
  expect(part1(INPUT_TEST_2)).toBe(226);
  expect(part1(INPUT)).toBe(5104);
});

test("part2", () => {
  expect(part2(INPUT_TEST_0)).toBe(36);
  expect(part2(INPUT_TEST_1)).toBe(103);
  expect(part2(INPUT_TEST_2)).toBe(3509);
  expect(part2(INPUT)).toBe(149_220);
});
