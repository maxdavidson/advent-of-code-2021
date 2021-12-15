import { first, lines } from "../utils.js";

/**
 * @param {string} message
 * @returns {never}
 */
function throwError(message) {
  throw new Error(message);
}

/**
 * @param {string} input
 */
function parse(input) {
  const it = lines(input);
  const firstLine = first(it) ?? throwError("no polymer template found!!");

  const initialPairs = Array.from({ length: firstLine.length - 1 }, (_, i) =>
    firstLine.slice(i, i + 2),
  );

  const pairInsertionRules = Array.from(it, line => {
    const [fromPair, insertionElement] = line.split(" -> ");
    const [firstElement, secondElement] = fromPair;
    return {
      fromPair,
      toPairA: firstElement + insertionElement,
      toPairB: insertionElement + secondElement,
    };
  });

  return { initialPairs, pairInsertionRules };
}

/**
 * @template T
 * @param {Map<T, number>} map
 * @param {T} key
 * @param {number} count
 */
function append(map, key, count) {
  map.set(key, (map.get(key) ?? 0) + count);
}

/**
 * @param {string} input
 * @param {number} maxSteps
 */
export function getScore(input, maxSteps) {
  const { initialPairs, pairInsertionRules } = parse(input);

  /** @type {Map<string, number>} */
  let prevPairCounts = new Map();

  for (const pair of initialPairs) {
    append(prevPairCounts, pair, 1);
  }

  for (let step = 0; step < maxSteps; step += 1) {
    /** @type {typeof prevPairCounts} */
    const nextPairCounts = new Map();

    for (const { fromPair, toPairA, toPairB } of pairInsertionRules) {
      const count = prevPairCounts.get(fromPair) ?? 0;
      if (count !== undefined) {
        append(nextPairCounts, toPairA, count);
        append(nextPairCounts, toPairB, count);
      }
    }

    prevPairCounts = nextPairCounts;
  }

  /** @type {Map<string, number>} */
  const elementCounts = new Map();

  for (const [[elementA, elementB], count] of prevPairCounts) {
    append(elementCounts, elementA, count);
    append(elementCounts, elementB, count);
  }

  const firstElement = initialPairs[0][0];
  const lastElement = initialPairs[initialPairs.length - 1][1];

  append(elementCounts, firstElement, 1);
  append(elementCounts, lastElement, 1);

  return (
    Math.max(...elementCounts.values()) / 2 -
    Math.min(...elementCounts.values()) / 2
  );
}
