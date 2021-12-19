/** @typedef {readonly [SnailfishNumber, SnailfishNumber]} SnailfishNumberPair */
/** @typedef {SnailfishNumberPair | number} SnailfishNumber */

import { lines, permutations } from "../utils.js";

/**
 * @param {SnailfishNumber} number
 * @returns {Generator<{ number: SnailfishNumber, path: string }>}
 */
function* numbers(number, path = "") {
  yield { number, path };
  if (typeof number !== "number") {
    const [left, right] = number;
    yield* numbers(left, `${path}0`);
    yield* numbers(right, `${path}1`);
  }
}

/**
 * @param {SnailfishNumber} value
 * @param {SnailfishNumber} replaceValue
 * @param {string} replacePath
 * @returns {SnailfishNumber}
 */
function replace(value, replacePath, replaceValue, path = "") {
  if (path === replacePath) {
    // console.log("replace", { path, value, replaceValue });
    return replaceValue;
  }

  if (typeof value === "number") {
    return value;
  }

  const [left, right] = value;

  const replacedLeft = replace(left, replacePath, replaceValue, `${path}0`);
  const replacedRight = replace(right, replacePath, replaceValue, `${path}1`);

  if (replacedLeft !== left || replacedRight !== right) {
    return [replacedLeft, replacedRight];
  }

  return value;
}

/**
 * @param {SnailfishNumber} pair
 */
export function explode(pair) {
  const allNumbers = Array.from(numbers(pair));

  for (let index = 0; index < allNumbers.length; index += 1) {
    const { number, path } = allNumbers[index];

    // Should explode
    if (
      path.length >= 4 &&
      typeof number !== "number" &&
      typeof number[0] === "number" &&
      typeof number[1] === "number"
    ) {
      pair = replace(pair, path, 0);

      const [left, right] = number;

      for (let i = index - 1; i >= 0; i -= 1) {
        const nextPair = allNumbers[i];
        if (typeof nextPair.number === "number") {
          pair = replace(pair, nextPair.path, nextPair.number + left);
          break;
        }
      }

      for (let i = index + 3; i < allNumbers.length; i += 1) {
        const nextPair = allNumbers[i];
        if (typeof nextPair.number === "number") {
          pair = replace(pair, nextPair.path, nextPair.number + right);
          break;
        }
      }

      return pair;
    }
  }

  return undefined;
}

/**
 * @param {SnailfishNumber} value
 */
export function split(value) {
  for (const { number, path } of numbers(value)) {
    if (typeof number === "number" && number >= 10) {
      const halfNumber = number / 2;
      return replace(value, path, [
        Math.floor(halfNumber),
        Math.ceil(halfNumber),
      ]);
    }
  }

  return undefined;
}

/**
 * @param {SnailfishNumber} value
 */
function reduce(value) {
  /** @type {SnailfishNumber} */
  let prevValue;
  do {
    prevValue = value;
    value = explode(value) ?? split(value) ?? value;
  } while (value !== prevValue);
  return value;
}

/**
 * @param {SnailfishNumber} a
 * @param {SnailfishNumber} b
 */
const add = (a, b) => reduce([a, b]);

/**
 * @param {SnailfishNumber} number
 * @returns {number}
 */
function magnitude(number) {
  if (typeof number === "number") {
    return number;
  } else {
    const [left, right] = number;
    return 3 * magnitude(left) + 2 * magnitude(right);
  }
}

/**
 * @param {string} input
 * @returns {Generator<SnailfishNumber>}
 */
function* snailfishNumbers(input) {
  for (const line of lines(input)) {
    yield JSON.parse(line);
  }
}
/**
 * @param {string} input
 */
export function part1(input) {
  return magnitude(Array.from(snailfishNumbers(input)).reduce(add));
}

/**
 * @param {string} input
 */
export function part2(input) {
  let maxMagnitude = -Infinity;

  for (const [a, b] of permutations(snailfishNumbers(input), 2)) {
    maxMagnitude = Math.max(maxMagnitude, magnitude(add(a, b)));
  }

  return maxMagnitude;
}
