/**
 *
 * @param {string} input
 * @param {(steps: number) => number} getFuelCost
 * @returns
 */
function computeFuelCost(input, getFuelCost) {
  const nums = Uint16Array.from(input.trim().split(","), Number).sort();

  if (nums.length === 0) {
    throw new Error("too short!");
  }

  const min = nums[0];
  const max = nums[nums.length - 1];

  const { abs } = Math;

  let lowestFuelCost = Infinity;

  for (let pos = min; pos <= max; pos += 1) {
    let fuelCost = 0;

    for (let n = 0; n < nums.length; n += 1) {
      fuelCost += getFuelCost(abs(nums[n] - pos));
    }

    if (fuelCost < lowestFuelCost) {
      lowestFuelCost = fuelCost;
    }
  }

  return lowestFuelCost;
}

/**
 * @param {string} input
 */
export function part1(input) {
  return computeFuelCost(input, steps => steps);
}

/**
 * @param {string} input
 */
export function part2(input) {
  return computeFuelCost(input, steps => (steps * (steps + 1)) / 2);
}
