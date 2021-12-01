import { lines } from "../utils.js";

/**
 * @param {string} input
 */
export function part1(input) {
  const nums = Uint16Array.from(lines(input), Number);

  let count = 0;

  for (let i = 0; i < nums.length - 1; i += 1) {
    if (nums[i] < nums[i + 1]) {
      count += 1;
    }
  }

  return count;
}

/**
 * @param {string} input
 */
export function part2(input) {
  const nums = Uint16Array.from(lines(input), Number);

  let count = 0;

  for (let i = 0; i < nums.length - 3; i += 1) {
    if (nums[i] < nums[i + 3]) {
      count += 1;
    }
  }

  return count;
}
