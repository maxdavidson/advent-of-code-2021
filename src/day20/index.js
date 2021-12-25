/** @typedef {{ readonly data: readonly boolean[]; readonly rows: number, readonly cols: number }} Pixels */

/**
 * @param {string} input
 */
function parse(input) {
  const [rawAlgorithm, image] = input.trim().split("\n\n");

  const algorithm = Array.from(rawAlgorithm, c => c === "#");

  if (algorithm.length !== 512) {
    throw new Error("incorrect algorithm");
  }

  const lines = image.split("\n");
  const data = lines.flatMap(line => Array.from(line, char => char === "#"));
  const rows = lines.length;
  const cols = data.length / rows;

  return { algorithm, data, rows, cols };
}

/**
 * @param {Pixels} pixels
 * @param {readonly boolean[]} algorithm
 * @param {boolean} outOfBoundsHasPixel
 * @returns {Pixels}
 */
function enhance({ data, cols, rows }, algorithm, outOfBoundsHasPixel) {
  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean | undefined}
   */
  function getPixel(x, y) {
    if (0 <= x && x < cols && 0 <= y && y < rows) {
      return data[cols * y + x];
    }
    return undefined;
  }

  const nextRows = rows + 2;
  const nextCols = cols + 2;

  const nextData = Array.from({ length: nextCols * nextRows }, (_, i) => {
    const x0 = i % nextCols;
    const y0 = (i / nextRows) | 0;

    let index = 0;

    for (let y = y0 - 1; y <= y0 + 1; y += 1) {
      for (let x = x0 - 1; x <= x0 + 1; x += 1) {
        index <<= 1;
        if (getPixel(x - 1, y - 1) ?? outOfBoundsHasPixel) {
          index |= 1;
        }
      }
    }

    return algorithm[index];
  });

  return { data: nextData, rows: nextRows, cols: nextCols };
}

/**
 * @param {string} input
 */
export function part1(input) {
  const { algorithm, data, cols, rows } = parse(input);

  /** @type {Pixels} */
  let pixels = { data, cols, rows };

  const shouldFlash = algorithm[0] && !algorithm[algorithm.length - 1];

  for (let step = 1; step <= 2; step += 1) {
    pixels = enhance(pixels, algorithm, step % 2 === 0 && shouldFlash);
  }

  return pixels.data.reduce((sum, pixel) => (pixel ? sum + 1 : sum), 0);
}

/**
 * @param {string} input
 */
export function part2(input) {
  const { algorithm, data, cols, rows } = parse(input);

  /** @type {Pixels} */
  let pixels = { data, cols, rows };

  const shouldFlash = algorithm[0] && !algorithm[algorithm.length - 1];

  for (let step = 1; step <= 50; step += 1) {
    pixels = enhance(pixels, algorithm, step % 2 === 0 && shouldFlash);
  }

  return pixels.data.reduce((sum, pixel) => (pixel ? sum + 1 : sum), 0);
}
