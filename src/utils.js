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
 * @returns {Iterable<string>}
 */
export function lines(input) {
  return split(input.trimEnd(), LINE_BOUNDARY_PATTERN);
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
 * @param {number} from
 * @param {number} to
 * @param {number} [step]
 * @returns {Iterable<number>}
 */
export function* range(from, to, step = 1) {
  for (let i = from; i < to; i += step) {
    yield i;
  }
}
