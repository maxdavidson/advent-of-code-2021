/**
 * @param {string} input
 * @param {number} maxDays
 */
export function countLanterns(input, maxDays) {
  const counts = new Float64Array(9);

  for (const num of input.trim().split(",")) {
    counts[Number(num)] += 1;
  }

  for (let day = 0; day < maxDays; day += 1) {
    counts[(day + 7) % 9] += counts[day % 9];
  }

  return counts.reduce((a, b) => a + b);
}
