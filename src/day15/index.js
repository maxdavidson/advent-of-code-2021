import Heap from "../Heap.js";

const { trunc } = Math;

class Node {
  /**
   * @param {number} pos
   * @param {number} score
   */
  constructor(pos, score) {
    this.pos = pos;
    this.score = score;
  }

  valueOf() {
    return this.score;
  }
}

/**
 * @param {string} input
 * @param {number} scale
 * @returns
 */
export function findShortestPath(input, scale) {
  const riskLevels = Array.from(input.matchAll(/\d/g), Number);

  const realSize = Math.sqrt(riskLevels.length);

  const size = realSize * scale;

  const startPos = 0;
  const endPos = scale * scale * riskLevels.length - 1;

  /**
   * @param {number} pos
   */
  function estimateRemainingDistance(pos) {
    const x = pos % size;
    const y = trunc(pos / size);
    return 2 * size - (x + y);
  }

  /**
   * @param {number} pos
   */
  function* getNeighbors(pos) {
    const x = pos % size;
    const y = trunc(pos / size);

    if (x - 1 >= 0) {
      yield size * y + x - 1;
    }

    if (x + 1 <= size - 1) {
      yield size * y + x + 1;
    }

    if (y - 1 >= 0) {
      yield size * (y - 1) + x;
    }

    if (y + 1 <= size - 1) {
      yield size * (y + 1) + x;
    }
  }

  const cameFrom = new Map();

  /** @type {Heap<Node>} */
  const openSet = new Heap();
  openSet.add(new Node(startPos, estimateRemainingDistance(startPos)));

  const gScore = new Map();
  gScore.set(startPos, 0);

  const fScore = new Map();
  fScore.set(startPos, estimateRemainingDistance(startPos));

  /**
   * @param {number} pos
   * @returns {IterableIterator<number>}
   */
  function* getPath(pos) {
    const prevPos = cameFrom.get(pos);
    if (prevPos !== undefined) {
      yield* getPath(prevPos);
    }
    yield pos;
  }

  /**
   * @param {number} pos
   * @returns {number}
   */
  function getRiskLevel(pos) {
    const x = pos % size;
    const y = trunc(pos / size);

    const realX = x % realSize;
    const realY = y % realSize;

    const xPos = trunc(x / realSize);
    const yPos = trunc(y / realSize);

    const unwrappedRiskLevel =
      riskLevels[realSize * realY + realX] + xPos + yPos;

    return ((unwrappedRiskLevel - 1) % 9) + 1;
  }

  /** @type {Node | undefined} */
  let nextNode;
  while ((nextNode = openSet.pop()) !== undefined) {
    const { pos } = nextNode;

    if (pos === endPos) {
      let sum = 0;
      for (const pos of getPath(endPos)) {
        sum += getRiskLevel(pos);
      }
      sum -= getRiskLevel(startPos);
      return sum;
    }

    const posGScore = gScore.get(pos);

    for (const nextPos of getNeighbors(pos)) {
      const tentativeScore = posGScore + getRiskLevel(nextPos);

      if (tentativeScore < (gScore.get(nextPos) ?? Infinity)) {
        const score = tentativeScore + estimateRemainingDistance(nextPos);
        gScore.set(nextPos, tentativeScore);
        fScore.set(nextPos, score);

        cameFrom.set(nextPos, pos);
        openSet.add(new Node(nextPos, score));
      }
    }
  }
}

/**
 * @param {string} input
 */
export function part1(input) {
  return findShortestPath(input, 1);
}

/**
 * @param {string} input
 */
export function part2(input) {
  return findShortestPath(input, 5);
}
