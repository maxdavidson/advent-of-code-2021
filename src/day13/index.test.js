import { expect, test } from "@jest/globals";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";
import { part1, part2 } from "./index.js";

const [INPUT, INPUT_TEST] = await Promise.all([
  readFile(new URL("input", import.meta.url), "utf-8"),
  readFile(new URL("input_test", import.meta.url), "utf-8"),
]);

test("part1", () => {
  expect(part1(INPUT_TEST)).toBe(17);
  expect(part1(INPUT)).toBe(675);
});

test("part2", () => {
  expect(part2(INPUT_TEST)).toMatchInlineSnapshot(`
    "#####
    #   #
    #   #
    #   #
    #####"
  `);
  expect(part2(INPUT)).toMatchInlineSnapshot(`
    "#  # #### #  # #  # #### ####   ## ####
    #  #    # # #  #  # #    #       #    #
    ####   #  ##   #### ###  ###     #   # 
    #  #  #   # #  #  # #    #       #  #  
    #  # #    # #  #  # #    #    #  # #   
    #  # #### #  # #  # #    ####  ##  ####"
  `);
});
