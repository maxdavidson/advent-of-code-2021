import { expect, test } from "@jest/globals";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";
import { countLanterns } from "./index.js";

const [INPUT, INPUT_TEST] = await Promise.all([
  readFile(new URL("input", import.meta.url), "utf-8"),
  readFile(new URL("input_test", import.meta.url), "utf-8"),
]);

test("part1", () => {
  expect(countLanterns(INPUT_TEST, 18)).toBe(26);
  expect(countLanterns(INPUT_TEST, 80)).toBe(5934);
  expect(countLanterns(INPUT, 80)).toBe(353_274);
});

test("part2", () => {
  expect(countLanterns(INPUT_TEST, 256)).toBe(26_984_457_539);
  expect(countLanterns(INPUT, 256)).toBe(1_609_314_870_967);
});
