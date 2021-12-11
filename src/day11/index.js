const { min, max, trunc } = Math;

/**
 * @param {string} input
 */
function createGrid(input) {
  const nums = input
    .trim()
    .split("\n")
    .flatMap(line => Array.from(line.trim(), Number));

  const gridSize = Math.sqrt(nums.length);

  /** @type {readonly number[]} */
  const indicesReversed = Array.from(nums.keys()).reverse();

  return {
    get size() {
      return nums.length;
    },

    step() {
      const stack = indicesReversed.slice();

      /** @type {number | undefined} */
      let pos;
      while ((pos = stack.pop()) !== undefined) {
        nums[pos] += 1;

        if (nums[pos] === 10) {
          const flashCol = pos % gridSize;
          const flashRow = trunc(pos / gridSize);

          const minCol = max(flashCol - 1, 0);
          const maxCol = min(flashCol + 1, gridSize - 1);
          const minRow = max(flashRow - 1, 0);
          const maxRow = min(flashRow + 1, gridSize - 1);

          for (let row = minRow; row <= maxRow; row += 1) {
            const rowOffset = gridSize * row;
            for (let col = minCol; col <= maxCol; col += 1) {
              const nextPos = rowOffset + col;
              if (nextPos !== pos) {
                stack.push(nextPos);
              }
            }
          }
        }
      }

      let flashes = 0;

      for (let pos = 0; pos < nums.length; pos += 1) {
        if (nums[pos] > 9) {
          flashes += 1;
          nums[pos] = 0;
        }
      }

      return flashes;
    },
  };
}

/**
 * @param {string} input
 * @param {number} [maxSteps]
 */
export function part1(input, maxSteps = 100) {
  const grid = createGrid(input);

  let totalFlashes = 0;

  for (let step = 0; step < maxSteps; step += 1) {
    totalFlashes += grid.step();
  }

  return totalFlashes;
}

/**
 * @param {string} input
 */
export function part2(input) {
  const grid = createGrid(input);

  for (let step = 1; ; step += 1) {
    if (grid.step() === grid.size) {
      return step;
    }
  }
}
