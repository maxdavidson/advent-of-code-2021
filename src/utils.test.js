import { expect, test } from "@jest/globals";
import { split } from "./utils.js";

test.each`
  str             | separator
  ${"abc"}        | ${""}
  ${"a b c"}      | ${" "}
  ${"a  b \n  c"} | ${/\s+/g}
  ${"a\nb\nc\n"}  | ${"\n"}
`('split "$str" by "$separator"', ({ str, separator }) => {
  expect(Array.from(split(str, separator))).toEqual(str.split(separator));
});
