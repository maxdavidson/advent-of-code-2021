const INSTRUCTION_PATTERN = /(\w+) (\d+)/g;

/**
 * @param {string} input
 */
function* instructions(input) {
  for (const [, action, value] of input.matchAll(INSTRUCTION_PATTERN)) {
    yield { action, value: Number(value) };
  }
}

/**
 * @param {string} input
 */
export function part1(input) {
  let position = 0;
  let depth = 0;

  for (const { action, value } of instructions(input)) {
    switch (action) {
      case "forward":
        position += value;
        break;
      case "up":
        depth -= value;
        break;
      case "down":
        depth += value;
        break;
    }
  }

  return position * depth;
}

/**
 * @param {string} input
 */
export function part2(input) {
  let position = 0;
  let depth = 0;
  let aim = 0;

  for (const { action, value } of instructions(input)) {
    switch (action) {
      case "forward":
        position += value;
        depth += aim * value;
        break;
      case "up":
        aim -= value;
        break;
      case "down":
        aim += value;
        break;
    }
  }

  return position * depth;
}
