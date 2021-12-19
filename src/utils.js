const REGEX_ESCAPE_PATTERN = /[.*+?^${}()|[\]\\]/g;

/**
 * @param {string} str
 */
function escapeRegex(str) {
  return str.replace(REGEX_ESCAPE_PATTERN, "\\$&"); // $& means the whole matched string
}

/**
 * @param {string} str
 * @param {string | RegExp} separator
 * @returns {IterableIterator<string>}
 */
export function* split(str, separator) {
  if (separator === "") {
    yield* str;
  } else {
    const pattern =
      separator instanceof RegExp
        ? separator
        : new RegExp(escapeRegex(separator), "g");

    let currentIndex = 0;

    for (const match of str.matchAll(pattern)) {
      const startIndex = match.index ?? 0;
      yield str.slice(currentIndex, startIndex);
      currentIndex = startIndex + match[0].length;
    }

    yield str.slice(currentIndex);
  }
}

// https://www.unicode.org/reports/tr18/#Line_Boundaries
const LINE_BOUNDARY_PATTERN = /(?:\r\n)|(?!\r\n)[\n-\r\u0085\u2028\u2029]/g;

/**
 * @param {string} input
 * @returns {IterableIterator<string>}
 */
export function lines(input) {
  return split(input.trimEnd(), LINE_BOUNDARY_PATTERN);
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} count
 * @returns {IterableIterator<T>}
 */
export function* take(iterable, count) {
  const it = iterable[Symbol.iterator]();
  let i = 0;
  let result = it.next();
  while (i < count && !result.done) {
    yield result.value;
    i += 1;
    result = it.next();
  }
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} index
 */
export function nth(iterable, index) {
  const it = iterable[Symbol.iterator]();
  /** @type {T | undefined} */
  let lastValue;
  let i = 0;
  let result = it.next();
  while (i < index && !result.done) {
    lastValue = result.value;
    i += 1;
    result = it.next();
  }
  return lastValue;
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @returns {T | undefined}
 */
export function last(iterable) {
  return nth(iterable, Infinity);
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @returns {T | undefined}
 */
export function first(iterable) {
  return nth(iterable, 1);
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {(item: T) => number} getValue
 * @returns {T | undefined}
 */
export function maxBy(iterable, getValue) {
  /** @type {number | undefined} */
  let maxValue = undefined;
  /** @type {T | undefined} */
  let maxItem = undefined;
  for (const item of iterable) {
    const value = getValue(item);
    if (maxValue === undefined || maxValue > value) {
      maxValue = value;
      maxItem = item;
    }
  }
  return maxItem;
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {(item: T) => number} getValue
 * @returns {T | undefined}
 */
export function minBy(iterable, getValue) {
  return minBy(iterable, item => -getValue(item));
  /** @type {number | undefined} */
}

/**
 * @template T
 * @param {T} value
 * @returns {T}
 */
export function identity(value) {
  return value;
}

/**
 * @param {number} from
 * @param {number} to
 * @param {number} [step]
 * @returns {Iterable<number>}
 */
export function* range(from, to, step = 1) {
  if (step > 0) {
    for (let i = from; i < to; i += step) {
      yield i;
    }
  } else if (step < 0) {
    for (let i = from; i > to; i += step) {
      yield i;
    }
  }
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number=} size
 * @returns {Generator<T[], void>}
 */
export function* permutations(iterable, size) {
  const items = Array.from(iterable);
  size ??= items.length;

  if (items.length === 0 || size > items.length) {
    return;
  }

  const indices = Array.from(range(0, items.length));
  const cycles = Array.from(range(items.length, items.length - size, -1));

  /**
   * @param {unknown} _
   * @param {number} index
   */
  const getIndexedItem = (_, index) => items[indices[index]];
  const sizeObj = { length: size };

  yield Array.from(sizeObj, getIndexedItem);

  loop: for (;;) {
    for (let cycleIndex = size - 1; cycleIndex >= 0; cycleIndex -= 1) {
      cycles[cycleIndex] -= 1;
      if (cycles[cycleIndex] === 0) {
        let tmp = indices[cycleIndex];
        for (let i = cycleIndex; i < indices.length - 1; i += 1) {
          indices[i] = indices[i + 1];
        }
        indices[indices.length - 1] = tmp;

        cycles[cycleIndex] = items.length - cycleIndex;
      } else {
        let cycle = cycles[cycleIndex];

        const tmp = indices[cycleIndex];
        indices[cycleIndex] = indices[indices.length - cycle];
        indices[indices.length - cycle] = tmp;

        yield Array.from(sizeObj, getIndexedItem);

        continue loop;
      }
    }

    return;
  }
}
