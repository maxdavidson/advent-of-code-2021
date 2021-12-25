import { expect, test } from "@jest/globals";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";
import { part1, part2 } from "./index.js";

const [INPUT, INPUT_TEST] = await Promise.all([
  readFile(new URL("input", import.meta.url), "utf-8"),
  readFile(new URL("input_test", import.meta.url), "utf-8"),
]);

test("part1", () => {
  expect(part1(INPUT_TEST)).toBe(739_785);
  expect(part1(INPUT)).toBe(897_798);
});

test("part2", () => {
  expect(part2(INPUT_TEST)).toBe(444_356_092_776_315);
  expect(part2(INPUT)).toBe(48_868_319_769_358);
});
