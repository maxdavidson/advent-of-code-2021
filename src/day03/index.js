import { lines } from "../utils.js";

/**
 * @param {readonly string[]} binaryStrings
 * @param {number} bitIndex
 * @returns {number}
 */
function countOnes(binaryStrings, bitIndex) {
  let ones = 0;
  for (const binaryString of binaryStrings) {
    if (binaryString[bitIndex] === "1") {
      ones += 1;
    }
  }
  return ones;
}

/**
 * @param {readonly string[]} binaryStrings
 * @param {number} bitIndex
 * @returns {"1" | "0"}
 */
function getMostCommonBit(binaryStrings, bitIndex) {
  let ones = countOnes(binaryStrings, bitIndex);
  return ones >= binaryStrings.length / 2 ? "1" : "0";
}

/**
 * @param {readonly string[]} binaryStrings
 * @param {number} bitIndex
 * @returns {"1" | "0"}
 */
function getLeastCommonBit(binaryStrings, bitIndex) {
  let ones = countOnes(binaryStrings, bitIndex);
  return ones < binaryStrings.length / 2 ? "1" : "0";
}

/**
 * @param {readonly string[]} binaryStrings
 * @param {(binaryStrings: readonly string[], bitIndex: number) => "1" | "0"} getBit
 * @returns {number}
 */
function getRate(binaryStrings, getBit) {
  const binaryString = Array.from({ length: binaryStrings[0].length }, (_, i) =>
    getBit(binaryStrings, i),
  ).join("");

  return Number.parseInt(binaryString, 2);
}

/**
 * @param {readonly string[]} binaryStrings;
 * @param {(binaryStrings: readonly string[], bitIndex: number) => "1" | "0"} getBit
 * @returns {number}
 */
function getRating(binaryStrings, getBit) {
  for (let i = 0; binaryStrings.length > 1; i += 1) {
    const bit = getBit(binaryStrings, i);
    binaryStrings = binaryStrings.filter(rating => rating[i] === bit);
  }
  return Number.parseInt(binaryStrings[0], 2);
}

/**
 * @param {string} input
 */
export function part1(input) {
  const binaryStrings = Array.from(lines(input));

  const gammaRate = getRate(binaryStrings, getMostCommonBit);
  const epsilonRate = getRate(binaryStrings, getLeastCommonBit);

  return gammaRate * epsilonRate;
}

/**
 * @param {string} input
 */
export function part2(input) {
  const binaryStrings = Array.from(lines(input));

  const oxygenRating = getRating(binaryStrings, getMostCommonBit);
  const scrubberRating = getRating(binaryStrings, getLeastCommonBit);

  return oxygenRating * scrubberRating;
}
