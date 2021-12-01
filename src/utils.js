// https://www.unicode.org/reports/tr18/#Line_Boundaries
const LINE_BOUNDARY_PATTERN = /(?:\r\n)|(?!\r\n)[\n-\r\u0085\u2028\u2029]/;

/**
 * @param {string} input
 * @returns {string[]}
 */
export function lines(input) {
  return input.trim().split(LINE_BOUNDARY_PATTERN);
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
