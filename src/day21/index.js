/**
 * @param {string} input
 */
const PATTERN = /Player (\w+) starting position: (\d+)/g;

/**
 * @param {string} input
 */
function* startSpaces(input) {
  for (const [, , startSpace] of input.matchAll(PATTERN)) {
    yield Number.parseInt(startSpace, 10);
  }
}

/**
 * @param {string} input
 */
export function part1(input) {
  const [startSpaceA, startSpaceB] = startSpaces(input);

  let rollCount = 0;
  let diceState = 0;

  function rollDice() {
    rollCount += 1;
    diceState = (diceState % 100) + 1;
    return diceState;
  }

  let spaceA = startSpaceA;
  let scoreA = 0;

  let spaceB = startSpaceB;
  let scoreB = 0;

  for (;;) {
    spaceA = ((spaceA + (rollDice() + rollDice() + rollDice()) - 1) % 10) + 1;
    scoreA += spaceA;

    if (scoreA >= 1000) {
      return scoreB * rollCount;
    }

    spaceB = ((spaceB + (rollDice() + rollDice() + rollDice()) - 1) % 10) + 1;
    scoreB += spaceB;

    if (scoreB >= 1000) {
      return scoreA * rollCount;
    }
  }
}

/**
 * @template {unknown[]} Args
 * @template T
 * @param {(...args: Args) => T} fn
 * @param {(...args: Args) => string | number | bigint} createKey
 */
function memoize(fn, createKey = (...args) => JSON.stringify(args)) {
  /** @type {Map<string | number | bigint, T>} */
  const cache = new Map();

  /** @type {(...args: Args) => T} */
  function memoized(...args) {
    const key = createKey(...args);
    if (cache.has(key)) {
      // @ts-expect-error
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }

  memoized.cache = cache;
  return memoized;
}

/**
 * @param {string} input
 * @param {number=} sides
 */
export function part2(input, sides = 3) {
  const [startSpaceA, startSpaceB] = startSpaces(input);

  const countWins = memoize(
    /**
     * @param {number} spaceA
     * @param {number} spaceB
     * @param {number} scoreA
     * @param {number} scoreB
     */
    (spaceA, spaceB, scoreA, scoreB) => {
      if (scoreA >= 21) {
        return [1, 0];
      }

      if (scoreB >= 21) {
        return [0, 1];
      }

      /** @type {[winsA: number, winsB: number]} */
      let wins = [0, 0];

      for (let a = 1; a <= sides; a += 1) {
        for (let b = 1; b <= sides; b += 1) {
          for (let c = 1; c <= sides; c += 1) {
            const nextSpaceA = ((spaceA + a + b + c - 1) % 10) + 1;
            const nextScoreA = scoreA + nextSpaceA;
            const [nextWinsB, nextWinsA] = countWins(
              spaceB,
              nextSpaceA,
              scoreB,
              nextScoreA,
            );
            wins[0] += nextWinsA;
            wins[1] += nextWinsB;
          }
        }
      }

      return wins;
    },
    // 4 bit + 4 bit + 12 bit + 12 bit = 32 bits
    (spaceA, spaceB, scoreA, scoreB) =>
      spaceA | (spaceB << 4) | (scoreA << 8) | (scoreB << 20),
  );

  const wins = countWins(startSpaceA, startSpaceB, 0, 0);

  return Math.max(...wins);
}
