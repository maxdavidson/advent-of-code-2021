import { lines } from "../utils.js";

const openingBrackets = {
  ")": "(",
  "]": "[",
  "}": "{",
  ">": "<",
};

const closingBrackets = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

/**
 * @param {string} input
 */
export function part1(input) {
  const points = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };

  let totalErrors = 0;

  for (const line of lines(input)) {
    const stack = [];

    for (const char of line) {
      switch (char) {
        case "(":
        case "[":
        case "{":
        case "<":
          stack.push(char);
          break;

        case ")":
        case "]":
        case "}":
        case ">": {
          const openingBracket = stack.pop();
          if (openingBracket !== openingBrackets[char]) {
            totalErrors += points[char];
          }
          break;
        }
      }
    }
  }

  return totalErrors;
}

/**
 * @param {string} input
 */
export function part2(input) {
  const points = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  };

  const scores = [];

  for (const line of lines(input)) {
    const stack = [];
    let hasError = false;

    for (const char of line) {
      switch (char) {
        case "(":
        case "[":
        case "{":
        case "<":
          stack.push(char);
          break;

        case ")":
        case "]":
        case "}":
        case ">": {
          const openingBracket = stack.pop();
          hasError ||= openingBracket !== openingBrackets[char];
          break;
        }
      }
    }

    if (hasError) {
      continue;
    }

    let score = 0;

    for (let i = stack.length - 1; i >= 0; i -= 1) {
      // @ts-ignore
      score = 5 * score + points[closingBrackets[stack[i]]];
    }

    scores.push(score);
  }

  scores.sort((a, b) => a - b);

  return scores[Math.trunc(scores.length / 2)];
}
