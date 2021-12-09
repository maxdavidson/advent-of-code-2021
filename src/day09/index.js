/** @typedef {number[][]} HeightMap */
/** @typedef {{ x: number; y: number; }} Point */

/**
 * @param {Point} point
 * @returns {string}
 */
function createPointKey({ x, y }) {
  return `${x},${y}`;
}

/**
 * @param {string} input
 * @returns {HeightMap}
 */
function createHeightMap(input) {
  return input
    .trim()
    .split("\n")
    .map(line => line.split("").map(Number));
}

/**
 * @param {HeightMap} heightMap
 * @param {Point} point
 * @returns {number}
 */
function getHeight(heightMap, { x, y }) {
  return heightMap[y][x];
}

/**
 * @param {HeightMap} heightMap
 * @returns {IterableIterator<Point>}
 */
function* lowPoints(heightMap) {
  for (let y = 0; y < heightMap.length; y += 1) {
    const row = heightMap[y];
    for (let x = 0; x < row.length; x += 1) {
      const height = row[x];
      if (
        (x === 0 || height < row[x - 1]) &&
        (x === row.length - 1 || height < row[x + 1]) &&
        (y === 0 || height < heightMap[y - 1][x]) &&
        (y === heightMap.length - 1 || height < heightMap[y + 1][x])
      ) {
        yield { x, y };
      }
    }
  }
}

/**
 * @param {string} input
 */
export function part1(input) {
  const heightMap = createHeightMap(input);

  let sumOfRiskLevels = 0;

  for (const lowPoint of lowPoints(heightMap)) {
    sumOfRiskLevels += getHeight(heightMap, lowPoint) + 1;
  }

  return sumOfRiskLevels;
}

/**
 * @param {HeightMap} heightMap
 * @param {Point} point
 * @returns {IterableIterator<Point>}
 */
function* climb(heightMap, point) {
  yield point;

  const { x, y } = point;
  const row = heightMap[y];
  const height = row[x];

  if (x !== 0 && height < row[x - 1]) {
    yield* climb(heightMap, { x: x - 1, y });
  }

  if (x !== row.length - 1 && height < row[x + 1]) {
    yield* climb(heightMap, { x: x + 1, y });
  }

  if (y !== 0 && height < heightMap[y - 1][x]) {
    yield* climb(heightMap, { x, y: y - 1 });
  }

  if (y !== heightMap.length - 1 && height < heightMap[y + 1][x]) {
    yield* climb(heightMap, { x, y: y + 1 });
  }
}

/**
 * @param {string} input
 */
export function part2(input) {
  const heightMap = createHeightMap(input);

  /** @type {Map<string, Set<string>>} */
  const basins = new Map();

  for (const lowPoint of lowPoints(heightMap)) {
    const visited = new Set();

    for (const point of climb(heightMap, lowPoint)) {
      const pointKey = createPointKey(point);
      if (getHeight(heightMap, point) !== 9) {
        visited.add(pointKey);
      }
    }

    basins.set(createPointKey(lowPoint), visited);
  }

  return Array.from(basins.values(), basin => basin.size)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b, 1);
}
