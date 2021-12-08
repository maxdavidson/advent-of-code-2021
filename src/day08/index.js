import { lines, permutations, range } from "../utils.js";

// Lookup table to get the digit from a pattern
const digitsByBitPattern = new Int8Array(1 << 7).fill(-1);
digitsByBitPattern[0b0111111] = 0;
digitsByBitPattern[0b0000110] = 1;
digitsByBitPattern[0b1011011] = 2;
digitsByBitPattern[0b1001111] = 3;
digitsByBitPattern[0b1100110] = 4;
digitsByBitPattern[0b1101101] = 5;
digitsByBitPattern[0b1111101] = 6;
digitsByBitPattern[0b0000111] = 7;
digitsByBitPattern[0b1111111] = 8;
digitsByBitPattern[0b1101111] = 9;

/**
 * @param {string} input
 */
function* parseInput(input) {
  for (const line of lines(input)) {
    const [rawSignals, rawOutputs] = line.split(" | ");
    yield {
      signalPatterns: rawSignals.split(" "),
      outputPatterns: rawOutputs.split(" "),
    };
  }
}

const charCodeA = "a".charCodeAt(0);

/**
 * @param {string} pattern
 * @param {readonly number[]} config
 */
function getDigit(pattern, config) {
  let bitPattern = 0;
  for (let i = 0; i < pattern.length && i < 7; i += 1) {
    bitPattern |= 1 << config[pattern[i].charCodeAt(0) - charCodeA];
  }
  return digitsByBitPattern[bitPattern];
}

const allConfigs = Array.from(permutations(range(0, 7)));

/**
 * @param {readonly string[]} patterns
 */
function findConfig(patterns) {
  // Find the config that results in all patterns being digits
  nextConfig: for (const config of allConfigs) {
    for (const pattern of patterns) {
      if (getDigit(pattern, config) === -1) {
        continue nextConfig;
      }
    }
    return config;
  }

  throw new Error("no config found");
}

/**
 * @param {string} input
 */
export function part1(input) {
  let sum = 0;

  for (const { outputPatterns } of parseInput(input)) {
    for (const outputPattern of outputPatterns) {
      switch (outputPattern.length) {
        case 2:
        case 3:
        case 4:
        case 7:
          sum += 1;
      }
    }
  }

  return sum;
}

/**
 * @param {string} input
 */
export function part2(input) {
  let sum = 0;

  for (const { signalPatterns, outputPatterns } of parseInput(input)) {
    const config = findConfig(signalPatterns);

    let output = 0;

    for (const outputPattern of outputPatterns) {
      output = 10 * output + getDigit(outputPattern, config);
    }

    sum += output;
  }

  return sum;
}
