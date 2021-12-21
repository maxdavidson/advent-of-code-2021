import { combinations, lines, split } from "../utils.js";

/** @typedef {[x: number, y: number, z: number]} Point */
/** @typedef {number} PointHash */
/** @typedef {number} ScannerId */
/** @typedef {readonly Point[]} PointView */
/** @typedef {{ scannerId: number, beaconsMap: ReadonlyMap<PointHash, Point>; beacons: readonly Point[]; transformedBeacons: Point[] }} ScannerReport */

const HEADER_PATTERN = /--- scanner (\d+) ---/;
/**
 * @param {string} input
 * @returns {Generator<ScannerReport>}
 */
function* parseScannerReports(input) {
  for (const scannerGroup of split(input, "\n\n")) {
    const [header, ...rawBeacons] = lines(scannerGroup);

    const beacons = rawBeacons.map(line => {
      const [x, y, z] = line.split(",").map(Number);
      return createPoint(x, y, z);
    });

    yield {
      scannerId: Number(header.match(HEADER_PATTERN)?.[1]),
      beacons,
      beaconsMap: new Map(beacons.map(createPointEntry)),
      transformedBeacons: beacons.map(([x, y, z]) => createPoint(x, y, z)),
    };
  }
}

/**
 * @param {Point} point
 * @returns {PointHash}
 */
function createPointHash(point) {
  // return point.join(",");
  return 0x100000000 * point[0] + 0x10000 * point[1] + point[2];
}

/**
 * @param {Point} point
 * @returns {[PointHash, Point]}
 */
function createPointEntry(point) {
  return [createPointHash(point), point];
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {Point}
 */
function createPoint(x, y, z) {
  return [x, y, z];
}

// prettier-ignore
/** @type {readonly ((out: Point, a: Point) => void)[]} */
const rotators = [
  (out, a) => { out[0] =  a[0]; out[1] =  a[1]; out[2] =  a[2]; },
  (out, a) => { out[0] =  a[0]; out[1] =  a[2]; out[2] = -a[1]; },
  (out, a) => { out[0] =  a[0]; out[1] = -a[1]; out[2] = -a[2]; },
  (out, a) => { out[0] =  a[0]; out[1] = -a[2]; out[2] =  a[1]; },

  (out, a) => { out[0] = -a[0]; out[1] = -a[1]; out[2] =  a[2]; },
  (out, a) => { out[0] = -a[0]; out[1] = -a[2]; out[2] = -a[1]; },
  (out, a) => { out[0] = -a[0]; out[1] =  a[1]; out[2] = -a[2]; },
  (out, a) => { out[0] = -a[0]; out[1] =  a[2]; out[2] =  a[1]; },
  
  (out, a) => { out[0] =  a[1]; out[1] = -a[0]; out[2] =  a[2]; },
  (out, a) => { out[0] =  a[1]; out[1] =  a[2]; out[2] =  a[0]; },
  (out, a) => { out[0] =  a[1]; out[1] =  a[0]; out[2] = -a[2]; },
  (out, a) => { out[0] =  a[1]; out[1] = -a[2]; out[2] = -a[0]; },
  
  (out, a) => { out[0] = -a[1]; out[1] =  a[0]; out[2] =  a[2]; },
  (out, a) => { out[0] = -a[1]; out[1] = -a[2]; out[2] =  a[0]; },
  (out, a) => { out[0] = -a[1]; out[1] = -a[0]; out[2] = -a[2]; },
  (out, a) => { out[0] = -a[1]; out[1] =  a[2]; out[2] = -a[0]; },
  
  (out, a) => { out[0] =  a[2]; out[1] =  a[1]; out[2] = -a[0]; },
  (out, a) => { out[0] =  a[2]; out[1] =  a[0]; out[2] =  a[1]; },
  (out, a) => { out[0] =  a[2]; out[1] = -a[1]; out[2] =  a[0]; },
  (out, a) => { out[0] =  a[2]; out[1] = -a[0]; out[2] = -a[1]; },
  
  (out, a) => { out[0] = -a[2]; out[1] = -a[1]; out[2] = -a[0]; },
  (out, a) => { out[0] = -a[2]; out[1] = -a[0]; out[2] =  a[1]; },
  (out, a) => { out[0] = -a[2]; out[1] =  a[1]; out[2] =  a[0]; },
  (out, a) => { out[0] = -a[2]; out[1] =  a[0]; out[2] = -a[1]; },
];

/**
 * @param {Point} out
 * @param {Point} a
 * @param {Point} b
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
}

/**
 * @param {Point} out
 * @param {Point} a
 * @param {Point} b
 */
function sub(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
}

/**
 * @param {Point} out
 */
function zero(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
}

/**
 * @param {string} input
 * @returns
 */
function getBeaconArrangement(input) {
  const scannerReports = Array.from(parseScannerReports(input));

  /** @type {Map<ScannerId, Point>}>} */
  const scanners = new Map();
  scanners.set(scannerReports[0].scannerId, createPoint(0, 0, 0));

  /** @type {Map<ScannerId, ReadonlyMap<PointHash, Point>>} */
  const scannerBeacons = new Map();
  scannerBeacons.set(scannerReports[0].scannerId, scannerReports[0].beaconsMap);

  /** @type {ScannerId[]} */
  const scannerIdStack = [scannerReports[0].scannerId];

  /** @type {ScannerId | undefined} */
  let scannerId;
  while ((scannerId = scannerIdStack.pop()) !== undefined) {
    const beacons = scannerBeacons.get(scannerId);
    if (beacons !== undefined) {
      for (const scannerReport of scannerReports) {
        if (
          !scanners.has(scannerReport.scannerId) &&
          scannerReport.scannerId !== scannerId
        ) {
          const arrangement = findArrangement(beacons, scannerReport);

          if (arrangement !== undefined) {
            scanners.set(scannerReport.scannerId, arrangement.scanner);
            scannerBeacons.set(
              scannerReport.scannerId,
              new Map(arrangement.transformedBeacons.map(createPointEntry)),
            );
            scannerIdStack.push(scannerReport.scannerId);
          }
        }
      }
    }
  }

  /** @type {Map<PointHash, Point>} */
  const beacons = new Map();

  for (const transformedBeacons of scannerBeacons.values()) {
    for (const [pointHash, point] of transformedBeacons) {
      beacons.set(pointHash, point);
    }
  }

  return { beacons, scanners };
}

/**
 * Return arrangements of beaconsB such that at least 12 beacons intersect
 * @param {ReadonlyMap<PointHash, Point>} referenceBeacons
 * @param {ScannerReport} scannerReport
 */
function findArrangement(referenceBeacons, { beacons, transformedBeacons }) {
  const translation = createPoint(0, 0, 0);

  for (const referenceBeacon of referenceBeacons.values()) {
    for (const beacon of beacons) {
      for (const rotate of rotators) {
        zero(translation);
        rotate(translation, beacon);
        sub(translation, referenceBeacon, translation);

        let intersectingBeaconsCount = 0;

        for (let i = 0; i < beacons.length; i += 1) {
          const transformedBeacon = transformedBeacons[i];
          zero(transformedBeacon);
          rotate(transformedBeacon, beacons[i]);
          add(transformedBeacon, transformedBeacon, translation);

          if (referenceBeacons.has(createPointHash(transformedBeacon))) {
            intersectingBeaconsCount += 1;
          }
        }

        if (intersectingBeaconsCount >= 12) {
          const scanner = createPoint(0, 0, 0);
          rotate(scanner, scanner);
          add(scanner, scanner, translation);

          return { scanner, transformedBeacons };
        }
      }
    }
  }
}

const { abs } = Math;

/**
 * @param {string} input
 */
export function part1(input) {
  const beaconArrangement = getBeaconArrangement(input);
  return beaconArrangement.beacons.size;
}

/**
 * @param {string} input
 */
export function part2(input) {
  const beaconArrangement = getBeaconArrangement(input);

  const distance = createPoint(0, 0, 0);

  let largestManhattanDistance = -Infinity;

  for (const [a, b] of combinations(beaconArrangement.scanners.values(), 2)) {
    sub(distance, a, b);

    largestManhattanDistance = Math.max(
      largestManhattanDistance,
      abs(distance[0]) + abs(distance[1]) + abs(distance[2]),
    );
  }

  return largestManhattanDistance;
}
