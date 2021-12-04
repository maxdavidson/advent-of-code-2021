import { first, last } from "../utils.js";

/**
 * @param {number} a
 * @param {number} b
 * @returns
 */
function add(a, b) {
  return a + b;
}

/**
 * @param {string} input
 */
function createBoard(input) {
  const numbers = Array.from(input.trim().split(/\s+/), Number);

  const size = Math.sqrt(numbers.length);

  /**
   * @param {number} row
   */
  function checkRow(row) {
    for (let col = 0; col < size; col += 1) {
      if (numbers[row * size + col] !== 0) {
        return false;
      }
    }

    return true;
  }

  /**
   * @param {number} col
   */
  function checkCol(col) {
    for (let row = 0; row < size; row += 1) {
      if (numbers[row * size + col] !== 0) {
        return false;
      }
    }

    return true;
  }

  return {
    /**
     * @param {number} drawnNumber
     */
    markAndCheckBingo(drawnNumber) {
      for (let i = 0; i < numbers.length; i += 1) {
        if (numbers[i] === drawnNumber) {
          numbers[i] = 0;
          return checkCol(i % size) || checkRow(Math.trunc(i / size));
        }
      }

      return false;
    },

    sumOfUnmarkedNumbers() {
      return numbers.reduce(add, 0);
    },
  };
}

/**
 *
 * @param {string} input
 */
function parseInput(input) {
  const [first, ...rest] = input.trim().split("\n\n");

  const numbers = Array.from(first.split(","), Number);
  const boards = new Set(rest.map(createBoard));

  return { numbers, boards };
}

/**
 * @param {string} input
 */
function* playBingo(input) {
  const { numbers, boards } = parseInput(input);

  for (const number of numbers) {
    for (const board of boards) {
      if (board.markAndCheckBingo(number)) {
        yield board.sumOfUnmarkedNumbers() * number;
        boards.delete(board);
      }
    }
  }
}

/**
 * @param {string} input
 */
export function part1(input) {
  return first(playBingo(input));
}

/**
 * @param {string} input
 */
export function part2(input) {
  return last(playBingo(input));
}
