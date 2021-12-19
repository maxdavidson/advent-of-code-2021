const hexCharBits = {
  0: "0000",
  1: "0001",
  2: "0010",
  3: "0011",
  4: "0100",
  5: "0101",
  6: "0110",
  7: "0111",
  8: "1000",
  9: "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
};

/** @typedef {{ typeId: 4; version: number; literal: number } | { typeId: 0 | 1 | 2| 3 | 5 | 6 | 7 | 8; version: number; subPackets: Packet[] }} Packet */

/**
 * @param {string} input
 * @returns {Packet}
 */
function parsePacket(input) {
  const bits = Array.from(input.trim())
    // @ts-expect-error
    .map(hexChar => hexCharBits[hexChar])
    .join("");

  let bitPos = 0;

  /**
   *
   * @param {number} bitCount
   * @returns {number}
   */
  function readBits(bitCount) {
    const maxPos = bitPos + bitCount;
    let value = 0;
    while (bitPos < maxPos) {
      value = value * 2 + (bits[bitPos] === "1" ? 1 : 0);
      bitPos += 1;
    }
    return value;
  }

  /**
   * @returns {Packet}
   */
  function parseNextPacket() {
    // A packet is at least 7 bits long
    while (bitPos + 7 < bits.length) {
      const version = readBits(3);
      const typeId = readBits(3);

      switch (typeId) {
        case 4: {
          /** @type {number} */
          let flag;
          let literal = 0;
          do {
            flag = readBits(1);
            literal = 16 * literal + readBits(4);
          } while (flag);
          return { typeId, version, literal };
        }

        case 0:
        case 1:
        case 2:
        case 3:
        case 5:
        case 6:
        case 7:
        case 8: {
          const lengthTypeId = readBits(1);

          if (lengthTypeId === 0) {
            const subPacketLength = readBits(15);
            const maxPos = bitPos + subPacketLength;
            /** @type {Packet[]} */
            const subPackets = [];
            while (bitPos < maxPos) {
              subPackets.push(parseNextPacket());
            }
            return { typeId, version, subPackets };
          } else {
            const subPacketCount = readBits(11);
            /** @type {Packet[]} */
            const subPackets = [];
            for (let i = 0; i < subPacketCount; i += 1) {
              subPackets.push(parseNextPacket());
            }
            return { typeId, version, subPackets };
          }
        }

        default:
          throw new Error(`Invalid typeId: ${typeId}`);
      }
    }

    throw new Error("No packet found!");
  }

  return parseNextPacket();
}

/**
 * @param {Packet} packet
 * @returns {number}
 */
function sumOfVersionNumbers(packet) {
  let sum = packet.version;

  if (packet.typeId !== 4) {
    for (const subPacket of packet.subPackets) {
      sum += sumOfVersionNumbers(subPacket);
    }
  }

  return sum;
}

/**
 * @param {string} input
 */
export function part1(input) {
  const packet = parsePacket(input);
  return sumOfVersionNumbers(packet);
}

/** @type {(a: number, b: number) => number} */
const add = (a, b) => a + b;
/** @type {(a: number, b: number) => number} */
const multiply = (a, b) => a * b;

/**
 * @param {Packet} packet
 * @returns {number}
 */
function exec(packet) {
  switch (packet.typeId) {
    case 0:
      return packet.subPackets.map(exec).reduce(add, 0);
    case 1:
      return packet.subPackets.map(exec).reduce(multiply, 1);
    case 2:
      return Math.min(...packet.subPackets.map(exec));
    case 3:
      return Math.max(...packet.subPackets.map(exec));
    case 4:
      return packet.literal;
    case 5:
      return Number(exec(packet.subPackets[0]) > exec(packet.subPackets[1]));
    case 6:
      return Number(exec(packet.subPackets[0]) < exec(packet.subPackets[1]));
    case 7:
      return Number(exec(packet.subPackets[0]) === exec(packet.subPackets[1]));
    default:
      throw new Error(`Invalid typeId: ${packet.typeId}`);
  }
}

/**
 * @param {string} input
 */
export function part2(input) {
  const packet = parsePacket(input);
  return exec(packet);
}
