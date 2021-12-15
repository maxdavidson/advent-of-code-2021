import { expect, test } from "@jest/globals";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";
import { getScore } from "./index.js";

const [INPUT, INPUT_TEST] = await Promise.all([
  readFile(new URL("input", import.meta.url), "utf-8"),
  readFile(new URL("input_test", import.meta.url), "utf-8"),
]);

test("part1", () => {
  expect(getScore(INPUT_TEST, 10)).toBe(1588);
  expect(getScore(INPUT, 10)).toBe(2027);
});

test("part2", () => {
  expect(getScore(INPUT_TEST, 40)).toBe(2188189693529);
  expect(getScore(INPUT, 40)).toBe(2265039461737);
});
