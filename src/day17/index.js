const PATTERN = /target area: x=([-\d]+)..([-\d]+), y=([-\d]+)..([-\d]+)/;

/**
 * @param {string} input
 */
function parseInput(input) {
  const match = input.match(PATTERN);

  if (match === null) {
    throw new Error("No match found!");
  }

  const [, xMinRaw, xMaxRaw, yMinRaw, yMaxRaw] = match;

  return {
    xMin: Number.parseInt(xMinRaw, 10),
    xMax: Number.parseInt(xMaxRaw, 10),
    yMin: Number.parseInt(yMinRaw, 10),
    yMax: Number.parseInt(yMaxRaw, 10),
  };
}

/**
 * @param {string} input
 */
export function part1(input) {
  const { yMin } = parseInput(input);
  const yMinAbs = Math.abs(yMin);
  return yMin + (yMinAbs * (yMinAbs + 1)) / 2;
}

/**
 * @param {string} input
 */
export function part2(input) {
  const { xMin, xMax, yMin, yMax } = parseInput(input);

  // region must be in bottom-right quadrant
  if (xMin <= 0 || yMax >= 0) {
    throw new Error("not supported!");
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  function withinTargetArea(x, y) {
    return xMin <= x && x <= xMax && yMin <= y && y <= yMax;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  function beyondTargetArea(x, y) {
    return x > xMax || y < yMin;
  }

  const { max } = Math;

  /**
   * @param {number} xVel
   * @param {number} yVel
   */
  function tryVel(xVel, yVel) {
    let x = 0;
    let y = 0;

    while (!beyondTargetArea(x, y)) {
      if (withinTargetArea(x, y)) {
        return true;
      }

      x += xVel;
      y += yVel;
      xVel = max(0, xVel - 1);
      yVel -= 1;
    }

    return false;
  }

  const velocities = new Set();

  for (let xVel = 1; xVel <= xMax; xVel += 1) {
    for (let yVel = yMin; yVel <= -yMin; yVel += 1) {
      if (tryVel(xVel, yVel)) {
        velocities.add(`${xVel},${yVel}`);
      }
    }
  }

  return velocities.size;
}
