import { expect, test } from "@jest/globals";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";
import { part1, part2 } from "./index.js";

const INPUT = await readFile(new URL("input", import.meta.url), "utf-8");

test("part1", () => {
  expect(part1("620080001611562C8802118E34")).toBe(12);
  expect(part1("C0015000016115A2E0802F182340")).toBe(23);
  expect(part1("A0016C880162017C3686B18A3D4780")).toBe(31);
  expect(part1(INPUT)).toBe(963);
});

test("part2", () => {
  expect(part2("C200B40A82")).toBe(3);
  expect(part2("04005AC33890")).toBe(54);
  expect(part2("880086C3E88112")).toBe(7);
  expect(part2("CE00C43D881120")).toBe(9);
  expect(part2("D8005AC2A8F0")).toBe(1);
  expect(part2("F600BC2D8F")).toBe(0);
  expect(part2("9C005AC2F8F0")).toBe(0);
  expect(part2("9C0141080250320F1802104A08")).toBe(1);

  expect(part2(INPUT)).toBe(1549026292886);
});
