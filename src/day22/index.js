const PATTERN =
  /(\w+) x=([-\d]+)..([-\d]+),y=([-\d]+)..([-\d]+),z=([-\d]+)..([-\d]+)/g;

/**
 * @param {string} input
 */
function* rebootSteps(input) {
  for (const [, method, xMin, xMax, yMin, yMax, zMin, zMax] of input.matchAll(
    PATTERN,
  )) {
    yield {
      method,
      xMin: Number.parseInt(xMin, 10),
      xMax: Number.parseInt(xMax, 10),
      yMin: Number.parseInt(yMin, 10),
      yMax: Number.parseInt(yMax, 10),
      zMin: Number.parseInt(zMin, 10),
      zMax: Number.parseInt(zMax, 10),
    };
  }
}

/** @typedef {Record<'xMin' | 'xMax' | 'yMin' | 'yMax' | 'zMin' | 'zMax', number>} Cuboid */

const { min, max } = Math;

/**
 * @param {Cuboid} cuboid
 * @param {number} x
 * @returns {Cuboid[]}
 */
function cutX(cuboid, x) {
  const { xMin, xMax, yMin, yMax, zMin, zMax } = cuboid;

  if (x - 1 < xMin || x > xMax) {
    return [cuboid];
  }

  return [
    { xMin, xMax: x - 1, yMin, yMax, zMin, zMax },
    { xMin: x, xMax, yMin, yMax, zMin, zMax },
  ];
}

/**
 * @param {Cuboid} cuboid
 * @param {number} y
 * @returns {Cuboid[]}
 */
function cutY(cuboid, y) {
  const { xMin, xMax, yMin, yMax, zMin, zMax } = cuboid;

  if (y - 1 < yMin || y > yMax) {
    return [cuboid];
  }

  return [
    { xMin, xMax, yMin, yMax: y - 1, zMin, zMax },
    { xMin, xMax, yMin: y, yMax, zMin, zMax },
  ];
}

/**
 * @param {Cuboid} cuboid
 * @param {number} z
 * @returns {Cuboid[]}
 */
function cutZ(cuboid, z) {
  const { xMin, xMax, yMin, yMax, zMin, zMax } = cuboid;

  if (z - 1 < zMin || z > zMax) {
    return [cuboid];
  }

  return [
    { xMin, xMax, yMin, yMax, zMin, zMax: z - 1 },
    { xMin, xMax, yMin, yMax, zMin: z, zMax },
  ];
}

/**

 * @param {Cuboid} cuboidA
 * @param {Cuboid} cuboidB
 * @returns {boolean}
 */
function equals(cuboidA, cuboidB) {
  return (
    cuboidA.xMin === cuboidB.xMin &&
    cuboidA.xMax === cuboidB.xMax &&
    cuboidA.yMin === cuboidB.yMin &&
    cuboidA.yMax === cuboidB.yMax &&
    cuboidA.zMin === cuboidB.zMin &&
    cuboidA.zMax === cuboidB.zMax
  );
}

/**
 * Intersect prism + prism
 * @param {Cuboid} cuboidA
 * @param {Cuboid} cuboidB
 * @returns {Cuboid | undefined}
 */
function intersect(cuboidA, cuboidB) {
  const xMin = max(cuboidA.xMin, cuboidB.xMin);
  const xMax = min(cuboidA.xMax, cuboidB.xMax);

  if (xMax < xMin) {
    return undefined;
  }

  const yMin = max(cuboidA.yMin, cuboidB.yMin);
  const yMax = min(cuboidA.yMax, cuboidB.yMax);

  if (yMax < yMin) {
    return undefined;
  }

  const zMin = max(cuboidA.zMin, cuboidB.zMin);
  const zMax = min(cuboidA.zMax, cuboidB.zMax);

  if (zMax < zMin) {
    return undefined;
  }

  return { xMin, xMax, yMin, yMax, zMin, zMax };
}

/**
 * Subdivide cuboidA such that no cuboids intersect with each other or cuboidB
 * @param {Cuboid} cuboidA
 * @param {Cuboid} cuboidB
 * @returns {Cuboid[]}
 */
function subdivideAndCut(cuboidA, cuboidB) {
  const intersection = intersect(cuboidA, cuboidB);

  if (intersection === undefined) {
    return [cuboidA];
  }

  if (volume(intersection) >= volume(cuboidA)) {
    return [];
  }

  return [cuboidA]
    .flatMap(cuboid => cutX(cuboid, intersection.xMin))
    .flatMap(cuboid => cutX(cuboid, intersection.xMax + 1))
    .flatMap(cuboid => cutY(cuboid, intersection.yMin))
    .flatMap(cuboid => cutY(cuboid, intersection.yMax + 1))
    .flatMap(cuboid => cutZ(cuboid, intersection.zMin))
    .flatMap(cuboid => cutZ(cuboid, intersection.zMax + 1))
    .filter(cuboid => !equals(cuboid, intersection));
}

/**
 * @param {Cuboid} cuboid
 */
function volume({ xMin, xMax, yMin, yMax, zMin, zMax }) {
  return (xMax - xMin + 1) * (yMax - yMin + 1) * (zMax - zMin + 1);
}

/**
 * @template T
 * @param {T} value
 * @returns {value is NonNullable<T>}
 */
function isNonNullable(value) {
  return value != null;
}

/**
 * @param {Iterable<Cuboid>} cuboids
 * @returns {number}
 */
function totalVolume(cuboids) {
  let sum = 0;
  for (const cuboid of cuboids) {
    sum += volume(cuboid);
  }
  return sum;
}

/**
 * @param {string} input
 */
export function part1(input) {
  const steps = Array.from(rebootSteps(input));

  /** @type {Cuboid[]} */
  let cuboids = [];

  for (const step of steps) {
    cuboids = cuboids.flatMap(cuboid => subdivideAndCut(cuboid, step));
    if (step.method === "on") {
      cuboids.push(step);
    }
  }

  const cube = {
    xMin: -50,
    xMax: 50,
    yMin: -50,
    yMax: 50,
    zMin: -50,
    zMax: 50,
  };

  return totalVolume(
    cuboids.map(cuboid => intersect(cuboid, cube)).filter(isNonNullable),
  );
}

/**
 * @param {string} input
 */
export function part2(input) {
  const steps = Array.from(rebootSteps(input));

  /** @type {Cuboid[]} */
  let cuboids = [];

  for (const step of steps) {
    cuboids = cuboids.flatMap(cuboid => subdivideAndCut(cuboid, step));
    if (step.method === "on") {
      cuboids.push(step);
    }
  }

  return totalVolume(cuboids);
}
