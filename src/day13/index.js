import { first, last } from "../utils.js";

const POINT_PATTERN = /(\d+),(\d+)/g;
const FOLD_PATTERN = /fold along (x|y)=(\d+)/g;

/**
 * @param {string} input
 */
function* parsePoints(input) {
  for (const [, x, y] of input.matchAll(POINT_PATTERN)) {
    yield {
      x: Number.parseInt(x, 10),
      y: Number.parseInt(y, 10),
    };
  }
}

/**
 * @param {string} input
 */
function* parseFolds(input) {
  for (const [, axis, value] of input.matchAll(FOLD_PATTERN)) {
    yield {
      axis,
      value: Number.parseInt(value, 10),
    };
  }
}

/**
 * @template T
 * @param {T} value
 * @returns {value is NonNullable<T>}
 */
function isNonNullable(value) {
  return value != null;
}

/**
 * @param {string} input
 */
function* foldPoints(input) {
  let points = Array.from(parsePoints(input));
  const folds = Array.from(parseFolds(input));
  /**
   * @this {{ axis: string, value: number }}
   * @param {{ x: number, y: number }} point
   * @returns
   */
  function foldPoint({ x, y }) {
    const { axis, value } = this;
    switch (axis) {
      case "y":
        if (y === value) {
          return null;
        } else if (y < value) {
          return { x, y };
        } else {
          return { x, y: 2 * value - y };
        }

      case "x":
        if (x === value) {
          return null;
        } else if (x < value) {
          return { x, y };
        } else {
          return { x: 2 * value - x, y };
        }
    }
  }

  for (const fold of folds) {
    points = points.map(foldPoint, fold).filter(isNonNullable);
    yield points;
  }
}

/**
 * @param {{ x: number, y: number }} param0
 * @returns
 */
function createPointKey({ x, y }) {
  return `${x},${y}`;
}

/**
 * @param {string} input
 */
export function part1(input) {
  const points = first(foldPoints(input));

  return new Set(points?.map(createPointKey)).size;
}

const { min, max } = Math;
/**
 * @param {string} input
 */
export function part2(input) {
  const points = last(foldPoints(input));

  if (points === undefined) {
    throw new TypeError("no points!");
  }

  let minX = 0;
  let minY = 0;
  let maxX = 0;
  let maxY = 0;

  for (const { x, y } of points) {
    minX = min(minX, x);
    minY = min(minY, y);
    maxY = max(maxY, y);
    maxX = max(maxX, x);
  }

  const pointKeys = new Set(points.map(createPointKey));

  const cols = maxX - minX + 1;
  const rows = maxY - minY + 1;

  const image = Array.from({ length: rows }, (_, row) => {
    const y = row + minY;
    return Array.from({ length: cols }, (_, col) => {
      const x = col + minX;
      return pointKeys.has(createPointKey({ x, y })) ? "#" : " ";
    }).join("");
  }).join("\n");

  return image;
}
