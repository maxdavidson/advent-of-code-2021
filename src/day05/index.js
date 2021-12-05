//
const PATTERN = /(\d+),(\d+) -> (\d+),(\d+)/g;

/** @typedef {{ x0: number, y0: number; x1: number; y1: number }} Line */

/**
 * @param {string} input
 * @returns {Generator<Line>}
 */
function* parseLines(input) {
  for (const [, x0, y0, x1, y1] of input.matchAll(PATTERN)) {
    yield {
      x0: Number.parseInt(x0, 10),
      y0: Number.parseInt(y0, 10),
      x1: Number.parseInt(x1, 10),
      y1: Number.parseInt(y1, 10),
    };
  }
}

/**
 * @param {Iterable<Line>} lines
 */
function createCanvas(lines) {
  let cols = 0;
  let rows = 0;

  for (const { x0, y0, x1, y1 } of lines) {
    cols = Math.max(cols, x0 + 1, x1 + 1);
    rows = Math.max(rows, y0 + 1, y1 + 1);
  }

  const board = new Uint16Array(cols * rows);

  return {
    /**
     * @param {Line} line
     */
    plotLine({ x0, y0, x1, y1 }) {
      const dx = x1 - x0;
      const dy = y1 - y0;

      const sx = Math.sign(dx);
      const sy = Math.sign(dy);

      const steps = Math.max(Math.abs(dx), Math.abs(dy)) + 1;

      for (let i = 0, x = x0, y = y0; i < steps; i += 1, x += sx, y += sy) {
        board[y * cols + x] += 1;
      }
    },

    getIntersectionCount() {
      let count = 0;

      for (let i = 0; i < board.length; i += 1) {
        if (board[i] >= 2) {
          count += 1;
        }
      }

      return count;
    },
  };
}

/**
 * @param {string} input
 */
export function part1(input) {
  const lines = Array.from(parseLines(input));
  const canvas = createCanvas(lines);

  for (const line of lines) {
    if (line.x0 === line.x1 || line.y0 === line.y1) {
      canvas.plotLine(line);
    }
  }

  return canvas.getIntersectionCount();
}

/**
 * @param {string} input
 */
export function part2(input) {
  const lines = Array.from(parseLines(input));
  const canvas = createCanvas(lines);

  for (const line of lines) {
    canvas.plotLine(line);
  }

  return canvas.getIntersectionCount();
}
